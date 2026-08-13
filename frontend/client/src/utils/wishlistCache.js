import { fetchWishlistIdsApi } from "../api/wishlistApi";

let cache = {
  token: null,
  ids: null,
  at: 0,
  promise: null,
};

const CACHE_MS = 60_000;

export const invalidateWishlistIdsCache = () => {
  cache = { token: null, ids: null, at: 0, promise: null };
};

/** One shared wishlist-id fetch for all product cards (avoids N+1). */
export const getWishlistIdSet = async (token) => {
  if (!token) return new Set();

  if (cache.token === token && cache.ids && Date.now() - cache.at < CACHE_MS) {
    return cache.ids;
  }

  if (cache.promise && cache.token === token) {
    return cache.promise;
  }

  cache.token = token;
  cache.promise = fetchWishlistIdsApi(token)
    .then((data) => {
      const ids = new Set((data?.ids || []).map(String));
      cache.ids = ids;
      cache.at = Date.now();
      cache.promise = null;
      return ids;
    })
    .catch(() => {
      cache.promise = null;
      return cache.ids || new Set();
    });

  return cache.promise;
};
