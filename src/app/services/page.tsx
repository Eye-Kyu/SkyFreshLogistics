import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { Container, Button, CloseBand, PageIntro } from "@/components/ui/primitives";
import { serviceDetails, servicePackages } from "@/data/services";
import { serviceIconMap } from "@/components/ui/icon-map";

export const metadata: Metadata = {
  title: "Services",
  description: "Export logistics, farmer sourcing, tracking, compliance, cold storage, and buyer matching.",
};

// Each tier lists "Everything in <tier>" plus its own features; expand that
// into one cumulative list per tier, then one table row per feature.
function tierMatrix() {
  const cumulative: string[][] = [];
  servicePackages.forEach((pkg, i) => {
    const own = pkg.features.filter((f) => !f.startsWith("Everything in"));
    cumulative.push([...(i > 0 ? cumulative[i - 1] : []), ...own]);
  });
  const features = cumulative[cumulative.length - 1];
  return features.map((feature) => ({ feature, tiers: cumulative.map((list) => list.includes(feature)) }));
}

export default function ServicesPage() {
  const matrix = tierMatrix();

  return (
    <>
      <PageIntro
        title="Everything between the farm and the buyer"
        lead="Six coordinated services that remove friction at every stage of the export journey."
      >
        <ul className="intro__jump" aria-label="Services on this page">
          {serviceDetails.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      </PageIntro>

      <section className="section--s">
        <Container>
          <div className="head head--split">
            <h2>What each service covers</h2>
            <p className="lead">Use one, or let us run the whole chain.</p>
          </div>
          {serviceDetails.map((service) => {
            const Icon = serviceIconMap[service.icon];
            return (
              <article key={service.id} id={service.id} className="svc" data-reveal>
                <div className="svc__head">
                  <Icon aria-hidden="true" size={32} strokeWidth={1.5} />
                  <h3>{service.title}</h3>
                </div>
                <div className="svc__body">
                  <p>{service.description}</p>
                  <ul className="checks">
                    {service.bullets.map((b) => (
                      <li key={b}>
                        <Check aria-hidden="true" size={16} strokeWidth={2.5} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <section className="section band--soft">
        <Container>
          <div className="head head--split">
            <h2>Choose your level of coordination</h2>
            <p className="lead">Each level includes everything in the one before it.</p>
          </div>
          <div className="table-wrap" data-reveal>
            <table className="table table--tiers">
              <caption className="visually-hidden">What each engagement level includes</caption>
              <thead>
                <tr>
                  <th scope="col">Included</th>
                  {servicePackages.map((pkg) => (
                    <th scope="col" key={pkg.name}>
                      <div className="tier-head">
                        <b>{pkg.name}</b>
                        <span>{pkg.description}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    {row.tiers.map((has, i) => (
                      <td key={servicePackages[i].name}>
                        {has ? (
                          <Check aria-label="Included" className="yes" size={20} strokeWidth={2.5} style={{ marginInline: "auto" }} />
                        ) : (
                          <Minus aria-label="Not included" className="no" size={20} style={{ marginInline: "auto" }} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td />
                  {servicePackages.map((pkg) => (
                    <td key={pkg.name}>
                      <Button href="/contact" variant="quiet">
                        Quote {pkg.name.split(" ")[0]}
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <CloseBand
        title="Not sure which level fits?"
        line="Tell us what you're shipping and we'll recommend the right package."
        primary={{ label: "Talk to our team", href: "/contact" }}
      />
    </>
  );
}
