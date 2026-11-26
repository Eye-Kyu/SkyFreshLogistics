import type { Metadata } from "next";
import { Container, CloseBand, PageIntro } from "@/components/ui/primitives";

// Testimonials, figures, certification and partner names, and the case study
// in src/data/trust.ts are unverified placeholders, so this page does not show
// them. It states how Bravair handles a shipment, from facts on the rest of the
// site, and asks buyers to request references directly.

export const metadata: Metadata = {
  title: "Why Bravair",
  description: "How Bravair prices, protects and documents every shipment, and how to ask for references.",
};

const practices = [
  {
    title: "Published rates only",
    detail:
      "Instant estimates come from Bravair's own rate sheet. A lane without an active rate is priced by the team, never guessed.",
  },
  {
    title: "An unbroken cold chain",
    detail: "Pre-cooling pulls field heat after harvest, and cold rooms hold temperature right up to departure.",
  },
  {
    title: "Paperwork handled",
    detail: "Phytosanitary certificates, export permits and customs clearance are prepared by our compliance team.",
  },
  {
    title: "Tracked to the buyer",
    detail: "Temperature, location and milestone alerts from collection to delivery, so nobody has to call for an update.",
  },
  {
    title: "A hotline that answers",
    detail: "The cargo hotline runs 24/7 for time-sensitive shipments and after-hours emergencies.",
  },
];

export default function TrustPage() {
  return (
    <>
      <PageIntro
        tone="field"
        title="Logistics is a trust business"
        lead="Here is how we handle every shipment, and how to check us before you book."
      />

      <section className="section">
        <Container>
          <div className="grid-12">
            <div className="g-aside">
              <h2>Five things we do every time</h2>
            </div>
            <ol className="rows g-main">
              {practices.map((p) => (
                <li key={p.title} data-reveal>
                  <h3>{p.title}</h3>
                  <p>{p.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <CloseBand
        title="Ask for our references"
        line="Request certifications and trade references with your quote, and we'll send them with the price."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: "See how it works", href: "/how-it-works" }}
      />
    </>
  );
}
