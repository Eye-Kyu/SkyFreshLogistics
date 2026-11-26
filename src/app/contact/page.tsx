import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/ui/primitives";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact and get a quote",
  description: "Request a shipping quote, reach our team, or call the 24/7 cargo hotline.",
};

export default function ContactPage() {
  const tel = (n: string) => `tel:${n.replace(/\s+/g, "")}`;

  return (
    <>
      <PageIntro
        title="Request a quote or get in touch"
        lead="Tell us about your shipment and we'll get back to you within one business day."
        aside={
          <div className="hotline">
            <p>24/7 cargo hotline, for time-sensitive shipments and after-hours emergencies</p>
            <a href={tel(site.hotline)}>{site.hotline}</a>
          </div>
        }
      />

      <section className="section--s" id="quote">
        <Container>
          <div className="contact">
            <aside className="contact__facts" aria-label="Office details">
              <dl>
                <div>
                  <dt>Address</dt>
                  <dd>{site.address}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={tel(site.phone)} className="textlink">
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className="textlink">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Business hours</dt>
                  <dd>{site.hours}</dd>
                </div>
                <div>
                  <dt>Elsewhere</dt>
                  <dd className="actions" style={{ gap: "var(--space-md)" }}>
                    <a href={site.social.linkedin} className="textlink">LinkedIn</a>
                    <a href={site.social.twitter} className="textlink">X</a>
                    <a href={site.social.facebook} className="textlink">Facebook</a>
                    <a href={site.social.instagram} className="textlink">Instagram</a>
                  </dd>
                </div>
              </dl>
              <iframe title="Bravair office location" src={site.mapEmbedSrc} className="map" loading="lazy" />
            </aside>

            <div>
              <h2 className="visually-hidden">Quote request</h2>
              <QuoteForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
