/** Slim product payloads so list/cart/wishlist responses stay fast (base64 images are huge). */

export const PRODUCT_CARD_SELECT =
  "name price oldPrice discount rating ratingCount category createdAt isFlashSale stock vendor images sizes colors";

export const toProductCard = (doc) => {
  if (!doc) return null;
  const p = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };

  const images = Array.isArray(p.images)
    ? p.images.filter(Boolean).slice(0, 1)
    : p.images
      ? [p.images]
      : [];

  const colors = Array.isArray(p.colors)
    ? p.colors
        .map((color) => ({
          name: color?.name || "",
          hex: color?.hex || "",
        }))
        .filter((color) => color.name || color.hex)
    : [];

  let vendor = p.vendor;
  if (vendor && typeof vendor === "object") {
    vendor = {
      _id: vendor._id,
      storeName: vendor.storeName,
      isApproved: vendor.isApproved,
    };
  }

  return {
    _id: p._id,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice,
    discount: p.discount,
    rating: p.rating,
    ratingCount: p.ratingCount,
    category: p.category,
    createdAt: p.createdAt,
    isFlashSale: Boolean(p.isFlashSale),
    stock: p.stock,
    images,
    sizes: Array.isArray(p.sizes) ? p.sizes : [],
    colors,
    vendor,
  };
};

export const toCartProduct = (doc) => {
  const card = toProductCard(doc);
  if (!card) return null;
  const p = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    ...card,
    description: String(p?.description || "").slice(0, 160),
  };
};

export const slimWishlist = (wishlist) => {
  if (!wishlist) return { items: [] };
  const obj = typeof wishlist.toObject === "function" ? wishlist.toObject() : { ...wishlist };
  return {
    ...obj,
    items: (obj.items || [])
      .map((item) => ({
        ...item,
        product: toProductCard(item.product),
      }))
      .filter((item) => item.product),
  };
};

export const slimCart = (cart) => {
  if (!cart) return { items: [] };
  const obj = typeof cart.toObject === "function" ? cart.toObject() : { ...cart };
  return {
    ...obj,
    items: (obj.items || []).map((item) => ({
      ...item,
      product: item.product ? toCartProduct(item.product) : item.product,
    })),
  };
};
