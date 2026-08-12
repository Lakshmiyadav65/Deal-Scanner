import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ImageSlot from "../components/ImageSlot.jsx";
import Navbar from "../components/Navbar.jsx";
import { getRestaurant } from "../data/restaurants.js";
import { useSaved } from "../hooks/useSaved.js";

export default function Restaurant() {
  const { slug } = useParams();
  const restaurant = getRestaurant(slug);
  const [saved, toggleSave] = useSaved(restaurant?.slug || slug);
  const [copied, setCopied] = useState(null);

  const items = useMemo(() => {
    if (!restaurant) return [];
    return restaurant.menu[restaurant.defaultCat] || Object.values(restaurant.menu)[0] || [];
  }, [restaurant]);
  const half = Math.ceil(items.length / 2);

  if (!restaurant) return <Navigate to="/explore" replace />;

  const related = restaurant.related.map(getRestaurant).filter(Boolean);
  const deals = restaurant.deals;

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="page">
      <Navbar
        variant="restaurant"
        cta={
          <button type="button" onClick={toggleSave} className={saved ? "btn btn-line btn-sm" : "btn btn-accent btn-sm"}>
            {saved ? "✓ Saved" : "Save"}
          </button>
        }
      />

      <section className="wrap" style={{ position: "relative", padding: "26px 28px 0" }}>
        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
          <Link to="/" style={{ color: "var(--ink-3)" }}>Home</Link>
          {" / "}
          <Link to="/explore" style={{ color: "var(--ink-3)" }}>Places</Link>
          {" / "}
          <span style={{ color: "var(--ink)" }}>{restaurant.name}</span>
        </div>

        <div className="grid-split" style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 28, alignItems: "stretch" }}>
          <div style={{ position: "relative", height: 500, borderRadius: "var(--r-panel)", overflow: "hidden", background: "var(--surface-3)" }}>
            <ImageSlot src={restaurant.images.hero} alt={restaurant.name} eager />
            <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {deals.length > 0 && <span className="badge badge-deal">{deals.length} {deals.length === 1 ? "deal" : "deals"}</span>}
              {restaurant.partnered && <span className="badge badge-float">Partner</span>}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="status">
              {restaurant.hours?.[0]?.value ? `Open today · ${restaurant.hours[0].value}` : "See hours below"}
            </div>
            <h1 style={{ margin: "12px 0 0", fontSize: 60, lineHeight: 0.98, letterSpacing: "-0.045em", fontWeight: 700 }}>
              {restaurant.lead} <span className="italic">{restaurant.italic}</span>
            </h1>
            <div style={{ fontSize: 15, color: "var(--ink-3)", marginTop: 12 }}>
              {restaurant.cuisine} · {restaurant.city} · {restaurant.rating} ★
            </div>
            <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)", maxWidth: "42ch" }}>{restaurant.description}</p>
            <div style={{ marginTop: 10, fontSize: 14, color: "var(--ink-3)" }}>{restaurant.address}</div>

            <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {deals.length > 0 && <a href="#deals" className="btn btn-accent">See {deals.length === 1 ? "the deal" : `all ${deals.length} deals`}</a>}
              <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="btn btn-line">Directions</a>
              {restaurant.phone && <a href={`tel:${restaurant.phone}`} className="btn btn-line">Call</a>}
            </div>

            <div className="grid-3" style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, height: 88 }}>
              {restaurant.images.thumbs.map((src, i) => (
                <div key={i} style={{ borderRadius: 14, overflow: "hidden", background: "var(--surface-3)" }}>
                  <ImageSlot src={src} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="deals" className="wrap" style={{ padding: "88px 28px 0" }}>
        {deals.length > 0 ? (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 46, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700 }}>
                  Deals and <span className="italic">coupons</span>
                </h2>
                <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--ink-3)", maxWidth: "56ch" }}>
                  Prototype offers for this demo. Confirm terms with {restaurant.shortName} before you order.
                </p>
              </div>
              <span className="status">{deals.length} live {deals.length === 1 ? "deal" : "deals"}</span>
            </div>

            <div className="grid-deals" style={{ marginTop: 28, display: "grid", gridTemplateColumns: deals.length > 1 ? "repeat(2,1fr)" : "1fr", gap: 20 }}>
              {deals.map((deal) => (
                <article key={deal.code} className="card" style={{ display: "grid", gridTemplateColumns: "190px 1fr", alignItems: "stretch" }}>
                  <div className="card-media" style={{ minHeight: 210 }}>
                    <ImageSlot src={deal.image} alt={`${deal.value} at ${restaurant.name}`} />
                  </div>
                  <div style={{ padding: "22px 22px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05 }}>{deal.value}</div>
                      <div style={{ fontSize: 16, color: "var(--ink-2)", marginTop: 4 }}>{deal.title}</div>
                      <p style={{ margin: "12px 0 0", fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-3)" }}>{deal.terms}</p>
                    </div>
                    <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span className="coupon">{deal.code}</span>
                      <button type="button" className="btn btn-line btn-sm" onClick={() => copyCode(deal.code)}>
                        {copied === deal.code ? "✓ Copied" : "Copy code"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div style={{ background: "var(--surface-2)", border: "1px solid var(--line)", borderRadius: "var(--r-panel)", padding: "44px 40px", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em" }}>No live deal here today</h2>
            <p style={{ margin: "10px auto 0", fontSize: 15, color: "var(--ink-3)", maxWidth: "46ch" }}>
              We are still tracking {restaurant.shortName}. Save it and check back, or see who is running an offer nearby.
            </p>
            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <button type="button" onClick={toggleSave} className={saved ? "btn btn-line" : "btn btn-ink"}>
                {saved ? "✓ Saved" : "Save restaurant"}
              </button>
              <Link to={`/explore?q=${encodeURIComponent(restaurant.cityName)}&filter=Deals`} className="btn btn-line">
                Deals in {restaurant.cityName}
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="wrap" style={{ padding: "60px 28px 0" }}>
        <div className="grid-facts" style={{ border: "1px solid var(--line)", borderRadius: "var(--r-panel)", display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
          {[
            ["Location", restaurant.city],
            ["Cuisine", restaurant.cuisineFull],
            ["Rating", restaurant.rating ? `${restaurant.rating} ★` : "Not rated"],
            ["Reviews", restaurant.reviewCount ? `${restaurant.reviewCount}` : "Not listed"],
            ["Phone", restaurant.phone || "Not listed"],
          ].map(([label, value], i) => (
            <div key={label} style={{ padding: "20px 22px", borderLeft: i ? "1px solid var(--line-soft)" : undefined }}>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>
                {label === "Phone" && restaurant.phone ? <a href={`tel:${restaurant.phone}`}>{value}</a> : value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="menu" className="wrap" style={{ padding: "88px 28px 0" }}>
        <h2 style={{ margin: 0, fontSize: 46, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700 }}>
          What is on the <span className="italic">menu</span>
        </h2>
        <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--ink-3)" }}>Preview only. Full menu and prices come from the restaurant.</p>

        <div className="grid-menu" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", gap: 24, alignItems: "start" }}>
          {[items.slice(0, half), items.slice(half)].map((col, i) => (
            <div key={i} style={{ border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: "6px 22px" }}>
              {col.map((dish) => (
                <div key={dish.name} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "baseline", padding: "18px 0", borderBottom: "1px solid var(--line-soft)" }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>{dish.name}</div>
                    <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>{dish.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", whiteSpace: "nowrap" }}>{dish.price}</div>
                </div>
              ))}
            </div>
          ))}
          <div>
            <div style={{ height: 270, borderRadius: "var(--r-card)", overflow: "hidden", background: "var(--surface-3)" }}>
              <ImageSlot src={restaurant.images.menu} alt="Dish from the menu" />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: "88px 28px 0" }}>
        <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 32, alignItems: "center" }}>
          <div style={{ height: 340, borderRadius: "var(--r-panel)", overflow: "hidden", background: "var(--surface-3)" }}>
            <ImageSlot src={restaurant.images.about} alt="Dining room" />
          </div>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>About the restaurant</div>
            <p style={{ margin: "14px 0 0", fontFamily: "'Instrument Serif', serif", fontSize: 34, lineHeight: 1.28 }}>{restaurant.description}</p>
            <div className="grid-3" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              <Fact label="Partnership" value={restaurant.partnership || "Independent"} />
              <Fact label="Live deals" value={`${deals.length}`} />
              <Fact label="Area" value={restaurant.cityName} />
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="wrap" style={{ padding: "88px 28px 0" }}>
        <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "1fr 0.72fr", gap: 24, alignItems: "stretch" }}>
          <a
            href={restaurant.mapsUrl}
            target="_blank"
            rel="noreferrer"
            style={{ position: "relative", minHeight: 400, borderRadius: "var(--r-panel)", overflow: "hidden", background: "var(--surface-2)", border: "1px solid var(--line)", display: "block" }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#E9EAF0 1px,transparent 1px),linear-gradient(90deg,#E9EAF0 1px,transparent 1px)", backgroundSize: "58px 58px" }} />
            <div style={{ position: "absolute", top: "48%", left: "46%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <span style={{ width: 18, height: 18, background: "var(--accent)", borderRadius: "50%", border: "5px solid #FFFFFF", boxShadow: "0 8px 20px -8px rgba(0,0,0,.4)", display: "block" }} />
              <span className="badge badge-ink">{restaurant.name}</span>
              <span className="badge badge-line">Open in Google Maps</span>
            </div>
          </a>

          <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-panel)", padding: 28 }}>
            <h2 style={{ margin: 0, fontSize: 30, letterSpacing: "-0.04em", fontWeight: 700 }}>Location and hours</h2>
            <div style={{ marginTop: 18 }}>
              <div style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)" }}>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Address</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 5, lineHeight: 1.5 }}>{restaurant.address || restaurant.city}</div>
              </div>
              {(restaurant.hours || []).map((row) => (
                <div key={row.day} style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 14.5 }}>{row.day}</span>
                  <span style={{ fontSize: 14.5, color: "var(--ink-3)", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ padding: "12px 0", borderBottom: "1px solid var(--line-soft)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14.5 }}>Phone</span>
                {restaurant.phone ? (
                  <a href={`tel:${restaurant.phone}`} style={{ fontSize: 14.5, fontWeight: 600 }}>{restaurant.phone}</a>
                ) : (
                  <span style={{ fontSize: 14.5, color: "var(--ink-3)" }}>Not listed</span>
                )}
              </div>
              <div style={{ padding: "12px 0", display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 14.5 }}>Website</span>
                {restaurant.website ? (
                  <a href={restaurant.website} target="_blank" rel="noreferrer" style={{ fontSize: 14.5, color: "var(--accent)", fontWeight: 600 }}>Visit site</a>
                ) : (
                  <span style={{ fontSize: 14.5, color: "var(--ink-3)" }}>Not listed</span>
                )}
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="btn btn-ink">Get directions</a>
              <a href={restaurant.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-line">Source listing</a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: "88px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 38, letterSpacing: "-0.04em", fontWeight: 700 }}>
            More deals <span className="italic">nearby</span>
          </h2>
          <Link to={`/explore?q=${encodeURIComponent(restaurant.cityName)}`} className="btn btn-line btn-sm">
            All of {restaurant.cityName}
          </Link>
        </div>
        <div className="grid-4" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
          {related.map((item) => (
            <Link key={item.slug} to={`/restaurant/${item.slug}`} className="card">
              <div className="card-media" style={{ height: 170 }}>
                <ImageSlot src={item.images.card} alt={item.name} />
                {item.topDeal && <span className="badge badge-deal" style={{ position: "absolute", top: 12, left: 12 }}>{item.topDeal.value}</span>}
              </div>
              <div style={{ padding: "16px 16px 18px" }}>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.03em" }}>{item.shortName}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>{item.cuisine} · {item.city}</div>
                <div className="status" style={{ marginTop: 10 }}>
                  {item.topDeal ? item.topDeal.title : `${item.rating} ★ · ${item.reviewCount} reviews`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer links={[{ to: "/", label: "Home" }, { to: "/explore", label: "Places" }]} />
    </div>
  );
}

function Fact({ label, value }) {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  );
}
