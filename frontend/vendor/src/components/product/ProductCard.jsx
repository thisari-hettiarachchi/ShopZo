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

  // fallback to localStorage if parent didn't pass token
  const token = propToken || localStorage.getItem("token");

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetchWishlistApi(token).then((data) => {
      const exists = data.items?.some(
        (item) => item.product._id === product._id
      );
      setIsWishlisted(exists);
    });
  }, [product._id, token]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) return alert("You must be logged in to add to cart");

    try {
      const updatedCart = await addToCartApi(product._id, 1, token);

      if (updatedCart?.message) {
        alert(updatedCart.message);
      } else {
        alert("Added to cart!");
        if (onCartUpdate) onCartUpdate(updatedCart);
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert(err.message || "Failed to add to cart");
    }
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!token) return alert("Login to use wishlist");

    try {
      if (isWishlisted) {
        await removeFromWishlistApi(product._id, token);
        setIsWishlisted(false);
      } else {
        await addToWishlistApi(product._id, token);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_14px_40px_-30px_var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_56px_-26px_var(--shadow)]"
    >
      <div className="relative bg-[linear-gradient(160deg,var(--bg-muted),var(--bg-card))] p-5">
        {product.oldPrice && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur dark:bg-white/90 dark:text-slate-900">
            Save Rs. {Math.max(product.oldPrice - product.price, 0)}
          </span>
        )}
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-52 w-full object-contain transition duration-500 group-hover:scale-110"
        />
        <button
          onClick={handleWishlistClick}
          className="absolute right-3 top-3 rounded-full border border-[var(--border)] bg-[var(--bg-card)]/90 p-2.5 backdrop-blur transition hover:scale-105 hover:border-[var(--color-primary)]"
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-[var(--color-primary)]"
            }`}
          />
        </button>
      </div>

      <div className="space-y-3 p-5 pt-4">
        <h3 className="line-clamp-1 text-base font-semibold text-[var(--text-primary)]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(product.rating)
                  ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                  : "text-[var(--text-muted)]"
              }`}
            />
          ))}
          <span className="text-xs text-[var(--text-muted)]">
            ({product.reviews ?? 0})
          </span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <span className="text-xl font-bold text-[var(--color-primary)]">
            Rs. {product.price}
          </span>
          {product.oldPrice && (
            <span className="line-through text-sm text-[var(--text-muted)]">
              Rs. {product.oldPrice}
            </span>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={handleAddToCart}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-2.5 font-medium text-white transition duration-200 hover:opacity-90"
          >
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
