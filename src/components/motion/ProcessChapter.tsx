"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The page's one scroll pattern: a pinned dial beside the steps. The dial
// is CSS-sticky, so it holds without script; GSAP only tracks which step is
// in view and scrubs the progress rule. Under reduced motion the rule is
// full and no step dims.
export function ProcessChapter({
  steps,
  label,
}: {
  steps: { title: string; description: string }[];
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const spine = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".chapter__steps li"));

    const triggers = items.map((item, i) =>
      ScrollTrigger.create({
        trigger: item,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) {
            setActive(i);
            items.forEach((node, j) => node.classList.toggle("is-active", j === i));
          }
        },
      })
    );
    items[0]?.classList.add("is-active");

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 60rem)", () => {
      el.classList.add("is-live");
      gsap.fromTo(
        spine.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: el.querySelector(".chapter__steps"), start: "top 55%", end: "bottom 55%", scrub: true },
        }
      );
      return () => el.classList.remove("is-live");
    });

    return () => {
      triggers.forEach((t) => t.kill());
      mm.revert();
    };
  }, []);

  const current = steps[active];

  return (
    <div className="chapter" ref={root}>
      <div className="chapter__pin">
        <div className="chapter__dial" aria-hidden="true">
          <div className="chapter__now">{String(active + 1).padStart(2, "0")}</div>
          <div>
            <div className="chapter__of">of {String(steps.length).padStart(2, "0")}</div>
            <div className="chapter__title">{current.title}</div>
          </div>
          <div className="chapter__spine">
            <span ref={spine} />
          </div>
        </div>
      </div>
      <ol className="chapter__steps" aria-label={label}>
        {steps.map((step) => (
          <li key={step.title}>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
