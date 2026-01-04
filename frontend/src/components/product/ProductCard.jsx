import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="bg-[var(--bg-card)] rounded-2xl shadow-md hover:shadow-lg transition group overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative bg-[var(--bg-muted)] p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain group-hover:scale-105 transition"
        />

        {/* Wishlist (prevent navigation) */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-[var(--bg-muted)]"
        >
          <Heart className="w-5 h-5 text-[var(--color-primary)]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < product.rating
                  ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                  : "text-[var(--text-muted)]"
              }`}
            />
          ))}
          <span className="text-xs text-[var(--text-muted)]">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-[var(--color-primary)]">
            Rs. {product.price}
          </span>
          {product.oldPrice && (
            <span className="line-through text-sm text-[var(--text-muted)]">
              Rs. {product.oldPrice}
            </span>
          )}
        </div>

        {/* Add to Cart (prevent navigation) */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-white font-medium bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
