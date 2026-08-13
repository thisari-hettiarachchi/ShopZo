/** Shared client helpers for product color variants. */
export const normalizeColor = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    return {
      name: value,
      hex: value.startsWith("#") ? value : "#9CA3AF",
      images: [],
    };
  }
  if (typeof value === "object") {
    const hex = String(value.hex || value.value || "").trim();
    const name = String(value.name || value.label || hex || "Color").trim();
    if (!hex && !name) return null;
    const images = Array.isArray(value.images)
      ? value.images.filter((img) => typeof img === "string" && img.trim())
      : [];
    return {
      name: name || hex,
      hex: hex.startsWith("#") ? hex : "#9CA3AF",
      images,
    };
  }
  return null;
};

export const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) return [];
  return colors.map(normalizeColor).filter(Boolean);
};

export const formatVariantLabel = ({ selectedSize, selectedColor } = {}) => {
  const parts = [];
  if (selectedSize) parts.push(`Size: ${selectedSize}`);
  const color = normalizeColor(selectedColor);
  if (color?.name) parts.push(`Color: ${color.name}`);
  return parts.join(" · ");
};

/** Cart/checkout only need name + hex — omit heavy image payloads. */
export const toCartColor = (color) => {
  const normalized = normalizeColor(color);
  if (!normalized) return null;
  return { name: normalized.name, hex: normalized.hex };
};

export const getImagesForColor = (product, selectedColor) => {
  const productImages = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : product?.images
      ? [product.images]
      : [];
  const color = normalizeColor(selectedColor);
  const colorImages = color?.images?.filter(Boolean) || [];
  return colorImages.length > 0 ? colorImages : productImages;
};
