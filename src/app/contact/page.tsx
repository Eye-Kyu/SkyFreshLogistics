import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { Container, SectionHeader } from "@/components/ui/primitives";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact & Get a Quote",
  description: "Request a shipping quote, reach our team, or call the 24/7 cargo hotline.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-brand-slate-200 py-16 sm:py-20">
        <Container>
          <SectionHeader
            align="left"
            eyebrow="Contact"
            title="Request a quote or get in touch"
            subtitle="Tell us about your shipment and we'll get back to you within one business day."
          />
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <QuoteForm />
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="border border-brand-slate-200 bg-white p-6">
              <h3 className="font-display font-semibold text-brand-slate-900">Office Details</h3>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div>
                  <dt className="text-brand-slate-500">Address</dt>
                  <dd className="text-brand-slate-800">{site.address}</dd>
                </div>
                <div>
                  <dt className="text-brand-slate-500">Phone</dt>
                  <dd>
                    <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="text-brand-blue-700 hover:underline">
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-brand-slate-500">Email</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className="text-brand-blue-700 hover:underline">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-brand-slate-500">Business Hours</dt>
                  <dd className="text-brand-slate-800">{site.hours}</dd>
                </div>
              </dl>
              <div className="mt-5 flex gap-3 border-t border-brand-slate-200 pt-4 text-sm text-brand-slate-500">
                <a href={site.social.linkedin} className="hover:text-brand-blue-700">LinkedIn</a>
                <a href={site.social.twitter} className="hover:text-brand-blue-700">X</a>
                <a href={site.social.facebook} className="hover:text-brand-blue-700">Facebook</a>
                <a href={site.social.instagram} className="hover:text-brand-blue-700">Instagram</a>
              </div>
            </div>

            <div className="overflow-hidden border border-brand-slate-200">
              <iframe
                title="SkyFresh office location"
                src={site.mapEmbedSrc}
                className="h-56 w-full"
                loading="lazy"
              />
            </div>

            <div className="border border-brand-green-700 bg-brand-green-50 p-6">
              <h3 className="font-display font-semibold text-brand-green-900">24/7 Cargo Hotline</h3>
              <p className="mt-1 text-sm text-brand-green-800">
                For time-sensitive shipments and after-hours emergencies.
              </p>
              <a
                href={`tel:${site.hotline.replace(/\s+/g, "")}`}
                className="mt-3 inline-flex items-center gap-2 font-display text-xl font-semibold text-brand-green-900"
              >
                <Phone aria-hidden="true" className="h-5 w-5" />
                {site.hotline}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
