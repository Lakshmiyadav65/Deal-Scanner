import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ImageSlot from "../components/ImageSlot.jsx";
import Navbar from "../components/Navbar.jsx";
import { cities, getRestaurant, restaurants } from "../data/restaurants.js";

const statuses = ["Any status", "Coming soon", "Partnered", "Has an offer"];
const trending = ["Biryani", "Hyderabadi", "Vegetarian", "South Indian", "North Indian"];
const ticker = restaurants.slice(0, 7).map((r) => r.name);

export default function Home() {
  const navigate = useNavigate();
  const railRef = useRef(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Fort Worth");
  const [status, setStatus] = useState("Any status");
  const [picker, setPicker] = useState(null);

  const pickerItems = picker === "loc" ? cities : picker === "status" ? statuses : [];

  const goExplore = (extra = {}) => {
    const params = new URLSearchParams();
    const q = extra.query ?? query;
    const loc = extra.location ?? location;
    const st = extra.status ?? status;
    if (q) params.set("q", q);
    if (loc) params.set("city", loc);
    if (st && st !== "Any status") params.set("status", st);
    navigate(`/explore${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="page">
      <div className="hero-wash">
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 55% at 12% 8%, #DCE7FF 0%, rgba(220,231,255,0) 60%), radial-gradient(55% 50% at 88% 6%, #FFE7D2 0%, rgba(255,231,210,0) 62%), radial-gradient(70% 60% at 50% 100%, #FDE2E4 0%, rgba(253,226,228,0) 65%), linear-gradient(180deg,#F3F6FF 0%, #FFFFFF 78%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#C9CEDD 1px, transparent 1px)", backgroundSize: "26px 26px", opacity: 0.35 }} />

        <Navbar
          cta={
            <Link to="/explore" className="btn-start pill" style={{ background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "12px 26px", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
              Get started
            </Link>
          }
        />

        <section className="wrap section-pad" style={{ position: "relative", padding: "78px 28px 0", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "rgba(255,255,255,.75)", border: "1px solid #E6E7EE", borderRadius: 999, padding: "7px 16px", fontSize: 13, color: "#4A4A55", maxWidth: "100%" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3FA663", display: "inline-block", flexShrink: 0 }} />
            16 kitchens tracked around North Texas
          </div>
          <h1 style={{ margin: "22px 0 0", fontSize: 86, lineHeight: 0.98, letterSpacing: "-0.045em", fontWeight: 700, textWrap: "balance" }}>
            Something good is coming
            <span className="hero-avatars">
              {["https://loremflickr.com/300/300/biryani?lock=11", "https://loremflickr.com/300/300/dosa?lock=12", "https://loremflickr.com/300/300/chai,tea?lock=13"].map((src) => (
                <span key={src} className="hero-avatar">
                  <ImageSlot src={src} alt="" shape="circle" />
                </span>
              ))}
            </span>
            to your <span className="italic" style={{ letterSpacing: "-0.01em" }}> neighborhood.</span>
          </h1>
          <p style={{ margin: "24px auto 0", maxWidth: "60ch", fontSize: 17, lineHeight: 1.6, color: "#55555F", padding: "0 4px" }}>
            Discover upcoming restaurants, local favorites and offers worth stepping out for.
          </p>
          <div className="mobile-stack" style={{ marginTop: 30, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <Link to="/explore" className="btn-dark pill mobile-full" style={{ background: "#131316", color: "#FFFFFF", borderRadius: 999, padding: "17px 34px", fontSize: 15, fontWeight: 600 }}>
              Explore restaurants
            </Link>
            <a href="#upcoming" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, color: "#131316" }}>
              See upcoming openings →
            </a>
          </div>

          <div className="search-panel">
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>What are you hungry for?</div>
            <div className="grid-search" style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr auto", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F5F6F9", borderRadius: 999, padding: "0 20px", height: 58, minWidth: 0 }}>
                <span style={{ color: "#8F909C", fontSize: 15 }}>⌕</span>
                <input
                  placeholder="Search restaurants, cuisines or dishes"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && goExplore()}
                  style={{ flex: 1, border: "none", outline: "none", background: "none", fontSize: 15, color: "#111112", height: 56, minWidth: 0, width: "100%" }}
                />
              </div>
              <button type="button" onClick={() => setPicker((p) => (p === "loc" ? null : "loc"))} style={pickerBtn}>
                {location}<span style={{ fontSize: 10, color: "#8F909C" }}>▼</span>
              </button>
              <button type="button" onClick={() => setPicker((p) => (p === "status" ? null : "status"))} style={pickerBtn}>
                {status}<span style={{ fontSize: 10, color: "#8F909C" }}>▼</span>
              </button>
              <button type="button" onClick={() => goExplore()} className="btn-dark pill" style={{ background: "#131316", color: "#FFFFFF", border: "none", borderRadius: 999, height: 58, padding: "0 34px", fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", width: "100%" }}>
                Find restaurants
              </button>
            </div>
            {picker && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, paddingTop: 14, borderTop: "1px solid #ECEDF2" }}>
                {pickerItems.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="chip"
                    onClick={() => {
                      if (picker === "loc") setLocation(label);
                      else setStatus(label);
                      setPicker(null);
                    }}
                    style={{ background: "#F5F6F9", border: "none", borderRadius: 999, padding: "9px 16px", fontSize: 13, color: "#111112", cursor: "pointer" }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#8F909C", marginRight: 4 }}>Trending</span>
              {trending.map((label) => (
                <button key={label} type="button" className="chip" onClick={() => setQuery(label)} style={{ background: "#F5F6F9", border: "1px solid #ECEDF2", borderRadius: 999, padding: "8px 15px", fontSize: 13, color: "#4A4A55", cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="wrap section-pad" style={{ position: "relative", padding: "44px 28px 64px" }}>
          <div style={{ textAlign: "center", fontSize: 13, color: "#8F909C", marginBottom: 22 }}>Loved by neighborhood kitchens across North Texas</div>
          <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" }}>
            <div className="ds-ticker">
              {[0, 1].map((copy) => (
                <div key={copy} style={{ display: "flex", gap: 56, paddingRight: 56 }}>
                  {ticker.map((name) => <span key={`${copy}-${name}`}>{name}</span>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="wrap section-pad" style={{ padding: "76px 28px 0" }}>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", textAlign: "center" }}>
          {[
            ["16", "Restaurants listed"],
            ["5", "Partner kitchens"],
            ["5", "Offers listed"],
          ].map(([n, label], i) => (
            <div key={label} style={{ padding: "0 12px", borderLeft: i === 1 ? "1px solid #ECEDF2" : undefined, borderRight: i === 1 ? "1px solid #ECEDF2" : undefined }}>
              <div className="stat-value">
                {n}<span style={{ fontSize: "0.4em", verticalAlign: "top", color: "#E2761B" }}>+</span>
              </div>
              <div style={{ fontSize: 14, color: "#77778A", marginTop: 10 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="upcoming" className="wrap section-pad" style={{ padding: "96px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700, maxWidth: "18ch" }}>
              Explore real <span className="italic">restaurants</span>
            </h2>
            <p style={{ margin: "14px 0 0", fontSize: 16, color: "#55555F" }}>Live listings from Fort Worth and nearby North Texas cities.</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn-soft" onClick={() => railRef.current?.scrollBy({ left: -400, behavior: "smooth" })} style={railBtn}>←</button>
            <button type="button" className="btn-soft" onClick={() => railRef.current?.scrollBy({ left: 400, behavior: "smooth" })} style={railBtn}>→</button>
          </div>
        </div>

        <div ref={railRef} className="ds-rail" style={{ marginTop: 36, display: "flex", gap: 22, overflowX: "auto", scrollBehavior: "smooth", paddingBottom: 10 }}>
          <UpcomingWide restaurant={getRestaurant("hyderabad-house")} />
          <UpcomingCard restaurant={getRestaurant("curry-cowboys")} />
          <UpcomingCard restaurant={getRestaurant("annampuram")} tint="#E9F2FF" border="#DCE7FA" badgeBg="#FFFFFF" />
          <UpcomingCard restaurant={getRestaurant("simply-south")} />
        </div>

        <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#8F909C" }}>Addresses and hours sourced from Indian Restaurants in USA.</span>
          <Link to="/explore" className="btn-soft pill" style={{ background: "#F5F6F9", borderRadius: 999, padding: "13px 24px", fontSize: 14, fontWeight: 600 }}>
            View all restaurants →
          </Link>
        </div>
      </section>

      <section id="partnered" className="wrap section-pad" style={{ padding: "110px 28px 0" }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: 48, lineHeight: 1.06, letterSpacing: "-0.04em", fontWeight: 700 }}>
            Upcoming partnered or <span className="italic">collaborated</span> restaurants
          </h2>
          <p style={{ margin: "14px 0 0", fontSize: 16, color: "#55555F" }}>Discover restaurants joining the Deal Scanner community through partnerships and collaborations.</p>
        </div>

        <div className="grid-split" style={{ marginTop: 44, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 22, alignItems: "stretch" }}>
          <Link to="/restaurant/hyderabad-house" className="keep-white" style={{ display: "block", position: "relative", borderRadius: 30, overflow: "hidden", minHeight: 520, color: "#FFFFFF" }}>
            <ImageSlot src={getRestaurant("hyderabad-house").images.partner} alt="Hyderabad House" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,10,16,.86) 0%,rgba(10,10,16,.15) 52%,rgba(10,10,16,.3) 100%)", pointerEvents: "none" }} />
            <span style={{ position: "absolute", top: 20, left: 20, background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "9px 16px", fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>Partnered · Launch partner</span>
            <div style={{ position: "absolute", inset: "auto 0 0 0", padding: 32, pointerEvents: "none" }}>
              <h3 style={{ margin: 0, fontSize: 44, fontWeight: 700, letterSpacing: "-0.04em", color: "#FFFFFF" }}>Hyderabad House</h3>
              <div style={{ fontSize: 15, color: "#D6D6E0", marginTop: 8 }}>Hyderabadi · Fort Worth, TX</div>
              <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(255,255,255,.16)", backdropFilter: "blur(6px)", borderRadius: 999, padding: "10px 16px", fontSize: 13, color: "#FFFFFF" }}>1901 Heritage Trace Pkwy</span>
                <span style={{ background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "10px 18px", fontSize: 13, fontWeight: 600 }}>View details →</span>
              </div>
            </div>
          </Link>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <PartnerRow slug="curry-cowboys" note="North Indian · Fort Worth, TX · Community partner" offer="15% off lunch" />
            <PartnerRow slug="annampuram" note="South Indian · Arlington, TX · Launch collaboration" offer="Free dessert offer" />
            <PartnerRow slug="simply-south" note="Vegetarian · Irving, TX · Community partner" offer="Pure veg kitchen" />
            <div style={{ background: "#F5F6F9", borderRadius: 24, padding: "20px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "#77778A", maxWidth: "34ch" }}>Partnership badges are Deal Scanner curated. Listings and addresses are real.</span>
              <Link to="/explore?status=Partnered" style={{ fontSize: 14, fontWeight: 600 }}>All partners →</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="offers" className="wrap section-pad" style={{ padding: "110px 28px 0" }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700 }}>
            Good food. <span className="italic" style={{ color: "#E2761B" }}>Better reasons to go.</span>
          </h2>
          <p style={{ margin: "14px 0 0", fontSize: 15, color: "#8F909C" }}>Illustrative offers shown for this prototype. Terms coming soon.</p>
        </div>

        <div className="grid-offers" style={{ marginTop: 44, display: "grid", gridTemplateColumns: "1.35fr 1fr 1fr", gap: 20 }}>
          <Link to="/restaurant/hyderabad-house" className="keep-white" style={{ gridRow: "span 2", position: "relative", borderRadius: 30, overflow: "hidden", minHeight: 520, display: "block", color: "#FFFFFF" }}>
            <ImageSlot src={getRestaurant("hyderabad-house").images.offerCard} alt="Hyderabad House" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,10,16,.88) 0%,rgba(10,10,16,0) 55%)", pointerEvents: "none" }} />
            <span style={{ position: "absolute", top: 20, left: 20, background: "#F5A04A", color: "#2A1B06", borderRadius: 999, padding: "12px 20px", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", pointerEvents: "none" }}>20% OFF</span>
            <div style={{ position: "absolute", inset: "auto 0 0 0", padding: 30, pointerEvents: "none" }}>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.03em", color: "#FFFFFF" }}>First visit</div>
              <div style={{ fontSize: 14, color: "#D6D6E0", marginTop: 6 }}>Hyderabad House · Fort Worth, TX</div>
              <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#C9C9D2" }}>
                <span>Ask in restaurant</span>
                <span style={{ background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "10px 18px", fontWeight: 600 }}>View offer →</span>
              </div>
            </div>
          </Link>

          <Link to="/restaurant/annampuram" style={{ background: "#EAF6EE", borderRadius: 26, padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 250, color: "#111112" }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "#2F7A4C" }}>Free dessert</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>With qualifying order</div>
              <div style={{ fontSize: 13, color: "#5E7A69", marginTop: 5 }}>Annampuram · Arlington, TX</div>
              <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600 }}>Confirm with restaurant · View →</div>
            </div>
          </Link>

          <Link to="/restaurant/saffron-kitchen" style={{ position: "relative", borderRadius: 26, overflow: "hidden", minHeight: 250, display: "block", color: "#111112" }}>
            <ImageSlot src={getRestaurant("saffron-kitchen").images.offerCard} alt="Saffron Kitchen" />
            <span style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "8px 14px", fontSize: 13, fontWeight: 700, pointerEvents: "none" }}>2 for 1</span>
            <div style={{ position: "absolute", inset: "auto 10px 10px", background: "#FFFFFF", borderRadius: 18, padding: "14px 16px" }}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>Selected appetizers</div>
              <div style={{ fontSize: 12, color: "#77778A", marginTop: 3 }}>Saffron Kitchen · Arlington, TX</div>
            </div>
          </Link>

          <Link to="/restaurant/curry-cowboys" style={{ background: "#FFF1E3", borderRadius: 26, padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 250, color: "#111112" }}>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", color: "#B45C0E" }}>15% off</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600 }}>Weekday lunch</div>
              <div style={{ fontSize: 13, color: "#8A6A46", marginTop: 5 }}>Curry Cowboys · Fort Worth, TX</div>
              <div style={{ marginTop: 16, fontSize: 13, fontWeight: 600 }}>Confirm with restaurant · View →</div>
            </div>
          </Link>

          <Link to="/explore?status=Offers" className="card-dark keep-white" style={{ background: "#131316", borderRadius: 26, padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 250, color: "#FFFFFF" }}>
            <div style={{ fontSize: 13, color: "#B9B9C6" }}>5 offers listed</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>See every offer near you</div>
              <div style={{ marginTop: 18, display: "inline-flex", background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "11px 20px", fontSize: 13, fontWeight: 600 }}>Browse offers →</div>
            </div>
          </Link>
        </div>
      </section>

      <section id="how" className="wrap section-pad" style={{ padding: "110px 28px 0", textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize: 48, lineHeight: 1.06, letterSpacing: "-0.04em", fontWeight: 700 }}>
          Where discovery <span className="italic">meets dinner</span>
        </h2>
        <div className="grid-4" style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, textAlign: "left" }}>
          {[
            ["01", "#E9F2FF", "#4E5566", "Discover", "Find restaurants and upcoming places around you."],
            ["02", "#F3ECFD", "#544E66", "Explore", "See menus, locations and restaurant information."],
            ["03", "#EAF6EE", "#4A5B50", "Save", "Keep track of restaurants and offers you want to try."],
            ["04", "#FFF1E3", "#6A553C", "Visit", "Go enjoy the restaurant."],
          ].map(([n, bg, color, title, copy]) => (
            <div key={n} style={{ background: bg, borderRadius: 26, padding: 26, minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ width: 38, height: 38, borderRadius: 999, background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{n}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>{title}</div>
                <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, color }}>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section-pad" style={{ padding: "110px 28px 96px" }}>
        <div className="grid-split panel-dark" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 40, alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 700, color: "#FFFFFF" }}>
              Your next favorite restaurant might be <span className="italic" style={{ color: "#F5A04A" }}>closer than you think.</span>
            </h2>
            <div className="mobile-stack" style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/explore" className="btn-start pill mobile-full" style={{ background: "#FFFFFF", color: "#111112", borderRadius: 999, padding: "16px 30px", fontSize: 15, fontWeight: 600 }}>Explore restaurants</Link>
              <a href="#upcoming" className="btn-ghost pill keep-white mobile-full" style={{ border: "1px solid #3A3A44", color: "#FFFFFF", borderRadius: 999, padding: "16px 30px", fontSize: 15, fontWeight: 600 }}>See upcoming openings</a>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ height: 180, borderRadius: 22, overflow: "hidden" }}><ImageSlot src="https://loremflickr.com/700/700/indian,thali?lock=51" alt="Table" /></div>
            <div style={{ height: 180, borderRadius: 22, overflow: "hidden", marginTop: 28 }}><ImageSlot src="https://loremflickr.com/700/700/restaurant,street?lock=52" alt="Street" /></div>
          </div>
        </div>
      </section>

      <Footer links={[{ to: "/explore", label: "Explore" }, { to: "/restaurant/hyderabad-house", label: "Restaurant detail" }, { to: "#offers", label: "Offers" }]} />
    </div>
  );
}

const pickerBtn = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#F5F6F9",
  border: "none",
  borderRadius: 999,
  height: 58,
  padding: "0 20px",
  fontSize: 15,
  color: "#111112",
  cursor: "pointer",
};

const railBtn = {
  width: 48,
  height: 48,
  borderRadius: 999,
  border: "1px solid #E6E7EE",
  background: "#FFFFFF",
  cursor: "pointer",
  fontSize: 15,
  color: "#111112",
};

function UpcomingWide({ restaurant }) {
  if (!restaurant) return null;
  return (
    <Link to={`/restaurant/${restaurant.slug}`} className="rail-card" style={{ flex: "0 0 560px", display: "block", background: "#FFFFFF", border: "1px solid #ECEDF2", borderRadius: 28, padding: 14, color: "#111112" }}>
      <div style={{ position: "relative", height: 340, borderRadius: 20, overflow: "hidden", background: "#F0F1F5" }}>
        <ImageSlot src={restaurant.images.card} alt={restaurant.name} />
        <span style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600, letterSpacing: "0.02em", pointerEvents: "none" }}>{restaurant.rating} ★</span>
        {restaurant.partnered && <span style={{ position: "absolute", top: 16, right: 16, background: "#131316", color: "#FFFFFF", borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>Partnered</span>}
      </div>
      <div style={{ padding: "22px 12px 10px", display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em" }}>{restaurant.name}</h3>
          <div style={{ fontSize: 14, color: "#77778A", marginTop: 7 }}>{restaurant.cuisine} · {restaurant.city}</div>
          <p style={{ margin: "12px 0 0", fontSize: 15, lineHeight: 1.6, color: "#55555F", maxWidth: "44ch" }}>{restaurant.blurb}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ background: "#EAF6EE", color: "#2F7A4C", borderRadius: 999, padding: "8px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>Open now</div>
          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600 }}>View restaurant →</div>
        </div>
      </div>
    </Link>
  );
}

function UpcomingCard({ restaurant, tint = "#FFFFFF", border = "#ECEDF2", badgeBg = "#EAF6EE" }) {
  if (!restaurant) return null;
  return (
    <Link to={`/restaurant/${restaurant.slug}`} className="rail-card" style={{ flex: "0 0 330px", display: "block", background: tint, border: `1px solid ${border}`, borderRadius: 28, padding: 14, color: "#111112" }}>
      <div style={{ position: "relative", height: 250, borderRadius: 20, overflow: "hidden", background: "#F0F1F5" }}>
        <ImageSlot src={restaurant.images.card} alt={restaurant.name} />
        <span style={{ position: "absolute", top: 14, left: 14, background: "rgba(255,255,255,.94)", borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>{restaurant.rating} ★</span>
      </div>
      <div style={{ padding: "20px 10px 8px" }}>
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>{restaurant.name}</h3>
        <div style={{ fontSize: 13, color: "#77778A", marginTop: 6 }}>{restaurant.cuisine} · {restaurant.city}</div>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.55, color: "#55555F" }}>{restaurant.blurb}</p>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
          <span style={{ background: badgeBg, color: "#2F7A4C", borderRadius: 999, padding: "7px 13px", fontWeight: 600 }}>Open now</span>
          <span style={{ fontWeight: 600 }}>View →</span>
        </div>
      </div>
    </Link>
  );
}

function PartnerRow({ slug, note, offer }) {
  const restaurant = getRestaurant(slug);
  return (
    <Link to={`/restaurant/${slug}`} className="partner-row">
      <div style={{ height: 104, borderRadius: 16, overflow: "hidden", background: "#F0F1F5" }}>
        <ImageSlot src={restaurant.images.partner} alt={restaurant.name} />
      </div>
      <div>
        <span style={{ background: "#EAF6EE", color: "#2F7A4C", borderRadius: 999, padding: "6px 12px", fontSize: 11, fontWeight: 600 }}>Partnered</span>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 9 }}>{restaurant.name}</div>
        <div style={{ fontSize: 13, color: "#77778A", marginTop: 4 }}>{note}</div>
        <div style={{ fontSize: 13, color: "#B45C0E", fontWeight: 600, marginTop: 6 }}>{offer}</div>
      </div>
      <div style={{ width: 38, height: 38, borderRadius: 999, background: "#F5F6F9", display: "flex", alignItems: "center", justifyContent: "center" }}>→</div>
    </Link>
  );
}
