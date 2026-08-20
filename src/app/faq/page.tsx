import type { Metadata } from "next";
import { Container, SectionHeader } from "@/components/ui/primitives";
import { FaqSection } from "@/components/faq/FaqSection";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about shipping, pricing, documents, and the farmer network.",
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-brand-slate-200 py-16 sm:py-20">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="FAQ"
            title="Answers before you have to ask"
            subtitle="Can't find what you're looking for? Reach out and our team will help directly."
          />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="mx-auto max-w-3xl">
          <FaqSection />
        </Container>
      </section>

      <CTASection
        title="Still have questions?"
        primary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
