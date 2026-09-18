import type { Metadata } from "next";
import { Container } from "@/components/ui/primitives";
import { site } from "@/data/site";

// NOTE for developer: this policy is drafted specifically for Bravair's
// business model (export logistics coordination, farmer sourcing, quote
// and farmer-application web forms) and references the Kenya Data
// Protection Act, 2019 and GDPR. It should still be reviewed by qualified
// legal counsel before launch, particularly the retention periods and any
// analytics/cookie tooling actually deployed on the live site.

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Bravair collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-brand-slate-900 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-brand-slate-500">Last updated: August 20, 2026</p>

        <div className="mt-10 flex max-w-none flex-col gap-6 border-t border-brand-slate-200 pt-10 leading-relaxed text-brand-slate-700">
          <p>
            {site.fullName} (&quot;Bravair&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides
            export logistics coordination, cold-chain handling, and farmer sourcing services for
            horticulture and floriculture exporters, buyers, and growers. This policy explains what
            personal information we collect through this website — primarily via our quote request
            and farmer application forms — how we use and protect it, and the rights you have over it.
            By submitting a form or otherwise providing information to us, you agree to the practices
            described here.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">1. Information We Collect</h2>
          <p>We collect information in two ways:</p>
          <p className="font-semibold text-brand-slate-800">Information you provide directly</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-brand-slate-800">Quote requests:</span> full name, company
              name, email address, phone number, product type, estimated shipment volume, destination,
              and any message details you include.
            </li>
            <li>
              <span className="font-medium text-brand-slate-800">Farmer sourcing applications:</span> farm
              or farmer name, farm location, produce grown, land size, phone number, email address,
              certifications held (e.g. GlobalGAP, KEPHIS), and details of your supply capacity.
            </li>
            <li>
              <span className="font-medium text-brand-slate-800">Direct contact:</span> anything you send us
              by phone, email, or our 24/7 cargo hotline, including call-back details.
            </li>
          </ul>
          <p className="font-semibold text-brand-slate-800">Information collected automatically</p>
          <p>
            Like most websites, our hosting and analytics tooling may automatically log standard
            technical data — IP address, browser type, device information, and pages visited — to keep
            the site secure and understand how it&apos;s used. We do not use this data to individually
            profile visitors, and we do not run third-party advertising trackers on this site.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">2. How We Use Your Information</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To respond to quote requests and prepare shipping estimates and proposals.</li>
            <li>To evaluate and process farmer sourcing applications against our vetting criteria.</li>
            <li>
              To coordinate an active shipment — including with airlines, shipping lines, customs
              agents, and cold storage partners who need shipment or consignor details to move your
              cargo.
            </li>
            <li>To prepare export documentation, such as phytosanitary certificates and customs paperwork, where legally required.</li>
            <li>To send operational updates about a quote, application, or in-progress shipment.</li>
            <li>To maintain the security, integrity, and performance of this website.</li>
            <li>To comply with tax, customs, and other legal or regulatory obligations.</li>
          </ul>
          <p>We do not sell your personal information, and we do not use it for unrelated marketing without your consent.</p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">3. Legal Basis for Processing</h2>
          <p>
            Where the Kenya Data Protection Act, 2019, the EU/UK General Data Protection Regulation
            (GDPR), or a similar law applies, we process your information on the following bases: to
            take steps toward, and perform, a service agreement with you (e.g. arranging a shipment);
            to comply with a legal obligation (e.g. export documentation and customs requirements); and
            our legitimate interest in operating and improving Bravair&apos;s logistics and sourcing
            services, balanced against your rights. Where none of these apply, we will ask for your
            consent.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">4. How We Share Information</h2>
          <p>We share personal information only where necessary to deliver our services, including with:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Airlines, shipping lines, freight forwarders, and cold storage partners involved in moving your cargo.</li>
            <li>Customs authorities, phytosanitary inspectors, and other regulators in origin and destination countries.</li>
            <li>Vetted growers or exporters, where necessary to fulfil a sourcing match or a shipment you have requested.</li>
            <li>Service providers who support our operations, such as email delivery, hosting, or CRM providers, under confidentiality obligations.</li>
            <li>Professional advisers, insurers, or authorities where required by law, or to establish, exercise, or defend a legal claim.</li>
          </ul>
          <p>We do not share your information with unrelated third parties for their own marketing purposes.</p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">5. International Data Transfers</h2>
          <p>
            Bravair is based in Kenya, and the produce we coordinate is exported to buyers across
            Europe, the Middle East, Asia, and beyond. As a result, shipment-related information may be
            transferred to, and processed in, countries outside Kenya — including destination markets
            and the countries where our service providers operate. Where we transfer personal
            information out of the EU/UK, we rely on appropriate safeguards such as standard
            contractual clauses or an equivalent lawful transfer mechanism.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">6. Data Retention</h2>
          <p>
            We retain quote request and farmer application information for as long as needed to respond
            to your inquiry, deliver an active service, and meet our legal, tax, and customs
            record-keeping obligations — after which it is deleted or anonymized. Shipment records
            connected to a completed export are typically retained for the statutory period required
            for tax and customs purposes.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">7. Data Security</h2>
          <p>
            We apply reasonable administrative, technical, and physical safeguards to protect the
            information you share with us against unauthorized access, loss, or misuse. No method of
            transmission or storage is completely secure, and we cannot guarantee absolute security of
            information you submit online.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">8. Your Rights</h2>
          <p>
            Depending on where you are located, you may have the right to access, correct, delete, or
            restrict our use of your personal information, to object to certain processing, and to
            receive a copy of your data in a portable format. To exercise any of these rights, contact
            us using the details below.
          </p>
          <p>
            If you are in Kenya, you also have the right to lodge a complaint with the Office of the
            Data Protection Commissioner (ODPC). If you are in the EU or UK, you have the right to
            lodge a complaint with your local data protection supervisory authority.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">9. Cookies</h2>
          <p>
            This site may use essential cookies required for it to function correctly, and may use
            limited analytics cookies to understand overall site usage. We do not use cookies for
            third-party advertising. You can control or disable cookies through your browser settings.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">10. Children&apos;s Privacy</h2>
          <p>
            This website and our services are intended for businesses, growers, and professionals, and
            are not directed at children. We do not knowingly collect personal information from anyone
            under the age of 18.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">11. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time to reflect changes in our practices or
            applicable law. The &quot;Last updated&quot; date at the top of this page indicates when it
            was last revised. Material changes will be reflected on this page.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-slate-900">12. Contact Us</h2>
          <p>
            For questions about this policy, or to exercise any of your data protection rights, contact
            us at{" "}
            <a href={`mailto:${site.email}`} className="text-brand-leaf-700 hover:underline">
              {site.email}
            </a>{" "}
            or write to us at {site.address}.
          </p>
        </div>
      </Container>
    </section>
  );
}
