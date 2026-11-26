"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The page's one entrance and one reveal, run again on every route change.
// Content is visible by default: globals.css hides [data-hero-item] and
// [data-reveal] only under the `.js` class the layout's head script adds, and
// only when the visitor allows motion. Under reduced motion nothing is hidden
// and nothing moves.
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
      if (hero.length) {
        gsap.fromTo(
          hero,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05, clearProps: "transform" }
        );
      }

      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 12 });
        ScrollTrigger.batch(items, {
          start: "top 95%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.05,
              overwrite: true,
              clearProps: "transform",
            }),
        });
      }
      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, [pathname]);

  return null;
}
