import { Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addToCartApi } from "../../api/cartApi";

export default function ProductCard({ product, token, onCartUpdate }) {
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation(); 
    try {
      const updatedCart = await addToCartApi(product._id, 1, token);
      onCartUpdate(updatedCart); 
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    console.log("Wishlist clicked for", product.name);
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="bg-[var(--bg-card)] rounded-2xl shadow-md hover:shadow-lg transition group overflow-hidden cursor-pointer"
    >
      <div className="relative bg-[var(--bg-muted)] p-4">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-48 object-contain group-hover:scale-105 transition"
        />

        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-[var(--bg-muted)]"
        >
          <Heart className="w-5 h-5 text-[var(--color-primary)]" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
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

        <button
              onClick={async () => {
                const token = localStorage.getItem("token");
                if (!token) return alert("You must be logged in to add to cart");

                try {
                  const updatedCart = await addToCartApi(product._id, quantity, token);

                  if (updatedCart?.message) {
                    alert(updatedCart.message);
                  } else {
                    alert("Added to cart!");
                  }
                } catch (err) {
                  console.error(err);
                  alert("Failed to add to cart");
                }
              }}
          className="w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl text-white font-medium bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
