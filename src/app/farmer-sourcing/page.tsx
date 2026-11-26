import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container, Button, PageIntro, PhotoSlot } from "@/components/ui/primitives";
import { FarmerForm } from "@/components/forms/FarmerForm";
import { farmerProgramSteps, farmerRequirements, exporterBenefits, growingRegions } from "@/data/company";
import { photos } from "@/data/photos";

export const metadata: Metadata = {
  title: "Farmer sourcing program",
  description: "Join Bravair's vetted farmer network, or register a sourcing need as an exporter.",
};

export default function FarmerSourcingPage() {
  return (
    <>
      <PageIntro
        tone="field"
        title="Reliable supply for exporters. Reliable buyers for farmers."
        lead="We connect exporters with vetted growers, on the condition that Bravair coordinates all cargo movement."
      >
        <div className="actions on-field">
          <a href="#apply" className="btn">
            Apply as a grower
          </a>
          <Button href="/contact" variant="quiet">
            Register a sourcing need
          </Button>
        </div>
      </PageIntro>

      <section className="section">
        <Container>
          <div className="head">
            <h2>The program in three steps</h2>
          </div>
          <ol className="steps">
            {farmerProgramSteps.map((step) => (
              <li key={step.title} data-reveal>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section band--soft">
        <Container>
          <div className="split split--even" style={{ alignItems: "start" }}>
            <div className="stack-lg" data-reveal>
              <h2>What growers need to qualify</h2>
              <ul className="checks">
                {farmerRequirements.map((req) => (
                  <li key={req}>
                    <Check aria-hidden="true" size={16} strokeWidth={2.5} />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="stack-lg" data-reveal>
              <h2>Why exporters source through us</h2>
              <ul className="rows rows--tight">
                {exporterBenefits.map((b) => (
                  <li key={b.title} style={{ gridTemplateColumns: "minmax(0, 1fr)" }}>
                    <h3 style={{ fontSize: "var(--text-lg)" }}>{b.title}</h3>
                    <p>{b.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="split split--flip">
            <div className="stack-lg">
              <h2>Partner growing regions</h2>
              <ul className="rows rows--tight">
                {growingRegions.map((r) => (
                  <li key={r.region} data-reveal>
                    <h3 style={{ fontSize: "var(--text-lg)" }}>{r.region}</h3>
                    <p>{r.focus}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal>
              <PhotoSlot photo={photos.farmland} slot="farmer-regions" ratio="tall" />
            </div>
          </div>
        </Container>
      </section>

      <section className="section band--soft" id="apply">
        <Container>
          <div className="contact">
            <div className="stack-lg">
              <h2>Join the network</h2>
              <p className="lead">Growers apply here. Exporters with a sourcing need can use the quote form.</p>
              <Button href="/contact" variant="quiet">
                Register a sourcing need
              </Button>
            </div>
            <FarmerForm />
          </div>
        </Container>
      </section>
    </>
  );
}
