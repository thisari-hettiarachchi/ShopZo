import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { addToCartApi } from "../../api/cartApi";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  fetchWishlistApi,
} from "../../api/wishlistApi";

export default function ProductCard({ product, token: propToken, onCartUpdate }) {
  const navigate = useNavigate();
  const token = propToken || localStorage.getItem("token");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchWishlistApi(token).then((data) => {
      const exists = data.items?.some((item) => item.product._id === product._id);
      setIsWishlisted(exists);
    });
  }, [product._id, token]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) return alert("You must be logged in to add to cart");
    try {
      const updatedCart = await addToCartApi(product._id, 1, token);
      if (updatedCart?.message) alert(updatedCart.message);
      else { alert("Added to cart!"); if (onCartUpdate) onCartUpdate(updatedCart); }
    } catch (err) {
      alert(err.message || "Failed to add to cart");
    }
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!token) return alert("Login to use wishlist");
    try {
      if (isWishlisted) { await removeFromWishlistApi(product._id, token); setIsWishlisted(false); }
      else { await addToWishlistApi(product._id, token); setIsWishlisted(true); }
    } catch (err) { console.error("Wishlist error:", err); }
  };

   const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group relative flex flex-col cursor-pointer overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgba(249,115,22,0.18)]"
    >
      {/* Image area */}
      <div className="relative flex-shrink-0 overflow-hidden bg-[linear-gradient(150deg,var(--bg-muted),var(--bg-card))] p-5 h-[160px] flex items-center justify-center">
        {product.oldPrice && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-white">
            Save Rs. {Math.max(product.oldPrice - product.price, 0)}
          </span>
        )}
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-400 group-hover:scale-110"
        />
        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] transition hover:scale-110 hover:border-[var(--color-primary)]"
        >
          <Heart className={`h-[15px] w-[15px] ${isWishlisted ? "fill-red-500 text-red-500" : "text-[var(--color-primary)]"}`} />
        </button>
      </div>

      {/* Body — flex:1 so it stretches, pushing button to bottom */}
      <div className="flex flex-1 flex-col px-4 pt-3 pb-0">

        <h3 className="mb-2 truncate text-[13px] font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "'Sora', sans-serif" }}>
          {product.name}
        </h3>

        <div className="mb-2.5 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-slate-200"}`} />
          ))}
          <span className="ml-1 text-[11px] text-[var(--text-muted)]">({product.reviews ?? 0})</span>
        </div>

        {/* Price block — fixed height so buttons always align */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-extrabold text-[var(--color-primary)]"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
              Rs. {product.price}
            </span>
            {discount && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                -{discount}%
              </span>
            )}
          </div>
          {/* Old price row — always rendered to keep height consistent */}
          <div className="mt-0.5 h-[18px]">
            {product.oldPrice && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                Rs. {product.oldPrice}
              </span>
            )}
          </div>
        </div>

        {/* Spacer pushes divider + button to bottom */}
        <div className="flex-1" />
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-[var(--border)]" />

      {/* Button — always at the bottom */}
      <div className="p-4 pt-3">
        <button
          onClick={handleAddToCart}
          className="flex h-[38px] w-full items-center justify-center gap-1.5 rounded-xl text-[13px] font-bold text-white transition duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
            boxShadow: "0 4px 14px rgba(249,115,22,0.25)",
          }}
        >
          <ShoppingCart className="h-[15px] w-[15px]" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}