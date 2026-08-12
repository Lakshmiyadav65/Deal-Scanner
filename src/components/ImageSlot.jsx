export default function ImageSlot({ src, alt = "", shape = "rect", eager = false }) {
  return (
    <img
      className="image-slot"
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      style={{ borderRadius: shape === "circle" ? "50%" : undefined }}
    />
  );
}
