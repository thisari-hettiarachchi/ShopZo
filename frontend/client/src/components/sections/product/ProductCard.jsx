import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCartApi } from "../../../api/cartApi";
import {
  addToWishlistApi,
  fetchWishlistApi,
  removeFromWishlistApi,
} from "../../../api/wishlistApi";
import { isNewArrival } from "../../../utils/productHelpers";

export default function ProductCard({ product, token: propToken, onCartUpdate }) {
  const navigate = useNavigate();
  const token = propToken || localStorage.getItem("token");
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchWishlistApi(token).then((data) => {
      const exists = data.items?.some((item) => item.product._id === product._id);
      setIsWishlisted(Boolean(exists));
    });
  }, [product._id, token]);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null;
  const showNewTag = isNewArrival(product);
  const rating = Math.round(Number(product.rating || 0));
  const reviewCount = product.ratingCount ?? 0;
  const image = product.images?.[0];

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

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!token) return toast.error("You must be logged in to checkout");
    navigate("/checkout", {
      state: {
        products: [
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image,
            quantity: 1,
            vendor: product.vendor,
          },
        ],
        quantity: 1,
      },
    });
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    if (!token) return toast.error("Login to use wishlist");
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
    <article
      onClick={() => navigate(`/products/${product._id}`)}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--bg-card)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--color-primary)]/35 hover:shadow-[0_28px_50px_-32px_var(--shadow)]"
    >
      <div className="relative h-36 overflow-hidden bg-[var(--bg-muted)] sm:h-40">
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {showNewTag && (
            <span className="w-fit rounded-lg bg-[var(--text-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--bg-main)]">
              New
            </span>
          )}
          {discount ? (
            <span className="w-fit rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-2.5 py-1 text-[10px] font-bold text-white">
              -{discount}%
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/90 text-[var(--color-primary)] backdrop-blur-md transition hover:scale-110 hover:border-[var(--color-primary)]"
        >
          <Heart size={15} className={isWishlisted ? "fill-[var(--color-primary)]" : ""} />
        </button>

        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[var(--text-primary)] sm:text-[15px]">
          {product.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-[var(--color-primary)]">
            Rs. {product.price}
          </span>
          {product.oldPrice ? (
            <span className="text-xs text-[var(--text-muted)] line-through">
              Rs. {product.oldPrice}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < rating
                  ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                  : "text-[var(--border)]"
              }`}
            />
          ))}
          <span className="ml-1 text-[11px] text-[var(--text-muted)]">({reviewCount})</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleBuyNow}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--color-primary)] bg-[var(--bg-main)] px-3 py-2.5 text-xs font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)] hover:text-white sm:text-[13px]"
          >
            <Zap size={14} />
            Buy Now
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-3 py-2.5 text-xs font-bold text-white shadow-[0_10px_22px_-12px_var(--shadow)] transition hover:opacity-90 sm:text-[13px]"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
