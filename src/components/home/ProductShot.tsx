import { ArrowUpRight } from "lucide-react";
import { PRODUCT_CAPTURES, productImage, type ProductCapture } from "@/lib/product";

const CAPTURE_HEIGHTS: Partial<Record<ProductCapture["file"], number>> = {
  "SMECreateCustomItem.jpg": 720,
  "SMEViewTexture.jpg": 720,
  "SMECreateRecipes.jpg": 717,
  "SME_IDE.jpg": 721,
};

export function ProductShot({
  file,
  className = "",
  eager = false,
  caption = true,
  label,
  description,
}: {
  file: ProductCapture["file"];
  className?: string;
  eager?: boolean;
  caption?: boolean;
  label?: string;
  description?: string;
}) {
  const capture = PRODUCT_CAPTURES.find((item) => item.file === file)!;
  return (
    <figure className={`product-shot ${className}`}>
      <a
        href={productImage(file)}
        target="_blank"
        rel="noreferrer"
        aria-label={`Открыть в полном размере: ${capture.title}`}
      >
        <img
          src={productImage(file)}
          alt={description ?? capture.description}
          width={1280}
          height={CAPTURE_HEIGHTS[file] ?? 719}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      </a>
      {caption && (
        <figcaption>
          <span>{label ?? capture.title}</span>
          <a href={productImage(file)} target="_blank" rel="noreferrer">
            Открыть снимок <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </figcaption>
      )}
    </figure>
  );
}
