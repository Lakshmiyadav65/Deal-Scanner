import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ImageSlot from "../components/ImageSlot.jsx";
import Navbar from "../components/Navbar.jsx";
import { freshLabel, maskCode } from "../data/deals.js";
import { getCategory } from "../data/categories.js";
import { cities, resolveQuery, searchRestaurants } from "../data/restaurants.js";

const baseFilters = ["All", "Deals", "Partnered"];
const cuisineFilters = ["Hyderabadi", "South Indian", "North Indian", "Vegetarian"];
const allFilters = [...baseFilters, ...cuisineFilters];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get("q") || "");
  const [pageSize, setPageSize] = useState(3);

  const rawQuery = params.get("q") || "";
  const filter = allFilters.includes(params.get("filter")) ? params.get("filter") : "All";
  const category = getCategory(params.get("category") || "");
  const resolved = useMemo(() => resolveQuery(rawQuery), [rawQuery]);

  useEffect(() => {
    setInput(params.get("q") || "");
    setPageSize(3);
  }, [params]);

  const visible = useMemo(
    () => searchRestaurants({ query: resolved.query, city: resolved.city, filter, category: category?.slug || "" }),
    [resolved, filter, category]
  );
  const shown = visible.slice(0, pageSize);

  const push = (next) => {
    const nextParams = new URLSearchParams();
    if (next.q) nextParams.set("q", next.q);
    if (next.filter && next.filter !== "All") nextParams.set("filter", next.filter);
    if (category) nextParams.set("category", category.slug);
    setParams(nextParams, { replace: true });
  };

  const area = resolved.city || (resolved.query ? `“${resolved.query}”` : "North Texas");
  const filters = !category || category.slug === "restaurants" ? allFilters : baseFilters;
  const dealCount = visible.reduce((n, r) => n + r.deals.length, 0);

  return (
    <div className="page">
      <Navbar
        cta={
          <a href="#results" className="btn btn-accent btn-sm">
            {visible.length} listed
          </a>
        }
      />

      <section className="wrap" style={{ position: "relative", padding: "60px 28px 44px", textAlign: "center" }}>
        {category && (
          <div className="badge badge-line" style={{ marginBottom: 16, fontWeight: 500, color: "var(--ink-2)" }}>
            {category.label}
          </div>
        )}
        <h1 style={{ margin: 0, fontSize: 64, lineHeight: 1.02, letterSpacing: "-0.045em", fontWeight: 700 }}>
          {category ? `${category.heading} in ` : "Deals in "}
          <span className="italic">{area}</span>
        </h1>
        <p style={{ margin: "16px auto 0", fontSize: 16, color: "var(--ink-2)", maxWidth: "52ch" }}>
          {visible.length > 0
            ? `${visible.length} ${visible.length === 1 ? "place" : "places"} listed${
                dealCount > 0
                  ? `, ${dealCount} live ${dealCount === 1 ? "deal" : "deals"} between them.`
                  : ", no live deals right now."
              }`
            : category?.blurb || "Nothing listed here yet."}
        </p>

        <div style={{ maxWidth: 700, margin: "30px auto 0" }}>
          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              aria-label="City, neighborhood or place"
              placeholder="Enter a city, neighborhood or place name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && push({ q: input, filter })}
            />
            <button type="button" className="btn btn-ink" onClick={() => push({ q: input, filter })} style={{ height: 50, padding: "0 28px" }}>
              Find deals
            </button>
          </div>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className={resolved.city === city ? "badge badge-ink" : "badge badge-line"}
                onClick={() => push({ q: city, filter })}
                style={{ cursor: "pointer", fontWeight: 500 }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ position: "sticky", top: "var(--nav-h)", zIndex: 30, background: "rgba(255,255,255,.92)", backdropFilter: "blur(10px)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="ds-rail pad-x" style={{ maxWidth: 1180, margin: "0 auto", padding: "12px 28px", display: "flex", gap: 8, overflowX: "auto", alignItems: "center" }}>
          {filters.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => push({ q: rawQuery, filter: label })}
              className={filter === label ? "badge badge-ink" : "badge badge-line"}
              style={{ cursor: "pointer", padding: "9px 16px", fontWeight: filter === label ? 600 : 500 }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section id="results" className="wrap" style={{ padding: "36px 28px 0" }}>
        {visible.length === 0 ? (
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: "var(--r-panel)", padding: "56px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em" }}>
              {category ? `${category.label} are not live yet` : "Nothing listed for that search yet."}
            </div>
            <p style={{ margin: "10px auto 0", color: "var(--ink-3)", maxWidth: "46ch" }}>
              {category
                ? `We are signing up ${category.label.toLowerCase()} across North Texas now. Restaurant deals are live in the meantime.`
                : "We track 16 places across five North Texas cities. Try one of those areas, or clear the filters."}
            </p>
            <div style={{ marginTop: 22, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              {category ? (
                <Link to="/explore?category=restaurants" className="btn btn-ink">See restaurant deals</Link>
              ) : (
                cities.map((city) => (
                  <button key={city} type="button" className="badge badge-line" onClick={() => push({ q: city })} style={{ cursor: "pointer", fontWeight: 500 }}>
                    {city}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {shown.map((restaurant) => (
              <ListingCard key={restaurant.slug} restaurant={restaurant} />
            ))}
          </div>
        )}

        {visible.length > 0 && (
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              className="btn btn-line"
              onClick={() => setPageSize((n) => n + 3)}
              disabled={pageSize >= visible.length}
            >
              {pageSize >= visible.length ? "That is everything" : "Load more places"}
            </button>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
              Showing {Math.min(pageSize, visible.length)} of {visible.length}
            </span>
          </div>
        )}
      </section>

      <section className="wrap" style={{ padding: "80px 28px 0" }}>
        <div style={{ background: "var(--ink)", borderRadius: "var(--r-panel)", padding: 44, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap", color: "#FFFFFF" }}>
          <div>
            <div style={{ fontSize: 13, color: "#B9B9C6" }}>Listings from Indian Restaurants in USA</div>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.04em", marginTop: 8, color: "#FFFFFF" }}>
              Running a business? <span className="italic" style={{ color: "#F0A05A" }}>List your deal.</span>
            </div>
          </div>
          <a href="https://www.indianrestaurentsinusa.com/usa/texas/fort-worth/indian-restaurants" target="_blank" rel="noreferrer" className="btn btn-accent">
            Source directory
          </a>
        </div>
      </section>

      <Footer links={[{ to: "/", label: "Home" }, { to: "/restaurant/hyderabad-house", label: "Sample listing" }]} />
    </div>
  );
}

function ListingCard({ restaurant }) {
  const deals = restaurant.deals;
  const top = deals[0];
  // Two codes is enough to read as "this place has offers" without a wall of chips.
  const shown = deals.slice(0, 2);

  return (
    <Link to={`/restaurant/${restaurant.slug}`} className="card">
      <div className="card-media" style={{ height: 200 }}>
        <ImageSlot src={restaurant.images.card} alt={restaurant.name} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {top && <span className="badge badge-float">{top.value}</span>}
          {restaurant.partnered && <span className="badge badge-ink">Partner</span>}
        </div>
      </div>

      <div style={{ padding: "18px 18px 20px" }}>
        <h3 style={{ margin: 0, fontSize: 21, fontWeight: 700, letterSpacing: "-0.03em" }}>{restaurant.shortName}</h3>

        <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{restaurant.cuisine} · {restaurant.city}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: deals.length ? "var(--accent)" : "var(--ink-3)", whiteSpace: "nowrap" }}>
            {deals.length ? `${deals.length} ${deals.length === 1 ? "deal" : "deals"}` : "No deals"}
          </span>
        </div>

        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)", minHeight: 44 }}>{restaurant.blurb}</p>

        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line-soft)" }}>
          {shown.length > 0 ? (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {shown.map((deal) => (
                  <span key={deal.code} className="coupon coupon-sm">{maskCode(deal.code)}</span>
                ))}
              </div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>Updated {freshLabel(top.postedMinutes)}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>View &rarr;</span>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <span className="status">{restaurant.rating} ★ · {restaurant.reviewCount} reviews</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>View &rarr;</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
