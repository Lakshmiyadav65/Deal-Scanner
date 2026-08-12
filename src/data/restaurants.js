import scraped from "./scraped-restaurants.json";

export const cities = ["Fort Worth", "Arlington", "Irving", "Dallas", "Plano"];

/** Manual enrichments for Deal Scanner filters / copy (real listings still come from scrape). */
const enrichments = {
  "hyderabad-house-fort-worth": {
    slug: "hyderabad-house",
    partnered: true,
    partnership: "Launch partner",
    tagsExtra: ["partnered", "offers", "hyderabadi"],
    offer: {
      badge: "Welcome offer",
      headline: "20% off",
      italic: "your first visit",
      cardTitle: "20% off first visit",
      cardLabel: "20% OFF",
      note: "Ask in restaurant",
      detail: "Illustrative Deal Scanner welcome offer. Confirm terms with the restaurant.",
    },
    blurb: "Hyderabadi dum biryani, haleem and regional specialties at Heritage Trace in Fort Worth.",
  },
  "curry-cowboys-fort-worth": {
    slug: "curry-cowboys",
    partnered: true,
    partnership: "Community partner",
    tagsExtra: ["partnered", "offers", "north"],
    cuisineFallback: ["North Indian"],
    offer: {
      badge: "Offer",
      headline: "15% off",
      italic: "weekday lunch",
      cardTitle: "15% off lunch",
      cardLabel: "15% OFF",
      note: "Weekdays",
      detail: "Illustrative Deal Scanner lunch offer. Confirm terms with the restaurant.",
    },
    blurb: "North Indian favorites in Fort Worth — highly rated neighborhood spot.",
  },
  "tikka-bites-indian-cuisine-fort-worth": {
    slug: "tikka-bites",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian cuisine on Boat Club Road in Fort Worth.",
  },
  "texas-indian-cuisine-fort-worth": {
    slug: "texas-indian-cuisine",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian dining in Fort Worth.",
  },
  "swad-indian-and-nepalese-cuisine-fort-worth-fort-worth": {
    slug: "swad-fort-worth",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Indian and Nepalese cuisine in Fort Worth.",
  },
  "namaste-grill-bar-fort-worth-fort-worth": {
    slug: "namaste-grill",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north", "partnered"],
    partnered: true,
    partnership: "Partner kitchen",
    blurb: "Indian grill and bar in Fort Worth.",
  },
  "annampuram-authentic-south-indian-restaurant-arlington": {
    slug: "annampuram",
    partnered: true,
    partnership: "Launch collaboration",
    tagsExtra: ["partnered", "offers", "south"],
    offer: {
      badge: "Opening week style",
      headline: "Free dessert",
      italic: "with qualifying order",
      cardTitle: "Free dessert",
      cardLabel: "Free dessert",
      note: "Ask server",
      detail: "Illustrative Deal Scanner offer. Confirm terms with the restaurant.",
    },
    blurb: "Authentic South Indian restaurant in Arlington.",
  },
  "tandoor-indian-restaurant-arlington": {
    slug: "tandoor-arlington",
    tagsExtra: ["north"],
    blurb: "Mughlai and North Indian tandoor cooking in Arlington.",
  },
  "saffron-kitchen-and-bar-arlington": {
    slug: "saffron-kitchen",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north", "offers"],
    offer: {
      badge: "Offer",
      headline: "2 for 1",
      italic: "selected appetizers",
      cardTitle: "2 for 1 apps",
      cardLabel: "2 for 1",
      note: "Limited hours",
      detail: "Illustrative Deal Scanner offer. Confirm terms with the restaurant.",
    },
    blurb: "Indian kitchen and bar in Arlington.",
  },
  "spices-of-india-kitchen-restaurant-catering-irving": {
    slug: "spices-of-india",
    tagsExtra: ["north", "south"],
    cuisineFallback: ["North Indian", "South Indian"],
    blurb: "Restaurant and catering in Irving — Indian kitchen favorites.",
  },
  "simply-south-indian-vegetarian-restaurant-irving": {
    slug: "simply-south",
    partnered: true,
    partnership: "Community partner",
    tagsExtra: ["partnered", "south", "vegetarian"],
    dietary: ["vegetarian"],
    blurb: "South Indian vegetarian restaurant in Irving.",
  },
  "urban-tadka-irving": {
    slug: "urban-tadka",
    tagsExtra: ["north"],
    cuisineFallback: ["North Indian"],
    blurb: "Punjabi / North Indian kitchen in Irving.",
  },
  "bawarchi-indian-cuisine-irvingtx-irving": {
    slug: "bawarchi-irving",
    cuisineFallback: ["Hyderabadi"],
    tagsExtra: ["hyderabadi"],
    blurb: "Hyderabadi-style Indian cuisine in Irving.",
  },
  "india-palace-dallas": {
    slug: "india-palace",
    cuisineFallback: ["North Indian"],
    tagsExtra: ["north"],
    blurb: "Classic Indian dining in Dallas.",
  },
  "hyderabadi-biryani-bbq-dallas": {
    slug: "hyderabadi-biryani-bbq",
    tagsExtra: ["hyderabadi", "north", "offers"],
    offer: {
      badge: "Offer",
      headline: "Family pack",
      italic: "biryani deal",
      cardTitle: "Family biryani",
      cardLabel: "Deal",
      note: "Ask counter",
      detail: "Illustrative Deal Scanner deal. Confirm pricing with the restaurant.",
    },
    blurb: "Hyderabadi biryani and BBQ in Dallas.",
  },
  "kuppanna-plano": {
    slug: "kuppanna",
    cuisineFallback: ["South Indian"],
    tagsExtra: ["south"],
    blurb: "South Indian restaurant in Plano.",
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

function buildTags(raw, extra = [], dietary = []) {
  const tags = new Set(["indian", "open"]);
  for (const t of raw.cuisineTags || []) {
    if (t.slug === "hyderabadi") tags.add("hyderabadi");
    if (t.slug === "south-indian") tags.add("south");
    if (t.slug === "north-indian") tags.add("north");
    if (t.slug === "punjabi" || t.slug === "mughlai") tags.add("north");
  }
  dietary.forEach((d) => tags.add(d));
  extra.forEach((t) => tags.add(t));
  if (tags.has("partnered") === false && enrichments[raw.sourceSlug]?.partnered) tags.add("partnered");
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

function normalize(raw) {
  const boost = enrichments[raw.sourceSlug] || {};
  const { lead, italic } = splitName(raw.name);
  const cuisineFallback = boost.cuisineFallback || [];
  const cuisine = cuisineLabel(raw.cuisineTags, cuisineFallback);
  const dietary = boost.dietary || [];
  const img = raw.image || "https://loremflickr.com/1200/900/indian,restaurant?lock=1";
  const cityName = raw.city || "Texas";

  return {
    slug: boost.slug || raw.sourceSlug,
    sourceSlug: raw.sourceSlug,
    sourceUrl: raw.sourceUrl,
    name: raw.name,
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
    status: "open",
    partnered: Boolean(boost.partnered),
    partnership: boost.partnership || null,
    tags: buildTags(raw, boost.tagsExtra || [], dietary),
    offer: boost.offer || null,
    blurb: boost.blurb || `${raw.name} — Indian restaurant in ${cityName}, TX.`,
    description:
      raw.description ||
      `${raw.name} is an Indian restaurant in ${cityName}, Texas. View hours, ratings, and get directions to the original location.`,
    images: {
      hero: img,
      card: img,
      partner: img,
      offer: img,
      offerCard: img,
      menu: img,
      about: img,
      thumbs: [img, img, img],
    },
    menu: {
      Popular: [
        { name: "Chef's specials", desc: "See full menu at the restaurant", price: "Ask in restaurant" },
        { name: "Vegetarian options", desc: "Available — confirm with staff", price: "Ask in restaurant" },
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

export function searchRestaurants({ query = "", city = "", status = "All" } = {}) {
  const q = query.trim().toLowerCase();
  const statusMap = {
    "Coming Soon": "coming",
    Partnered: "partnered",
    Offers: "offers",
    Indian: "indian",
    Hyderabadi: "hyderabadi",
    "South Indian": "south",
    "North Indian": "north",
    Vegetarian: "vegetarian",
    "Coming soon": "coming",
    "Has an offer": "offers",
    "Any status": null,
    All: null,
  };
  const tag = statusMap[status] ?? null;

  return restaurants.filter((r) => {
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.blurb.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q) ||
      r.tags.some((t) => t.includes(q));
    const matchesCity = !city || r.cityName === city;
    const matchesStatus = !tag || r.tags.includes(tag);
    return matchesQuery && matchesCity && matchesStatus;
  });
}
