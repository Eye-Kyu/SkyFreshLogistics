import type { Metadata } from "next";
import { Container, CloseBand, PageIntro } from "@/components/ui/primitives";
import { FaqSection } from "@/components/faq/FaqSection";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about shipping, pricing, documents, and the farmer network.",
};

export default function FaqPage() {
  return (
    <>
      <PageIntro
        title="Answers before you have to ask"
        lead="Can't find what you're looking for? Reach out and our team will help directly."
      />

      <section className="section--s">
        <Container>
          <div className="grid-12">
            <div className="g-aside">
              <p className="muted small">{faqs.length} questions, by topic</p>
            </div>
            <div className="g-main">
              <FaqSection />
            </div>
          </div>
        </Container>
      </section>

      <CloseBand
        title="Still have questions?"
        line="The team answers within one business day, the hotline at any hour."
        primary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
