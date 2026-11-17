import { useState, type CSSProperties } from "react";
import { ChevronsLeftRight, ArrowUpRight } from "lucide-react";

export function InterfaceCompare() {
  const [split, setSplit] = useState(48);
  return (
    <figure className="interface-comparison">
      <div className="comparison-labels">
        <span>Редактор интерфейсов</span>
        <span>Меню в игре</span>
      </div>
      <div
        className="comparison-stage"
        style={{ "--comparison-split": `${split}%` } as CSSProperties}
      >
        <img
          src="/product/MainMenuGame.jpg"
          alt="Главное меню Minecraft в игре"
          width={1280}
          height={719}
          loading="lazy"
          decoding="async"
        />
        <div className="comparison-editor">
          <img
            src="/product/SMEUIDesigner.jpg"
            alt="То же меню в редакторе интерфейсов StoryModEngine с панелями редактирования"
            width={1280}
            height={719}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="comparison-divider" aria-hidden="true">
          <span>
            <ChevronsLeftRight size={21} />
          </span>
        </div>
        <input
          className="comparison-input"
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          aria-label="Доля видимой области снимка редактора интерфейсов"
          aria-valuetext={`${split}% — редактор интерфейсов, ${100 - split}% — меню в игре`}
        />
      </div>
      <figcaption>
        <span>Перетаскивай разделитель, чтобы сравнить два снимка.</span>
        <div>
          <a href="/product/SMEUIDesigner.jpg" target="_blank" rel="noreferrer">
            Снимок редактора <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href="/product/MainMenuGame.jpg" target="_blank" rel="noreferrer">
            Снимок из игры <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
