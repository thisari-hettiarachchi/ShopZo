import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCartApi } from "../../../api/cartApi";
import { addToWishlistApi, removeFromWishlistApi } from "../../../api/wishlistApi";

function BestSellerCard({ product, index }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [wishlisted, setWishlisted] = useState(false);

  const rating = Math.round(Number(product.rating || 0));
  const reviewCount = product.ratingCount ?? product.reviews?.length ?? 0;
  const description =
    product.description?.trim() ||
    "A customer favorite with standout quality and everyday value.";

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) return toast.error("You must be logged in to add to cart");
    try {
      const updatedCart = await addToCartApi(product._id, 1, token);
      if (updatedCart?.message) toast.info(updatedCart.message);
      else {
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) return toast.error("Login to use wishlist");
    try {
      if (wishlisted) {
        await removeFromWishlistApi(product._id, token);
        setWishlisted(false);
      } else {
        await addToWishlistApi(product._id, token);
        setWishlisted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      onClick={() => navigate(`/products/${product._id}`)}
      className="group relative flex cursor-pointer overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_16px_40px_-28px_var(--shadow)] transition hover:-translate-y-1 hover:border-[var(--color-primary)]/30 hover:shadow-[0_24px_48px_-24px_var(--shadow)]"
    >
      <span className="absolute left-3 top-3 z-10 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        Bestseller
      </span>

      <button
        type="button"
        onClick={handleWishlist}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur-sm transition hover:scale-105"
      >
        <Heart
          size={15}
          className={wishlisted ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-primary)]"}
        />
      </button>

      <div className="relative flex w-[42%] shrink-0 items-center justify-center bg-[linear-gradient(150deg,var(--bg-muted),var(--bg-card))] p-4 sm:w-[38%]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-36 w-full object-contain transition duration-500 group-hover:scale-105 sm:h-40"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:p-5">
        <div>
          <h3 className="truncate text-base font-bold text-[var(--text-primary)] sm:text-lg">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-lg font-extrabold text-[var(--color-primary)]">
              Rs. {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[var(--text-muted)] line-through">
                Rs. {product.oldPrice}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-0.5">
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
            <span className="ml-1 text-xs text-[var(--text-muted)]">({reviewCount})</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_12px_24px_-14px_var(--shadow)] transition hover:opacity-90"
          >
            Quick Add
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function BestSellersSection({ products }) {
  const items = [...(products || [])]
    .sort((a, b) => {
      const scoreA = Number(a.rating || 0) * 10 + Number(a.ratingCount || 0);
      const scoreB = Number(b.rating || 0) * 10 + Number(b.ratingCount || 0);
      return scoreB - scoreA;
    })
    .slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 flex items-end justify-between gap-4">
          <div className="relative">
            <span className="section-eyebrow relative mb-3 block">Top picks</span>
            <h2 className="display-font relative mt-4 text-[2.6rem] font-black leading-[1.0] tracking-tight text-[var(--text-primary)] md:text-[3.4rem] lg:text-[4rem]">
              Best <span className="display-font italic text-[var(--color-primary)]">Sellers</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-2 rounded-full border border-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary)] transition-all duration-300 hover:bg-[var(--color-primary)] hover:text-white md:inline-flex"
          >
            View All Best Sellers <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {items.map((product, index) => (
            <BestSellerCard key={product._id || index} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
