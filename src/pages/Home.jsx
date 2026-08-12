import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import ImageSlot from "../components/ImageSlot.jsx";
import Navbar from "../components/Navbar.jsx";
import { freshLabel, maskCode } from "../data/deals.js";
import { editorial, slideUrl } from "../data/images.js";
import { categories } from "../data/categories.js";
import { cities, countInCategory, getRestaurant, restaurants } from "../data/restaurants.js";

const featured = "hyderabad-house";
const dealStrip = ["curry-cowboys", "annampuram", "saffron-kitchen", "kuppanna"];

// The step previews run on real data so they cannot drift from the product.
const claimDeal = getRestaurant(featured).topDeal;

// Every live deal becomes a slide, so the marquee is the deal list, not decoration.
const slides = restaurants
  .filter((r) => r.topDeal)
  .map((r) => ({ ...r.topDeal, name: r.shortName, city: r.city, slug: r.slug }));

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const search = (value = query) => {
    const q = value.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
  };

  return (
    <div className="page">
      <Navbar
        cta={
          <Link to="/explore" className="btn btn-accent btn-sm">
            Find deals
          </Link>
        }
      />

      <section className="wrap" style={{ position: "relative", padding: "44px 28px 34px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 72, lineHeight: 1.04, letterSpacing: "-0.045em", fontWeight: 700 }}>
          <span style={{ display: "block" }}>Every local deal near you,</span>
          <span className="italic" style={{ display: "block", letterSpacing: "-0.01em" }}>in one search.</span>
        </h1>

        <p className="hero-sub">
          Coupons and discounts from restaurants, grocery stores and shops near you.
        </p>

        <div style={{ maxWidth: 720, margin: "28px auto 0" }}>
          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              aria-label="City, neighborhood or place"
              placeholder="Enter a city, neighborhood or place name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <button type="button" className="btn btn-ink" onClick={() => search()} style={{ height: 50, padding: "0 28px" }}>
              Find deals
            </button>
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--ink-3)", marginRight: 2 }}>Popular areas</span>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                className="badge badge-line"
                onClick={() => search(city)}
                style={{ cursor: "pointer", fontWeight: 500, color: "var(--ink-2)" }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed so the loop reads as continuous rather than a boxed carousel. */}
      <section style={{ padding: "0 0 64px" }} aria-label="Live deals">
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((copy) => (
              <div className="marquee-group" key={copy} aria-hidden={copy === 1}>
                {slides.map((slide) => (
                  <Link key={`${copy}-${slide.code}`} to={`/restaurant/${slide.slug}`} className="deal-slide">
                    <ImageSlot src={slideUrl(slide.image)} alt="" eager />
                    <span className="deal-slide-scrim" />
                    <span className="deal-slide-body">
                      <span className="deal-slide-head">
                        <span className="deal-slide-value">{slide.value}</span>
                        <span className="deal-slide-fresh">{freshLabel(slide.postedMinutes)}</span>
                      </span>
                      <span className="deal-slide-title">{slide.title}</span>
                      <span className="deal-slide-foot">
                        <span className="deal-slide-meta">{slide.name}<br />{slide.city}</span>
                        <span className="coupon">{maskCode(slide.code)}</span>
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="deals" className="wrap" style={{ padding: "96px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 50, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700 }}>
              Deals on the table <span className="italic">right now</span>
            </h2>
            <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--ink-3)", maxWidth: "58ch" }}>
              Open a listing to reveal the full code.
            </p>
          </div>
          <Link to="/explore?filter=Deals" className="btn btn-line">See all deals</Link>
        </div>

        <div className="grid-deals" style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1.35fr 1fr 1fr", gridAutoRows: "auto", gap: 20 }}>
          <FeatureDeal slug={featured} />
          {dealStrip.map((slug) => <DealCard key={slug} slug={slug} />)}
        </div>
      </section>

      <section id="categories" className="wrap" style={{ padding: "104px 28px 0" }}>
        <h2 style={{ margin: 0, fontSize: 50, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700 }}>
          Deals across the <span className="italic">neighborhood</span>
        </h2>
        <p style={{ margin: "12px 0 0", fontSize: 16, color: "var(--ink-2)", maxWidth: "56ch" }}>
          Restaurants are live now. Groceries and local shops are next.
        </p>

        <div className="cats">
          {categories.map((cat) => {
            const count = countInCategory(cat.slug);
            return (
              <Link key={cat.slug} to={`/explore?category=${cat.slug}`} className="cat">
                <div className="cat-media">
                  <ImageSlot src={cat.image} alt="" />
                  <span className="cat-scrim" />
                  <span className={count > 0 ? "badge badge-deal cat-tag" : "badge badge-float cat-tag"}>
                    {count > 0 ? `${count} listed` : "Coming soon"}
                  </span>
                </div>
                <div className="cat-body">
                  <h3 className="cat-title">{cat.label}</h3>
                  <p className="cat-copy">{cat.blurb}</p>
                  <span className="cat-go">Browse {cat.label.toLowerCase()} &rarr;</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="how" className="wrap" style={{ padding: "104px 28px 0" }}>
        <h2 style={{ margin: 0, fontSize: 50, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700 }}>
          How it <span className="italic">works</span>
        </h2>
        <p style={{ margin: "12px 0 0", fontSize: 16, color: "var(--ink-2)", maxWidth: "52ch" }}>
          Three steps between spotting a deal and using it.
        </p>

        {/* Each step previews the real component, running on real data. */}
        <div className="steps">
          <article>
            <div className="step-frame">
              <ImageSlot src={editorial.steps.search} alt="A street of neighborhood restaurants" />
              <div className="step-stage" aria-hidden="true">
                <div className="demo-search">
                  <span className="search-icon">⌕</span>
                  <span className="demo-search-text">Fort Worth</span>
                  <span className="demo-search-btn">Find deals</span>
                </div>
              </div>
            </div>
            <span className="step-num">STEP 01</span>
            <h3 className="step-title">Search</h3>
            <p className="step-copy">Enter your city, neighborhood or the name of a place.</p>
          </article>

          <article>
            <div className="step-frame">
              <ImageSlot src={editorial.steps.claim} alt="Biryani served at a partner restaurant" />
              <div className="step-stage" aria-hidden="true">
                <div className="demo-reveal">
                  <span className="coupon coupon-muted">{maskCode(claimDeal.code)}</span>
                </div>
                <span className="demo-caption">{claimDeal.value} · {claimDeal.title}</span>
              </div>
            </div>
            <span className="step-num">STEP 02</span>
            <h3 className="step-title">Claim</h3>
            <p className="step-copy">Open the listing to unlock the full coupon code.</p>
          </article>

          <article>
            <div className="step-frame">
              <ImageSlot src={editorial.steps.redeem} alt="A guest ordering at a restaurant counter" />
              <div className="step-stage" aria-hidden="true">
                <div className="demo-redeem">
                  <span className="demo-redeem-label">Show it at the counter</span>
                  <span className="coupon">{claimDeal.code}</span>
                </div>
              </div>
            </div>
            <span className="step-num">STEP 03</span>
            <h3 className="step-title">Redeem</h3>
            <p className="step-copy">Read the code out when you pay. That is the whole thing.</p>
          </article>
        </div>
      </section>

      <section className="wrap" style={{ padding: "104px 28px 0" }}>
        <div className="grid-split" style={{ background: "var(--ink)", borderRadius: "var(--r-panel)", padding: 52, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 40, alignItems: "center", color: "#FFFFFF" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 48, lineHeight: 1.04, letterSpacing: "-0.04em", fontWeight: 700, color: "#FFFFFF" }}>
              Stop hunting group chats for <span className="italic" style={{ color: "#F0A05A" }}>a discount code.</span>
            </h2>
            <p style={{ margin: "18px 0 0", fontSize: 16, lineHeight: 1.6, color: "#B9B9C6", maxWidth: "46ch" }}>
              Every offer we find near you lands on one page, with the code attached.
            </p>
            <div style={{ marginTop: 30 }}>
              <Link to="/explore" className="btn btn-accent">Find deals near you</Link>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ height: 200, borderRadius: 18, overflow: "hidden" }}><ImageSlot src={editorial.closing[0]} alt="Curry served at a North Texas kitchen" /></div>
            <div style={{ height: 200, borderRadius: 18, overflow: "hidden", marginTop: 30 }}><ImageSlot src={editorial.closing[1]} alt="A long table of diners" /></div>
          </div>
        </div>
      </section>

      <Footer links={[{ to: "/explore", label: "Restaurants" }, { to: "#deals", label: "Deals" }, { to: "#how", label: "How it works" }]} />
    </div>
  );
}


function FeatureDeal({ slug }) {
  const restaurant = getRestaurant(slug);
  const deal = restaurant?.topDeal;
  if (!deal) return null;

  return (
    <Link
      to={`/restaurant/${slug}`}
      className="span-2"
      style={{ gridRow: "span 2", position: "relative", borderRadius: "var(--r-panel)", overflow: "hidden", minHeight: 470, display: "block", color: "#FFFFFF" }}
    >
      <ImageSlot src={deal.image} alt={`${deal.value} at ${restaurant.name}`} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(10,10,16,.92) 0%,rgba(10,10,16,.1) 62%,rgba(10,10,16,.3) 100%)", pointerEvents: "none" }} />
      <span className="badge badge-deal" style={{ position: "absolute", top: 20, left: 20, pointerEvents: "none" }}>Featured deal</span>
      <div style={{ position: "absolute", inset: "auto 0 0 0", padding: 30, pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
          <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05 }}>{deal.value}</span>
          <span style={{ fontSize: 13, color: "#C4C4D0" }}>{freshLabel(deal.postedMinutes)}</span>
        </div>
        <div style={{ fontSize: 18, color: "#E4E4EC", marginTop: 6 }}>{deal.title}</div>
        <div style={{ fontSize: 14, color: "#B9B9C6", marginTop: 16 }}>{restaurant.shortName} · {restaurant.city}</div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span className="coupon coupon-dark">{maskCode(deal.code)}</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>View restaurant →</span>
        </div>
      </div>
    </Link>
  );
}

function DealCard({ slug }) {
  const restaurant = getRestaurant(slug);
  const deal = restaurant?.topDeal;
  if (!deal) return null;

  return (
    <Link to={`/restaurant/${slug}`} className="card">
      <div className="card-media" style={{ height: 132 }}>
        <ImageSlot src={deal.image} alt={`${deal.value} at ${restaurant.name}`} />
      </div>
      <div style={{ padding: "18px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1 }}>{deal.value}</span>
          <span style={{ fontSize: 12.5, color: "var(--ink-3)", whiteSpace: "nowrap" }}>{freshLabel(deal.postedMinutes)}</span>
        </div>
        <div style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 4 }}>{deal.title}</div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line-soft)" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{restaurant.shortName}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{restaurant.city}</div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span className="coupon">{maskCode(deal.code)}</span>
            <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
