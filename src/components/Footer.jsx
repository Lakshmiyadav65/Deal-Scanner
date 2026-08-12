import { Link } from "react-router-dom";

export default function Footer({ links }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>Deal Scanner — internal prototype · illustrative content only</span>
        <div style={{ display: "flex", gap: 22 }}>
          {links.map((link) =>
            link.to.startsWith("#") ? (
              <a key={link.to} href={link.to} className="muted-link">
                {link.label}
              </a>
            ) : (
              <Link key={link.to} to={link.to} className="muted-link">
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
