# Bravair Logistics Limited — Website

Marketing and lead-generation site for Bravair Logistics Limited, an export logistics
coordinator moving horticulture and floriculture produce from vetted African farms to
global buyers.

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Layout

- `src/app/` — one route per page: Home, About, Services, Horticulture, Floriculture,
  How It Works, Trust, Farmer Sourcing, FAQ, Contact, Privacy, Terms, 404.
- `src/components/layout/` — Header with sticky nav and 24/7 hotline strip, and Footer.
- `src/components/ui/` — shared building blocks: cards, tabs, accordion, timeline, CTA.
- `src/components/forms/` — quote request form and farmer registration form.
- `src/components/tools/` — interactive shipping transit-time estimator.
- `src/data/` — all site content as plain TypeScript objects. Edit content here; page
  code does not need to change.

Brand colours are defined once as CSS custom properties in `src/app/globals.css` and
exposed as `brand-navy-*`, `brand-leaf-*`, and `brand-slate-*` utility classes. Logo
assets live in `public/`.
