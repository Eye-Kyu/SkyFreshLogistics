export const coreValues = [
  { icon: "shield" as const, title: "Integrity", description: "We handle every shipment and every partnership honestly, with clear communication at every step." },
  { icon: "clock" as const, title: "Reliability", description: "Harvest windows and flight schedules don't wait — neither do we. Consistency is the product." },
  { icon: "leaf" as const, title: "Quality", description: "From grading to cold storage, we protect the quality your buyers and your reputation depend on." },
  { icon: "handshake" as const, title: "Partnership", description: "We succeed when our growers, exporters, and buyers succeed — the relationship outlasts the shipment." },
];

export type CoreValueIconKey = (typeof coreValues)[number]["icon"];

export const team = [
  { name: "Brian Kareko", role: "Founder & CEO", bio: "20+ years in African horticulture export logistics.", initials: "DK" }, // [P]
  { name: "Brian Kareko", role: "Head of Operations", bio: "Oversees cold chain, sourcing, and freight coordination.", initials: "GA" }, // [P]
  { name: "Papius", role: "Head of Compliance", bio: "Manages certifications, permits, and customs relationships.", initials: "SO" }, // [P]
];

export const milestones = [
  { label: "2015", title: "Bravair Founded", description: "Started as a small export coordination service for three vegetable farms near Nairobi." },
  { label: "2017", title: "First Major Shipment", description: "Delivered our first consolidated air freight shipment of mixed vegetables to the Netherlands." },
  { label: "2019", title: "GlobalGAP Certification", description: "Achieved GlobalGAP-aligned handling standards, opening EU retail supply chains." },
  { label: "2021", title: "Floriculture Division Launched", description: "Expanded into cut flower export logistics, adding cold storage capacity for stems." },
  { label: "2023", title: "Farmer Sourcing Program", description: "Launched the formal farmer vetting and matching program now serving 450+ growers." },
  { label: "2025", title: "28 Export Markets", description: "Grew to serve buyers across Europe, the Middle East, Asia, and Russia." },
]; // [P] verify all dates and milestones

export const missionVision = {
  mission: "To move fresh produce from African farms to global markets without compromising quality, speed, or trust — for every grower and every buyer we work with.",
  vision: "To be the most trusted logistics partner connecting African horticulture and floriculture to the world.",
};

export const processSteps = [
  { title: "Inquiry & Booking", description: "Reach out, confirm availability, routes, and pricing." },
  { title: "Farmer Coordination", description: "Match with vetted growers and align harvest with departure schedules." },
  { title: "Collection & Pre-Cooling", description: "Pickup, grading, and pre-cooling to lock in freshness." },
  { title: "Documentation & Customs", description: "Handle all certificates, permits, and clearance." },
  { title: "Shipment & Tracking", description: "Air or sea transit with real-time monitoring." },
  { title: "Delivery & Confirmation", description: "Arrival at destination, receipt confirmation, and quality feedback." },
];

export const shippingModes = [
  { title: "Air Freight", detail: "Fast transit of 24-72 hours, ideal for high-value, time-sensitive cargo like flowers and berries.", icon: "plane" as const },
  { title: "Sea Freight", detail: "Cost-effective reefer container shipping for larger volumes with longer shelf life.", icon: "ship" as const },
  { title: "Mixed Consolidation", detail: "Shared loads across multiple exporters to reduce costs while maintaining schedule flexibility.", icon: "package" as const },
];

export type ShippingModeIconKey = (typeof shippingModes)[number]["icon"];

export const requiredDocuments = [
  "Phytosanitary certificate",
  "Export permit",
  "Commercial invoice",
  "Packing list",
  "Airway bill / bill of lading",
  "Certificate of origin",
];

export const farmerProgramSteps = [
  { title: "Exporter Registers a Need", description: "Tell us the product, volume, and timeline you're sourcing for." },
  { title: "Bravair Matches Vetted Farmers", description: "We identify growers who meet quality, certification, and capacity requirements." },
  { title: "Bravair Coordinates All Cargo Movement", description: "From collection to delivery, logistics is handled by our team end-to-end." },
];

export const farmerRequirements = [
  "Minimum land size suitable for consistent export volumes", // [P] add specific figure
  "GlobalGAP certification (or active progress toward it)",
  "Access to on-farm or nearby cold storage",
  "Demonstrated consistent supply capacity",
  "Willingness to meet Bravair quality grading standards",
];

export const exporterBenefits = [
  { title: "Reliable Supply", description: "Consistent volumes from vetted growers, reducing sourcing gaps." },
  { title: "Pre-Vetted Quality", description: "Every grower meets certification and quality standards before matching." },
  { title: "Consolidated Logistics", description: "One point of contact for both sourcing and cargo coordination." },
  { title: "Reduced Sourcing Overhead", description: "Spend less time vetting farms and more time growing your buyer base." },
];

export const growingRegions = [
  { region: "Central Kenya (Kiambu, Murang'a)", focus: "Vegetables, herbs" }, // [P]
  { region: "Rift Valley (Naivasha, Nakuru)", focus: "Cut flowers" },
  { region: "Eastern Kenya (Machakos, Kitui)", focus: "Fruits, avocados" },
  { region: "Mount Kenya region", focus: "French beans, snow peas" },
];
