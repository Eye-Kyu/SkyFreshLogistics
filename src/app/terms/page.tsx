import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { site } from "@/data/site";

// NOTE for developer: these terms are drafted specifically for SkyFresh's
// business model (export logistics coordination and farmer sourcing for
// perishable horticulture/floriculture cargo). They should still be
// reviewed by qualified legal counsel — and by your cargo insurer —
// before launch, particularly the liability and carriage sections, which
// should be checked against the actual freight/carrier agreements SkyFresh
// signs on each shipment.

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the SkyFresh website and services.",
};

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-brand-slate-900 sm:text-4xl">Terms of Service</h1>
        <p className="mt-2 text-sm text-brand-slate-500">Last updated: August 20, 2026</p>

        <div className="mt-10 flex max-w-none flex-col gap-6 border-t border-brand-slate-200 pt-10 leading-relaxed text-brand-slate-700">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the {site.name} website and
            your engagement of services from {site.fullName} (&quot;SkyFresh&quot;, &quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;). By using this website, submitting a quote request, or
            applying to our farmer sourcing program, you agree to these Terms. If you do not agree,
            please do not use this website or our services.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">1. About SkyFresh</h2>
          <p>
            SkyFresh coordinates export logistics for fresh horticulture and floriculture produce,
            including farmer sourcing and vetting, cold storage and pre-cooling, freight booking on air
            and sea carriers, real-time shipment tracking, compliance and export documentation, and
            buyer matching. SkyFresh acts as a logistics coordinator and freight forwarder — we arrange
            carriage with third-party airlines, shipping lines, and customs agents, and are not
            ourselves the underlying air or sea carrier.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">2. Use of This Website</h2>
          <p>
            This website is provided for informational purposes and to let prospective customers and
            growers request a quote, learn about our services, or apply to our farmer sourcing program.
            You agree not to: use the site for any unlawful purpose; misrepresent your identity,
            company, or produce when submitting a form; attempt to interfere with the site&apos;s normal
            operation; or scrape, copy, or reuse site content without our permission.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">3. Quote Requests Are Not Binding Contracts</h2>
          <p>
            Submitting a quote request through this website, or receiving a price estimate from us,
            does not create a binding contract for carriage or any other service. A shipment is only
            confirmed once SkyFresh and the customer agree on scope, pricing, and schedule — typically
            documented in a written booking confirmation or service agreement — and formal shipping
            terms, including applicable carrier conditions, are set out in that agreement rather than on
            this website. Quoted rates are indicative and may change based on fuel surcharges, currency
            movements, customs duties, seasonal capacity, and market conditions until confirmed in
            writing.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">4. Farmer Sourcing Program</h2>
          <p>
            Participation in the farmer sourcing program is subject to SkyFresh&apos;s vetting process,
            including review of certifications, quality standards, and supply capacity. Submitting an
            application does not guarantee acceptance into the network, a buyer match, or any minimum
            purchase volume. As a condition of the program, growers matched through SkyFresh agree that
            SkyFresh coordinates all associated cargo movement for that supply relationship.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">5. Perishable Cargo &amp; Limitation of Liability</h2>
          <p>
            Horticultural and floricultural produce is perishable and time-sensitive by nature. While
            SkyFresh takes commercially reasonable care in pre-cooling, cold storage, packaging, and
            routing to preserve product quality, we do not guarantee against spoilage, quality
            degradation, or loss arising from causes outside our reasonable control, including but not
            limited to: customs or regulatory holds, carrier delay or schedule changes, adverse weather,
            mechanical failure of third-party equipment, or force majeure events.
          </p>
          <p>
            Where SkyFresh is liable for loss or damage to cargo, that liability is limited to the
            extent permitted by the applicable carriage terms and international conventions governing
            the relevant mode of transport (for example, the Montreal Convention for air carriage or the
            Hague-Visby Rules for sea carriage), and by the specific service agreement covering the
            shipment. We strongly recommend arranging cargo insurance for every shipment; SkyFresh can
            help arrange this on request.
          </p>
          <p>
            To the maximum extent permitted by law, SkyFresh is not liable for indirect, incidental, or
            consequential losses, including loss of profit or loss of a buyer contract, arising from use
            of this website or our services.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">6. Documentation &amp; Compliance</h2>
          <p>
            SkyFresh prepares export documentation (such as phytosanitary certificates, export permits,
            and customs paperwork) based on information supplied by the customer or grower. You are
            responsible for the accuracy of the information you provide, and SkyFresh is not liable for
            delays or rejections caused by inaccurate or incomplete information supplied to us.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">7. Intellectual Property</h2>
          <p>
            The content on this website — including text, graphics, and branding — is owned by SkyFresh
            or its licensors and is protected by applicable intellectual property laws. You may view and
            share pages of this site for legitimate business purposes, but may not reproduce, modify, or
            distribute the content without our prior written consent.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">8. Third-Party Partners</h2>
          <p>
            Our services rely on third-party airlines, shipping lines, customs agents, and cold storage
            providers. SkyFresh is not responsible for acts, omissions, or delays caused by these
            third parties beyond the scope of what we have separately contracted them to do on your
            behalf.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold SkyFresh harmless from any claims, losses, or expenses
            arising from your breach of these Terms, misuse of this website, or inaccurate information
            you provide to us in connection with a quote request, farmer application, or shipment.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">10. Governing Law &amp; Dispute Resolution</h2>
          <p>
            These Terms are governed by the laws of Kenya. Any dispute arising from these Terms or from
            services provided by SkyFresh will first be addressed through good-faith negotiation between
            the parties. If unresolved, the dispute will be subject to the exclusive jurisdiction of the
            courts of Nairobi, Kenya, or, where the parties agree, resolved by arbitration under the
            Arbitration Act (Kenya).
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">11. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. The &quot;Last updated&quot; date at the top of
            this page reflects the most recent revision. Continued use of this website after changes
            take effect constitutes acceptance of the revised Terms; specific shipments already booked
            under a signed service agreement remain governed by the terms of that agreement.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">12. Contact</h2>
          <p>
            Questions about these Terms can be sent to{" "}
            <a href={`mailto:${site.email}`} className="text-brand-blue-700 hover:underline">
              {site.email}
            </a>{" "}
            or to {site.address}.
          </p>
        </div>
      </Container>
    </section>
  );
}
