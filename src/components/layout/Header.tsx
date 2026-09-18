"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { primaryNav, site } from "@/data/site";
import { Button } from "@/components/ui/primitives";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-slate-200 bg-white/95 backdrop-blur">
      {/* Hotline strip */}
      <div className="hidden bg-brand-slate-950 text-white sm:block">
        <div className="container-page flex items-center justify-end gap-2 py-1.5 text-xs">
          <Phone aria-hidden="true" className="h-3 w-3 text-brand-leaf-400" />
          <span className="text-white/60">24/7 Cargo Hotline:</span>
          <a href={`tel:${site.hotline.replace(/\s+/g, "")}`} className="font-semibold hover:text-brand-leaf-300">
            {site.hotline}
          </a>
        </div>
      </div>

      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.fullName} — home`}>
          <Image
            src="/logo-mark.webp"
            alt=""
            width={36}
            height={36}
            priority
            className="h-9 w-9 object-contain"
          />
          <span className="font-display text-lg font-semibold text-brand-slate-900">{site.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-brand-slate-700 hover:text-brand-navy-800"
                >
                  {item.label}
                  <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full z-10 w-56 border border-brand-slate-200 bg-white p-2 opacity-0 shadow-lifted transition-all group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-3 py-2 text-sm text-brand-slate-700 hover:bg-brand-navy-50 hover:text-brand-navy-800"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-brand-slate-700 hover:text-brand-navy-800"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact" variant="primary">
            Get a Quote
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border border-brand-slate-200 lg:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Menu aria-hidden="true" className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen ? (
        <div className="border-t border-brand-slate-200 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold text-brand-slate-800 hover:bg-brand-slate-50"
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="ml-3 flex flex-col gap-1 border-l border-brand-slate-200 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-1.5 text-sm text-brand-slate-600 hover:bg-brand-slate-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="mt-3 flex flex-col gap-2 px-3">
              <Button href="/contact" variant="primary">
                Get a Quote
              </Button>
              <a
                href={`tel:${site.hotline.replace(/\s+/g, "")}`}
                className="text-center text-sm font-semibold text-brand-leaf-700"
              >
                24/7 Hotline: {site.hotline}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
