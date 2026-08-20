import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container, SectionHeader, Button, Eyebrow, MediaPlaceholder } from "@/components/ui/primitives";
import { NumberedSteps } from "@/components/ui/Timeline";
import { FarmerForm } from "@/components/forms/FarmerForm";
import {
  farmerProgramSteps,
  farmerRequirements,
  exporterBenefits,
  growingRegions,
} from "@/data/company";

export const metadata: Metadata = {
  title: "Farmer Sourcing Program",
  description: "Join SkyFresh's vetted farmer network, or register a sourcing need as an exporter.",
};

export default function FarmerSourcingPage() {
  return (
    <>
      <section className="bg-grain bg-linear-to-br from-brand-green-900 via-brand-green-800 to-brand-blue-900 py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-4 text-center">
          <Eyebrow tone="white">Farmer Sourcing Program</Eyebrow>
          <h1 className="max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl text-balance">
            Reliable supply for exporters. Reliable buyers for farmers.
          </h1>
          <p className="max-w-xl text-white/75">
            We connect exporters with vetted growers — on the condition that SkyFresh
            coordinates all cargo movement, so both sides get consolidated logistics.
          </p>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-10">
          <SectionHeader eyebrow="How It Works" title="The program in three steps" />
          <NumberedSteps steps={farmerProgramSteps} />
        </Container>
      </section>

      {/* Dual-audience split: farmers vs exporters */}
      <section className="border-y border-brand-slate-200">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col gap-6 bg-brand-green-50 px-6 py-14 sm:px-10 lg:py-20">
            <Eyebrow>For Farmers</Eyebrow>
            <h2 className="font-display text-2xl font-semibold text-brand-slate-900">What you need to qualify</h2>
            <ul className="flex flex-col gap-3">
              {farmerRequirements.map((req) => (
                <li key={req} className="flex items-start gap-3 border border-brand-green-700/20 bg-white px-5 py-4 text-sm text-brand-slate-700">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-700" strokeWidth={2.5} />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 bg-brand-blue-50 px-6 py-14 sm:px-10 lg:py-20">
            <Eyebrow tone="blue">For Exporters</Eyebrow>
            <h2 className="font-display text-2xl font-semibold text-brand-slate-900">Why source through SkyFresh</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {exporterBenefits.map((benefit) => (
                <div key={benefit.title} className="border border-brand-blue-700/20 bg-white p-5">
                  <h3 className="font-display font-semibold text-brand-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-slate-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Network map */}
      <section className="bg-brand-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col gap-10">
          <SectionHeader eyebrow="Our Reach" title="Partner growing regions" />
          <div className="grid gap-6 lg:grid-cols-2">
            <MediaPlaceholder label="Interactive map of partner growing regions" tone="green" className="h-72 sm:h-96" />
            <div className="flex flex-col divide-y divide-brand-slate-200 border-y border-brand-slate-200">
              {growingRegions.map((region) => (
                <div key={region.region} className="flex items-center justify-between bg-white px-5 py-4">
                  <span className="text-sm font-medium text-brand-slate-800">{region.region}</span>
                  <span className="text-sm text-brand-green-700">{region.focus}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Apply / register */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center gap-4">
            <SectionHeader
              align="left"
              eyebrow="Get Started"
              title="Join the network or register a sourcing need"
              subtitle="Farmers can apply below. Exporters looking to register a sourcing need can use the same form or contact our team directly."
            />
            <Button href="/contact" variant="ghost" className="w-fit">
              I&apos;m an exporter — register a sourcing need
            </Button>
          </div>
          <FarmerForm />
        </Container>
      </section>
    </>
  );
}
