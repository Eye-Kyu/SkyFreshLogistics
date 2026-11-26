import type { Metadata } from "next";
import { Container, CloseBand, PageIntro, PhotoSlot } from "@/components/ui/primitives";
import { coreValueIconMap } from "@/components/ui/icon-map";
import { coreValues, team, milestones, missionVision } from "@/data/company";
import { photos } from "@/data/photos";

export const metadata: Metadata = {
  title: "About us",
  description: "Learn about Bravair's mission, values, leadership, and history in export logistics.",
};

export default function AboutPage() {
  const history = milestones.filter((m) => !m.unverified);

  return (
    <>
      <PageIntro
        title="Built by people who understand freight, farming, and freshness"
        lead="We started as a small coordination service for local farms and grew into a full logistics partner for African fresh produce exports."
      />

      <section className="section">
        <Container>
          <div className="split">
            <div className="stack-lg" data-reveal>
              <h2>From three farms to a continent-wide network</h2>
              <p className="lead">
                Bravair was founded to solve a simple but persistent problem: growers with excellent produce had no reliable
                way to reach international buyers, and exporters struggled to find consistent, quality-assured supply.
              </p>
              <p className="measure muted">
                We started by coordinating cargo for a handful of vegetable farms near Nairobi, and as trust grew, so did our
                network. Today we manage cold chain logistics, documentation, and farmer sourcing for exporters and buyers
                across Europe, the Middle East, Asia, and Russia.
              </p>
            </div>
            <div data-reveal>
              <PhotoSlot photo={photos.farmland} slot="about-story" ratio="land" />
            </div>
          </div>
        </Container>
      </section>

      <section className="band section">
        <Container>
          <div className="stack-lg" data-reveal>
            <h2 className="visually-hidden">Mission and vision</h2>
            <p className="statement">{missionVision.mission}</p>
            <p className="lead measure">{missionVision.vision}</p>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid-12">
            <div className="g-aside">
              <h2>Four values we work by</h2>
            </div>
            <ul className="rows g-main">
              {coreValues.map((value) => {
                const Icon = coreValueIconMap[value.icon];
                return (
                  <li key={value.title} data-reveal>
                    <h3 className="with-icon">
                      <Icon aria-hidden="true" size={24} strokeWidth={1.5} className="tile__icon" />
                      {value.title}
                    </h3>
                    <p>{value.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <section className="section band--soft">
        <Container>
          <div className="head">
            <h2>The team behind the coordination</h2>
          </div>
          <ul className="people">
            {team.map((member, i) => (
              <li key={`${member.name}-${i}`} data-reveal>
                <span>{member.role}</span>
                <h3>{member.name}</h3>
                <p>{member.bio}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid-12">
            <div className="g-aside">
              <h2>Since 2015</h2>
            </div>
            <ol className="rows g-main" aria-label="Milestones">
              {history.map((m) => (
                <li key={m.label} data-reveal>
                  <div>
                    <div className="milestone-year">{m.label}</div>
                  </div>
                  <div className="stack-sm">
                    <h3>{m.title}</h3>
                    <p>{m.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <CloseBand
        title="Work with the team"
        line="Exporters, buyers and growers all start in the same place."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: "Farmer sourcing", href: "/farmer-sourcing" }}
      />
    </>
  );
}
