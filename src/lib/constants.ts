export const SITE_NAME = "L'Ami Mauricien";
export const SITE_DESCRIPTION =
  "Your premium digital concierge for Mauritius. Curated experiences, fine dining, culture, and private transport — planned by AI, perfected by local expertise.";

export const PERSONAS = [
  {
    id: "honeymoon",
    labelEn: "Honeymoon",
    labelFr: "Lune de miel",
    prompt: "Plan a romantic honeymoon experience in Mauritius",
    icon: "heart",
  },
  {
    id: "family",
    labelEn: "Family Holiday",
    labelFr: "Vacances en famille",
    prompt: "Plan a family-friendly holiday in Mauritius with activities for kids",
    icon: "users",
  },
  {
    id: "adventure",
    labelEn: "Adventure",
    labelFr: "Aventure",
    prompt: "Plan an adventure trip in Mauritius with hiking, diving, and nature",
    icon: "compass",
  },
  {
    id: "relax-luxury",
    labelEn: "Relax & Luxury",
    labelFr: "Détente & Luxe",
    prompt: "Plan a relaxing luxury retreat in Mauritius with spas and fine dining",
    icon: "sparkles",
  },
  {
    id: "business-leisure",
    labelEn: "Business + Leisure",
    labelFr: "Affaires + Loisirs",
    prompt:
      "Plan a bleisure trip in Mauritius combining work and premium leisure",
    icon: "briefcase",
  },
] as const;

export const REGIONS = [
  { slug: "north", nameEn: "North", nameFr: "Nord" },
  { slug: "east", nameEn: "East", nameFr: "Est" },
  { slug: "south", nameEn: "South", nameFr: "Sud" },
  { slug: "west", nameEn: "West", nameFr: "Ouest" },
] as const;

export const CATEGORIES = [
  {
    slug: "restaurants",
    nameEn: "Restaurants & Fine Dining",
    nameFr: "Restaurants & Gastronomie",
    icon: "utensils",
  },
  {
    slug: "experiences-tours",
    nameEn: "Experiences & Tours",
    nameFr: "Expériences & Excursions",
    icon: "sailboat",
  },
  {
    slug: "culture-events",
    nameEn: "Culture & Events",
    nameFr: "Culture & Événements",
    icon: "landmark",
  },
  {
    slug: "premium-transport",
    nameEn: "Premium Transport",
    nameFr: "Transport Premium",
    icon: "car",
  },
] as const;

export const PRICE_RANGES = [
  { value: 1, label: "$" },
  { value: 2, label: "$$" },
  { value: 3, label: "$$$" },
  { value: 4, label: "$$$$" },
] as const;
