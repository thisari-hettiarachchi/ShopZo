import { useState, useEffect } from "react";
import { Trash2, Heart, ShoppingCart, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import {
  fetchWishlistApi,
  removeFromWishlistApi,
  clearWishlistApi,
} from "../../api/wishlistApi";
import { addToCartApi } from "../../api/cartApi";

export default function Wishlist() {
  const token = localStorage.getItem("token");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState("");
  const [addingAll, setAddingAll] = useState(false);
  const [clearing, setClearing] = useState(false);

  const dispatchWishlistUpdate = () => {
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  const dispatchCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
  };

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await fetchWishlistApi(token);
        const items = data.items || [];
        setWishlistItems(items);
        
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
      
      localStorage.setItem('wishlist', JSON.stringify(items));
      dispatchWishlistUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAll = async () => {
    if (wishlistItems.length === 0) return;
    const confirmed = window.confirm("Remove all items from your wishlist?");
    if (!confirmed) return;

    setClearing(true);
    try {
      await clearWishlistApi(token);
      setWishlistItems([]);
      localStorage.setItem('wishlist', JSON.stringify([]));
      dispatchWishlistUpdate();
      toast.success("Wishlist cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear wishlist");
    } finally {
      setClearing(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) return toast.error("Please login to continue");
    setAddingId(productId);
    try {
      await addToCartApi(productId, 1, token);
      dispatchCartUpdate();
      toast.success("Added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingId("");
    }
  };

  const handleAddAllToCart = async () => {
    if (!token) return toast.error("Please login to continue");
    if (wishlistItems.length === 0) return;

    setAddingAll(true);
    try {
      await Promise.all(
        wishlistItems.map((item) => addToCartApi(item.product._id, 1, token))
      );
      dispatchCartUpdate();
      toast.success("All items added to cart!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add some items to cart");
    } finally {
      setAddingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)]">
        <p className="text-[var(--text-muted)]">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_12px_28px_-18px_var(--shadow)]">
              <Heart className="w-6 h-6 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Your Wishlist
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                {wishlistItems.length > 0 ? `${wishlistItems.length} item${wishlistItems.length > 1 ? "s" : ""} saved` : "No items saved yet"}
              </p>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddAllToCart}
                disabled={addingAll}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <ShoppingCart className="w-4 h-4" />
                {addingAll ? "Adding..." : "Add All to Cart"}
              </button>
              <button
                onClick={handleRemoveAll}
                disabled={clearing}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-red-500 hover:text-red-500 disabled:opacity-60"
              >
                <XCircle className="w-4 h-4" />
                {clearing ? "Removing..." : "Remove All"}
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] py-20 text-center shadow-[0_24px_60px_-36px_var(--shadow)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-muted)]">
              <Heart className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-[var(--text-secondary)]">Your wishlist is empty.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-[0_18px_40px_-30px_var(--shadow)] transition hover:-translate-y-0.5"
              >
                <div className="flex gap-4">
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] object-contain"
                  />

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <h3 className="truncate font-semibold text-[var(--text-primary)]">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 font-bold text-[var(--color-primary)]">
                        Rs. {item.product.price}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="h-fit rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-red-500/10 hover:text-red-500"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(item.product._id)}
                  disabled={addingId === item.product._id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-60"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {addingId === item.product._id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
