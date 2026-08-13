const CLIENT_API_BASE = (
  process.env.CLIENT_API_URL ||
  process.env.CLIENT_BACKEND_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const toPlainProduct = (product) => {
  const plain = product?.toObject ? product.toObject() : product;
  if (!plain) return null;
  return {
    _id: String(plain._id),
    name: plain.name,
    price: plain.price,
    oldPrice: plain.oldPrice,
    discount: plain.discount,
    category: plain.category,
    images: Array.isArray(plain.images) ? plain.images : [],
    isFlashSale: Boolean(plain.isFlashSale),
  };
};

const resolveAlertType = ({ type, product, previousProduct }) => {
  if (type === "new_product") return "new_product";

  const previousPrice = Number(previousProduct?.price);
  const nextPrice = Number(product?.price);
  const previousDiscount = Number(previousProduct?.discount || 0);
  const nextDiscount = Number(product?.discount || 0);
  const flashEnabled = !previousProduct?.isFlashSale && Boolean(product?.isFlashSale);

  const priceDropped =
    Number.isFinite(previousPrice) && Number.isFinite(nextPrice) && nextPrice < previousPrice;
  const discountIncreased = nextDiscount > previousDiscount || flashEnabled;

  // Prefer a single email per update: discount wins when both apply.
  if (discountIncreased) return "discount";
  if (priceDropped) return "price_drop";
  return null;
};

const postAlert = async (payload) => {
  const secret = process.env.NEWSLETTER_INTERNAL_SECRET?.trim();
  if (!secret) {
    console.warn("[newsletter] NEWSLETTER_INTERNAL_SECRET missing — skipped alert");
    return;
  }

  const response = await fetch(`${CLIENT_API_BASE}/api/newsletter/internal/alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-newsletter-secret": secret,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Client newsletter API ${response.status}: ${text}`);
  }
};

/**
 * Fire-and-forget newsletter alerts for product create/update.
 * Safe to call without awaiting from controllers.
 */
export const queueProductNewsletterAlerts = ({ type, product, previousProduct } = {}) => {
  setImmediate(async () => {
    try {
      const alertType = resolveAlertType({ type, product, previousProduct });
      if (!alertType) return;

      const plainProduct = toPlainProduct(product);
      if (!plainProduct) return;

      await postAlert({
        alertType,
        product: plainProduct,
        previousPrice: previousProduct?.price ?? null,
      });
    } catch (error) {
      console.error("[newsletter] Failed to queue product alert:", error.message);
    }
  });
};
