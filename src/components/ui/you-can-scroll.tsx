import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ArrowUpRight } from "lucide-react";

export type ScrollShowcaseItem = {
  title: string;
  description: string;
  href: string;
  content: ReactNode;
};

// Adapted from foridea.txt: the list travels through a fixed reading position.
// Each row selects real product content instead of cycling through decorative verbs.
// All animation state stays inside this component; there is no global theme or debug UI.
export function ScrollShowcase({
  prefix,
  headingId,
  items,
}: {
  prefix: string;
  headingId: string;
  items: readonly ScrollShowcaseItem[];
}) {
  const stage = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const currentIndex = useRef(0);
  const scrollToItem = useRef<((index: number) => void) | null>(null);
  const [selected, setSelected] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const current = items[selected]!;

  const select = useCallback((index: number) => {
    if (currentIndex.current === index) return;
    currentIndex.current = index;
    setSelected(index);
  }, []);
  const go = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(items.length - 1, index));
      if (scrollToItem.current) scrollToItem.current(next);
      else select(next);
    },
    [items.length, select],
  );

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        const root = stage.current;
        const belt = list.current;
        if (cancelled || !root || !belt || items.length < 2) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        dispose = () => media.revert();
        media.add(
          "(min-width: 901px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
          () => {
            root.dataset["resourceScroll"] = "true";
            setEnhanced(true);
            const rows = Array.from(belt.querySelectorAll<HTMLElement>(".resource-word"));
            const rowHeight = () => rows[0]!.offsetHeight;
            const animation = gsap.fromTo(
              belt,
              { y: () => rowHeight() },
              {
                y: () => rowHeight() * (2 - rows.length),
                ease: "none",
                scrollTrigger: {
                  trigger: root,
                  start: "top top",
                  end: () => `+=${(rows.length - 1) * window.innerHeight * 0.42}`,
                  pin: true,
                  scrub: 0.5,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  refreshPriority: 1,
                },
                onUpdate: function (this: { progress: () => number }) {
                  if (cancelled) return;
                  const position = this.progress() * (rows.length - 1);
                  rows.forEach((row, index) => {
                    row.style.opacity = String(
                      Math.max(0.55, 1 - Math.abs(position - index) * 0.45),
                    );
                  });
                  select(Math.round(position));
                },
              },
            );
            const trigger = animation.scrollTrigger!;
            scrollToItem.current = (index) =>
              window.scrollTo({
                top: trigger.start + ((trigger.end - trigger.start) * index) / (rows.length - 1),
                behavior: "smooth",
              });
            ScrollTrigger.refresh();
            return () => {
              scrollToItem.current = null;
              delete root.dataset["resourceScroll"];
              rows.forEach((row) => row.style.removeProperty("opacity"));
              if (!cancelled) setEnhanced(false);
            };
          },
          root,
        );
      })
      .catch(() => {
        dispose?.();
        scrollToItem.current = null;
        if (stage.current) delete stage.current.dataset["resourceScroll"];
        list.current
          ?.querySelectorAll<HTMLElement>(".resource-word")
          .forEach((row) => row.style.removeProperty("opacity"));
        if (!cancelled) setEnhanced(false);
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [items, select]);

  function onKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key))
      return;
    event.preventDefault();
    const buttons = Array.from(list.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const focused = buttons.findIndex((button) => button === document.activeElement);
    const start = focused >= 0 ? focused : selected;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : Math.max(
              0,
              Math.min(
                items.length - 1,
                start + (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1),
              ),
            );
    go(next);
    buttons[next]?.focus({ preventScroll: true });
  }

  return (
    <div ref={stage} className="resource-scroll-stage">
      <div className="sequence-width resource-scroll-grid">
        <div className="resource-scroll-copy">
          <h2 id={headingId} className="resource-scroll-prefix">
            {prefix}
          </h2>
          <div className="resource-word-window">
            <ul
              ref={list}
              className="resource-word-list"
              aria-label="Выбрать средство просмотра ресурсов проекта"
              onKeyDown={onKeyDown}
            >
              {items.map((item, index) => (
                <li className="resource-word" key={item.title}>
                  <button
                    type="button"
                    aria-pressed={selected === index}
                    tabIndex={enhanced && selected !== index ? -1 : 0}
                    onClick={() => go(index)}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="resource-scroll-preview">
          <div className="resource-scroll-image" key={current.title}>
            {current.content}
          </div>
          <div className="resource-scroll-description">
            <p aria-live="polite">{current.description}</p>
            <a
              href={current.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Открыть оригинал: ${current.title}`}
            >
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
