/**
 * Curated food and dining-room photography, served from /public/images.
 *
 * The scrape carries Google-hosted photo URLs that now return 403, so every
 * listing was rendering as a broken frame. These are local, licence-free
 * Unsplash frames picked per cuisine, favouring bright natural light and clean
 * plating over moody close-ups that read as murky at card size.
 */

const pools = {
  hyderabadi: ["biryani-1", "biryani-7", "biryani-4", "biryani-6", "north-7", "biryani-5", "thali-3", "biryani-2"],
  south: ["south-1", "south-3", "south-7", "south-8", "thali-2", "south-2", "south-4", "south-5"],
  north: ["curry-2", "north-9", "curry-4", "north-4", "thali-3", "north-10", "curry-3", "north-1", "curry-1", "north-8"],
};

const rooms = ["room-1", "people-3", "room-4", "room-2"];

export const url = (name) => `/images/${name}.jpg`;

/**
 * The marquee renders at 268px wide and loads eagerly, because lazy loading does
 * not reliably anticipate content moved by a CSS transform and slides were
 * arriving on screen still blank. These are 600px copies so eager stays cheap.
 */
export const slideUrl = (fullUrl) => fullUrl.replace("/images/", "/images/slides/");

/** Frames used outside the listing data. */
export const editorial = {
  band: [url("people-1"), url("thali-3"), url("north-9"), url("south-3"), url("curry-4")],
  steps: {
    search: url("street-1"),
    claim: url("biryani-7"),
    redeem: url("counter-1"),
  },
  closing: [url("curry-4"), url("people-2")],
  community: url("people-1"),
};

function poolFor(tags) {
  if (tags.includes("hyderabadi")) return pools.hyderabadi;
  if (tags.includes("south")) return pools.south;
  return pools.north;
}

/**
 * Every listing gets its own coherent set: one primary shot that stays constant
 * wherever the restaurant appears, plus distinct supporting frames.
 */
export function buildImages(tags, index) {
  const pool = poolFor(tags);
  const pick = (k) => url(pool[(index * 3 + k) % pool.length]);
  const primary = pick(0);

  return {
    hero: primary,
    card: primary,
    partner: primary,
    menu: pick(2),
    about: url(rooms[index % rooms.length]),
    thumbs: [pick(3), pick(4), url(rooms[(index + 2) % rooms.length])],
  };
}
