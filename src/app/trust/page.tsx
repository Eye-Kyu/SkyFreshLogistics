import type { Metadata } from "next";
import { Container, SectionHeader, StatBar, Eyebrow, MediaPlaceholder } from "@/components/ui/primitives";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { CTASection } from "@/components/ui/CTASection";
import { testimonials, certifications, partners, trustStats, caseStudy } from "@/data/trust";

export const metadata: Metadata = {
  title: "Why SkyFresh",
  description: "Certifications, testimonials, partners, and proven track record — see why exporters and farmers trust SkyFresh.",
};

export default function TrustPage() {
  return (
    <>
      <section className="bg-grain bg-brand-slate-950 py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Eyebrow tone="white">Why SkyFresh</Eyebrow>
          <h1 className="max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl text-balance">
            Logistics is a trust business. Here&apos;s our proof.
          </h1>
          <div className="mt-4 w-full max-w-3xl">
            <StatBar stats={trustStats} />
          </div>
        </Container>
      </section>

      {/* Certifications */}
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <SectionHeader eyebrow="Certifications & Memberships" title="Recognized standards, verified compliance" />
          <div className="grid grid-cols-2 gap-px overflow-hidden border border-brand-slate-200 bg-brand-slate-200 sm:grid-cols-5">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="flex h-24 items-center justify-center bg-white text-center text-sm font-semibold text-brand-slate-400"
              >
                {cert}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-slate-50 py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeader eyebrow="Testimonials" title="What our partners say" />
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </Container>
      </section>

      {/* Partner logos */}
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-8">
          <SectionHeader eyebrow="Our Network" title="Airline, shipping, and cold storage partners" />
          <div className="flex flex-wrap items-center justify-center gap-px overflow-hidden border border-brand-slate-200 bg-brand-slate-200">
            {partners.map((partner) => (
              <div
                key={partner}
                className="flex h-16 flex-1 items-center justify-center bg-white px-8 text-sm font-medium text-brand-slate-500"
              >
                {partner}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Case study — full editorial weight */}
      <section className="bg-grain bg-brand-blue-950 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col gap-6">
            <Eyebrow tone="white">Case Study</Eyebrow>
            <h2 className="font-display text-3xl font-semibold leading-[1.1] text-white text-balance sm:text-4xl">
              {caseStudy.title}
            </h2>
            <p className="text-lg leading-relaxed text-white/70">{caseStudy.summary}</p>
            <div className="mt-2 grid grid-cols-3 gap-6 border-t border-white/15 pt-6">
              {caseStudy.metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col gap-1">
                  <div className="font-display text-2xl font-semibold text-white sm:text-3xl">{metric.value}</div>
                  <div className="text-xs text-white/55">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
          <MediaPlaceholder label="Case study photography" tone="blue" className="h-72 sm:h-96 lg:h-112" />
        </Container>
      </section>

      <CTASection
        title="See it for yourself"
        subtitle="Request a quote and experience the coordination our partners rely on."
        primary={{ label: "Get a Quote", href: "/contact" }}
        tone="blue"
      />
    </>
  );
}
