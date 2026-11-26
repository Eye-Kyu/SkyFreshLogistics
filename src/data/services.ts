export const services = [
  {
    icon: "package" as const,
    title: "Export Logistics",
    description: "End-to-end handling from farm gate to port, including packaging and freight booking.",
    href: "/services",
  },
  {
    icon: "sprout" as const,
    title: "Farmer Sourcing",
    description: "We connect you with vetted growers and coordinate every step of the cargo movement.",
    href: "/farmer-sourcing",
  },
  {
    icon: "map-pin" as const,
    title: "Real-Time Tracking",
    description: "Temperature monitoring, GPS location, and status alerts from pickup to delivery.",
    href: "/services",
  },
  {
    icon: "clipboard-check" as const,
    title: "Compliance & Documentation",
    description: "Phytosanitary certificates, export permits, and customs clearance, fully managed.",
    href: "/services",
  },
  {
    icon: "snowflake" as const,
    title: "Cold Storage",
    description: "Pre-cooling and cold-room facilities that maintain an unbroken cold chain.",
    href: "/services",
  },
  {
    icon: "handshake" as const,
    title: "Buyer Matching",
    description: "We connect quality growers with verified international buyers.",
    href: "/services",
  },
];

export type ServiceIconKey = (typeof services)[number]["icon"];

export const serviceDetails = [
  {
    id: "export-logistics",
    icon: "package" as const,
    title: "Export Logistics",
    description:
      "We manage the full journey from farm gate to final port of discharge: consolidating cargo, booking freight capacity on air and sea carriers, and ensuring produce is packed to international export standards. Our operations team coordinates pickup schedules around harvest windows so nothing sits waiting.",
    bullets: [
      "End-to-end cargo handling and coordination",
      "Export-grade packaging standards",
      "Port and airline booking management",
    ],
    imageAlt: "Cargo pallets of fresh produce being loaded for export", // [P] replace with real photography
    imageSide: "right" as const,
  },
  {
    id: "farmer-sourcing",
    icon: "sprout" as const,
    title: "Farmer Sourcing",
    description:
      "Need reliable supply? We vet growers against quality, certification, and consistency standards, then match them to your sourcing needs. The one condition: Bravair coordinates all cargo movement, so you get consolidated logistics alongside consolidated supply.",
    bullets: [
      "Rigorous grower vetting process",
      "Matched to your volume and product needs",
      "Cargo coordination is bundled in, not optional",
    ],
    imageAlt: "Farmer inspecting fresh vegetables in a field", // [P]
    imageSide: "left" as const,
  },
  {
    id: "real-time-tracking",
    icon: "map-pin" as const,
    title: "Real-Time Tracking",
    description:
      "Every shipment is monitored from collection to delivery. Temperature sensors, GPS location pings, and automated status alerts mean you always know exactly where your cargo is and what condition it's in, with no more waiting on phone calls for updates.",
    bullets: [
      "Live temperature and humidity monitoring",
      "GPS-tracked cargo location",
      "Automated milestone status alerts",
    ],
    imageAlt: "Dashboard mockup showing shipment tracking status", // [P]
    imageSide: "right" as const,
  },
  {
    id: "compliance-documentation",
    icon: "clipboard-check" as const,
    title: "Compliance & Documentation",
    description:
      "Export paperwork is where shipments stall. We handle phytosanitary certificates, export permits, customs clearance, and all regulatory navigation required by origin and destination countries, so your cargo moves without administrative delay.",
    bullets: [
      "Phytosanitary certificates & export permits",
      "Customs clearance handled end-to-end",
      "Destination-market regulatory compliance",
    ],
    imageAlt: "Export documentation and certificates being reviewed", // [P]
    imageSide: "left" as const,
  },
  {
    id: "cold-storage",
    icon: "snowflake" as const,
    title: "Cold Storage",
    description:
      "Freshness is won or lost in the hours after harvest. Our pre-cooling facilities pull field heat immediately, and our cold rooms maintain precise temperature bands right up to departure, keeping the cold chain unbroken from farm to cargo hold.",
    bullets: [
      "Rapid pre-cooling after harvest",
      "Temperature-controlled cold rooms",
      "Cold chain maintained until departure",
    ],
    imageAlt: "Cold storage facility with crates of fresh produce", // [P]
    imageSide: "right" as const,
  },
  {
    id: "buyer-matching",
    icon: "handshake" as const,
    title: "Buyer Matching",
    description:
      "Quality growers deserve reliable buyers. We connect vetted producers with verified international buyers actively sourcing horticulture and floriculture products, reducing the time and risk involved in finding the right trade partner.",
    bullets: [
      "Verified international buyer network",
      "Matched by product, volume, and season",
      "Reduces sourcing overhead on both sides",
    ],
    imageAlt: "Handshake between grower and international buyer", // [P]
    imageSide: "left" as const,
  },
];

export const servicePackages = [
  {
    name: "Basic Logistics",
    description: "For exporters who already have growers and buyers, and need reliable freight coordination.",
    features: [
      "Export logistics & freight booking",
      "Compliance & documentation support",
      "Standard shipment tracking",
    ],
    highlighted: false,
  },
  {
    name: "Full Coordination",
    description: "Our most popular tier: end-to-end handling of sourcing, cold chain, and delivery.",
    features: [
      "Everything in Basic Logistics",
      "Farmer sourcing & vetting",
      "Cold storage & pre-cooling",
      "Real-time tracking with alerts",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise Partnership",
    description: "For high-volume exporters and buyers who need a dedicated logistics partner.",
    features: [
      "Everything in Full Coordination",
      "Buyer matching & market access",
      "Dedicated account coordination",
      "Priority hotline & reporting",
    ],
    highlighted: false,
  },
];
