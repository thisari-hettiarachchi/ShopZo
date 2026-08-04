import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addToCartApi } from "../../../api/cartApi";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  fetchWishlistApi,
} from "../../../api/wishlistApi";

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
    if (!token) return toast.error("You must be logged in to add to cart");
    try {
      const updatedCart = await addToCartApi(product._id, 1, token);
      if (updatedCart?.message) toast.info(updatedCart.message);
      else {
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
        if (onCartUpdate) onCartUpdate(updatedCart);
      }
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!token) return toast.error("Login to use wishlist");
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
      className="group relative flex h-full flex-col cursor-pointer overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_12px_32px_-24px_var(--shadow)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)]/30 hover:shadow-[0_24px_48px_-20px_var(--shadow)]"
    >
      {/* Image area */}
      <div className="relative flex h-[168px] flex-shrink-0 items-center justify-center overflow-hidden bg-[linear-gradient(150deg,var(--bg-muted),var(--bg-card))] p-5">
        {product.oldPrice && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--text-primary)] px-2.5 py-1 text-[10px] font-bold text-[var(--bg-main)]">
            Save Rs. {Math.max(product.oldPrice - product.price, 0)}
          </span>
        )}
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-sm transition hover:scale-110 hover:border-[var(--color-primary)]"
        >
          <Heart className={`h-[15px] w-[15px] ${isWishlisted ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-primary)]"}`} />
        </button>
      </div>

      {/* Body — flex:1 so it stretches, pushing button to bottom */}
      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-0">

        <h3 className="mb-2 truncate text-[13px] font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "'Sora', sans-serif" }}>
          {product.name}
        </h3>

        <div className="mb-2.5 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(product.rating) ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--border)]"}`} />
          ))}
          <span className="ml-1 text-[11px] text-[var(--text-muted)]">({product.ratingCount ?? 0})</span>
        </div>

        {/* Price block — fixed height so buttons always align */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[18px] font-extrabold text-[var(--color-primary)]"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
              Rs. {product.price}
            </span>
            {discount && (
              <span className="rounded-full bg-[var(--bg-muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-primary)]">
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
          className="flex h-[38px] w-full items-center justify-center gap-1.5 rounded-2xl text-[13px] font-bold text-white transition duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))",
            boxShadow: "0 8px 20px -10px var(--shadow)",
          }}
        >
          <ShoppingCart className="h-[15px] w-[15px]" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}