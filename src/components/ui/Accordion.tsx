"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y divide-brand-slate-200 border-y border-brand-slate-200">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm sm:text-base font-semibold text-brand-slate-900 transition-colors hover:text-brand-green-800"
            >
              <span>{item.question}</span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center border border-brand-slate-300 text-brand-slate-500 transition-all duration-200 ${
                  isOpen ? "rotate-45 border-brand-green-700 bg-brand-green-700 text-white" : ""
                }`}
                aria-hidden="true"
              >
                <Plus className="h-3.5 w-3.5" />
              </span>
            </button>
            {isOpen ? (
              <div className="pb-5 pr-10 text-sm leading-relaxed text-brand-slate-600">{item.answer}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
