export default function ImageSlot({ src, alt = "", shape = "rect" }) {
  return (
    <img
      className="image-slot"
      src={src}
      alt={alt}
      style={{ borderRadius: shape === "circle" ? "50%" : undefined }}
    />
  );
}
