# SkyFresh — Marketing & Lead-Gen Website (Prototype)

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

- `src/app/` — one route per page (Home, About, Services, Horticulture, Floriculture,
  How It Works, Trust, Farmer Sourcing, FAQ, Contact, Privacy, Terms, 404).
- `src/components/layout/` — Header (sticky nav + 24/7 hotline strip) and Footer.
- `src/components/ui/` — shared building blocks (cards, tabs, accordion, timeline, CTA, etc).
- `src/components/forms/` — QuoteForm (Contact page) and FarmerForm (Farmer Sourcing page).
- `src/components/tools/TransitCalculator.tsx` — the interactive shipping-time estimator.
- `src/data/` — all editable content lives here as plain TypeScript objects (site info,
  services, products, testimonials, FAQs, team, milestones, etc). Update content by editing
  these files — no page code needs to change.

## Before launch — replace placeholders

Every placeholder is marked `[P]` in the data files and inline in a few components. In particular:

- `src/data/site.ts` — real phone numbers, hotline, email, office address, map embed URL, social links.
- `src/data/trust.ts` — real testimonials, certification logos, partner logos, verified stats, a real case study.
- `src/data/company.ts` — real team bios/photos, verified milestones/dates, confirmed farmer requirements.
- Product photography — Services, Horticulture, Floriculture, and Trust pages currently use
  colored placeholder blocks marked `[P]` instead of real photos.
- `src/components/forms/QuoteForm.tsx` and `FarmerForm.tsx` — currently simulate submission
  client-side. Wire `handleSubmit` to a real backend (API route, CRM, or email service).
- `src/components/tools/TransitCalculator.tsx` — transit times are illustrative placeholders;
  replace with real route data from operations.
- Logo — the header/footer currently use an "SF" monogram placeholder; swap in the real logo.
- Legal — `/privacy` and `/terms` are placeholder copy and need review by legal counsel,
  especially for GDPR given EU buyers.

## Notes on scope

This prototype does not include a real backend, CMS, authentication, or a live shipment-tracking
portal (the "real-time tracking" service is presented as a marketing feature with an illustrative
dashboard visual — building an actual customer-facing tracking portal is a separate project).
# SkyFreshLogistics
