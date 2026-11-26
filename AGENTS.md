<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

This is a prototype. It has no backend, CMS, authentication, or live shipment-tracking
portal. The "real-time tracking" service is presented as a marketing feature with an
illustrative dashboard visual; building an actual customer-facing tracking portal is a
separate project.

## Placeholders still outstanding

Every placeholder is marked `[P]` in the data files and inline in a few components.

- `src/data/site.ts` — real phone numbers, hotline, office address, map embed URL, and
  social profile URLs. The company name and email addresses are final.
- `src/data/trust.ts` — real testimonials, certification and partner logos, verified
  stats, a real case study.
- `src/data/company.ts` — real team bios and photos, verified milestones and dates,
  confirmed farmer requirements.
- Product photography — the Services, Horticulture, Floriculture, and Trust pages use
  colored placeholder blocks marked `[P]` instead of real photos.
- `src/components/forms/FarmerForm.tsx` — submission is simulated client-side. Wire
  `handleSubmit` to a real backend, CRM, or email service.
- `src/components/forms/QuoteForm.tsx` is live: requests are stored in Postgres via
  `POST /api/quote-requests` and read by staff via `GET /api/quote-requests` (internal
  key). Nobody is notified of a new request yet: add an email/Slack notification (or a
  staff view) before launch. Its instant estimate (`QuoteEstimate.tsx`) calls
  `/api/lists` and `/api/quotes/price`.
- `src/components/tools/TransitCalculator.tsx` — transit times are illustrative. Replace
  with real route data from operations.
- Legal — `/privacy` and `/terms` are placeholder copy and need review by counsel,
  especially for GDPR given EU buyers.
- `metadataBase` is not set in the root layout. Add it once the production domain is
  live so Open Graph image URLs resolve absolutely.
