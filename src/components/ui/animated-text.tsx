// Adapted from promptfortext1.txt. The weight wave is scroll-driven, not an infinite loop.
import { Fragment } from "react";

export function AnimatedText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={`weight-text ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={wordIndex}>
            <span className="weight-word">
              {Array.from(word).map((char, index) => (
                <span className="weight-cell" data-char={char} key={index}>
                  <span className="weight-glyph">{char}</span>
                </span>
              ))}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
