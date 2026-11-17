import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; alpha: number; drift: number; lift: number };

// Adapted from promptfortext2.txt: sample the real type, then disperse it.
// Positions are deterministic functions of scroll, so reversing scroll rebuilds the text.
// No perpetual frame loop, glow passes, timers, or text-index React updates.
export function VaporizeAnimationText({ text }: { text: string }) {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        const element = host.current;
        if (cancelled || !element) return;
        const label = element.querySelector<HTMLElement>(".vapor-label")!;
        const canvas = element.querySelector("canvas")!;
        const context = canvas.getContext("2d");
        if (!context) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        dispose = () => media.revert();
        media.add(
          "(prefers-reduced-motion: no-preference) and (min-height: 700px)",
          () => {
            let active = true;
            const state = { progress: 0 };
            let particles: Particle[] = [];
            let width = 1;
            let height = 1;
            let density = 1;
            let color = "#f2f1ed";
            const gutter = 55;
            const draw = () => {
              const p = state.progress;
              context.clearRect(0, 0, width + gutter * 2, height + gutter * 2);
              label.style.opacity = String(1 - Math.min(1, p * 16));
              canvas.style.opacity = p > 0 && p < 1 ? "1" : "0";
              if (p <= 0 || p >= 1) return;
              context.fillStyle = color;
              for (const point of particles) {
                const local = Math.max(0, Math.min(1, p * 1.65 - (point.x / width) * 0.65));
                const fade = 1 - local;
                context.globalAlpha = point.alpha * fade * Math.min(1, p * 16);
                const x = point.x + gutter + local * point.drift;
                const y = point.y + gutter + Math.sin(local * 3.14) * point.lift;
                context.fillRect(x, y, density * (1 - local * 0.5), density * (1 - local * 0.5));
              }
              context.globalAlpha = 1;
            };
            const measure = () => {
              const style = getComputedStyle(label);
              width = Math.ceil(label.offsetWidth);
              height = Math.ceil(label.offsetHeight);
              if (!width || !height) return;
              const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
              canvas.width = Math.ceil((width + gutter * 2) * dpr);
              canvas.height = Math.ceil((height + gutter * 2) * dpr);
              canvas.style.width = `${width + gutter * 2}px`;
              canvas.style.height = `${height + gutter * 2}px`;
              context.setTransform(dpr, 0, 0, dpr, 0, 0);
              color = style.color;
              const mask = document.createElement("canvas");
              mask.width = width;
              mask.height = height;
              const ink = mask.getContext("2d");
              if (!ink) return;
              ink.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
              (ink as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
                style.letterSpacing;
              ink.fillStyle = "white";
              ink.textBaseline = "middle";
              ink.fillText(text, 0, height * 0.5);
              const pixels = ink.getImageData(0, 0, width, height).data;
              density = Math.max(2, Math.ceil(Math.sqrt((width * height) / 2200)));
              particles = [];
              for (let y = 0; y < height; y += density) {
                for (let x = 0; x < width; x += density) {
                  const alpha = pixels[(y * width + x) * 4 + 3]! / 255;
                  if (alpha < 0.1) continue;
                  const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
                  const noise = seed - Math.floor(seed);
                  particles.push({
                    x,
                    y,
                    alpha,
                    drift: 30 + noise * 75,
                    lift: (noise - 0.55) * 100,
                  });
                }
              }
              draw();
            };
            const section = element.closest("section")!;
            gsap.to(state, {
              progress: 1,
              ease: "none",
              onUpdate: draw,
              scrollTrigger: { trigger: section, start: "top top", end: "+=550", scrub: 0.4 },
            });
            const resize = new ResizeObserver(measure);
            resize.observe(label);
            measure();
            document.fonts.ready.then(() => {
              if (!cancelled && active) measure();
            });
            return () => {
              active = false;
              resize.disconnect();
              label.style.removeProperty("opacity");
              canvas.style.opacity = "0";
            };
          },
          element,
        );
      })
      .catch(() => {
        /* The readable DOM text is the fallback. */
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [text]);

  return (
    <span ref={host} className="vaporize-text">
      <span className="vapor-label">{text}</span>
      <canvas aria-hidden="true" />
    </span>
  );
}
