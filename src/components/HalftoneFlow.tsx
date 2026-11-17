import { useEffect, useRef, useState, type RefObject } from "react";

// Adapted from the halftone-flow-hero.tsx source supplied in /prompt.txt.
// Retains its domain-warped flow, rotated halftone cells and pointer bloom;
// deliberately excludes the original SaaS UI and embedded font.
const VERTEX = `attribute vec2 p; void main() { gl_Position = vec4(p, 0., 1.); }`;
const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime, uHover, uCell, uJourney;
uniform vec2 uMouse;
float flow(vec2 p, float t) {
  vec2 w = p * 2.;
  for (int i = 1; i < 6; i++) {
    float fi = float(i);
    w += vec2(.85 / fi * sin(fi * w.y * 1.2 + t * .42 + fi * 2.3),
              .7 / fi * cos(fi * w.x * 1.05 - t * .31 + fi * 1.1));
  }
  float b = .5 + .5 * sin(w.x * 2.6 - w.y * 1.7);
  return smoothstep(.15, 1., pow(b, 2.2));
}
void main() {
  float a = .5236;
  mat2 R = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2 px = R * gl_FragCoord.xy;
  vec2 cc = (floor(px / uCell) + .5) * uCell;
  vec2 cs = (cc * R - .5 * uRes) / uRes.y;
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  // Keep the flow in the composition on portrait screens rather than at its edge.
  vec2 portraitOffset = vec2((1. - smoothstep(.65, 1., uRes.x / uRes.y)) * .28, 0.);
  cs += portraitOffset;
  p += portraitOffset;
  // A continuous camera through the same field across all eight chapters.
  vec2 travel = vec2(sin(uJourney * 5.2) * .32, uJourney * 1.7);
  cs += travel;
  p += travel;
  float I = flow(cs, uTime + uJourney * 2.);
  float md = length(cs - (uMouse + portraitOffset + travel));
  I = clamp(I + uHover * .45 * exp(-md * md * 14.), 0., 1.);
  float r = sqrt(I) * .48 * uCell;
  float d = length(px - cc);
  float dotm = 1. - smoothstep(r - .8, r + .6, d);
  float g = flow(p, uTime + uJourney * 2.);
  // StoryModEngine ember: black ground, burnt orange flow, warm orange crests.
  vec3 ground = vec3(.043, .047, .051);
  vec3 ember = vec3(.64, .20, .065);
  vec3 hot = vec3(1., .48, .20);
  vec3 col = ground + ember * g * .10;
  vec3 ink = mix(ember, hot, smoothstep(.65, 1., I) * .7);
  col = mix(col, ink, dotm * .88);
  vec2 uv = gl_FragCoord.xy / uRes;
  float vignette = 1. - smoothstep(.3, 1.1, length((uv - .5) * vec2(1., 1.25)));
  col *= mix(.5, 1., vignette);
  gl_FragColor = vec4(col, 1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function HalftoneFlow({
  paused,
  interactionRoot,
  journey,
}: {
  paused: boolean;
  interactionRoot?: RefObject<HTMLElement | null>;
  journey?: RefObject<number>;
}) {
  const host = useRef<HTMLDivElement>(null);
  const pauseState = useRef(paused);
  const syncAnimation = useRef<(() => void) | null>(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    pauseState.current = paused;
    syncAnimation.current?.();
  }, [paused]);

  useEffect(() => {
    const holder = host.current;
    const hero = interactionRoot?.current ?? holder?.parentElement;
    if (!holder || !hero) return;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    holder.appendChild(canvas);
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
    } catch {
      /* Keep the CSS fallback if a browser blocks context creation. */
    }
    if (!gl) {
      holder.dataset["renderer"] = "fallback";
      canvas.remove();
      return;
    }
    const context = gl;
    const vs = compile(context, context.VERTEX_SHADER, VERTEX);
    const fs = compile(context, context.FRAGMENT_SHADER, FRAGMENT);
    const program = context.createProgram();
    const buffer = context.createBuffer();
    const dispose = () => {
      if (buffer) context.deleteBuffer(buffer);
      if (program) context.deleteProgram(program);
      if (vs) context.deleteShader(vs);
      if (fs) context.deleteShader(fs);
      context.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
    if (!vs || !fs || !program || !buffer) {
      dispose();
      return;
    }
    context.attachShader(program, vs);
    context.attachShader(program, fs);
    context.linkProgram(program);
    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      dispose();
      return;
    }
    context.useProgram(program);
    context.bindBuffer(context.ARRAY_BUFFER, buffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      context.STATIC_DRAW,
    );
    const position = context.getAttribLocation(program, "p");
    if (position < 0) {
      dispose();
      return;
    }
    context.enableVertexAttribArray(position);
    context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
    const uniform = (name: string) => context.getUniformLocation(program, name);
    const uniforms = {
      res: uniform("uRes"),
      time: uniform("uTime"),
      cell: uniform("uCell"),
      mouse: uniform("uMouse"),
      hover: uniform("uHover"),
      journey: uniform("uJourney"),
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let size = { width: 1, height: 1, left: 0, top: 0, dpr: 1 };
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, hover: 0, targetHover: 0 };
    let frame = 0;
    let visible = true;
    let lost = false;
    let running = false;
    let time = 6;
    let travel = journey?.current ?? 0;
    let last = performance.now();

    const draw = (delta = 0) => {
      time += delta;
      if (!reduce.matches && !pauseState.current)
        travel += ((journey?.current ?? 0) - travel) * 0.09;
      pointer.x += (pointer.targetX - pointer.x) * 0.12;
      pointer.y += (pointer.targetY - pointer.y) * 0.12;
      pointer.hover += (pointer.targetHover - pointer.hover) * 0.1;
      context.uniform2f(uniforms.res, canvas.width, canvas.height);
      context.uniform1f(uniforms.time, time);
      context.uniform1f(uniforms.journey, travel);
      context.uniform1f(uniforms.cell, (size.width < 600 ? 6 : 7) * size.dpr);
      context.uniform2f(uniforms.mouse, pointer.x, pointer.y);
      context.uniform1f(uniforms.hover, reduce.matches ? 0 : pointer.hover);
      context.drawArrays(context.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      if (!running) return;
      // At most 30 rendered frames/second; no layout reads in the frame loop.
      const elapsed = now - last;
      if (elapsed >= 1000 / 30) {
        draw(Math.min(0.08, elapsed / 1000));
        last = now - (elapsed % (1000 / 30));
      }
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      const want = visible && !document.hidden && !reduce.matches && !pauseState.current && !lost;
      holder.dataset["motion"] = want ? "running" : "paused";
      if (want && !running) {
        running = true;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else if (!want) {
        running = false;
        cancelAnimationFrame(frame);
        if (!lost) draw();
      }
    };
    const measure = () => {
      const rect = holder.getBoundingClientRect();
      // Cap both density and total pixel count, including wide/high-DPI displays.
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5,
        Math.sqrt(1_800_000 / Math.max(1, rect.width * rect.height)),
      );
      size = { width: rect.width, height: rect.height, left: rect.left, top: rect.top, dpr };
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      context.viewport(0, 0, canvas.width, canvas.height);
      if (!lost) draw();
    };
    const onEnter = () => {
      const rect = holder.getBoundingClientRect();
      size.left = rect.left;
      size.top = rect.top;
      pointer.targetHover = 1;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !running) return;
      pointer.targetX = (event.clientX - size.left - size.width / 2) / size.height;
      pointer.targetY = (size.height / 2 - (event.clientY - size.top)) / size.height;
    };
    const onLeave = () => {
      pointer.targetHover = 0;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      holder.dataset["renderer"] = "fallback";
      sync();
    };
    const onRestored = () => setGeneration((value) => value + 1);
    const resize = new ResizeObserver(measure);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    resize.observe(holder);
    intersection.observe(hero);
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    hero.addEventListener("pointerenter", onEnter);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    syncAnimation.current = sync;
    measure();
    holder.dataset["renderer"] = "webgl";
    sync();
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      syncAnimation.current = null;
      resize.disconnect();
      intersection.disconnect();
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      hero.removeEventListener("pointerenter", onEnter);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      holder.dataset["renderer"] = "fallback";
      dispose();
    };
  }, [generation, interactionRoot, journey]);

  return (
    <div ref={host} className="halftone-background" data-renderer="fallback" aria-hidden="true" />
  );
}
