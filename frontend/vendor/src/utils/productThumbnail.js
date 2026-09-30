/** First usable product image: default cover, else first color photo. */
export function getProductThumbnail(product) {
  if (!product) return "";

  const defaults = Array.isArray(product.images)
    ? product.images.filter((img) => typeof img === "string" && img.trim())
    : typeof product.images === "string" && product.images.trim()
      ? [product.images]
      : typeof product.image === "string" && product.image.trim()
        ? [product.image]
        : [];

  if (defaults[0]) return defaults[0];

  const colors = Array.isArray(product.colors) ? product.colors : [];
  for (const color of colors) {
    if (!Array.isArray(color?.images)) continue;
    const colorImg = color.images.find((img) => typeof img === "string" && img.trim());
    if (colorImg) return colorImg;
  }

  return "";
}
