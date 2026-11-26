import type { Metadata } from "next";
import { Container, CloseBand, PageIntro } from "@/components/ui/primitives";
import { FilterableProductGrid } from "@/components/catalog/FilterableProductGrid";
import { horticultureCategories, horticultureProducts, seasonalCalendar } from "@/data/products";
import { photos } from "@/data/photos";

export const metadata: Metadata = {
  title: "Horticulture export",
  description:
    "Export fresh fruits, vegetables, herbs and exotics with Bravair: cold-chain handling from farm to global market.",
};

// The calendar marks the current quarter; regenerate daily.
export const revalidate = 86400;

const specs = [
  {
    figure: "2 to 8°C",
    title: "Temperature",
    detail: "Most horticulture is held at 2 to 8°C depending on variety, from pre-cooling through transit.",
  },
  {
    figure: "5 days to 3+ weeks",
    title: "Shelf life",
    detail: "Typical shelf life ranges from 5 days (leafy greens) to 3+ weeks (root vegetables) post-harvest.",
  },
  {
    figure: "Retail-ready",
    title: "Packaging",
    detail: "Ventilated export cartons sized and labelled to destination-market retail and foodservice standards.",
  },
];

export default function HorticulturePage() {
  const quarter = Math.floor(new Date().getMonth() / 3);

  return (
    <>
      <PageIntro
        title="Fruits, vegetables, and herbs, export-ready"
        lead="From avocados to fine beans, we handle grading, cold storage, and freight for a wide range of horticultural produce."
        photo={{ photo: photos.produce, slot: "horticulture-hero", ratio: "land" }}
      />

      <section className="section">
        <Container>
          <div className="head head--split">
            <h2>The produce we move</h2>
            <p className="lead">Filter by family. Ask about anything not listed.</p>
          </div>
          <FilterableProductGrid categories={horticultureCategories} products={horticultureProducts} label="Horticulture products" />
        </Container>
      </section>

      <section className="band section">
        <Container>
          <div className="head">
            <h2>How produce travels</h2>
          </div>
          <div className="specs">
            {specs.map((spec) => (
              <div key={spec.title} data-reveal>
                <b>{spec.figure}</b>
                <h3>{spec.title}</h3>
                <p>{spec.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="head head--split">
            <h2>When it&apos;s in season</h2>
            <p className="lead">Plan orders a quarter ahead. The current quarter is shaded.</p>
          </div>
          <div className="sched" data-reveal>
            {seasonalCalendar.map((q, i) => (
              <div key={q.quarter} className={i === quarter ? "is-now" : undefined}>
                <h3>{q.quarter}</h3>
                <ul>
                  {q.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CloseBand
        title="Ready to export your produce?"
        line="Tell us what you're growing and where it needs to go."
        primary={{ label: "Request a quote", href: "/contact" }}
      />
    </>
  );
}
