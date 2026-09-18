import Link from "next/link";
import { ArrowRight, Flower2, Radio, Sprout } from "lucide-react";
import { Container, SectionHeader, Button, StatBar, Eyebrow, MediaPlaceholder } from "@/components/ui/primitives";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { CTASection } from "@/components/ui/CTASection";
import { NumberedSteps } from "@/components/ui/Timeline";
import { serviceIconMap } from "@/components/ui/icon-map";
import { services } from "@/data/services";
import { processSteps } from "@/data/company";
import { site } from "@/data/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — asymmetric split, image-led right panel */}
      <section className="relative overflow-hidden bg-white">
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col justify-center gap-7 px-5 py-16 sm:py-20 lg:col-span-6 lg:px-12 lg:py-28 xl:col-span-6">
            <Eyebrow>{site.shortTagline}</Eyebrow>
            <h1 className="max-w-xl font-display text-[2.75rem] leading-[1.04] font-semibold text-brand-slate-900 text-balance sm:text-6xl lg:text-[3.4rem] xl:text-6xl">
              From farm to global market —{" "}
              <span className="text-brand-navy-700">fresh, fast,</span> and flawlessly
              coordinated.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-brand-slate-600">
              Bravair moves horticulture and floriculture exports from vetted African
              farms to buyers worldwide, handling every link in the cold chain along the way.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="primary" showArrow>
                Start Shipping
              </Button>
              <Button href="/how-it-works" variant="ghost">
                See How It Works
              </Button>
            </div>
            <dl className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-brand-slate-200 pt-6">
              {[
                { value: "28", label: "export markets" },
                { value: "450+", label: "farmer network" },
                { value: "24/7", label: "shipment tracking" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-xl font-semibold text-brand-slate-900">{stat.value}</dd>
                  <span className="text-sm text-brand-slate-500">{stat.label}</span>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative lg:col-span-6 xl:col-span-6">
            <MediaPlaceholder
              label="Cold-chain export photography"
              tone="duo"
              className="h-72 sm:h-96 lg:h-full lg:min-h-144"
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 border border-white/15 bg-brand-slate-950/80 px-4 py-3 text-white backdrop-blur sm:bottom-10 sm:left-10">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy-600/20 text-brand-navy-300">
                <Radio aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Live cold-chain tracking</div>
                <div className="text-xs text-white/60">Temperature verified every leg</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="What We Do"
            title="Everything your export needs, coordinated"
            subtitle="From sourcing to delivery, Bravair handles the logistics so you can focus on trade."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIconMap[service.icon];
              return (
                <ServiceCard
                  key={service.title}
                  icon={<Icon aria-hidden="true" className="h-5 w-5" />}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                />
              );
            })}
          </div>
        </Container>
      </section>

      {/* Product category teaser */}
      <section className="bg-brand-slate-50 py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="What We Ship" title="Two product families. One standard of care." />
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              href="/horticulture"
              className="group bg-grain relative flex h-80 flex-col justify-end overflow-hidden bg-linear-to-br from-brand-navy-700 via-brand-navy-800 to-brand-navy-950 p-8 text-white"
            >
              <Sprout aria-hidden="true" className="relative z-1 h-8 w-8 text-brand-navy-200" strokeWidth={1.5} />
              <h3 className="relative z-1 mt-4 font-display text-2xl font-semibold">Horticulture</h3>
              <p className="relative z-1 mt-2 text-white/80">Fruits, vegetables, and herbs, export-ready.</p>
              <span className="relative z-1 mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                Explore produce
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/floriculture"
              className="group bg-grain relative flex h-80 flex-col justify-end overflow-hidden bg-linear-to-br from-brand-leaf-700 via-brand-leaf-800 to-brand-leaf-950 p-8 text-white"
            >
              <Flower2 aria-hidden="true" className="relative z-1 h-8 w-8 text-brand-leaf-300" strokeWidth={1.5} />
              <h3 className="relative z-1 mt-4 font-display text-2xl font-semibold">Floriculture</h3>
              <p className="relative z-1 mt-2 text-white/80">Cut flowers, stems, and fillers, graded to spec.</p>
              <span className="relative z-1 mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                Explore flowers
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Process teaser */}
      <section className="py-20 sm:py-28">
        <Container className="flex flex-col gap-12">
          <SectionHeader eyebrow="The Process" title="Three steps from inquiry to delivery" />
          <NumberedSteps
            steps={[
              { title: "Inquiry", description: processSteps[0].description },
              { title: "Coordination", description: "We match farmers, arrange cold storage, and handle documentation." },
              { title: "Delivery", description: processSteps[5].description },
            ]}
          />
          <div className="text-center">
            <Button href="/how-it-works" variant="ghost">
              See the full 6-step process
            </Button>
          </div>
        </Container>
      </section>

      {/* Trust bar */}
      <section className="bg-grain bg-brand-slate-950 py-16">
        <Container>
          <StatBar
            stats={[
              { value: "100%", label: "Cold chain maintained" },
              { value: "24/7", label: "Shipment tracking" },
              { value: "28", label: "Countries reached" },
              { value: "450+", label: "Trusted farmer network" },
            ]}
          />
        </Container>
      </section>

      <CTASection
        title="Ready to move your first shipment?"
        subtitle="Get a quote in under a day, or register as a sourcing farmer to join our network."
        primary={{ label: "Request a Quote", href: "/contact" }}
        secondary={{ label: "Farmer Sourcing", href: "/farmer-sourcing" }}
      />
    </>
  );
}
