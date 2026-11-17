import { useState, type ReactNode } from "react";
import { Check, Copy, Link2, Info, Lightbulb, TriangleAlert, Clock, ImageIcon } from "lucide-react";
import type { MdxPage } from "@/lib/docs";
import type { CalloutType } from "@/lib/rehype-callouts";

const CALLOUTS: Record<CalloutType, { label: string; Icon: typeof Info }> = {
  note: { label: "Заметка", Icon: Info },
  tip: { label: "Совет", Icon: Lightbulb },
  warning: { label: "Внимание", Icon: TriangleAlert },
  pending: { label: "Раздел дополняется", Icon: Clock },
};

const SCREENSHOT_FILES = import.meta.glob("/src/assets/docs/screenshots/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const SCREENSHOT_ROOT = "/src/assets/docs/screenshots/";

function screenshotUrl(id: string): string | undefined {
  for (const ext of ["png", "webp", "jpg", "jpeg"]) {
    const url = SCREENSHOT_FILES[`${SCREENSHOT_ROOT}${id}.${ext}`];
    if (url) return url;
  }
  return undefined;
}

export function Screenshot({ id, alt, children }: { id: string; alt: string; children?: ReactNode }) {
  const url = screenshotUrl(id);
  if (url) {
    return (
      <figure className="docs-shot">
        <a href={url} target="_blank" rel="noreferrer" title="Открыть в полном размере">
          <img src={url} alt={alt} loading="lazy" />
        </a>
        <figcaption>{alt}</figcaption>
      </figure>
    );
  }
  return (
    <figure className="docs-shot">
      <div className="docs-shot-empty" role="img" aria-label={`Скриншот появится позже: ${alt}`}>
        <strong><ImageIcon size={16} /> Скриншот появится позже</strong>
        <p>{children ?? alt}</p>
        <code>src/assets/docs/screenshots/{id}.png</code>
      </div>
      <figcaption>{alt}</figcaption>
    </figure>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="docs-kbd">{children}</kbd>;
}

function CodeBlock({ text, lang, children }: { text: string; lang?: string | undefined; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="docs-code group">
      <div className="docs-code-bar">
        <span>{!lang || lang === "text" ? "Текст" : lang}</span>
        <button
          type="button"
          aria-label="Скопировать код"
          onClick={() => {
            navigator.clipboard.writeText(text.replace(/\n$/, ""));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

function Anchor({ id, children, level }: { id?: string | undefined; children: ReactNode; level: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id} className="docs-heading">
      {children}
      <a href={`#${id}`} aria-label="Ссылка на этот раздел" className="docs-anchor"><Link2 size={14} /></a>
    </Tag>
  );
}

type WithNode = { node?: unknown; children?: ReactNode };

function codeLanguage(children: ReactNode): string | undefined {
  const child = Array.isArray(children) ? children[0] : children;
  const className = (child as { props?: { className?: string } } | undefined)?.props?.className;
  return className?.split(" ").find((c) => c.startsWith("language-"))?.replace("language-", "");
}

function nodeText(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(nodeText).join("");
  const props = (children as { props?: { children?: ReactNode } }).props;
  return props ? nodeText(props.children) : "";
}

const components = {
  h2: ({ id, children }: { id?: string; children?: ReactNode }) => <Anchor id={id} level={2}>{children}</Anchor>,
  h3: ({ id, children }: { id?: string; children?: ReactNode }) => <Anchor id={id} level={3}>{children}</Anchor>,
  pre: ({ children }: WithNode) => <CodeBlock text={nodeText(children)} lang={codeLanguage(children)}>{children}</CodeBlock>,
  table: ({ children }: WithNode) => <div className="docs-table"><table>{children}</table></div>,
  blockquote: (props: WithNode & { "data-callout"?: CalloutType }) => {
    const type = props["data-callout"];
    if (!type || !CALLOUTS[type]) return <blockquote>{props.children}</blockquote>;
    const { label, Icon } = CALLOUTS[type];
    return (
      <aside className="docs-callout" data-type={type}>
        <p className="docs-callout-title"><Icon size={15} /> {label}</p>
        {props.children}
      </aside>
    );
  },
  a: ({ href, children }: { href?: string; children?: ReactNode }) => (
    <a href={href} {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>
  ),
  Screenshot,
  Kbd,
};

export function MdxContent({ Page }: { Page: MdxPage }) {
  return (
    <div className="docs-prose">
      <Page components={components} />
    </div>
  );
}
