import { Link, NavLink } from "react-router-dom";

/** Three links, one action. Anything longer stops fitting on one line. */
const menus = {
  home: [
    { to: "/explore", label: "Places", route: true },
    { to: "/#deals", label: "Deals" },
    { to: "/#how", label: "How it works" },
  ],
  restaurant: [
    { to: "/explore", label: "Places", route: true },
    { to: "#deals", label: "Deals", hash: true },
    { to: "#location", label: "Location", hash: true },
  ],
};

export default function Navbar({ variant = "home", cta }) {
  const links = menus[variant] || menus.home;

  return (
    <header className="ds-nav">
      <div className="ds-nav-inner">
        <Link to="/" className="ds-brand">
          <span className="ds-mark" />
          Deal Scanner
        </Link>

        <nav>
          {links.map((link) =>
            link.hash ? (
              <a key={link.to} href={link.to} className="nav-link">{link.label}</a>
            ) : link.route ? (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                {link.label}
              </NavLink>
            ) : (
              <Link key={link.to} to={link.to} className="nav-link">{link.label}</Link>
            )
          )}
        </nav>

        <div className="ds-nav-cta">{cta}</div>
      </div>
    </header>
  );
}
