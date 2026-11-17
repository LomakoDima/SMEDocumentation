import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownRight, ArrowUp, ArrowUpRight, Github, Menu, X } from "lucide-react";
import { NAV, SITE } from "@/lib/site";
import { useFooterReveal } from "./useFooterReveal";

export function Logo({
  onNavigate,
  maskWordmark = false,
}: {
  onNavigate?: () => void;
  maskWordmark?: boolean;
}) {
  const wordmark = (
    <span className="wordmark">
      StoryMod<span>Engine</span>
    </span>
  );
  return (
    <Link to="/" className="site-logo" aria-label="StoryModEngine — главная" onClick={onNavigate}>
      <span className="logo-mark">
        <svg viewBox="0 0 32 36" fill="none" aria-hidden="true">
          <path d="M28 4H4v11l24 6v11H4" pathLength="1" stroke="currentColor" strokeWidth="4" />
        </svg>
      </span>
      {maskWordmark ? <span className="footer-wordmark-mask">{wordmark}</span> : wordmark}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", close);
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <header ref={header} className="site-header" data-scrolled={scrolled} data-menu-open={open}>
      <a className="skip-link" href="#main-content">
        Перейти к содержимому
      </a>
      <nav className="site-width header-inner" aria-label="Основная навигация">
        <Logo onNavigate={() => setOpen(false)} />
        <div className="desktop-navigation">
          <Link
            to="/"
            hash="world"
            className="nav-link"
            activeOptions={{ exact: true }}
            activeProps={{ className: "nav-link is-active" }}
          >
            Движок
          </Link>
          {NAV.filter((item) => item.to !== "/download").map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link"
              activeProps={{ className: "nav-link is-active" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="header-actions">
          <a href={SITE.github} className="header-source" aria-label="StoryModEngine на GitHub">
            <Github size={20} aria-hidden="true" />
          </a>
          <Link to="/download" className="action-button header-download">
            Скачать <ArrowDown size={16} aria-hidden="true" />
          </Link>
        </div>
        <button
          ref={menuButton}
          className="mobile-menu-button"
          aria-label="Меню"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation site-width"
          aria-label="Мобильная навигация"
        >
          <Link to="/" hash="world" onClick={() => setOpen(false)}>
            Движок <ArrowDownRight size={18} aria-hidden="true" />
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              activeProps={{ className: "is-active" }}
            >
              {item.label} <ArrowDownRight size={18} aria-hidden="true" />
            </Link>
          ))}
          <a href={SITE.github}>
            GitHub <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const footer = useRef<HTMLElement>(null);
  const route = useRouterState({ select: (state) => state.location.pathname });
  const finishReveal = useFooterReveal(footer, route);
  return (
    <footer ref={footer} className="site-footer" onFocusCapture={finishReveal}>
      <div className="site-width footer-inner">
        <div className="footer-identity">
          <Logo maskWordmark />
          <p className="footer-credit">
            <span className="footer-credit-label">Автор —</span>{" "}
            <a href={SITE.authorUrl} className="footer-author" aria-label={SITE.author}>
              <span className="footer-credit-name" aria-hidden="true">
                {Array.from(SITE.author).map((letter, index) => (
                  <span className="footer-credit-char" key={index}>
                    {letter}
                  </span>
                ))}
              </span>
            </a>
          </p>
        </div>
        <nav className="footer-navigation" aria-label="Навигация внизу страницы">
          {NAV.map((item) => (
            <span className="footer-nav-mask" key={item.to}>
              <Link to={item.to}>{item.label}</Link>
            </span>
          ))}
          <span className="footer-nav-mask">
            <a href={SITE.github}>
              GitHub <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </span>
        </nav>
        <a href="#main-content" className="footer-top" aria-label="Наверх">
          <ArrowUp size={21} aria-hidden="true" />
        </a>
      </div>
      <div className="site-width footer-meta">
        <span>Minecraft Java Edition 1.20.1</span>
        <p>Неофициальный продукт Minecraft. Не одобрен Mojang или Microsoft и не связан с ними.</p>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro site-width">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="display-heading">{title}</h1>
      {children && <div className="page-intro-description">{children}</div>}
    </section>
  );
}
