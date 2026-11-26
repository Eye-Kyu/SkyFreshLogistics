import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container, CloseBand, PageIntro } from "@/components/ui/primitives";
import { ProcessChapter } from "@/components/motion/ProcessChapter";
import { TransitCalculator } from "@/components/tools/TransitCalculator";
import { shippingModeIconMap } from "@/components/ui/icon-map";
import { processSteps, shippingModes, requiredDocuments } from "@/data/company";

export const metadata: Metadata = {
  title: "How it works",
  description: "The full Bravair process from inquiry to delivery, shipping modes, and required export documents.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        title="From first contact to final delivery"
        lead="A transparent six-step process, so you always know what happens next."
      />

      <section className="section">
        <Container>
          <ProcessChapter steps={processSteps} label="The six steps of a Bravair shipment" />
        </Container>
      </section>

      <section className="band section">
        <Container>
          <div className="head head--split">
            <h2>Three ways to move it</h2>
            <p className="lead">Choose by shelf life, volume and how soon the buyer needs it.</p>
          </div>
          <div className="modes">
            {shippingModes.map((mode) => {
              const Icon = shippingModeIconMap[mode.icon];
              return (
                <div key={mode.title} data-reveal>
                  <h3 className="with-icon">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.5} />
                    {mode.title}
                  </h3>
                  <p>{mode.detail}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="split split--even" style={{ alignItems: "start" }}>
            <div className="stack-lg">
              <h2>How long it takes</h2>
              <p className="lead">Pick a lane and a mode for an indicative transit time.</p>
            </div>
            <div data-reveal>
              <TransitCalculator />
            </div>
          </div>
        </Container>
      </section>

      <section className="section band--soft">
        <Container>
          <div className="grid-12">
            <div className="g-aside stack-lg">
              <h2>The paperwork we handle</h2>
              <p className="muted">
                Bravair prepares and manages all of these on your behalf as part of our compliance and documentation service.
              </p>
            </div>
            <ul className="doclist g-main" data-reveal>
              {requiredDocuments.map((doc) => (
                <li key={doc}>
                  <Check aria-hidden="true" size={20} strokeWidth={2.5} />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CloseBand
        title="Have questions about the process?"
        line="Check the answers first, or talk to the team directly."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Read the FAQ", href: "/faq" }}
      />
    </>
  );
}
