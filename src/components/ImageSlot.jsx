import { useEffect, useMemo, useState } from "react";
import fallbackImage from "../assets/hero.png";

function proxied(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Google-hosted map photos often block direct hotlinking (403) on deployed domains.
    if (parsed.hostname.includes("googleusercontent.com")) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(
        parsed.host + parsed.pathname + parsed.search
      )}&w=1600&output=webp`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function ImageSlot({ src, alt = "", shape = "rect" }) {
  const candidates = useMemo(() => {
    const list = [];
    const proxy = proxied(src);
    if (proxy) list.push(proxy);
    if (src) list.push(src);
    list.push(fallbackImage);
    return list;
  }, [src]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [candidates]);

  return (
    <img
      className="image-slot"
      src={candidates[idx]}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      style={{ borderRadius: shape === "circle" ? "50%" : undefined }}
      onError={() => {
        setIdx((current) => (current < candidates.length - 1 ? current + 1 : current));
      }}
    />
  );
}
