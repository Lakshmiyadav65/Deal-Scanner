# Deal Scanner

Local deals in one place. Right now people find offers through WhatsApp groups,
Instagram stories and word of mouth, which means most deals are missed. Deal Scanner
puts every offer in an area on one page, with the coupon code attached.

## Categories

`src/data/categories.js` declares what the product covers: **Restaurants**,
**Groceries**, **Shops and services**. Every listing carries a `category`, and
`/explore?category=groceries` filters on it.

Only restaurants are seeded (16, from the scrape). The other two are declared with no
listings, so their card reads "Coming soon" and the page opens to a "not live yet"
state instead of an empty grid. Cuisine filters only appear on the restaurants
category. Seeding a new category means adding listings with that `category` value and
their deals; no UI change is needed.

## The flow

1. **Search** — enter an area (or a restaurant name) in the single search field
2. **Claim** — open a restaurant to unlock its full coupon codes
3. **Redeem** — show the code at the table or the counter

The home page explains these three steps with previews of the real components,
built from live data so they cannot drift out of sync with the product.

## Pages

- `/` — search, live deals, restaurants, partners
- `/explore?q=Irving` — results for an area or a restaurant name
- `/restaurant/:slug` — deals and coupons, hours, phone, website, directions

## Search

One field covers both cases. `resolveQuery` in `src/data/restaurants.js` checks the
input against the city list first, so `Irving` filters by area, and anything else
(`Saffron`, `biryani`) falls through to a free-text match on name, cuisine, blurb,
address and tags.

## Data

- 20 real restaurants across Fort Worth, Arlington, Irving, Dallas and Plano
  (at least 3 per city, so a place search always fills the three-card row)
- Addresses, ratings, hours, phone and website from restaurant JSON-LD
- **Get directions** opens Google Maps for the real coordinates
- Refresh scrape: `node scripts/scrape-indianrestaurents.mjs`

## Deals

`src/data/deals.js` is a set of deal **templates** plus a **plan** saying which
templates each listing runs. A template owns the wording, the terms, a photo that
matches the offer (dessert deals show dessert, takeaway deals show a takeaway bag)
and an illustrative "posted" age rendered as `14 min ago`. The plan is what gives
listings different deal counts, from 2 up to 7. Coupon codes are generated as
`DS-<listing token>-<template code>`, so no two listings share one.
These are **illustrative prototype offers, not agreements with the restaurants**, so
every surface that shows one also shows the "confirm with the restaurant" line. Real
offers replace the contents of that one file.

Codes are partially masked everywhere except the restaurant page: `maskCode` replaces
the last three characters with `XXX`, so results show `DS-HH-FIRSXXX` and opening the
listing reveals `DS-HH-FIRST20`. Adding a new browse surface means passing the code
through `maskCode` too.

Results are paged three at a time, so searching a place lands on a row of three
listing cards. Each card shows its deal count and the first two masked codes.

## Photography

The scraped Google-hosted photo URLs now return 403, so listings render local images
from `public/images`. `src/data/images.js` assigns each listing a set matched to its
cuisine, so a Hyderabadi listing shows biryani and a South Indian listing shows dosa
or a banana-leaf thali. Drop real restaurant photography into `public/images` and
point the pools at it.

## Design notes

Three rules keep the UI honest, all enforced in `src/index.css`:

- Text never sits on a background of its own hue. Badges are ink-on-white,
  white-on-ink, or white-on-accent. No green text on a green chip.
- The burnt-orange accent belongs to coupon codes and primary actions. Deal values
  on photography use white or ink chips so the code stays the loudest thing on a card.
- One soft page wash (`body`, fixed attachment): cool light at the edges, white
  through the middle where the reading happens. Cards stay white on top of it.

There are no hover effects anywhere by design. Keyboard focus rings remain.

## Run

```bash
npm install
npm run dev
```
