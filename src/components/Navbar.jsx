import { Link, NavLink } from "react-router-dom";

export default function Navbar({ variant = "home", cta }) {
  const restaurant = variant === "restaurant";

  return (
    <div className="nav-wrap" data-pad="true">
      <header className="ds-header" data-nav="true">
        <Link to="/" className="logo" style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>
          <span style={{ width: 22, height: 22, borderRadius: 7, background: "linear-gradient(135deg,#F5A04A,#E2761B)", display: "inline-block" }} />
          Deal Scanner
        </Link>
        <nav>
          <NavLink to="/explore" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            Explore
          </NavLink>
          <Link to="/#upcoming" className="nav-link">Upcoming</Link>
          <Link to="/#partnered" className="nav-link">Partnered</Link>
          {restaurant ? (
            <>
              <a href="#menu" className="nav-link">Menu</a>
              <a href="#location" className="nav-link">Location</a>
            </>
          ) : (
            <>
              <Link to="/#offers" className="nav-link">Offers</Link>
              <Link to="/#how" className="nav-link">How it works</Link>
            </>
          )}
        </nav>
        {cta}
      </header>
    </div>
  );
}
