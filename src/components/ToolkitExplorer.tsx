import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Box, Code2, Sparkles, UserRound } from "lucide-react";
import { TOOLS } from "@/lib/site";

const icons = [Box, UserRound, Sparkles, Code2];

// Website navigation to the documented tools, not a simulated engine UI.
export function ToolkitExplorer() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function selectWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % TOOLS.length;
    else if (event.key === "ArrowUp") next = (index + TOOLS.length - 1) % TOOLS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TOOLS.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
  }

  return (
    <div className="toolkit-explorer">
      <div
        className="toolkit-tabs"
        role="tablist"
        aria-label="Инструменты движка"
        aria-orientation="vertical"
      >
        {TOOLS.map((item, index) => {
          const Icon = icons[index]!;
          return (
            <button
              key={item.key}
              id={`tool-tab-${item.key}`}
              role="tab"
              aria-selected={index === selected}
              aria-controls={`tool-panel-${item.key}`}
              tabIndex={index === selected ? 0 : -1}
              ref={(element) => {
                buttons.current[index] = element;
              }}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => selectWithKeyboard(event, index)}
            >
              <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
              <span>{item.name}</span>
              <ArrowRight className="tab-arrow" size={18} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      {TOOLS.map((item, index) => (
        <div
          key={item.key}
          id={`tool-panel-${item.key}`}
          role="tabpanel"
          aria-labelledby={`tool-tab-${item.key}`}
          hidden={selected !== index}
          tabIndex={0}
          className="toolkit-panel"
        >
          <p className="tool-purpose">{item.purpose}</p>
          <h3>{item.name}</h3>
          <p className="tool-description">{item.detail}</p>
          <Link to="/docs/$" params={{ _splat: item.doc }} className="editorial-link">
            {index === 3 ? "Обзор языка сценариев" : "Открыть справку редактора"}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p className="reference-note">
            {index === 3
              ? "Описание языка дополняется. Проверенные примеры синтаксиса появятся в документации."
              : "Справка дополняется: описываем управление и приёмы работы."}
          </p>
        </div>
      ))}
    </div>
  );
}
