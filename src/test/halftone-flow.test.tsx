import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HalftoneFlow } from "@/components/HalftoneFlow";

function webgl() {
  return {
    VERTEX_SHADER: 35633,
    FRAGMENT_SHADER: 35632,
    COMPILE_STATUS: 35713,
    LINK_STATUS: 35714,
    ARRAY_BUFFER: 34962,
    STATIC_DRAW: 35044,
    FLOAT: 5126,
    TRIANGLES: 4,
    createShader: vi.fn(() => ({})),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => true),
    createProgram: vi.fn(() => ({})),
    createBuffer: vi.fn(() => ({})),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => true),
    useProgram: vi.fn(),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn((_, name) => name),
    uniform2f: vi.fn(),
    uniform1f: vi.fn(),
    drawArrays: vi.fn(),
    viewport: vi.fn(),
    getExtension: vi.fn(() => null),
    deleteBuffer: vi.fn(),
    deleteProgram: vi.fn(),
    deleteShader: vi.fn(),
  };
}

let reduced = false;
let intersection: IntersectionObserverCallback;
let nextFrame: FrameRequestCallback;
let motionChange: (() => void) | undefined;
let gl: ReturnType<typeof webgl>;

beforeEach(() => {
  reduced = false;
  gl = webgl();
  vi.spyOn(performance, "now").mockReturnValue(0);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    gl as unknown as WebGLRenderingContext,
  );
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      nextFrame = callback;
      return 1;
    }),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersection = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, callback: () => void) => {
        motionChange = callback;
      },
      removeEventListener: vi.fn(),
    })),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function scene(paused = false) {
  return (
    <section>
      <HalftoneFlow paused={paused} />
    </section>
  );
}

describe("Halftone background lifecycle", () => {
  it("keeps the static CSS fallback when WebGL is unavailable or shader linking fails", () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null);
    const unavailable = render(scene());
    expect(unavailable.container.querySelector("[data-renderer='fallback']")).not.toBeNull();
    expect(unavailable.container.querySelector("canvas")).toBeNull();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    unavailable.unmount();

    gl.getProgramParameter.mockReturnValue(false);
    const failed = render(scene());
    expect(failed.container.querySelector("canvas")).toBeNull();
    expect(gl.deleteBuffer).toHaveBeenCalled();
    expect(gl.deleteProgram).toHaveBeenCalled();
    expect(gl.deleteShader).toHaveBeenCalledTimes(2);
  });

  it("renders a still frame for reduced motion and responds when the preference changes", () => {
    reduced = true;
    const view = render(scene());
    expect(gl.drawArrays).toHaveBeenCalled();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(view.container.querySelector("[data-motion='paused']")).not.toBeNull();
    act(() => {
      reduced = false;
      motionChange?.();
    });
    expect(requestAnimationFrame).toHaveBeenCalled();
    expect(view.container.querySelector("[data-motion='running']")).not.toBeNull();
  });

  it("changes shader time across frames, throttles drawing, and stops for pause or offscreen", () => {
    const view = render(scene());
    const initialDraws = gl.drawArrays.mock.calls.length;
    act(() => nextFrame(10));
    expect(gl.drawArrays).toHaveBeenCalledTimes(initialDraws);
    act(() => nextFrame(40));
    expect(gl.drawArrays).toHaveBeenCalledTimes(initialDraws + 1);
    const times = gl.uniform1f.mock.calls
      .filter(([name]) => name === "uTime")
      .map(([, value]) => value);
    expect(times.at(-1)).toBeGreaterThan(times[0]!);

    view.rerender(scene(true));
    expect(view.container.querySelector("[data-motion='paused']")).not.toBeNull();
    expect(cancelAnimationFrame).toHaveBeenCalled();
    view.rerender(scene(false));
    expect(view.container.querySelector("[data-motion='running']")).not.toBeNull();
    act(() =>
      intersection(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(view.container.querySelector("[data-motion='paused']")).not.toBeNull();
    act(() =>
      intersection(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(view.container.querySelector("[data-motion='running']")).not.toBeNull();
    view.unmount();
    expect(gl.deleteBuffer).toHaveBeenCalled();
    expect(gl.deleteProgram).toHaveBeenCalled();
    expect(gl.deleteShader).toHaveBeenCalledTimes(2);
  });

  it("moves the shared field with scroll without recreating WebGL, and freezes it on pause", () => {
    const journey = { current: 0 };
    const view = render(
      <section>
        <HalftoneFlow paused={false} journey={journey} />
      </section>,
    );
    const canvas = view.container.querySelector("canvas");
    const lastTravel = () =>
      gl.uniform1f.mock.calls.filter(([name]) => name === "uJourney").at(-1)?.[1];
    journey.current = 0.7;
    act(() => nextFrame(40));
    expect(lastTravel()).toBeGreaterThan(0);
    expect(view.container.querySelector("canvas")).toBe(canvas);
    view.rerender(
      <section>
        <HalftoneFlow paused journey={journey} />
      </section>,
    );
    const frozen = lastTravel();
    journey.current = 1;
    act(() => motionChange?.());
    expect(lastTravel()).toBe(frozen);
  });

  it("returns to the static fallback on context loss and rebuilds after restoration", () => {
    const view = render(scene());
    const canvas = view.container.querySelector("canvas")!;
    act(() => {
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
    });
    expect(
      view.container.querySelector("[data-renderer='fallback'][data-motion='paused']"),
    ).not.toBeNull();
    act(() => {
      canvas.dispatchEvent(new Event("webglcontextrestored"));
    });
    expect(view.container.querySelector("canvas")).not.toBe(canvas);
    expect(view.container.querySelector("[data-renderer='webgl']")).not.toBeNull();
  });
});
