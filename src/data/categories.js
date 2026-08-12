/**
 * Deal Scanner covers any local merchant, not just restaurants.
 *
 * Restaurants are seeded from the scrape. Groceries and shops are declared here
 * with no listings yet, so the category opens to an honest "not live yet" state
 * rather than an empty grid. Seeding them means giving those listings a matching
 * `category` in the data; nothing else in the UI has to change.
 */

import { url } from "./images.js";

export const categories = [
  {
    slug: "restaurants",
    label: "Restaurants",
    heading: "Restaurant deals",
    blurb: "Dine-in and takeaway offers from kitchens around you.",
    image: url("curry-2"),
  },
  {
    slug: "groceries",
    label: "Groceries",
    heading: "Grocery deals",
    blurb: "Weekly savings from local grocers and food markets.",
    image: url("grocery-1"),
  },
  {
    slug: "shops",
    label: "Shops and services",
    heading: "Shop and service deals",
    blurb: "Salons, pharmacies and everyday neighborhood businesses.",
    image: url("shop-1"),
  },
];

export function getCategory(slug) {
  return categories.find((c) => c.slug === slug) || null;
}
