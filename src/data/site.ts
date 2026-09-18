// Central place for editable company info. Replace [P] placeholder values
// with real details before launch.

export const site = {
  name: "Bravair",
  fullName: "Bravair Logistics Limited",
  tagline: "From farm to global market — fresh, fast, and flawlessly coordinated.",
  shortTagline: "Fresh. Fast. Reliable.",
  phone: "+254 700 000 000", // [P]
  hotline: "+254 700 111 222", // [P] 24/7 cargo hotline
  email: "info@bravairlogistics.com",
  quoteEmail: "quotes@bravairlogistics.com",
  address: "Airport North Road, Utawala, Nairobi, Kenya", // [P]
  hours: "Mon-Fri, 8:00-18:00 EAT (hotline is 24/7)", // [P]
  social: {
    linkedin: "https://linkedin.com/company/bravairlogistics", // [P]
    twitter: "https://x.com/bravairlogistics", // [P]
    facebook: "https://facebook.com/bravairlogistics", // [P]
    instagram: "https://instagram.com/bravairlogistics", // [P]
  },
  mapEmbedSrc:
    "https://www.openstreetmap.org/export/embed.html?bbox=36.8656%2C-1.3399%2C36.9356%2C-1.2799&layer=mapnik", // [P] replace with exact office location
};

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  {
    label: "Products",
    href: "/horticulture",
    children: [
      { label: "Horticulture", href: "/horticulture" },
      { label: "Floriculture", href: "/floriculture" },
    ],
  },
  {
    label: "Why Bravair",
    href: "/trust",
    children: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Trust & Certifications", href: "/trust" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  { label: "Farmer Sourcing", href: "/farmer-sourcing" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Trust & Certifications", href: "/trust" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Products",
    links: [
      { label: "Horticulture", href: "/horticulture" },
      { label: "Floriculture", href: "/floriculture" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Farmer Sourcing", href: "/farmer-sourcing" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Get a Quote", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
