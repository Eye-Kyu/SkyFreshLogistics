import type { Metadata } from "next";
import { CalendarRange, Package, Thermometer } from "lucide-react";
import { Container, SectionHeader, Eyebrow } from "@/components/ui/primitives";
import { FilterableProductGrid } from "@/components/catalog/FilterableProductGrid";
import { CTASection } from "@/components/ui/CTASection";
import { horticultureCategories, horticultureProducts, seasonalCalendar } from "@/data/products";

export const metadata: Metadata = {
  title: "Horticulture Export",
  description:
    "Export fresh fruits, vegetables, herbs and exotics with Bravair — cold-chain handling from farm to global market.",
};

const specs = [
  {
    icon: Thermometer,
    title: "Temperature",
    detail: "Most horticulture is held at 2–8°C depending on variety, from pre-cooling through transit.",
  },
  {
    icon: CalendarRange,
    title: "Shelf Life",
    detail: "Typical shelf life ranges from 5 days (leafy greens) to 3+ weeks (root vegetables) post-harvest.",
  },
  {
    icon: Package,
    title: "Packaging",
    detail: "Ventilated export cartons sized and labeled to destination-market retail and foodservice standards.",
  },
];

export default function HorticulturePage() {
  return (
    <>
      <section className="border-b border-brand-slate-200 py-16 sm:py-20">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="Horticulture"
            title="Fruits, vegetables, and herbs — export-ready"
            subtitle="From avocados to fine beans, we handle grading, cold storage, and freight for a wide range of horticultural produce."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <FilterableProductGrid categories={horticultureCategories} products={horticultureProducts} tone="navy" />
        </Container>
      </section>

      {/* Shipping info panel */}
      <section className="bg-brand-slate-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-px overflow-hidden border border-brand-slate-200 bg-brand-slate-200 sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.title} className="flex flex-col gap-3 bg-white p-7">
                <spec.icon aria-hidden="true" className="h-6 w-6 text-brand-navy-700" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-brand-slate-900">{spec.title}</h3>
                <p className="text-sm leading-relaxed text-brand-slate-600">{spec.detail}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Seasonal calendar */}
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-10">
          <SectionHeader eyebrow="Plan Ahead" title="Seasonal Availability Calendar" />
          <div className="grid overflow-hidden border border-brand-slate-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-brand-slate-200">
            {seasonalCalendar.map((quarter) => (
              <div key={quarter.quarter} className="flex flex-col gap-3 border-b border-brand-slate-200 p-6 last:border-b-0 sm:border-b lg:border-b-0">
                <Eyebrow>{quarter.quarter}</Eyebrow>
                <ul className="flex flex-col gap-1.5">
                  {quarter.items.map((item) => (
                    <li key={item} className="text-sm text-brand-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Ready to export your produce?"
        subtitle="Tell us what you're growing and where it needs to go."
        primary={{ label: "Request a Quote", href: "/contact" }}
      />
    </>
  );
}
