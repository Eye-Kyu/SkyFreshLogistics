"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Segmented } from "@/components/ui/primitives";
import { faqCategories, faqs, type FaqCategory } from "@/data/faq";

export function FaqSection() {
  const [active, setActive] = useState<"all" | FaqCategory>("all");
  const filtered = active === "all" ? faqs : faqs.filter((f) => f.category === active);

  return (
    <div>
      <Segmented items={faqCategories} active={active} onChange={setActive} label="Filter questions by topic" />
      <Accordion key={active} items={filtered} />
    </div>
  );
}
