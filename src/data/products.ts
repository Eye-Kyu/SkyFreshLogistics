export type ProductCategory = "vegetables" | "fruits" | "herbs" | "exotics";

export const horticultureProducts: {
  name: string;
  category: ProductCategory;
  description: string;
}[] = [
    { name: "Avocados (Hass)", category: "fruits", description: "Export-grade, sized and graded for EU and Middle East markets." },
    { name: "Mangoes", category: "fruits", description: "Multiple varieties, harvested and pre-cooled for air and sea freight." },
    { name: "Passion Fruit", category: "fruits", description: "Hand-selected for skin quality and consistent brix levels." },
    { name: "French Beans", category: "vegetables", description: "Fine and extra-fine grades, a staple of our EU vegetable program." },
    { name: "Snow Peas & Sugar Snaps", category: "vegetables", description: "Delicate produce handled with tight cold-chain discipline." },
    { name: "Baby Corn", category: "vegetables", description: "Sorted and packed to strict length and diameter specifications." },
    { name: "Root Vegetables", category: "vegetables", description: "Carrots, beetroot, and more, washed, graded, and export-packed." },
    { name: "Basil", category: "herbs", description: "Living and cut basil, packed to preserve aroma and shelf life." },
    { name: "Coriander & Mint", category: "herbs", description: "Bunched or loose-packed herbs for foodservice and retail buyers." },
    { name: "Rosemary & Thyme", category: "herbs", description: "Hardy herbs suited to longer sea-freight transit windows." },
    { name: "Dragon Fruit", category: "exotics", description: "Specialty exotic fruit handled with custom ripeness protocols." },
    { name: "Baby Vegetables", category: "exotics", description: "Premium miniature vegetables for high-end foodservice buyers." },
  ];

export const horticultureCategories: { id: "all" | ProductCategory; label: string }[] = [
  { id: "all", label: "All Produce" },
  { id: "vegetables", label: "Vegetables" },
  { id: "fruits", label: "Fruits" },
  { id: "herbs", label: "Herbs" },
  { id: "exotics", label: "Exotics" },
];

export const seasonalCalendar = [
  { quarter: "Q1 (Jan-Mar)", items: ["French Beans", "Avocados", "Snow Peas", "Basil"] },
  { quarter: "Q2 (Apr-Jun)", items: ["Mangoes", "Passion Fruit", "Baby Corn", "Coriander"] },
  { quarter: "Q3 (Jul-Sep)", items: ["Avocados", "Root Vegetables", "Rosemary", "Dragon Fruit"] },
  { quarter: "Q4 (Oct-Dec)", items: ["French Beans", "Snow Peas", "Mangoes", "Mint"] },
];

export type FlowerCategory = "roses" | "summer" | "carnations" | "fillers";

export const flowerProducts: {
  name: string;
  category: FlowerCategory;
  description: string;
}[] = [
    { name: "Rose Stems", category: "roses", description: "Wide color range, graded by stem length and head size." },
    { name: "Spray Roses", category: "roses", description: "Multi-headed roses popular for bouquet and arrangement work." },
    { name: "Alstroemeria", category: "summer", description: "Long vase-life summer flower available in varied colors." },
    { name: "Hypericum", category: "fillers", description: "Berry-topped stems used widely as a bouquet filler." },
    { name: "Chrysanthemums", category: "summer", description: "Hardy, high-yield blooms with strong shipping durability." },
    { name: "Carnations (Standard)", category: "carnations", description: "Classic single-bloom carnations, a reliable year-round export." },
    { name: "Mini Carnations", category: "carnations", description: "Spray carnations favored for mixed arrangements." },
    { name: "Statice", category: "fillers", description: "Long-lasting filler flower, popular for dried arrangements too." },
    { name: "Ornamental Greens", category: "fillers", description: "Eucalyptus, ruscus, and other foliage for bouquet structure." },
  ];

export const flowerCategories: { id: "all" | FlowerCategory; label: string }[] = [
  { id: "all", label: "All Flowers" },
  { id: "roses", label: "Roses" },
  { id: "summer", label: "Summer Flowers" },
  { id: "carnations", label: "Carnations" },
  { id: "fillers", label: "Fillers" },
];

export const flowerGrades = [
  { grade: "Extra", stemLength: "70cm+", headSize: "5cm+", bunchCount: "10 stems/bunch" },
  { grade: "Class I", stemLength: "50-70cm", headSize: "4-5cm", bunchCount: "10-20 stems/bunch" },
  { grade: "Class II", stemLength: "30-50cm", headSize: "3-4cm", bunchCount: "20-25 stems/bunch" },
];

export const destinationMarkets = [
  { region: "Europe", note: "Amsterdam (FloraHolland) hub via daily air freight; 24-48h transit." },
  { region: "Middle East", note: "Dubai and Doha routes with strong demand for roses and fillers." },
  { region: "Asia", note: "Growing demand in Japan and China for premium mixed varieties." },
  { region: "Russia", note: "Seasonal peaks around key holidays; consolidated charter options." },
];
