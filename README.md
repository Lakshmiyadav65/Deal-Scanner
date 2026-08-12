# Deal Scanner

Restaurant discovery app with real North Texas Indian restaurant data scraped from [Indian Restaurants in USA](https://www.indianrestaurentsinusa.com/).

## Pages

- `/` — Home
- `/explore` — Search, city switcher, and filters
- `/restaurant/:slug` — Detail page with hours, phone, website, and Google Maps directions

## Data

- 16 real restaurants across Fort Worth, Arlington, Irving, Dallas, and Plano
- Addresses, ratings, hours, phone, and website from restaurant JSON-LD
- **Get directions** opens Google Maps for the real coordinates
- Refresh scrape: `node scripts/scrape-indianrestaurents.mjs`

## Filters

All · Coming Soon · Partnered · Offers · Indian · Hyderabadi · South Indian · North Indian · Vegetarian  
City cycling on Explore also filters listings.

## Run

```bash
npm install
npm run dev
```
