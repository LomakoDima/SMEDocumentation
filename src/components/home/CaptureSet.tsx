import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { productImage, type ProductCapture } from "@/lib/product";
import { ProductShot } from "./ProductShot";

export type CaptureChoice = { file: ProductCapture["file"]; title: string; copy: string };

export function CaptureSet({
  choices,
  label,
  layout,
}: {
  choices: readonly CaptureChoice[];
  label: string;
  layout: "content" | "resources";
}) {
  const [selected, setSelected] = useState(0);
  const current = choices[selected]!;
  return (
    <div className={`capture-set capture-set-${layout}`}>
      <div className="capture-set-choices" role="group" aria-label={label}>
        {choices.map((choice, index) => (
          <button
            key={choice.file}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
          >
            {choice.title}
          </button>
        ))}
      </div>
      <ProductShot
        key={current.file}
        file={current.file}
        className="capture-set-image"
        caption={false}
      />
      <div className="capture-set-description">
        <p aria-live="polite">{current.copy}</p>
        <a
          href={productImage(current.file)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Открыть оригинал: ${current.title}`}
        >
          <ArrowUpRight size={22} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
