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
  const [offerSaved, setOfferSaved] = useState(false);
  const [cat, setCat] = useState(restaurant?.defaultCat || "Mains");

  const categories = useMemo(() => (restaurant ? Object.keys(restaurant.menu) : []), [restaurant]);
  const items = restaurant?.menu[cat] || restaurant?.menu[categories[0]] || [];
  const half = Math.ceil(items.length / 2);

  if (!restaurant) return <Navigate to="/explore" replace />;

  const related = restaurant.related.map(getRestaurant).filter(Boolean);
  const coming = restaurant.status === "coming";

  const tab = (active) => ({
    background: active ? "#131316" : "#F5F6F9",
    color: active ? "#FFFFFF" : "#4A4A55",
    border: `1px solid ${active ? "#131316" : "#ECEDF2"}`,
    borderRadius: 999,
    padding: "11px 20px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background .18s ease, color .18s ease",
  });

  return (
    <div className="page">
      <div className="hero-wash">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 60% at 80% 0%, #FFE7D2 0%, rgba(255,231,210,0) 60%), radial-gradient(60% 60% at 10% 6%, #E4EBFF 0%, rgba(228,235,255,0) 62%), linear-gradient(180deg,#F5F7FF 0%, #FFFFFF 88%)" }} />

        <Navbar
          variant="restaurant"
          cta={
            <button type="button" onClick={toggleSave} style={{
              background: saved ? "#F5A04A" : "#FFFFFF",
              color: "#111112",
              border: "none",
              borderRadius: 999,
              padding: "12px 26px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}>
              {saved ? "✓ Saved" : "Save restaurant"}
            </button>
          }
        />

        <section className="wrap" style={{ position: "relative", padding: "26px 28px 0" }}>
          <div style={{ fontSize: 13, color: "#8F909C" }}>
            <Link to="/" className="muted-link">Home</Link> / <Link to="/explore" className="muted-link">Explore</Link> / <span style={{ color: "#111112" }}>{restaurant.name}</span>
          </div>
          <div className="grid-split" style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 28, alignItems: "stretch" }}>
            <div style={{ position: "relative", height: 520, borderRadius: 32, overflow: "hidden", background: "#F0F1F5" }}>
              <ImageSlot src={restaurant.images.hero} alt={restaurant.name} />
              <div style={{ position: "absolute", top: 20, left: 20, display: "flex", gap: 8, pointerEvents: "none", flexWrap: "wrap" }}>
                {coming && <span style={{ background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "9px 16px", fontSize: 12, fontWeight: 600 }}>Coming soon</span>}
                {restaurant.partnered && <span style={{ background: "#131316", color: "#FFFFFF", borderRadius: 999, padding: "9px 16px", fontSize: 12, fontWeight: 600 }}>Partnered</span>}
                {restaurant.rating && <span style={{ background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "9px 16px", fontSize: 12, fontWeight: 600 }}>{restaurant.rating} ★ · {restaurant.reviewCount}</span>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: coming ? "#FFF1E3" : "#EAF6EE", color: coming ? "#B45C0E" : "#2F7A4C", borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600, width: "max-content" }}>
                {coming ? "Opening soon · date coming soon" : `Open · ${restaurant.hours?.[0]?.value || "See hours below"}`}
              </div>
              <h1 style={{ margin: "16px 0 0", fontSize: 64, lineHeight: 0.98, letterSpacing: "-0.045em", fontWeight: 700 }}>
                {restaurant.lead} <span className="italic">{restaurant.italic}</span>
              </h1>
              <div style={{ fontSize: 15, color: "#77778A", marginTop: 12 }}>{restaurant.cuisine} · {restaurant.city}</div>
              <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.65, color: "#55555F", maxWidth: "42ch" }}>{restaurant.description}</p>
              <div style={{ marginTop: 10, fontSize: 14, color: "#8F909C" }}>{restaurant.address}</div>
              <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button type="button" onClick={toggleSave} style={{
                  background: saved ? "#EAF6EE" : "#131316",
                  color: saved ? "#2F7A4C" : "#FFFFFF",
                  border: `1px solid ${saved ? "#CDE6D8" : "#131316"}`,
                  borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>
                  {saved ? "✓ Saved" : "Save restaurant"}
                </button>
                <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="btn-outline pill" style={{ border: "1px solid #E6E7EE", background: "#FFFFFF", borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600, color: "#111112" }}>
                  Get directions
                </a>
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} className="btn-outline pill" style={{ border: "1px solid #E6E7EE", background: "#FFFFFF", borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600, color: "#111112" }}>
                    Call
                  </a>
                )}
              </div>
              <div className="grid-3" style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, height: 92 }}>
                {restaurant.images.thumbs.map((src) => (
                  <div key={src} style={{ borderRadius: 18, overflow: "hidden", background: "#F0F1F5" }}>
                    <ImageSlot src={src} alt="" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="wrap" style={{ position: "relative", padding: "36px 28px 56px" }}>
          <div className="grid-facts" style={{ background: "#FFFFFF", border: "1px solid #ECEDF2", borderRadius: 28, padding: 8, display: "grid", gridTemplateColumns: "repeat(5,1fr)", boxShadow: "0 30px 60px -50px rgba(20,20,40,.5)" }}>
            {[
              ["Location", restaurant.city],
              ["Cuisine", restaurant.cuisineFull],
              ["Status", coming ? "Opening soon" : "Open"],
              ["Rating", restaurant.rating ? `${restaurant.rating} ★` : "Not rated"],
              ["Phone", restaurant.phone || "—"],
            ].map(([label, value], i) => (
              <div key={label} style={{ padding: "20px 22px", borderLeft: i ? "1px solid #F1F2F6" : undefined }}>
                <div style={{ fontSize: 12, color: "#8F909C" }}>{label}</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginTop: 7, color: label === "Status" && coming ? "#B45C0E" : undefined }}>
                  {label === "Phone" && restaurant.phone ? (
                    <a href={`tel:${restaurant.phone}`} style={{ color: "#111112" }}>{value}</a>
                  ) : value}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {restaurant.offer && (
        <section className="wrap" style={{ padding: "24px 28px 0" }}>
          <div className="grid-split" data-offer="true" style={{ background: "#131316", borderRadius: 34, padding: 0, display: "grid", gridTemplateColumns: "1.1fr 0.9fr", overflow: "hidden", color: "#FFFFFF" }}>
            <div style={{ padding: "52px 48px" }}>
              <div style={{ display: "inline-flex", background: "rgba(245,160,74,.18)", color: "#F5A04A", borderRadius: 999, padding: "8px 16px", fontSize: 12, fontWeight: 600 }}>{restaurant.offer.badge}</div>
              <div style={{ fontSize: 66, lineHeight: 1, letterSpacing: "-0.045em", fontWeight: 700, marginTop: 22, color: "#FFFFFF" }}>
                {restaurant.offer.headline} <span className="italic" style={{ color: "#F5A04A" }}>{restaurant.offer.italic}</span>
              </div>
              <p style={{ margin: "20px 0 0", fontSize: 16, lineHeight: 1.65, color: "#B9B9C6", maxWidth: "44ch" }}>{restaurant.offer.detail}</p>
              <div style={{ marginTop: 30, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <button type="button" onClick={() => setOfferSaved((v) => !v)} style={{
                  background: offerSaved ? "transparent" : "#F5A04A",
                  color: offerSaved ? "#F5A04A" : "#2A1B06",
                  border: "1px solid #F5A04A",
                  borderRadius: 999, padding: "15px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>
                  {offerSaved ? "✓ Offer saved" : "Save offer"}
                </button>
                <span style={{ fontSize: 13, color: "#8F909C" }}>{offerSaved ? "We'll notify you at launch" : "Terms coming soon"}</span>
              </div>
            </div>
            <div style={{ position: "relative", minHeight: 340 }}>
              <ImageSlot src={restaurant.images.offer} alt="Offer dish" />
            </div>
          </div>
        </section>
      )}

      <section id="menu" className="wrap" style={{ padding: "96px 28px 0" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: 48, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700 }}>
            What's on the <span className="italic">menu</span>
          </h2>
          <p style={{ margin: "12px 0 0", fontSize: 15, color: "#8F909C" }}>Preview menu. Full menu and prices coming soon.</p>
        </div>

        <div className="ds-rail" style={{ marginTop: 28, display: "flex", gap: 10, overflowX: "auto", justifyContent: "center" }}>
          {categories.map((label) => (
            <button key={label} type="button" onClick={() => setCat(label)} style={tab(cat === label)}>
              {label}
            </button>
          ))}
        </div>

        <div className="grid-menu" style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", gap: 28, alignItems: "start" }}>
          {[items.slice(0, half), items.slice(half)].map((col, i) => (
            <div key={i} style={{ background: "#FAFAFD", border: "1px solid #ECEDF2", borderRadius: 28, padding: "10px 24px" }}>
              {col.map((dish) => (
                <div key={dish.name} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "baseline", padding: "18px 0", borderBottom: "1px solid #EFF0F4" }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em" }}>{dish.name}</div>
                    <div style={{ fontSize: 14, color: "#77778A", marginTop: 5, lineHeight: 1.5 }}>{dish.desc}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#9A9AA6", whiteSpace: "nowrap" }}>{dish.price}</div>
                </div>
              ))}
            </div>
          ))}
          <div>
            <div style={{ height: 300, borderRadius: 28, overflow: "hidden", background: "#F0F1F5" }}>
              <ImageSlot src={restaurant.images.menu} alt="Menu highlight" />
            </div>
            <div style={{ background: "#EAF6EE", borderRadius: 24, padding: 22, marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#2F7A4C" }}>Good to know</div>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.6, color: "#3F5A4B" }}>
                Dishes and prices are illustrative for this prototype. Vegetarian and spice-level marks will be published with the final menu.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: "100px 28px 0" }}>
        <div className="grid-split" style={{ background: "#F6F7FB", borderRadius: 34, padding: 20, display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 36, alignItems: "center" }}>
          <div style={{ height: 360, borderRadius: 26, overflow: "hidden", background: "#F0F1F5" }}>
            <ImageSlot src={restaurant.images.about} alt="Kitchen" />
          </div>
          <div style={{ padding: "20px 28px 20px 0" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#8F909C" }}>About the restaurant</div>
            <p style={{ margin: "16px 0 0", fontFamily: "'Instrument Serif', serif", fontSize: 36, lineHeight: 1.25 }}>{restaurant.description}</p>
            <div className="grid-3" style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              <Fact label="Partnership" value={restaurant.partnership || "Independent"} muted={!restaurant.partnership} />
              <Fact label="Reviews" value={restaurant.reviewCount ? `${restaurant.reviewCount}` : "—"} />
              <Fact label="Rating" value={restaurant.rating ? `${restaurant.rating} ★` : "Not yet rated"} muted={!restaurant.rating} />
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="wrap" style={{ padding: "100px 28px 0" }}>
        <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "1fr 0.72fr", gap: 26, alignItems: "stretch" }}>
          <a
            href={restaurant.mapsUrl}
            target="_blank"
            rel="noreferrer"
            style={{ position: "relative", minHeight: 420, borderRadius: 32, overflow: "hidden", background: "#EDEFF5", border: "1px solid #ECEDF2", display: "block", color: "#111112" }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#E2E5EE 1px,transparent 1px),linear-gradient(90deg,#E2E5EE 1px,transparent 1px)", backgroundSize: "58px 58px" }} />
            <div style={{ position: "absolute", top: "48%", left: "46%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <span style={{ width: 20, height: 20, background: "#E2761B", borderRadius: "50%", border: "5px solid #FFFFFF", boxShadow: "0 8px 20px -8px rgba(0,0,0,.4)", display: "block" }} />
              <span style={{ background: "#131316", color: "#FFFFFF", borderRadius: 999, fontSize: 12, fontWeight: 600, padding: "9px 16px" }}>{restaurant.name}</span>
              <span style={{ background: "#FFFFFF", borderRadius: 999, fontSize: 12, fontWeight: 600, padding: "8px 14px", border: "1px solid #ECEDF2" }}>Open in Google Maps →</span>
            </div>
            <div style={{ position: "absolute", bottom: 16, left: 18, fontSize: 12, color: "#9A9AA6" }}>
              {restaurant.lat && restaurant.lng ? `${restaurant.lat.toFixed(4)}, ${restaurant.lng.toFixed(4)}` : "Map"}
            </div>
          </a>
          <div style={{ background: "#FAFAFD", border: "1px solid #ECEDF2", borderRadius: 32, padding: 30 }}>
            <h2 style={{ margin: 0, fontSize: 32, letterSpacing: "-0.04em", fontWeight: 700 }}>Location & hours</h2>
            <div style={{ marginTop: 20 }}>
              <div style={{ padding: "14px 0", borderBottom: "1px solid #EFF0F4" }}>
                <div style={{ fontSize: 12, color: "#8F909C" }}>Address</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, lineHeight: 1.5 }}>
                  {restaurant.address || restaurant.city}
                </div>
              </div>
              {(restaurant.hours || []).map((row) => (
                <div key={row.day} style={{ padding: "14px 0", borderBottom: "1px solid #EFF0F4", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontSize: 15 }}>{row.day}</span>
                  <span style={{ fontSize: 15, color: "#77778A", textAlign: "right" }}>{row.value}</span>
                </div>
              ))}
              <div style={{ padding: "14px 0", borderBottom: "1px solid #EFF0F4", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 15 }}>Phone</span>
                {restaurant.phone ? (
                  <a href={`tel:${restaurant.phone}`} style={{ fontSize: 15, color: "#111112", fontWeight: 600 }}>{restaurant.phone}</a>
                ) : (
                  <span style={{ fontSize: 15, color: "#77778A" }}>—</span>
                )}
              </div>
              <div style={{ padding: "14px 0", display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 15 }}>Website</span>
                {restaurant.website ? (
                  <a href={restaurant.website} target="_blank" rel="noreferrer" style={{ fontSize: 15, color: "#E2761B", fontWeight: 600 }}>Visit site →</a>
                ) : (
                  <span style={{ fontSize: 15, color: "#77778A" }}>—</span>
                )}
              </div>
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href={restaurant.directionsUrl} target="_blank" rel="noreferrer" className="btn-dark pill" style={{ display: "inline-block", background: "#131316", color: "#FFFFFF", borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600 }}>
                Get directions →
              </a>
              <a href={restaurant.sourceUrl} target="_blank" rel="noreferrer" className="btn-outline pill" style={{ display: "inline-block", border: "1px solid #E6E7EE", background: "#FFFFFF", borderRadius: 999, padding: "15px 26px", fontSize: 14, fontWeight: 600, color: "#111112" }}>
                Source listing →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ padding: "100px 28px 96px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 40, letterSpacing: "-0.04em", fontWeight: 700 }}>
            You might also <span className="italic">like</span>
          </h2>
          <Link to="/explore" className="btn-soft pill" style={{ background: "#F5F6F9", borderRadius: 999, padding: "12px 22px", fontSize: 14, fontWeight: 600 }}>
            All restaurants →
          </Link>
        </div>
        <div className="grid-4" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {related.map((item) => (
            <Link key={item.slug} to={`/restaurant/${item.slug}`} style={{ display: "block", background: "#FFFFFF", border: "1px solid #ECEDF2", borderRadius: 26, padding: 12, color: "#111112" }}>
              <div style={{ height: 190, borderRadius: 18, overflow: "hidden", background: "#F0F1F5" }}>
                <ImageSlot src={item.images.card} alt={item.name} />
              </div>
              <div style={{ padding: "16px 8px 6px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em" }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#77778A", marginTop: 4 }}>{item.cuisine} · {item.city}</div>
                <span style={{
                  display: "inline-block", marginTop: 10, borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600,
                  background: item.offer ? "#FFF1E3" : "#F5F6F9",
                  color: item.offer ? "#B45C0E" : "#111112",
                }}>
                  {item.offer?.cardTitle || (item.status === "coming" ? "Coming soon" : "Open")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer links={[{ to: "/", label: "Home" }, { to: "/explore", label: "Explore" }]} />
    </div>
  );
}

function Fact({ label, value, muted }) {
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 20, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: "#8F909C" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, marginTop: 5, color: muted ? "#77778A" : undefined }}>{value}</div>
    </div>
  );
}
