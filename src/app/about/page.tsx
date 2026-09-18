import type { Metadata } from "next";
import { Container, SectionHeader, Eyebrow, MediaPlaceholder } from "@/components/ui/primitives";
import { Timeline } from "@/components/ui/Timeline";
import { coreValueIconMap } from "@/components/ui/icon-map";
import { coreValues, team, milestones, missionVision } from "@/data/company";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Bravair's mission, values, leadership, and history in export logistics.",
};

const valueTints = [
  "bg-white",
  "bg-brand-navy-50",
  "bg-brand-leaf-50",
  "bg-white",
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-brand-slate-200 py-16 sm:py-20">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="About Bravair"
            title="Built by people who understand freight, farming, and freshness"
            subtitle="We started as a small coordination service for local farms and grew into a full logistics partner for African fresh produce exports."
          />
        </Container>
      </section>

      {/* Our story */}
      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5 lg:order-2">
            <Eyebrow>Our Story</Eyebrow>
            <h2 className="font-display text-3xl font-semibold text-brand-slate-900">
              From three farms to a continent-wide network
            </h2>
            <p className="leading-relaxed text-brand-slate-600">
              Bravair was founded to solve a simple but persistent problem: growers with
              excellent produce had no reliable way to reach international buyers, and
              exporters struggled to find consistent, quality-assured supply. We started by
              coordinating cargo for a handful of vegetable farms near Nairobi, and as trust
              grew, so did our network.
            </p>
            <p className="leading-relaxed text-brand-slate-600">
              Today we manage cold chain logistics, documentation, and farmer sourcing for
              exporters and buyers across 28 markets, while staying true to the same
              principle: freshness and trust are the product, logistics is how we deliver it.
            </p>
          </div>
          <MediaPlaceholder label="Team or facility photo" tone="navy" className="h-72 sm:h-96 lg:order-1" />
        </Container>
      </section>

      {/* Mission & vision */}
      <section className="bg-grain bg-brand-navy-950 py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:divide-x lg:divide-white/10">
          <div className="flex flex-col gap-4 lg:pr-12">
            <Eyebrow tone="white">Our Mission</Eyebrow>
            <p className="font-display text-2xl font-medium leading-snug text-white text-balance sm:text-3xl">
              {missionVision.mission}
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:pl-12">
            <Eyebrow tone="white">Our Vision</Eyebrow>
            <p className="font-display text-2xl font-medium leading-snug text-white text-balance sm:text-3xl">
              {missionVision.vision}
            </p>
          </div>
        </Container>
      </section>

      {/* Core values */}
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="What Drives Us" title="Core Values" />
          <div className="grid gap-px overflow-hidden border border-brand-slate-200 bg-brand-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, idx) => {
              const Icon = coreValueIconMap[value.icon];
              return (
                <div key={value.title} className={`flex flex-col gap-4 p-7 ${valueTints[idx % valueTints.length]}`}>
                  <span className="flex h-11 w-11 items-center justify-center border border-brand-slate-300 text-brand-navy-700">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display font-semibold text-brand-slate-900">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-brand-slate-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-brand-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="Leadership" title="The team behind the coordination" />
          <div className="grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="group flex flex-col overflow-hidden border border-brand-slate-200 bg-white transition-shadow hover:shadow-lifted">
                <MediaPlaceholder label="Portrait pending" tone="leaf" className="h-48" />
                <div className="flex flex-col gap-1 p-6">
                  <h3 className="font-display font-semibold text-brand-slate-900">{member.name}</h3>
                  <p className="text-sm font-medium text-brand-navy-700">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-slate-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Milestones */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <SectionHeader eyebrow="Our Journey" title="Milestones" align="left" />
          </div>
          <Timeline items={milestones} />
        </Container>
      </section>
    </>
  );
}
