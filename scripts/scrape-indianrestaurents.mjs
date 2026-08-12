import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const SLUGS = [
  // Fort Worth
  "hyderabad-house-fort-worth",
  "curry-cowboys-fort-worth",
  "tikka-bites-indian-cuisine-fort-worth",
  "texas-indian-cuisine-fort-worth",
  "swad-indian-and-nepalese-cuisine-fort-worth-fort-worth",
  "namaste-grill-bar-fort-worth-fort-worth",
  // Arlington
  "annampuram-authentic-south-indian-restaurant-arlington",
  "tandoor-indian-restaurant-arlington",
  "saffron-kitchen-and-bar-arlington",
  // Irving
  "spices-of-india-kitchen-restaurant-catering-irving",
  "simply-south-indian-vegetarian-restaurant-irving",
  "urban-tadka-irving",
  "bawarchi-indian-cuisine-irvingtx-irving",
  // Dallas / Plano
  "india-palace-dallas",
  "hyderabadi-biryani-bbq-dallas",
  "kuppanna-plano",
];

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1]);
      if (data["@type"] === "Restaurant") return data;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function extractCuisineTags(html) {
  const section = html.match(/Regional Cuisine[\s\S]{0,1200}?Opening Hours/);
  if (!section) return [];
  const tags = [];
  const re = /href="\/indian-food\/([^"]+)"[^>]*>\s*<span[^>]*>\s*([^<]+)/g;
  let m;
  while ((m = re.exec(section[0]))) {
    tags.push({ slug: m[1], label: m[2].replace(/\s+/g, " ").trim() });
  }
  return tags;
}

function extractHours(html) {
  const hours = {};
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const section = html.match(/Opening Hours[\s\S]{0,2500}?Contact/);
  const chunk = section ? section[0] : html;
  for (const day of days) {
    const re = new RegExp(`${day}</span><span[^>]*>([^<]+)`, "i");
    const m = chunk.match(re);
    if (m) {
      hours[day] = m[1].trim();
      continue;
    }
    const re2 = new RegExp(`${day}</span>\\s*<span[^>]*>([^<]+)`, "i");
    const m2 = chunk.match(re2);
    if (m2) hours[day] = m2[1].trim();
  }
  return hours;
}

function extractDietary(html, name = "") {
  const diet = new Set();
  const blob = `${name}\n${html}`;
  if (/\/indian-restaurants\/vegan|\\bvegan\\b/i.test(html) && /Regional Cuisine|Dietary|pure-veg|Pure Veg/i.test(html)) {
    // only count dietary if near content, not footer alone
  }
  if (/pure-veg|pure vegetarian|vegetarian restaurant/i.test(blob)) diet.add("vegetarian");
  if (/\bvegan\b/i.test(name) || /indian-restaurants\/vegan/i.test(html.match(/Dietary[\s\S]{0,800}|pure-veg[\s\S]{0,200}/)?.[0] || "")) {
    diet.add("vegan");
  }
  if (/\bhalal\b/i.test(name)) diet.add("halal");
  if (/\bjain\b/i.test(name)) diet.add("jain");
  // Chip detection on page body for dietary badges if present
  const dietSection = html.match(/Dietary[\s\S]{0,1000}?Opening Hours|pure-veg|Pure Vegetarian/);
  if (dietSection) {
    if (/vegan/i.test(dietSection[0])) diet.add("vegan");
    if (/pure-veg|vegetarian/i.test(dietSection[0])) diet.add("vegetarian");
    if (/halal/i.test(dietSection[0])) diet.add("halal");
    if (/jain/i.test(dietSection[0])) diet.add("jain");
  }
  if (/vegetarian/i.test(name)) diet.add("vegetarian");
  return [...diet];
}

function mapsUrl(ld) {
  const addr = ld.address?.streetAddress || "";
  const lat = ld.geo?.latitude;
  const lng = ld.geo?.longitude;
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
}

function directionsUrl(ld) {
  const lat = ld.geo?.latitude;
  const lng = ld.geo?.longitude;
  const addr = ld.address?.streetAddress || "";
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
}

async function scrapeOne(slug) {
  const url = `https://www.indianrestaurentsinusa.com/restaurants/${slug}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${slug} -> HTTP ${res.status}`);
  const html = await res.text();
  const ld = extractJsonLd(html);
  if (!ld) throw new Error(`${slug} -> no Restaurant JSON-LD`);

  const cuisineTags = extractCuisineTags(html);
  const hours = extractHours(html);
  const dietary = extractDietary(html, ld.name);

  return {
    sourceSlug: slug,
    sourceUrl: url,
    name: ld.name,
    description: ld.description,
    image: ld.image,
    phone: ld.telephone || null,
    website: ld.url || null,
    cuisine: ld.servesCuisine || "Indian",
    cuisineTags,
    dietary,
    address: ld.address?.streetAddress || null,
    city: ld.address?.addressLocality || null,
    region: ld.address?.addressRegion || null,
    postalCode: ld.address?.postalCode || null,
    country: ld.address?.addressCountry || "US",
    lat: ld.geo?.latitude ?? null,
    lng: ld.geo?.longitude ?? null,
    rating: ld.aggregateRating?.ratingValue ?? null,
    reviewCount: ld.aggregateRating?.reviewCount ?? null,
    hours,
    mapsUrl: mapsUrl(ld),
    directionsUrl: directionsUrl(ld),
  };
}

async function main() {
  const out = [];
  for (const slug of SLUGS) {
    try {
      const data = await scrapeOne(slug);
      out.push(data);
      console.log("OK", data.name, "|", data.city, "|", data.cuisineTags.map((t) => t.label).join(", "), "|", data.dietary.join(","));
    } catch (err) {
      console.error("FAIL", slug, err.message);
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  const dest = path.join(__dirname, "..", "src", "data", "scraped-restaurants.json");
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${out.length} restaurants -> ${dest}`);
}

main();
