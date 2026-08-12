import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ImageSlot from "../components/ImageSlot.jsx";
import Navbar from "../components/Navbar.jsx";
import { cities, searchRestaurants } from "../data/restaurants.js";
import { useSaved } from "../hooks/useSaved.js";

const labels = ["All", "Coming Soon", "Partnered", "Offers", "Indian", "Hyderabadi", "South Indian", "North Indian", "Vegetarian"];

function mapStatusParam(value) {
  if (!value) return "All";
  if (labels.includes(value)) return value;
  if (value === "Coming soon") return "Coming Soon";
  if (value === "Has an offer") return "Offers";
  return "All";
}

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [location, setLocation] = useState(params.get("city") || "Fort Worth");
  const [filter, setFilter] = useState(mapStatusParam(params.get("status")));
  const [pageSize, setPageSize] = useState(9);

  useEffect(() => {
    setQuery(params.get("q") || "");
    setLocation(params.get("city") || "Fort Worth");
    setFilter(mapStatusParam(params.get("status")));
  }, [params]);

  const visible = useMemo(
    () => searchRestaurants({ query, city: location, status: filter }),
    [query, location, filter]
  );
  const shown = visible.slice(0, pageSize);
  const featured = shown[0];
  const rest = shown.slice(1);

  const syncParams = (next) => {
    const nextParams = new URLSearchParams();
    if (next.q) nextParams.set("q", next.q);
    if (next.city) nextParams.set("city", next.city);
    if (next.status && next.status !== "All") nextParams.set("status", next.status);
    setParams(nextParams, { replace: true });
  };

  const applyFilter = (next) => {
    setFilter(next);
    setPageSize(9);
    syncParams({ q: query, city: location, status: next });
  };

  const runSearch = () => {
    setPageSize(9);
    syncParams({ q: query, city: location, status: filter });
  };

  const cycleCity = () => {
    const next = cities[(cities.indexOf(location) + 1) % cities.length];
    setLocation(next);
    setPageSize(9);
    syncParams({ q: query, city: next, status: filter });
  };

  const chip = (active) => ({
    background: active ? "#131316" : "#F5F6F9",
    color: active ? "#FFFFFF" : "#4A4A55",
    border: `1px solid ${active ? "#131316" : "#ECEDF2"}`,
    borderRadius: 999,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background .18s ease, color .18s ease",
  });

  return (
    <div className="page">
      <div className="hero-wash">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(55% 60% at 85% 0%, #FFE7D2 0%, rgba(255,231,210,0) 62%), radial-gradient(60% 65% at 8% 4%, #DCE7FF 0%, rgba(220,231,255,0) 60%), linear-gradient(180deg,#F4F6FF 0%, #FFFFFF 86%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#C9CEDD 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.3 }} />

        <Navbar
          cta={
            <a href="#feed" className="btn-start pill" style={{ background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "12px 26px", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
              Get started
            </a>
          }
        />

        <section className="wrap" style={{ position: "relative", padding: "64px 28px 56px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,.75)", border: "1px solid #E6E7EE", borderRadius: 999, padding: "7px 16px", fontSize: 13, color: "#4A4A55" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E2761B", display: "inline-block" }} />
            Browsing {location}
          </div>
          <h1 style={{ margin: "20px 0 0", fontSize: 72, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 700 }}>
            Restaurants worth <span className="italic">knowing about.</span>
          </h1>
          <div style={{ margin: "34px auto 0", maxWidth: 860, background: "#FFFFFF", border: "1px solid #ECEDF2", borderRadius: 999, padding: "9px 9px 9px 22px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 30px 60px -46px rgba(20,20,40,.5)" }}>
            <span style={{ color: "#8F909C", fontSize: 15 }}>⌕</span>
            <input
              placeholder="Search restaurants, cuisines or dishes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              style={{ flex: 1, border: "none", outline: "none", background: "none", fontSize: 15, color: "#111112", height: 48 }}
            />
            <button type="button" className="chip" onClick={cycleCity} style={{ background: "#F5F6F9", border: "none", borderRadius: 999, height: 48, padding: "0 20px", fontSize: 14, color: "#111112", cursor: "pointer", whiteSpace: "nowrap" }}>
              {location} ⇄
            </button>
            <button type="button" className="btn-dark" onClick={runSearch} style={{ background: "#131316", color: "#FFFFFF", border: "none", borderRadius: 999, height: 48, padding: "0 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              Search
            </button>
          </div>
        </section>
      </div>

      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid #ECEDF2" }}>
        <div className="ds-rail pad-x" style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 28px", display: "flex", gap: 9, overflowX: "auto", alignItems: "center" }}>
          {labels.map((label) => (
            <button key={label} type="button" onClick={() => applyFilter(label)} style={chip(filter === label)}>
              {label}
            </button>
          ))}
          <span style={{ marginLeft: "auto", paddingLeft: 16, fontSize: 13, color: "#8F909C", whiteSpace: "nowrap" }}>
            {visible.length} listings · {filter}
          </span>
        </div>
      </div>

      <section id="feed" className="wrap" style={{ padding: "40px 28px 0" }}>
        {visible.length === 0 && (
          <div style={{ background: "#FAFAFD", border: "1px solid #ECEDF2", borderRadius: 28, padding: 40, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>No listings match that search.</div>
            <p style={{ margin: "10px 0 0", color: "#77778A" }}>Try another city, filter, or clear the search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("All");
                syncParams({ q: "", city: location, status: "All" });
              }}
              className="btn-dark"
              style={{ marginTop: 18, background: "#131316", color: "#FFF", border: "none", borderRadius: 999, padding: "12px 22px", cursor: "pointer" }}
            >
              Clear filters
            </button>
          </div>
        )}

        {featured && <FeaturedCard restaurant={featured} />}

        <div className="grid-3" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
          {rest.map((restaurant) => (
            <ListingCard key={restaurant.slug} restaurant={restaurant} />
          ))}
        </div>

        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            className="btn-soft"
            onClick={() => setPageSize((n) => n + 6)}
            disabled={pageSize >= visible.length}
            style={{ background: "#F5F6F9", border: "1px solid #ECEDF2", borderRadius: 999, padding: "15px 34px", fontSize: 14, fontWeight: 600, cursor: pageSize >= visible.length ? "default" : "pointer", color: "#111112", opacity: pageSize >= visible.length ? 0.7 : 1 }}
          >
            {pageSize >= visible.length ? "No more listings" : "Load more restaurants"}
          </button>
          <span style={{ fontSize: 13, color: "#8F909C" }}>
            Showing {Math.min(pageSize, visible.length)} of {visible.length} places in {location}
          </span>
        </div>
      </section>

      <section className="wrap" style={{ padding: "80px 28px 96px" }}>
        <div style={{ background: "#131316", borderRadius: 34, padding: 48, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 32, flexWrap: "wrap", color: "#FFFFFF" }}>
          <div>
            <div style={{ fontSize: 13, color: "#B9B9C6" }}>Data from Indian Restaurants in USA</div>
            <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.04em", marginTop: 8, color: "#FFFFFF" }}>
              Real kitchens around <span className="italic" style={{ color: "#F5A04A" }}>North Texas.</span>
            </div>
          </div>
          <a href="https://www.indianrestaurentsinusa.com/usa/texas/fort-worth/indian-restaurants" target="_blank" rel="noreferrer" className="btn-start pill keep-white" style={{ background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "16px 30px", fontSize: 15, fontWeight: 600 }}>
            Source directory →
          </a>
        </div>
      </section>

      <Footer links={[{ to: "/", label: "Home" }, { to: "/restaurant/hyderabad-house", label: "Restaurant detail" }]} />
    </div>
  );
}

function FeaturedCard({ restaurant }) {
  const [saved, toggleSave] = useSaved(restaurant.slug);
  return (
    <article className="grid-split" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "center", background: "#FAFAFD", border: "1px solid #ECEDF2", borderRadius: 32, padding: 16 }}>
      <Link to={`/restaurant/${restaurant.slug}`} style={{ display: "block", position: "relative", height: 430, borderRadius: 24, overflow: "hidden", background: "#F0F1F5" }}>
        <ImageSlot src={restaurant.images.hero} alt={restaurant.name} />
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, pointerEvents: "none", flexWrap: "wrap" }}>
          {restaurant.partnered && <span style={{ background: "#131316", color: "#FFFFFF", borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600 }}>Partnered</span>}
          <span style={{ background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600 }}>{restaurant.rating} ★ · {restaurant.reviewCount} reviews</span>
        </div>
      </Link>
      <div style={{ padding: "12px 20px 12px 4px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#E2761B" }}>Featured · {restaurant.cityName}</div>
        <h2 style={{ margin: "10px 0 0", fontSize: 44, lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 700 }}>{restaurant.name}</h2>
        <div style={{ fontSize: 14, color: "#77778A", marginTop: 8 }}>{restaurant.cuisine} · {restaurant.city}</div>
        <p style={{ margin: "14px 0 0", fontSize: 16, lineHeight: 1.6, color: "#55555F", maxWidth: "46ch" }}>{restaurant.description}</p>
        <div style={{ marginTop: 12, fontSize: 13, color: "#8F909C" }}>{restaurant.address}</div>
        {restaurant.offer && (
          <div style={{ marginTop: 20, background: "#FFF1E3", borderRadius: 20, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: "#B45C0E", fontWeight: 600 }}>{restaurant.offer.badge}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 3, letterSpacing: "-0.02em" }}>{restaurant.offer.cardTitle}</div>
            </div>
            <span style={{ fontSize: 12, color: "#8A6A46", textAlign: "right" }}>{restaurant.offer.note}</span>
          </div>
        )}
        <div style={{ marginTop: 22, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <Link to={`/restaurant/${restaurant.slug}`} className="btn-dark pill" style={{ background: "#131316", color: "#FFFFFF", borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600 }}>
            View restaurant
          </Link>
          <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="btn-outline pill" style={{ border: "1px solid #E6E7EE", background: "#FFFFFF", borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600, color: "#111112" }}>
            Get directions
          </a>
          <button type="button" onClick={toggleSave} style={{
            background: saved ? "#EAF6EE" : "#FFFFFF",
            border: `1px solid ${saved ? "#CDE6D8" : "#E6E7EE"}`,
            color: saved ? "#2F7A4C" : "#111112",
            borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>
            {saved ? "✓ Saved" : "Save restaurant"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ListingCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant.slug}`} style={{ display: "block", background: "#FFFFFF", border: "1px solid #ECEDF2", borderRadius: 28, padding: 14, color: "#111112" }}>
      <div style={{ position: "relative", height: 220, borderRadius: 20, overflow: "hidden", background: "#F0F1F5" }}>
        <ImageSlot src={restaurant.images.card} alt={restaurant.name} />
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {restaurant.partnered && <span style={{ background: "#131316", color: "#FFFFFF", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 600 }}>Partnered</span>}
          {restaurant.offer && <span style={{ background: "#F5A04A", color: "#2A1B06", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 700 }}>Offer</span>}
        </div>
      </div>
      <div style={{ padding: "20px 10px 8px" }}>
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>{restaurant.name}</h3>
        <div style={{ fontSize: 13, color: "#77778A", marginTop: 6 }}>{restaurant.cuisine} · {restaurant.city}</div>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.55, color: "#55555F" }}>{restaurant.blurb}</p>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <span style={{ background: restaurant.offer ? "#FFF1E3" : "#EAF6EE", color: restaurant.offer ? "#B45C0E" : "#2F7A4C", borderRadius: 999, padding: "7px 13px", fontSize: 12, fontWeight: 600 }}>
            {restaurant.offer?.cardTitle || `${restaurant.rating} ★`}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>View →</span>
        </div>
      </div>
    </Link>
  );
}
