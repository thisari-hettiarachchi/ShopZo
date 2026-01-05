import { useState, useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import {
  fetchWishlistApi,
  removeFromWishlistApi,
} from "../api/wishlistApi";

export default function Wishlist() {
  const token = localStorage.getItem("token");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dispatch custom event to update navbar
  const dispatchWishlistUpdate = () => {
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlistApi(token);
        const items = data.items || [];
        setWishlistItems(items);
        
        // Update localStorage for navbar sync
        localStorage.setItem('wishlist', JSON.stringify(items));
        dispatchWishlistUpdate();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [token]);

  const removeItem = async (productId) => {
    try {
      const updated = await removeFromWishlistApi(productId, token);
      const items = updated.items || [];
      setWishlistItems(items);
      
      // Update localStorage for navbar sync
      localStorage.setItem('wishlist', JSON.stringify(items));
      dispatchWishlistUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading your wishlist...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-7 h-7 text-[var(--color-primary)]" />
          <h1 className="text-3xl font-bold">Your Wishlist</h1>
        </div>

        {wishlistItems.length === 0 ? (
          <p className="text-center text-[var(--text-muted)]">
            Your wishlist is empty.
          </p>
        ) : (
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-4 p-4 rounded-2xl bg-[var(--bg-card)] shadow"
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-24 h-24 object-contain rounded-lg bg-[var(--bg-muted)]"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {item.product.name}
                  </h3>
                  <p className="font-bold text-[var(--color-primary)]">
                    Rs. {item.product.price}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.product._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}