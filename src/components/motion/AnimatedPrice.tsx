"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usd } from "@/lib/estimateClient";

// The freight total counts up from zero once, when a price arrives. Under
// reduced motion it is written at once. The final value is always in the DOM
// for screen readers via aria-label.
export function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.textContent = usd.format(value);
      return;
    }
    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: value,
      duration: 0.7,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = usd.format(counter.v);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={usd.format(value)}>
      {usd.format(value)}
    </span>
  );
}
