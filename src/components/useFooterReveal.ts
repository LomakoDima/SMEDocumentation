import { useCallback, useEffect, useRef, type FocusEvent, type RefObject } from "react";

export function useFooterReveal(root: RefObject<HTMLElement | null>, route: string) {
  const settle = useRef<(() => void) | null>(null);
  const finish = useCallback((event: FocusEvent<HTMLElement>) => {
    // A pointer click must not jump an in-flight entrance to its final frame.
    // Keyboard focus still exposes every control immediately.
    if (event.target instanceof HTMLElement && event.target.matches(":focus-visible"))
      settle.current?.();
  }, []);
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("gsap")
      .then(({ gsap }) => {
        const footer = root.current;
        if (cancelled || !footer) return;
        const media = gsap.matchMedia();
        dispose = () => media.revert();
        media.add(
          "(prefers-reduced-motion: no-preference)",
          () => {
            if (footer.contains(document.activeElement)) return;
            const select = gsap.utils.selector(footer);
            const mark = select(".logo-mark");
            const wordmark = select(".wordmark");
            const credit = select(".footer-credit-label");
            const characters = select(".footer-credit-char");
            const links = select(".footer-navigation a");
            const top = select(".footer-top");
            const meta = select(".footer-meta > *");
            const moving = [
              ...mark,
              ...wordmark,
              ...credit,
              ...characters,
              ...links,
              ...top,
              ...meta,
            ];
            const logoPath = select(".logo-mark path");
            const arrowPaths = gsap.utils.toArray<SVGPathElement>(".footer-top path", footer);
            gsap.set(moving, { force3D: true, willChange: "transform,opacity" });
            // Initialise once; use only forward tweens. No per-item clearProps or
            // perspective changes that promote/demote individual glyph layers.
            gsap.set(mark, { scale: 0.45, rotation: -90 });
            gsap.set(wordmark, { x: -28, opacity: 0 });
            gsap.set(credit, { yPercent: 90, opacity: 0 });
            gsap.set(characters, { yPercent: 115, opacity: 0 });
            gsap.set(links, { x: 45, opacity: 0 });
            gsap.set(top, { y: 22, opacity: 0 });
            gsap.set(meta, { y: 8, opacity: 0 });
            gsap.set(logoPath, { strokeDasharray: 1, strokeDashoffset: 1 });
            arrowPaths.forEach((path) => {
              const length = path.getTotalLength();
              gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            });
            const animation = gsap.timeline({
              paused: true,
              defaults: { ease: "power3.out", force3D: true },
              onComplete: () => {
                gsap.set(moving, { clearProps: "willChange" });
              },
            });
            animation
              .to(mark, { scale: 1, rotation: 0, duration: 0.75, ease: "power4.out" }, 0)
              .to(logoPath, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" }, 0.08)
              .to(wordmark, { x: 0, opacity: 1, duration: 0.75 }, 0.2)
              .to(credit, { yPercent: 0, opacity: 1, duration: 0.5 }, 0.4)
              .to(characters, { yPercent: 0, opacity: 1, stagger: 0.035, duration: 0.65 }, 0.46)
              .to(
                links,
                { x: 0, opacity: 1, stagger: { each: 0.08, from: "end" }, duration: 0.7 },
                0.4,
              )
              .to(top, { y: 0, opacity: 1, duration: 0.6 }, 0.65)
              .to(
                arrowPaths,
                { strokeDashoffset: 0, stagger: 0.1, duration: 0.5, ease: "power2.inOut" },
                0.8,
              )
              .to(meta, { y: 0, opacity: 1, stagger: 0.08, duration: 0.55 }, 0.85);
            let started = false;
            const observer = new IntersectionObserver(
              (entries) => {
                if (
                  cancelled ||
                  started ||
                  !entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.35)
                )
                  return;
                started = true;
                observer.disconnect();
                animation.play(0);
              },
              { threshold: 0.35 },
            );
            observer.observe(footer);
            settle.current = () => {
              started = true;
              observer.disconnect();
              animation.progress(1).pause();
            };
            return () => {
              observer.disconnect();
              settle.current = null;
            };
          },
          footer,
        );
      })
      .catch(() => {
        dispose?.();
        settle.current = null;
      });
    return () => {
      cancelled = true;
      dispose?.();
      settle.current = null;
    };
  }, [root, route]);
  return finish;
}
