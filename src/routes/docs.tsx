import { createFileRoute, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { DEFAULT_DOC, getDoc, getFlat, VERSIONS, VERSION_LABELS } from "@/lib/docs";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Документация — StoryModEngine" },
      { name: "description", content: "Техническая документация StoryModEngine." },
      { property: "og:title", content: "Документация — StoryModEngine" },
      { property: "og:description", content: "Техническая документация StoryModEngine." },
    ],
  }),
  component: DocsLayout,
});

function DocsLayout() {
  const { _splat } = useParams({ strict: false }) as { _splat?: string };
  const current = _splat?.replace(/\/$/, "");
  const version = current?.split("/")[0] ?? VERSIONS[0] ?? "latest";
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const switchVersion = (value: string) => {
    const rest = current?.split("/").slice(1).join("/");
    const target =
      rest && getDoc(`${value}/${rest}`)
        ? `${value}/${rest}`
        : (getFlat(value)[0]?.id ?? DEFAULT_DOC);
    navigate({ to: "/docs/$", params: { _splat: target } });
  };
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);
  return (
    <div className="docs-layout site-width">
      <div className="docs-toolbar">
        <p className="docs-toolbar-title">Документация</p>
        <div className="docs-toolbar-search">
          <DocsSearch version={version} />
        </div>
        <label className="docs-version">
          <span className="sr-only">Версия документации</span>
          <select value={version} onChange={(event) => switchVersion(event.target.value)}>
            {VERSIONS.map((value) => (
              <option key={value} value={value}>
                {VERSION_LABELS[value] ?? value}
              </option>
            ))}
          </select>
        </label>
        <button
          ref={menuButton}
          type="button"
          className="docs-section-toggle"
          onClick={() => setMobileOpen(true)}
          aria-expanded={mobileOpen}
        >
          <Menu size={18} aria-hidden="true" /> Разделы
        </button>
      </div>
      {mobileOpen && (
        <div className="docs-drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <div
            className="docs-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Разделы документации"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key !== "Tab") return;
              const controls = event.currentTarget.querySelectorAll<HTMLElement>(
                "a[href], button:not([disabled]), select",
              );
              const first = controls[0];
              const last = controls[controls.length - 1];
              if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last?.focus();
              } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first?.focus();
              }
            }}
          >
            <div className="docs-drawer-heading">
              <span>Документация</span>
              <button
                type="button"
                autoFocus
                aria-label="Закрыть разделы"
                onClick={() => {
                  setMobileOpen(false);
                  menuButton.current?.focus();
                }}
              >
                <X size={22} />
              </button>
            </div>
            <DocsSidebar
              version={version}
              current={current}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
      <div className="docs-columns">
        <aside className="docs-sidebar">
          <div>
            <DocsSidebar version={version} current={current} />
          </div>
        </aside>
        <Outlet />
      </div>
    </div>
  );
}
