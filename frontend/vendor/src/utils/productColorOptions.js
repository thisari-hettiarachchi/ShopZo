export const PRODUCT_COLOR_OPTIONS = [
  { name: "Black", hex: "#111827" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Gray", hex: "#9CA3AF" },
  { name: "Red", hex: "#EF4444" },
  { name: "Orange", hex: "#F97316" },
  { name: "Yellow", hex: "#EAB308" },
  { name: "Green", hex: "#22C55E" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Indigo", hex: "#6366F1" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Brown", hex: "#92400E" },
  { name: "Navy", hex: "#1E3A5F" },
  { name: "Beige", hex: "#D6C3A5" },
];

export const MAX_COLOR_IMAGES = 4;

const normalizeColorImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .filter((img) => typeof img === "string" && img.trim())
    .map((img) => img.trim())
    .slice(0, MAX_COLOR_IMAGES);
};

export const normalizeColor = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    const match = PRODUCT_COLOR_OPTIONS.find(
      (color) =>
        color.hex.toLowerCase() === value.toLowerCase() ||
        color.name.toLowerCase() === value.toLowerCase()
    );
    return match
      ? { ...match, images: [] }
      : { name: value, hex: value.startsWith("#") ? value : "#9CA3AF", images: [] };
  }
  if (typeof value === "object") {
    const hex = String(value.hex || value.value || "").trim();
    const name = String(value.name || value.label || hex || "Color").trim();
    if (!hex && !name) return null;
    return {
      name: name || hex,
      hex: hex.startsWith("#")
        ? hex
        : PRODUCT_COLOR_OPTIONS.find((c) => c.name.toLowerCase() === name.toLowerCase())?.hex ||
          "#9CA3AF",
      images: normalizeColorImages(value.images),
    };
  }
  return null;
};

export const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) return [];
  const seen = new Set();
  return colors
    .map(normalizeColor)
    .filter(Boolean)
    .filter((color) => {
      const key = color.hex.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};
