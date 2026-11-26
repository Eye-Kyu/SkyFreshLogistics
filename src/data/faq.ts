export type FaqCategory = "shipping" | "pricing" | "documents" | "farmers" | "general";

export const faqCategories: { id: "all" | FaqCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "shipping", label: "Shipping" },
  { id: "pricing", label: "Pricing" },
  { id: "documents", label: "Documents" },
  { id: "farmers", label: "Farmers" },
  { id: "general", label: "General" },
];

export const faqs: { question: string; answer: string; category: FaqCategory }[] = [
  {
    question: "How do I get a quote?",
    answer:
      "Fill out the quote request form on our Contact page with your product type, volume, and destination, and our team will respond within one business day.",
    category: "pricing",
  },
  {
    question: "What documents do I need to export flowers?",
    answer:
      "Typically a phytosanitary certificate, export permit, commercial invoice, packing list, and airway bill. We handle preparation of all of these for you.",
    category: "documents",
  },
  {
    question: "How long does shipping to Europe take?",
    answer:
      "Air freight to Europe typically takes 24-72 hours door to door. Sea freight for less time-sensitive cargo can take 2 to 4 weeks depending on the route.",
    category: "shipping",
  },
  {
    question: "What happens if my cargo is delayed?",
    answer:
      "Our operations team monitors every shipment in real time and proactively communicates delays, along with revised delivery estimates and any corrective action taken.",
    category: "shipping",
  },
  {
    question: "How do you ensure cold chain integrity?",
    answer:
      "Produce is pre-cooled immediately after harvest, held in temperature-controlled storage, and monitored with sensors throughout transit until final delivery.",
    category: "shipping",
  },
  {
    question: "What are your payment terms?",
    answer:
      "Payment terms vary by engagement tier and shipment volume. Our team will outline specific terms when you request a quote.", // [P]
    category: "pricing",
  },
  {
    question: "Can I track my shipment in real time?",
    answer:
      "Yes. All shipments include status alerts, and higher-tier packages include full GPS and temperature tracking dashboards.",
    category: "shipping",
  },
  {
    question: "How do I join the farmer network?",
    answer:
      "Visit our Farmer Sourcing page and submit the registration form. Our team reviews applications against our quality and certification requirements.",
    category: "farmers",
  },
  {
    question: "What if I don't have GlobalGAP certification yet?",
    answer:
      "You can still apply. We accept farms actively working toward GlobalGAP certification and can advise on the steps needed to qualify, though certified farms are prioritized for time-sensitive orders.",
    category: "farmers",
  },
  {
    question: "Is there a minimum shipment volume?",
    answer:
      "There's no strict minimum for a first inquiry, but consistent scheduling and freight economics generally favor volumes from a few hundred kilograms upward. Smaller volumes may be consolidated with other shipments on the same route.",
    category: "pricing",
  },
  {
    question: "Do you offer cargo insurance?",
    answer:
      "We can arrange cargo insurance for your shipment through our freight partners, priced per consignment based on declared value and commodity. We recommend it for high-value or long-transit shipments.",
    category: "pricing",
  },
  {
    question: "Do you handle door-to-door delivery, or just export logistics?",
    answer:
      "Our core service covers farm gate to destination port or airport, including customs clearance on both ends where we have partner coverage. Onward inland delivery to a buyer's warehouse can be arranged on request and is quoted separately.",
    category: "shipping",
  },
  {
    question: "Which countries do you currently export to?",
    answer:
      "We regularly ship to buyers across Europe (via the Amsterdam/FloraHolland hub), the Middle East (Dubai, Doha), Asia (Japan, China), and Russia. If your destination isn't listed, contact us: we can usually route through a partner carrier.",
    category: "general",
  },
  {
    question: "What happens if my shipment fails a customs or phytosanitary inspection?",
    answer:
      "Our documentation team prepares every shipment to meet the destination market's requirements in advance to minimize this risk. If a hold does occur, we manage the resolution directly with the relevant authority and keep you informed of the impact on delivery timing.",
    category: "documents",
  },
  {
    question: "Can I cancel or change a quote request after submitting it?",
    answer:
      "Yes. A quote request is not a binding commitment. Contact your assigned coordinator or email us with your reference details, and we'll update or withdraw the request at no cost before a shipment is booked.",
    category: "general",
  },
];
