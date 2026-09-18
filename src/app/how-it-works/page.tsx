import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container, SectionHeader } from "@/components/ui/primitives";
import { Timeline } from "@/components/ui/Timeline";
import { TransitCalculator } from "@/components/tools/TransitCalculator";
import { CTASection } from "@/components/ui/CTASection";
import { shippingModeIconMap } from "@/components/ui/icon-map";
import { processSteps, shippingModes, requiredDocuments } from "@/data/company";

export const metadata: Metadata = {
  title: "How It Works",
  description: "The full Bravair process from inquiry to delivery, shipping modes, and required export documents.",
};

export default function HowItWorksPage() {
  const timelineItems = processSteps.map((step, idx) => ({
    label: `Step ${idx + 1}`,
    title: step.title,
    description: step.description,
  }));

  return (
    <>
      <section className="border-b border-brand-slate-200 py-16 sm:py-20">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="How It Works"
            title="From first contact to final delivery"
            subtitle="A transparent six-step process, so you always know what happens next."
          />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="mx-auto max-w-2xl">
          <Timeline items={timelineItems} />
        </Container>
      </section>

      {/* Shipping modes */}
      <section className="bg-brand-slate-50 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeader eyebrow="Shipping Modes" title="Choose the right mode for your cargo" />
          <div className="grid gap-px overflow-hidden border border-brand-slate-200 bg-brand-slate-200 sm:grid-cols-3">
            {shippingModes.map((mode) => {
              const Icon = shippingModeIconMap[mode.icon];
              return (
                <div key={mode.title} className="relative flex flex-col gap-4 bg-white p-7">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.75 bg-brand-leaf-700"
                  />
                  <Icon aria-hidden="true" className="h-7 w-7 text-brand-leaf-700" strokeWidth={1.5} />
                  <h3 className="font-display font-semibold text-brand-slate-900">{mode.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-slate-600">{mode.detail}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Calculator */}
      <section className="py-20 sm:py-28">
        <Container className="mx-auto max-w-3xl">
          <TransitCalculator />
        </Container>
      </section>

      {/* Documents checklist */}
      <section className="bg-brand-slate-50 py-16 sm:py-20">
        <Container className="mx-auto flex max-w-2xl flex-col gap-8">
          <SectionHeader eyebrow="Paperwork" title="Required Documents Checklist" />
          <ul className="flex flex-col divide-y divide-brand-slate-200 border-y border-brand-slate-200">
            {requiredDocuments.map((doc) => (
              <li
                key={doc}
                className="flex items-center gap-3 bg-white px-5 py-4 text-sm font-medium text-brand-slate-800"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-brand-navy-700 text-brand-navy-700">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                {doc}
              </li>
            ))}
          </ul>
          <p className="text-sm text-brand-slate-500">
            Bravair prepares and manages all of the above on your behalf as part of our
            compliance &amp; documentation service.
          </p>
        </Container>
      </section>

      <CTASection
        title="Have questions about the process?"
        subtitle="Check our FAQ or reach out directly — we're happy to walk you through it."
        primary={{ label: "View FAQ", href: "/faq" }}
        secondary={{ label: "Contact Us", href: "/contact" }}
      />
    </>
  );
}
