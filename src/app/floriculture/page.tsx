import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import { Container, SectionHeader } from "@/components/ui/primitives";
import { FilterableProductGrid } from "@/components/catalog/FilterableProductGrid";
import { CTASection } from "@/components/ui/CTASection";
import { flowerCategories, flowerProducts, flowerGrades, destinationMarkets } from "@/data/products";

export const metadata: Metadata = {
  title: "Floriculture Export",
  description:
    "Export cut flowers, stems, and fillers with Bravair — graded, cold-chain handled, and shipped to global markets.",
};

export default function FloriculturePage() {
  return (
    <>
      <section className="border-b border-brand-slate-200 py-16 sm:py-20">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="Floriculture"
            title="Cut flowers, stems, and fillers — graded to spec"
            subtitle="Roses, summer flowers, carnations, and fillers, handled with the precision cut flowers demand."
            tone="leaf"
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <FilterableProductGrid categories={flowerCategories} products={flowerProducts} tone="leaf" />
        </Container>
      </section>

      {/* Grades & specs */}
      <section className="bg-brand-slate-50 py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <SectionHeader eyebrow="Specifications" title="Grades & Specs" tone="leaf" />
          <div className="overflow-x-auto border border-brand-slate-200 bg-white">
            <table className="w-full min-w-120 text-left text-sm">
              <thead className="border-b border-brand-slate-200 text-brand-slate-500">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Grade</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Stem Length</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Head Size</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide">Bunch Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate-100">
                {flowerGrades.map((row) => (
                  <tr key={row.grade}>
                    <td className="px-6 py-4 font-display font-semibold text-brand-leaf-800">{row.grade}</td>
                    <td className="px-6 py-4 text-brand-slate-600">{row.stemLength}</td>
                    <td className="px-6 py-4 text-brand-slate-600">{row.headSize}</td>
                    <td className="px-6 py-4 text-brand-slate-600">{row.bunchCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Destination markets */}
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-10">
          <SectionHeader eyebrow="Where We Ship" title="Primary Export Destinations" tone="leaf" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinationMarkets.map((market) => (
              <div key={market.region} className="flex flex-col gap-3 border border-brand-slate-200 bg-white p-6">
                <Globe2 aria-hidden="true" className="h-6 w-6 text-brand-leaf-700" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-brand-slate-900">{market.region}</h3>
                <p className="text-sm leading-relaxed text-brand-slate-600">{market.note}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Ready to ship your flowers?"
        subtitle="Tell us your varieties, volumes, and target market."
        primary={{ label: "Request a Quote", href: "/contact" }}
        tone="leaf"
      />
    </>
  );
}
