import { useCallback, useEffect, useState } from "react";

const KEY = "ds-saved";

function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useSaved(slug) {
  const [saved, setSaved] = useState(() => readSaved().includes(slug));

  useEffect(() => {
    setSaved(readSaved().includes(slug));
  }, [slug]);

  const toggle = useCallback(
    (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      setSaved((prev) => {
        const list = readSaved();
        const next = !prev;
        const updated = next
          ? [...new Set([...list, slug])]
          : list.filter((item) => item !== slug);
        localStorage.setItem(KEY, JSON.stringify(updated));
        return next;
      });
    },
    [slug]
  );

  return [saved, toggle];
}
