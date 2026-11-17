import { useRef, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { VaporizeAnimationText } from "@/components/ui/vaporize-animation-text";
import { PRODUCT_CAPTURES, productImage } from "@/lib/product";
import { useHorizontalRail } from "./useHorizontalRail";

const SCENES = [
  { file: "SMETimelineCutscene.jpg", id: "timeline", tab: "Монтаж" },
  { file: "SMEVFXEditor.jpg", id: "vfx", tab: "Эффекты" },
  { file: "SMEReplayView.jpg", id: "replay", tab: "Повторы" },
] as const;
const FRAMES = SCENES.map((scene) => ({
  ...PRODUCT_CAPTURES.find((capture) => capture.file === scene.file)!,
  ...scene,
}));

export function SceneSequence() {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { active, navigate } = useHorizontalRail(root, viewport, track, FRAMES.length);
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    navigate(active + (event.key === "ArrowRight" ? 1 : -1));
  }
  return (
    <section
      className="home-chapter motion-chapter"
      id="motion"
      data-home-slide="4"
      aria-labelledby="motion-heading"
    >
      <div className="sequence-width chapter-heading motion-heading">
        <h2 id="motion-heading">
          Катсцены.
          <br />
          <VaporizeAnimationText text="Эффекты." />
        </h2>
        <p>Собирай катсцены на временной шкале, создавай эффекты и просматривай записи сцен.</p>
      </div>
      <div
        ref={root}
        className="editor-rail"
        id="scene-sequence"
        aria-label="Редакторы катсцен, эффектов и повторов"
      >
        <div
          ref={viewport}
          className="editor-rail-viewport"
          tabIndex={0}
          onKeyDown={onKeyDown}
          aria-label="Редакторы сцен. Для переключения используй клавиши со стрелками."
        >
          <div ref={track} className="editor-rail-track">
            {FRAMES.map((frame, index) => (
              <article
                className="editor-slide"
                id={frame.id}
                key={frame.file}
                aria-labelledby={`scene-title-${index}`}
              >
                <a
                  className="editor-slide-image"
                  href={productImage(frame.file)}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={active === index ? 0 : -1}
                  aria-label={`Открыть оригинал: ${frame.title}`}
                >
                  <img
                    src={productImage(frame.file)}
                    alt={frame.description}
                    width={1280}
                    height={719}
                    loading="eager"
                    decoding="async"
                  />
                </a>
                <div className="editor-slide-caption">
                  <h3 id={`scene-title-${index}`}>{frame.title}</h3>
                  <p>{frame.description}</p>
                  <a
                    href={productImage(frame.file)}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={active === index ? 0 : -1}
                    aria-label={`Открыть в полном размере: ${frame.title}`}
                  >
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <nav className="scene-navigation" aria-label="Редакторы сцен">
          {FRAMES.map((frame, index) => (
            <button
              key={frame.file}
              type="button"
              aria-pressed={active === index}
              onClick={() => navigate(index)}
            >
              {frame.tab}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
