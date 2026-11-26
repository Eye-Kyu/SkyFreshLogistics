"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import { primaryNav, site } from "@/data/site";

// Three-part slab: the wordmark, the site's real destinations (the two groups
// open as disclosure menus, by click or keyboard), and the hotline beside the
// one action. It slides away while reading down and returns on the way up.
export function Header() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const bar = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

  // Close menus on navigation (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setSheetOpen(false);
    setOpenMenu(null);
  }

  // Close an open menu on Escape or a click elsewhere.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [openMenu]);

  // Hide on scroll down, show on scroll up (direction matters, so a passive,
  // frame-throttled listener). Reduced motion keeps the bar in place.
  useEffect(() => {
    const el = bar.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const to = gsap.quickTo(el, "yPercent", { duration: 0.35, ease: "power3.out" });
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const down = y > last && y > 240;
        if (Math.abs(y - last) > 4) to(down && !el.matches(":focus-within") ? -100 : 0);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const tel = `tel:${site.hotline.replace(/\s+/g, "")}`;

  return (
    <header className="nav" ref={bar}>
      <div className="container nav__bar">
        <Link href="/" className="nav__brand" aria-label={`${site.fullName}, home`}>
          <Image src="/logo-mark.webp" alt="" width={36} height={36} priority />
          {site.name}
        </Link>

        <nav aria-label="Main">
          <ul className="nav__links" ref={navRef}>
            {primaryNav
              .filter((item) => item.href !== "/")
              .map((item) =>
                item.children ? (
                  <li key={item.label} className="nav__item">
                    <button
                      type="button"
                      className="nav__link"
                      aria-expanded={openMenu === item.label}
                      aria-controls={`menu-${item.label}`}
                      onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown aria-hidden="true" className="nav__chev" size={16} />
                    </button>
                    <div className="nav__menu" id={`menu-${item.label}`} hidden={openMenu !== item.label}>
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} aria-current={isCurrent(child.href) ? "page" : undefined}>
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li key={item.label}>
                    <Link href={item.href} className="nav__link" aria-current={isCurrent(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </li>
                )
              )}
          </ul>
        </nav>

        <div className="nav__end">
          <a href={tel} className="nav__hotline">
            24/7 cargo hotline
            <b>{site.hotline}</b>
          </a>
          <Link href="/contact" className="btn">
            Get a quote
          </Link>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={sheetOpen}
            aria-controls="nav-sheet"
            aria-label={sheetOpen ? "Close menu" : "Open menu"}
            onClick={() => setSheetOpen((v) => !v)}
          >
            {sheetOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </div>

      <div className="nav__sheet" id="nav-sheet" hidden={!sheetOpen}>
        <nav aria-label="Main, small screens" className="container">
          <ul>
            {primaryNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="nav__sub">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="actions" style={{ marginTop: "var(--space-lg)" }}>
            <Link href="/contact" className="btn btn--block">
              Get a quote
            </Link>
            <a href={tel} className="btn btn--quiet btn--block">
              Call {site.hotline}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
