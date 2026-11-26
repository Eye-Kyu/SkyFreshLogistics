"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="acc">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `${base}-panel-${idx}`;
        return (
          <div key={item.question} className="acc__item">
            <h3 style={{ fontSize: "inherit", maxWidth: "none" }}>
              <button
                type="button"
                className="acc__btn"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span>{item.question}</span>
                <Plus aria-hidden="true" className="acc__sign" size={20} />
              </button>
            </h3>
            <div id={panelId} className="acc__panel" hidden={!isOpen}>
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
