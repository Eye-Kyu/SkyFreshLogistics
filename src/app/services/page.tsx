import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container, SectionHeader, Button, Eyebrow, MediaPlaceholder } from "@/components/ui/primitives";
import { serviceDetails, servicePackages } from "@/data/services";
import { serviceIconMap } from "@/components/ui/icon-map";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description: "Export logistics, farmer sourcing, tracking, compliance, cold storage, and buyer matching.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-brand-slate-200 py-16 sm:py-20">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="Our Services"
            title="Everything between the farm and the buyer"
            subtitle="Six coordinated services that remove friction at every stage of the export journey."
          />
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-24">
          {serviceDetails.map((service) => {
            const Icon = serviceIconMap[service.icon];
            return (
              <div key={service.id} id={service.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <MediaPlaceholder
                  label={service.imageAlt}
                  tone={service.imageSide === "left" ? "blue" : "green"}
                  className={`h-64 sm:h-80 ${service.imageSide === "left" ? "lg:order-1" : "lg:order-2"}`}
                  icon={<Icon aria-hidden="true" className="h-8 w-8" strokeWidth={1.25} />}
                />
                <div className={`flex flex-col gap-5 ${service.imageSide === "left" ? "lg:order-2" : "lg:order-1"}`}>
                  <span className="flex h-11 w-11 items-center justify-center border border-brand-slate-200 text-brand-green-700">
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <h2 className="font-display text-2xl font-semibold text-brand-slate-900 sm:text-3xl">{service.title}</h2>
                  <p className="leading-relaxed text-brand-slate-600">{service.description}</p>
                  <ul className="flex flex-col gap-2.5">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm text-brand-slate-700">
                        <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-700" strokeWidth={2} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </Container>
      </section>

      {/* Packages */}
      <section className="bg-grain bg-brand-slate-950 py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="Engagement Levels" title="Choose the level of coordination you need" tone="white" />
          <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
            {servicePackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`flex flex-col gap-6 p-8 ${
                  pkg.highlighted
                    ? "border border-brand-green-400/30 bg-white shadow-lifted lg:-my-6 lg:py-12"
                    : "border border-white/10 bg-white/3"
                }`}
              >
                {pkg.highlighted ? (
                  <Eyebrow tone="green">Most Popular</Eyebrow>
                ) : (
                  <Eyebrow tone="white">Engagement Tier</Eyebrow>
                )}
                <h3 className={`font-display text-xl font-semibold ${pkg.highlighted ? "text-brand-slate-900" : "text-white"}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm ${pkg.highlighted ? "text-brand-slate-600" : "text-white/60"}`}>{pkg.description}</p>
                <ul className="flex flex-col gap-2.5">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex items-start gap-2.5 text-sm ${pkg.highlighted ? "text-brand-slate-700" : "text-white/75"}`}
                    >
                      <Check
                        aria-hidden="true"
                        className={`mt-0.5 h-4 w-4 shrink-0 ${pkg.highlighted ? "text-brand-green-700" : "text-brand-green-400"}`}
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button href="/contact" variant={pkg.highlighted ? "primary" : "outline"} className="mt-2" showArrow={pkg.highlighted}>
                  Request a Quote
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTASection
        title="Not sure which service level fits?"
        subtitle="Tell us what you're shipping and we'll recommend the right package."
        primary={{ label: "Talk to Our Team", href: "/contact" }}
      />
    </>
  );
}
