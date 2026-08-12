import { dealsFor } from "./deals.js";
import { buildImages } from "./images.js";
import scraped from "./scraped-restaurants.json";

export const cities = ["Fort Worth", "Arlington", "Irving", "Dallas", "Plano"];

/** Manual enrichments for Deal Scanner filters and copy. Listings stay from the scrape. */
const enrichments = {
  "hyderabad-house-fort-worth": {
    slug: "hyderabad-house",
    shortName: "Hyderabad House",
    partnered: true,
    partnership: "Launch partner",
    tagsExtra: ["hyderabadi"],
    blurb: "Hyderabadi dum biryani, haleem and regional specialties at Heritage Trace in Fort Worth.",
  },
  "curry-cowboys-fort-worth": {
    slug: "curry-cowboys",
    shortName: "Curry Cowboys",
    partnered: true,
    partnership: "Community partner",
    tagsExtra: ["north"],
    cuisineFallback: ["North Indian"],
    blurb: "North Indian favorites in Fort Worth, a highly rated neighborhood spot.",
  },
  "tikka-bites-indian-cuisine-fort-worth": {
    slug: "tikka-bites",
    shortName: "Tikka Bites",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian cuisine on Boat Club Road in Fort Worth.",
  },
  "texas-indian-cuisine-fort-worth": {
    slug: "texas-indian-cuisine",
    shortName: "Texas Indian Cuisine",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian dining in Fort Worth.",
  },
  "swad-indian-and-nepalese-cuisine-fort-worth-fort-worth": {
    slug: "swad-fort-worth",
    shortName: "Swad Indian & Nepalese",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian and Nepalese cuisine in Fort Worth.",
  },
  "namaste-grill-bar-fort-worth-fort-worth": {
    slug: "namaste-grill",
    shortName: "Namaste Grill & Bar",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    partnered: true,
    partnership: "Partner kitchen",
    blurb: "Indian grill and bar in Fort Worth.",
  },
  "annampuram-authentic-south-indian-restaurant-arlington": {
    slug: "annampuram",
    shortName: "Annampuram",
    partnered: true,
    partnership: "Launch collaboration",
    tagsExtra: ["south"],
    blurb: "Authentic South Indian restaurant in Arlington.",
  },
  "tandoor-indian-restaurant-arlington": {
    slug: "tandoor-arlington",
    shortName: "Tandoor",
    tagsExtra: ["north"],
    blurb: "Mughlai and North Indian tandoor cooking in Arlington.",
  },
  "saffron-kitchen-and-bar-arlington": {
    slug: "saffron-kitchen",
    shortName: "Saffron Kitchen & Bar",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian kitchen and bar in Arlington.",
  },
  "spices-of-india-kitchen-restaurant-catering-irving": {
    slug: "spices-of-india",
    shortName: "Spices of India",
    tagsExtra: ["north", "south"],
    cuisineFallback: ["North Indian", "South Indian"],
    blurb: "Restaurant and catering in Irving, serving Indian kitchen favorites.",
  },
  "simply-south-indian-vegetarian-restaurant-irving": {
    slug: "simply-south",
    shortName: "Simply South",
    partnered: true,
    partnership: "Community partner",
    tagsExtra: ["south", "vegetarian"],
    dietary: ["vegetarian"],
    blurb: "South Indian vegetarian restaurant in Irving.",
  },
  "urban-tadka-irving": {
    slug: "urban-tadka",
    shortName: "Urban Tadka",
    tagsExtra: ["north"],
    cuisineFallback: ["North Indian"],
    blurb: "Punjabi and North Indian kitchen in Irving.",
  },
  "bawarchi-indian-cuisine-irvingtx-irving": {
    slug: "bawarchi-irving",
    shortName: "Bawarchi",
    cuisineFallback: ["Hyderabadi"],
    tagsExtra: ["hyderabadi"],
    blurb: "Hyderabadi-style Indian cuisine in Irving.",
  },
  "india-palace-dallas": {
    slug: "india-palace",
    shortName: "India Palace",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Classic Indian dining in Dallas.",
  },
  "hyderabadi-biryani-bbq-dallas": {
    slug: "hyderabadi-biryani-bbq",
    shortName: "Hyderabadi Biryani & BBQ",
    tagsExtra: ["hyderabadi", "north"],
    blurb: "Hyderabadi biryani and BBQ in Dallas.",
  },
  "kuppanna-plano": {
    slug: "kuppanna",
    shortName: "Kuppanna",
    cuisineFallback: ["South Indian"],
    tagsExtra: ["south"],
    blurb: "South Indian restaurant in Plano.",
  },
  "roti-grill-dallas": {
    slug: "roti-grill",
    shortName: "Roti Grill",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Fast Indian grill and rotis in Dallas.",
  },
  "the-dhaba-dallas": {
    slug: "the-dhaba",
    shortName: "The Dhaba",
    cuisineFallback: ["Punjabi"],
    tagsExtra: ["north"],
    partnered: true,
    partnership: "Partner kitchen",
    blurb: "Punjabi dhaba cooking in Dallas.",
  },
  "the-yellow-chilli-plano": {
    slug: "yellow-chilli",
    shortName: "The Yellow Chilli",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Modern Indian dining in Plano.",
  },
  "jashan-indian-fine-dining-plano": {
    slug: "jashan",
    shortName: "Jashan Fine Dining",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian fine dining in Plano.",
  },
};

function splitName(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return { lead: parts[0], italic: "" };
  return { lead: parts.slice(0, -1).join(" "), italic: parts[parts.length - 1] };
}

function cuisineLabel(tags, fallback = []) {
  const labels = tags.map((t) => t.label);
  const merged = [...new Set([...labels, ...fallback])];
  return merged[0] || "Indian";
}

function buildTags(raw, extra = [], dietary = [], hasDeals = false, partnered = false) {
  const tags = new Set(["indian"]);
  for (const t of raw.cuisineTags || []) {
    if (t.slug === "hyderabadi") tags.add("hyderabadi");
    if (t.slug === "south-indian") tags.add("south");
    if (t.slug === "north-indian") tags.add("north");
    if (t.slug === "punjabi" || t.slug === "mughlai") tags.add("north");
  }
  dietary.forEach((d) => tags.add(d));
  extra.forEach((t) => tags.add(t));
  if (hasDeals) tags.add("deals");
  if (partnered) tags.add("partnered");
  return [...tags];
}

function hoursList(hours = {}) {
  return Object.entries(hours).map(([day, value]) => ({ day, value }));
}

function relatedFor(city, slug, all) {
  const sameCity = all.filter((r) => r.cityName === city && r.slug !== slug).slice(0, 2).map((r) => r.slug);
  const others = all.filter((r) => r.slug !== slug && !sameCity.includes(r.slug)).slice(0, 4 - sameCity.length).map((r) => r.slug);
  return [...sameCity, ...others].slice(0, 4);
}

function normalize(raw, index) {
  const boost = enrichments[raw.sourceSlug] || {};
  const slug = boost.slug || raw.sourceSlug;
  const { lead, italic } = splitName(raw.name);
  const cuisineFallback = boost.cuisineFallback || [];
  const cuisine = cuisineLabel(raw.cuisineTags, cuisineFallback);
  const dietary = boost.dietary || [];
  const cityName = raw.city || "Texas";
  const deals = dealsFor(slug);
  const partnered = Boolean(boost.partnered);
  const tags = buildTags(raw, boost.tagsExtra || [], dietary, deals.length > 0, partnered);

  return {
    slug,
    sourceSlug: raw.sourceSlug,
    sourceUrl: raw.sourceUrl,
    category: "restaurants",
    name: raw.name,
    // Scraped names run long ("Simply South - Indian Vegetarian Restaurant").
    // Cards use the short form so they do not wrap to three lines.
    shortName: boost.shortName || raw.name,
    lead,
    italic,
    cuisine,
    cuisineFull: `${cuisine} · Indian`,
    cuisineTags: [
      ...raw.cuisineTags.map((t) => t.label),
      ...cuisineFallback.filter((l) => !raw.cuisineTags.some((t) => t.label === l)),
    ],
    city: `${cityName}, TX`,
    cityName,
    address: raw.address,
    phone: raw.phone,
    website: raw.website,
    lat: raw.lat,
    lng: raw.lng,
    mapsUrl: raw.mapsUrl,
    directionsUrl: raw.directionsUrl,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    hours: hoursList(raw.hours),
    partnered,
    partnership: boost.partnership || null,
    tags,
    deals,
    topDeal: deals[0] || null,
    blurb: boost.blurb || `Indian restaurant in ${cityName}, TX.`,
    description:
      raw.description ||
      `${raw.name} is an Indian restaurant in ${cityName}, Texas. View hours, ratings, and get directions to the original location.`,
    images: buildImages(tags, index),
    menu: {
      Popular: [
        { name: "Chef's specials", desc: "See full menu at the restaurant", price: "Ask in restaurant" },
        { name: "Vegetarian options", desc: "Available, confirm with staff", price: "Ask in restaurant" },
        { name: "Biryani & curries", desc: "Regional Indian favorites", price: "Ask in restaurant" },
        { name: "Tandoor & breads", desc: "When available", price: "Ask in restaurant" },
      ],
    },
    defaultCat: "Popular",
    related: [],
  };
}

export const restaurants = scraped.map(normalize).map((r, _, all) => ({
  ...r,
  related: relatedFor(r.cityName, r.slug, all),
}));

export function getRestaurant(slug) {
  return restaurants.find((r) => r.slug === slug || r.sourceSlug === slug);
}

export const dealsTotal = restaurants.reduce((n, r) => n + r.deals.length, 0);

export function countInCategory(slug) {
  return restaurants.filter((r) => r.category === slug).length;
}

/**
 * One search field has to cover both "my area" and "that place I heard about",
 * so a query that names a city filters by city and anything else is free text.
 */
export function resolveQuery(input = "") {
  const q = input.trim();
  if (!q) return { city: "", query: "" };

  const city = cities.find(
    (c) => c.toLowerCase() === q.toLowerCase() || c.toLowerCase().startsWith(q.toLowerCase())
  );
  if (city) return { city, query: "" };

  // Some listings carry the city in the address rather than the name.
  const byAddress = cities.find((c) => q.toLowerCase().includes(c.toLowerCase()));
  if (byAddress) return { city: byAddress, query: "" };

  return { city: "", query: q };
}

const filterTags = {
  All: null,
  Deals: "deals",
  Partnered: "partnered",
  Hyderabadi: "hyderabadi",
  "South Indian": "south",
  "North Indian": "north",
  Vegetarian: "vegetarian",
};

export function searchRestaurants({ query = "", city = "", filter = "All", category = "" } = {}) {
  const q = query.trim().toLowerCase();
  const tag = filterTags[filter] ?? null;

  return restaurants.filter((r) => {
    const matchesCategory = !category || r.category === category;
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.blurb.toLowerCase().includes(q) ||
      r.cityName.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.tags.some((t) => t.includes(q));
    const matchesCity = !city || r.cityName === city;
    const matchesFilter = !tag || r.tags.includes(tag);
    return matchesCategory && matchesQuery && matchesCity && matchesFilter;
  });
}
