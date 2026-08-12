/**
 * Deals and coupons.
 *
 * These are illustrative prototype offers, not agreements with the restaurants.
 * Every surface that renders one also renders the "confirm with the restaurant"
 * line, so nobody turns up expecting a discount we invented.
 *
 * A deal is a template plus a listing. The template owns the wording and a photo
 * that matches what is on offer, so a dessert deal shows dessert and a takeaway
 * deal shows a takeaway bag. `plan` decides which templates each listing runs,
 * which is what gives listings different deal counts.
 */

import { url } from "./images.js";

const templates = {
  first:   { value: "20% off",         title: "your first visit",         terms: "Dine-in only. One redemption per table. Show the code before ordering.",image: "biryani-7", code: "FIRST20",  posted: 6 },
  lunch:   { value: "15% off",         title: "weekday lunch",            terms: "Monday to Friday, 11AM to 3PM. Dine-in only.",                          image: "thali-3",   code: "LUNCH15",  posted: 14 },
  dessert: { value: "Free dessert",    title: "with any main course",     terms: "One dessert per table. Ask your server when ordering.",                 image: "sweet-1",   code: "DESSERT",  posted: 27 },
  apps:    { value: "2 for 1",         title: "on selected appetizers",   terms: "Weekdays before 6PM. The cheaper item is free.",                        image: "snack-1",   code: "APPS2FOR1",posted: 43 },
  family:  { value: "$10 off",         title: "family platters",          terms: "Orders over $60. Not valid with other offers.",                         image: "biryani-6", code: "FAMILY10", posted: 58 },
  naan:    { value: "Free naan basket",title: "with two main courses",    terms: "Dine-in only. One basket per table.",                                   image: "curry-1",   code: "NAANFREE", posted: 95 },
  dosa:    { value: "Buy 1 get 1",     title: "on plain and masala dosa", terms: "Weekdays until 11AM. Dine-in only.",                                    image: "south-1",   code: "DOSA2FOR1",posted: 130 },
  buffet:  { value: "$3 off",          title: "the weekend buffet",       terms: "Saturday and Sunday, 12PM to 3PM.",                                     image: "buffet-1",  code: "BUFFET3",  posted: 165 },
  togo:    { value: "10% off",         title: "every takeaway order",     terms: "Show the code at the counter when you collect.",                        image: "takeaway-1",code: "TOGO10",   posted: 210 },
  chai:    { value: "Free chai",       title: "with any dessert",         terms: "Dine-in only, one per guest.",                                          image: "chai-1",    code: "CHAIFREE", posted: 280 },
  tandoor: { value: "15% off",         title: "tandoor platters",         terms: "Dine-in only, after 5PM.",                                              image: "north-9",   code: "TANDOOR15",posted: 340 },
  thali:   { value: "$4 off",          title: "the full vegetarian thali",terms: "Dine-in, one per guest.",                                               image: "thali-2",   code: "THALI4",   posted: 420 },
  biryani: { value: "25% off",         title: "family biryani packs",     terms: "Takeaway orders over $45. Call ahead to confirm.",                      image: "biryani-6", code: "PACK25",   posted: 520 },
  early:   { value: "$5 off",          title: "dinner before 6PM",        terms: "Minimum spend $30. Dine-in only.",                                      image: "curry-2",   code: "EARLY5",   posted: 700 },
};

/** Which offers each listing runs. Counts vary the way real merchants would. */
const plan = {
  "hyderabad-house":        ["first", "family", "biryani", "dessert", "togo"],
  "curry-cowboys":          ["lunch", "naan", "apps"],
  "tikka-bites":            ["togo", "apps"],
  "texas-indian-cuisine":   ["lunch", "first", "chai"],
  "swad-fort-worth":        ["buffet", "togo"],
  "namaste-grill":          ["tandoor", "early", "first", "apps"],
  annampuram:               ["dessert", "dosa", "thali", "chai", "lunch", "first"],
  "tandoor-arlington":      ["tandoor", "first", "early"],
  "saffron-kitchen":        ["apps", "early", "lunch", "dessert"],
  "spices-of-india":        ["buffet", "togo", "family"],
  "simply-south":           ["thali", "dosa", "chai"],
  "urban-tadka":            ["naan", "lunch", "early", "first"],
  "bawarchi-irving":        ["biryani", "first", "togo"],
  "india-palace":           ["buffet", "lunch", "dessert", "first", "apps"],
  "hyderabadi-biryani-bbq": ["biryani", "family", "togo"],
  "roti-grill":             ["togo", "lunch", "naan"],
  "the-dhaba":              ["naan", "tandoor", "early", "first", "lunch", "apps", "dessert"],
  kuppanna:                 ["dosa", "thali", "chai"],
  "yellow-chilli":          ["first", "lunch", "dessert", "apps", "early"],
  jashan:                   ["tandoor", "early", "first"],
};

/** Short per-listing token so two restaurants never share a coupon code. */
function tokenFor(slug) {
  const words = slug.split("-").filter((w) => w.length > 2);
  const letters = words.map((w) => w[0].toUpperCase()).join("");
  return (letters.length >= 2 ? letters : slug.slice(0, 2).toUpperCase()).slice(0, 3);
}

export function dealsFor(slug) {
  const keys = plan[slug];
  if (!keys) return [];
  const token = tokenFor(slug);

  return keys.map((key) => {
    const t = templates[key];
    return {
      value: t.value,
      title: t.title,
      terms: t.terms,
      image: url(t.image),
      code: `DS-${token}-${t.code}`,
      postedMinutes: t.posted,
    };
  });
}

/**
 * Browse surfaces show a partial code; the full one is on the restaurant page.
 * It keeps the deal legible while giving people a reason to open the listing.
 */
export function maskCode(code) {
  if (!code) return "";
  return code.length <= 3 ? "XXX" : `${code.slice(0, -3)}XXX`;
}

/** Illustrative recency, so a deal reads as something that just landed. */
export function freshLabel(minutes) {
  if (minutes == null) return "";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}
