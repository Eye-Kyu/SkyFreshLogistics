import Link from "next/link";
import { Container, Button, CloseBand, PhotoSlot } from "@/components/ui/primitives";
import { EstimateDesk } from "@/components/forms/EstimateDesk";
import { ProcessChapter } from "@/components/motion/ProcessChapter";
import { serviceIconMap } from "@/components/ui/icon-map";
import { services } from "@/data/services";
import { processSteps, missionVision } from "@/data/company";
import { photos } from "@/data/photos";
import { getLaneSummary } from "@/lib/lanes";

// The lane board reads the rate engine; refresh it every five minutes.
export const revalidate = 300;

// Tiles that point at /services jump to that service's own section.
function serviceHref(s: { title: string; href: string }) {
  if (s.href !== "/services") return s.href;
  return `/services#${s.title.toLowerCase().replace(/&/g, "").replace(/[^a-z]+/g, "-").replace(/-+$/, "")}`;
}

const tileSize = ["tile--lead", "tile--m", "tile--m", "tile--s", "tile--s", "tile--s"];

export default async function HomePage() {
  const lanes = await getLaneSummary();

  return (
    <>
      {/* Counter hero: the estimate is the visual */}
      <section className="hero">
        <Container>
          <div className="hero__grid">
            <div>
              <h1 data-hero-item>From farm to global market.</h1>
              <p className="lead" data-hero-item>
                Cold-chain export logistics for African flowers and fresh produce, priced in seconds.
              </p>
              <div className="actions on-field" data-hero-item>
                <Button href="/how-it-works" variant="quiet">
                  See the six steps
                </Button>
              </div>
            </div>
            <div data-hero-item>
              <EstimateDesk />
            </div>
          </div>
        </Container>
      </section>

      {/* The lane board, from the rate engine */}
      {lanes && lanes.destinations.length > 0 ? (
        <section className="section">
          <Container>
            <div className="head head--split">
              <h2>Airports we price today</h2>
              <p className="lead">Every destination in Bravair&apos;s rate engine, quoted from one form.</p>
            </div>
            <div className="board" data-reveal>
              <ul
                className="board__list"
                aria-label="Destination airports"
                style={{ ["--rows" as string]: Math.ceil(lanes.destinations.length / 2) }}
              >
                {lanes.destinations.map((d) => (
                  <li key={d.code} className="board__row">
                    <span className="board__code">{d.code}</span>
                    <span className="board__city">{d.city}</span>
                    <span className="board__region">{d.region}</span>
                  </li>
                ))}
              </ul>
            </div>
            <dl className="figs" data-reveal>
              <div>
                <dt>destination airports</dt>
                <dd>{lanes.destinations.length}</dd>
              </div>
              <div>
                <dt>airlines compared on every estimate</dt>
                <dd>{lanes.airlines}</dd>
              </div>
              <div>
                <dt>product lines in the rate sheet</dt>
                <dd>{lanes.products}</dd>
              </div>
            </dl>
          </Container>
        </section>
      ) : null}

      {/* Services as a bento */}
      <section className={`section ${lanes ? "section--flush-top" : ""}`}>
        <Container>
          <div className="head head--split">
            <h2>Everything between farm and buyer</h2>
            <p className="lead">Six services, one team, one point of contact.</p>
          </div>
          <div className="bento">
            {services.map((service, i) => {
              const Icon = serviceIconMap[service.icon];
              return (
                <Link key={service.title} href={serviceHref(service)} className={`tile ${tileSize[i]}`} data-reveal>
                  <Icon aria-hidden="true" className="tile__icon" size={i === 0 ? 32 : 24} strokeWidth={1.5} />
                  <div className="stack-sm">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    {i === 0 ? <span className="tile__more">All six services</span> : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Statement */}
      <section className="band section">
        <Container>
          <p className="statement" data-reveal>
            {missionVision.mission}
          </p>
        </Container>
      </section>

      {/* The one scroll pattern: the process, pinned */}
      <section className="section--l">
        <Container>
          <div className="head">
            <h2>Six steps, one contact</h2>
            <p className="lead">From your first message to the buyer&apos;s receipt.</p>
          </div>
          <ProcessChapter steps={processSteps} label="Bravair's six-step export process" />
        </Container>
      </section>

      {/* Two product families */}
      <section className="section section--flush-top">
        <Container>
          <div className="head head--split">
            <h2>Two families, one cold chain</h2>
            <p className="lead">Produce held at 2 to 8°C, flowers graded to spec.</p>
          </div>
          <div className="families">
            <Link href="/horticulture" className="family" data-reveal>
              <PhotoSlot photo={photos.produce} slot="home-produce" ratio="fill" sizes="(min-width: 60rem) 58vw, 100vw" />
              <div className="family__copy">
                <h3>Horticulture</h3>
                <p>Fruits, vegetables and herbs, export-ready.</p>
                <span className="tile__more">Explore produce</span>
              </div>
            </Link>
            <Link href="/floriculture" className="family" data-reveal>
              <PhotoSlot photo={photos.flowers} slot="home-flowers" ratio="fill" sizes="(min-width: 60rem) 42vw, 100vw" />
              <div className="family__copy">
                <h3>Floriculture</h3>
                <p>Cut flowers, stems and fillers, graded to spec.</p>
                <span className="tile__more">Explore flowers</span>
              </div>
            </Link>
          </div>
        </Container>
      </section>

      <CloseBand
        title="Ready to move your first shipment?"
        line="Get a quote within a business day, or join the sourcing network as a grower."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: "Farmer sourcing", href: "/farmer-sourcing" }}
      />
    </>
  );
}
