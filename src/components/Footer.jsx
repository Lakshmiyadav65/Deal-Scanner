import { Link } from "react-router-dom";

export default function Footer({ links }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>Deal Scanner prototype · deals shown are illustrative, confirm with the restaurant</span>
        <div style={{ display: "flex", gap: 22 }}>
          {links.map((link) =>
            link.to.startsWith("#") ? (
              <a key={link.to} href={link.to} style={{ color: "var(--ink-3)" }}>
                {link.label}
              </a>
            ) : (
              <Link key={link.to} to={link.to} style={{ color: "var(--ink-3)" }}>
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
