"use client";

import { useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { TabPills } from "@/components/ui/primitives";
import { faqCategories, faqs, type FaqCategory } from "@/data/faq";

export function FaqSection() {
  const [active, setActive] = useState<"all" | FaqCategory>("all");
  const filtered = active === "all" ? faqs : faqs.filter((f) => f.category === active);

  return (
    <div className="flex flex-col gap-10">
      <div className="sm:self-center">
        <TabPills items={faqCategories} active={active} onChange={setActive} />
      </div>
      <Accordion items={filtered} />
    </div>
  );
}
