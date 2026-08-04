const NEW_ARRIVAL_DAYS = 5;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Product is a new arrival from createdAt day through the next 5 days. */
export function isNewArrival(product, now = Date.now()) {
  const createdAt = product?.createdAt ? new Date(product.createdAt).getTime() : NaN;
  if (Number.isNaN(createdAt)) return false;
  const ageMs = now - createdAt;
  return ageMs >= 0 && ageMs <= NEW_ARRIVAL_DAYS * MS_PER_DAY;
}

export function filterNewArrivals(products = []) {
  return [...products]
    .filter((product) => isNewArrival(product))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export function getBestSellerScore(product) {
  return Number(product?.rating || 0) * 10 + Number(product?.ratingCount || 0);
}

/** Higher-rated / more-reviewed products rank as bestsellers. */
export function filterBestSellers(products = []) {
  return [...products]
    .filter(
      (product) =>
        Number(product?.rating || 0) >= 3.5 || Number(product?.ratingCount || 0) > 0
    )
    .sort((a, b) => getBestSellerScore(b) - getBestSellerScore(a));
}

export { NEW_ARRIVAL_DAYS };
