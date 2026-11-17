import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

export function useHorizontalRail(
  root: RefObject<HTMLElement | null>,
  viewport: RefObject<HTMLDivElement | null>,
  track: RefObject<HTMLDivElement | null>,
  count: number,
) {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const scrollToSlide = useRef<((index: number) => void) | null>(null);
  const update = useCallback((index: number) => {
    if (index === activeRef.current) return;
    activeRef.current = index;
    setActive(index);
  }, []);
  const navigate = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(count - 1, index));
      if (scrollToSlide.current) return scrollToSlide.current(next);
      const container = viewport.current;
      if (!container) return;
      container.scrollTo({
        left: next * container.clientWidth,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    },
    [count, viewport],
  );

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const section = root.current;
    const container = viewport.current;
    const belt = track.current;
    if (!section || !container || !belt) return;
    const onScroll = () => {
      if (section.dataset["horizontal"] === "true") return;
      update(
        Math.min(count - 1, Math.round(container.scrollLeft / Math.max(1, container.clientWidth))),
      );
    };
    const onHash = () => {
      const id = window.location.hash.slice(1);
      const slides = Array.from(belt.querySelectorAll<HTMLElement>(".editor-slide"));
      const index = id === section.id ? 0 : slides.findIndex((slide) => slide.id === id);
      if (index >= 0) navigate(index);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHash);
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        dispose = () => media.revert();
        media.add(
          "(min-width: 901px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)",
          () => {
            section.dataset["horizontal"] = "true";
            container.scrollLeft = 0;
            const distance = () => Math.max(0, belt.scrollWidth - container.clientWidth);
            const animation = gsap.to(belt, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                id: "home-editor-rail",
                trigger: section,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.65,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                refreshPriority: 1,
              },
              onUpdate: function (this: { progress: () => number }) {
                update(Math.round(this.progress() * (count - 1)));
              },
            });
            const trigger = animation.scrollTrigger!;
            scrollToSlide.current = (index) => {
              window.scrollTo({
                top: trigger.start + ((trigger.end - trigger.start) * index) / (count - 1),
                behavior: "smooth",
              });
            };
            // Captions enter with the horizontal camera; screenshots themselves keep
            // their original geometry and never receive an artificial zoom or crop.
            gsap.utils.toArray<HTMLElement>(".editor-slide", section).forEach((slide, index) => {
              if (index === 0) return;
              gsap.from(slide.querySelector(".editor-slide-caption"), {
                y: 24,
                opacity: 0,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: slide,
                  containerAnimation: animation,
                  start: "left 85%",
                  end: "left 20%",
                  scrub: true,
                },
              });
            });
            ScrollTrigger.refresh();
            if (window.location.hash) onHash();
            return () => {
              scrollToSlide.current = null;
              delete section.dataset["horizontal"];
              container.scrollLeft = activeRef.current * container.clientWidth;
            };
          },
          section,
        );
      })
      .catch(() => {
        dispose?.();
        scrollToSlide.current = null;
        delete section.dataset["horizontal"];
        // Keep the native horizontal scroller available if enhancement fails.
      });
    return () => {
      cancelled = true;
      dispose?.();
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, [root, viewport, track, count, navigate, update]);

  return { active, navigate };
}
