import { useEffect, type RefObject } from "react";

export function useHomeSequence(
  root: RefObject<HTMLDivElement | null>,
  journey: RefObject<number>,
) {
  useEffect(() => {
    let cancelled = false;
    let entered = false;
    let dispose: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !root.current) return;
        const page = root.current;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        dispose = () => media.revert();
        media.add(
          {
            all: "(min-width: 0px)",
            desktop: "(min-width: 768px)",
            reduce: "(prefers-reduced-motion: reduce)",
            short: "(max-height: 639px)",
          },
          (context) => {
            if (context.conditions!["reduce"] || context.conditions!["short"]) return;
            const select = gsap.utils.selector(page);
            const chapter = (selector: string) => select(selector)[0]!;
            ScrollTrigger.create({
              trigger: page,
              start: "top top",
              end: "bottom bottom",
              onUpdate: (trigger) => {
                journey.current = trigger.progress;
              },
              onRefresh: (trigger) => {
                journey.current = trigger.progress;
              },
            });
            const opening = chapter(".opening-chapter");
            const words = select(".opening-word");
            const cores = select(".opening-word-core");
            const leftGlyphs = select(".opening-word:first-child .weight-glyph");
            const rightGlyphs = select(".opening-engine .weight-glyph");
            const depth = context.conditions!["desktop"] ? 1 : 0.45;
            if (!entered && opening.getBoundingClientRect().bottom > innerHeight * 0.4) {
              entered = true;
              // The two real word parts hinge around their shared seam. A contour
              // resolves into solid type as the weight ripple reaches the outside.
              const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
              entrance
                .fromTo(
                  cores,
                  {
                    xPercent: (index: number) => (index === 0 ? -12 : 12),
                    rotationY: (index: number) => (index === 0 ? -38 : 38),
                    z: -120,
                    "--word-fill": 0,
                    "--word-stroke": "1px",
                  },
                  {
                    xPercent: 0,
                    rotationY: 0,
                    z: 0,
                    duration: 1.25,
                    stagger: 0.07,
                    clearProps: "transform",
                  },
                  0.05,
                )
                .fromTo(
                  leftGlyphs,
                  {
                    yPercent: 42,
                    scaleY: 1.16,
                    opacity: 0,
                    fontVariationSettings: '\"wght\" 300',
                  },
                  {
                    yPercent: 0,
                    scaleY: 1,
                    opacity: 1,
                    fontVariationSettings: '\"wght\" 700',
                    duration: 0.75,
                    stagger: { each: 0.035, from: "end" },
                    clearProps: "transform,opacity",
                  },
                  0.12,
                )
                .fromTo(
                  rightGlyphs,
                  {
                    yPercent: -42,
                    scaleY: 1.16,
                    opacity: 0,
                    fontVariationSettings: '\"wght\" 300',
                  },
                  {
                    yPercent: 0,
                    scaleY: 1,
                    opacity: 1,
                    fontVariationSettings: '\"wght\" 700',
                    duration: 0.75,
                    stagger: 0.035,
                    clearProps: "transform,opacity",
                  },
                  0.22,
                )
                .to(
                  cores,
                  {
                    "--word-fill": 1,
                    "--word-stroke": "0px",
                    duration: 0.7,
                    stagger: 0.08,
                    ease: "power2.inOut",
                  },
                  0.55,
                )
                .to(
                  [...leftGlyphs, ...rightGlyphs],
                  {
                    fontVariationSettings: '\"wght\" 650',
                    duration: 0.5,
                    stagger: { each: 0.02, from: "center" },
                    ease: "sine.out",
                  },
                  1.15,
                )
                .fromTo(
                  select(".opening-line"),
                  { clipPath: "inset(0% 50% 0% 50%)" },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.85,
                    ease: "power3.inOut",
                    clearProps: "clipPath",
                  },
                  0.6,
                )
                .from(
                  select(".opening-line > span"),
                  { yPercent: 100, duration: 0.8, clearProps: "transform" },
                  0.65,
                )
                .from(
                  select(".opening-action-reveal"),
                  {
                    x: (index: number) => (index === 0 ? 28 : -28),
                    opacity: 0,
                    duration: 0.7,
                    stagger: 0.1,
                    clearProps: "transform,opacity",
                  },
                  1,
                );
            }
            // Scroll uses the outer word planes; entry owns only their inner cores.
            // The user can scroll at any point without two tweens fighting for a transform.
            gsap
              .timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: opening,
                  start: "top top",
                  end: "bottom 15%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              })
              .to(
                select(".opening-masthead"),
                {
                  y: () => -Math.min(115, innerHeight * 0.12) * depth,
                  scale: 1.035,
                  duration: 1,
                },
                0,
              )
              .to(
                words,
                {
                  xPercent: (index: number) => (index === 0 ? -19 : 19) * depth,
                  rotationY: (index: number) => (index === 0 ? 18 : -18) * depth,
                  yPercent: (index: number) => (index === 0 ? -7 : 7) * depth,
                  duration: 1,
                },
                0,
              )
              .to(words, { "--scroll-ink": 0.12, "--scroll-stroke": "1px", duration: 0.35 }, 0.22)
              .to(select(".opening-description"), { y: -50 * depth, duration: 1 }, 0)
              .to(select(".opening-actions"), { y: -22 * depth, duration: 1 }, 0)
              .to(
                select(".opening-masthead, .opening-description, .opening-actions"),
                { opacity: 0, duration: 0.3 },
                0.65,
              )
              .to({}, { duration: 0.05 }, 0.95);
            gsap.utils.toArray<HTMLElement>(".weight-text", page).forEach((text) => {
              if (text.closest(".opening-chapter")) return;
              const glyphs = text.querySelectorAll(".weight-glyph");
              gsap
                .timeline({
                  scrollTrigger: { trigger: text, start: "top 90%", end: "bottom 25%", scrub: 0.5 },
                })
                .fromTo(
                  glyphs,
                  { fontVariationSettings: '\"wght\" 350' },
                  {
                    fontVariationSettings: '\"wght\" 700',
                    stagger: 0.035,
                    duration: 0.6,
                    ease: "sine.inOut",
                  },
                  0,
                )
                .to(
                  glyphs,
                  {
                    fontVariationSettings: '\"wght\" 550',
                    stagger: 0.025,
                    duration: 0.6,
                    ease: "sine.inOut",
                  },
                  0.7,
                );
            });
            gsap.fromTo(
              select(".world-screen"),
              {
                y: 100,
                scale: 0.94,
                clipPath: "inset(2% 34% 2% 34%)",
              },
              {
                y: 0,
                scale: 1,
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "power1.out",
                scrollTrigger: {
                  trigger: chapter(".world-screen"),
                  start: "top 95%",
                  end: "top 15%",
                  scrub: 0.7,
                },
              },
            );
            gsap.fromTo(
              select(".cast-screen"),
              { y: 65 },
              {
                y: -30,
                ease: "none",
                scrollTrigger: {
                  trigger: chapter(".cast-chapter"),
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                },
              },
            );
            gsap.from(select(".comparison-stage"), {
              clipPath: "inset(0% 10% 0% 10%)",
              y: 50,
              ease: "power1.out",
              scrollTrigger: {
                trigger: chapter(".interface-comparison"),
                start: "top 90%",
                end: "top 15%",
                scrub: 0.65,
              },
            });
            gsap.utils.toArray<HTMLElement>(".capture-set", page).forEach((set) => {
              gsap.from(set, {
                y: 50,
                ease: "power1.out",
                scrollTrigger: { trigger: set, start: "top 95%", end: "top 40%", scrub: 0.5 },
              });
            });
            gsap.from(select(".script-screen"), {
              scale: 0.94,
              clipPath: "inset(0% 5% 0% 5%)",
              ease: "power1.out",
              scrollTrigger: {
                trigger: chapter(".script-screen"),
                start: "top 90%",
                end: "top 10%",
                scrub: 0.65,
              },
            });
            document.fonts.ready.then(() => {
              if (!cancelled) ScrollTrigger.refresh();
            });
            ScrollTrigger.refresh();
          },
          page,
        );
      })
      .catch(() => {
        dispose?.();
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [root, journey]);
}
