import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Heart, Star, Truck, MapPin, Shield, Store, RefreshCcw } from "lucide-react";
import { fetchProductById, fetchProductReviews, postProductReview } from "../../api/productApi";
import { API_BASE_URL, authHeaders } from "../../api/base";
import { addToCartApi } from "../../api/cartApi";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  fetchWishlistApi,
} from "../../api/wishlistApi";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatInputRef = useRef(null);

  /* ---------------- Fetch Product ---------------- */
  useEffect(() => {
    fetchProductById(id).then((data) => {
      setProduct(data);
      setMainImage(data.images?.[0]);
    });
    fetchProductReviews(id).then((data) => setReviews(Array.isArray(data) ? data : []));
  }, [id]);

  useEffect(() => {
    const loadChat = async () => {
      if (!token || !product?.vendor?._id) return;
      try {
        const res = await fetch(`${API_BASE_URL}/chat/messages?vendorId=${product.vendor._id}&productId=${product._id}`, {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        setChatMessages(Array.isArray(data) ? data : []);
      } catch {
        setChatMessages([]);
      }
    };
    loadChat();
  }, [product, token]);

  /* ---------------- Check Wishlist Status ---------------- */
  useEffect(() => {
    if (!token || !product) return;

    fetchWishlistApi(token).then((data) => {
      const exists = data.items?.some(
        (item) => item.product._id === product._id
      );
      setIsWishlisted(exists);
    });
  }, [product, token]);

  /* ---------------- Wishlist Toggle ---------------- */
  const handleWishlistClick = async () => {
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

  /* ---------------- Add to Cart ---------------- */
  const handleAddToCart = async () => {
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
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login to submit a review");

    const created = await postProductReview(product._id, reviewForm);
    if (created?.message) return alert(created.message);

    const latest = await fetchProductReviews(product._id);
    setReviews(Array.isArray(latest) ? latest : []);
    setReviewForm({ rating: 5, title: "", comment: "" });
  };

  const handleSendChat = async () => {
    if (!token) return alert("Login to chat with vendor");
    if (!product?.vendor?._id || !chatInput.trim()) return;

    const res = await fetch(`${API_BASE_URL}/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        vendorId: product.vendor._id,
        productId: product._id,
        message: chatInput,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setChatMessages((prev) => [...prev, data]);
      setChatInput("");
    }
  };

  const handleBuyNow = () => {
    if (!token) return alert("You must be logged in to checkout");
    navigate("/checkout", {
      state: {
        products: [
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: mainImage,
            quantity: quantity,
            vendor: product.vendor,
          },
        ],
        quantity: quantity,
      },
    });
  };

  const handleChatNow = () => {
    if (!token) return alert("Login to chat with vendor");
    if (chatInputRef.current) {
      chatInputRef.current.focus();
      chatInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!product) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_320px] gap-6 bg-[var(--bg-main)] rounded-2xl">

        {/* -------- Images -------- */}
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] h-fit">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg mb-4"
          />

          <div className="flex gap-2 overflow-x-auto">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i + 1}`}
                className={`w-20 h-20 object-contain rounded-lg cursor-pointer border-2 ${
                  mainImage === img
                    ? "border-[var(--color-primary)]"
                    : "border-transparent hover:border-[var(--color-primary)]"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* -------- Product Info -------- */}
        <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)]">

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold leading-tight">
              {product.name}
            </h1>
            <button
              onClick={handleWishlistClick}
              className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--bg-muted)] transition shrink-0"
            >
              <Heart
                className={`w-6 h-6 ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-[var(--color-primary)]"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(product.rating || 0)
                    ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-[var(--text-secondary)] ml-2">
              ({product.reviews ?? 0} Ratings)
            </span>
            <span className="text-[var(--border)] mx-2">|</span>
            <span className="text-sm text-[var(--color-primary)] hover:underline cursor-pointer">
              {product.category}
            </span>
          </div>

          <div className="my-6">
            <p className="text-3xl font-bold text-[var(--color-primary)]">
              Rs. {product.price}
            </p>
            {product.oldPrice && (
              <p className="text-sm text-gray-400 line-through mt-1">Rs. {product.oldPrice}</p>
            )}
          </div>

          {/* -------- Quantity -------- */}
          <div className="flex items-center gap-4 mb-8">
            <span className="font-medium text-sm text-[var(--text-secondary)]">Quantity</span>
            <div className="flex items-center border border-[var(--border)] rounded-lg">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-4 py-2 hover:bg-[var(--bg-muted)] text-lg"
              >
                −
              </button>
              <span className="px-4 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-[var(--bg-muted)] text-lg"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-400">Only {product.stock || 50} items left</span>
          </div>

          {/* -------- Actions -------- */}
          <div className="flex gap-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-100 text-[var(--color-primary)] font-semibold hover:bg-orange-200 transition"
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold hover:opacity-90 shadow-lg shadow-orange-500/30 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <h3 className="font-semibold mb-3">Product Description</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)]">
            <h3 className="font-semibold mb-3">Ratings & Reviews</h3>
            <form onSubmit={handleSubmitReview} className="mb-5 grid grid-cols-1 md:grid-cols-4 gap-2">
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Stars</option>
                ))}
              </select>
              <input
                value={reviewForm.title}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Review title"
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm"
              />
              <input
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                placeholder="Your feedback"
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm md:col-span-2"
              />
              <button className="md:col-span-4 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white">
                Submit Review
              </button>
            </form>

            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review._id} className="rounded-xl border border-[var(--border)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{review.user?.name || "Customer"}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{review.verifiedBuyer ? "Verified Buyer" : "Unverified"}</p>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{"★".repeat(review.rating)}{"☆".repeat(Math.max(0, 5 - review.rating))}</p>
                  {review.title && <p className="text-sm font-semibold mt-1">{review.title}</p>}
                  {review.comment && <p className="text-sm text-[var(--text-secondary)] mt-1">{review.comment}</p>}
                </div>
              ))}
              {reviews.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No reviews yet.</p>}
            </div>
          </div>
        </div>

        {/* -------- Delivery & Vendor Profile (Daraz Style) -------- */}
        <div className="space-y-4">
          
          {/* Delivery Panel */}
          <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">Delivery</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="text-gray-400 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-medium">Standard Delivery</p>
                  <p className="text-xs text-gray-500">3 - 5 working days</p>
                </div>
                <span className="ml-auto font-bold text-sm">Rs. 286</span>
              </div>
              
              <div className="flex gap-3 border-t border-gray-100 pt-3">
                <Truck className="text-gray-400 shrink-0" size={20} />
                <p className="text-sm font-medium">Cash on Delivery Available</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 mb-3 text-sm">
              <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">Service</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <RefreshCcw className="text-gray-400 shrink-0" size={20} />
                <p className="text-sm font-medium">14 Days Free Returns</p>
              </div>
              <div className="flex gap-3 border-t border-gray-100 pt-3">
                <Shield className="text-gray-400 shrink-0" size={20} />
                <p className="text-sm font-medium">Warranty Not Available</p>
              </div>
            </div>
          </div>

          {/* Vendor Panel */}
          <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3 text-sm">
              <span className="text-gray-500 font-medium text-xs uppercase tracking-wide">Sold By</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <Store className="text-[var(--color-primary)]" size={32} />
              <div>
                <p className="font-bold text-[var(--text-primary)]">
                  {product.vendor?.storeName || product.vendor?.name || "Vendor"}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-700">{product.vendor?.rating || 4.8} / 5</span> 
                  <span>({Math.floor(Math.random() * 500) + 50} reviews)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[var(--border)] p-2">
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                Ask this vendor about delivery, color, warranty, and availability.
              </p>
              <div className="flex gap-2">
                <input
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-2 py-1 text-xs"
                  placeholder="Ask about delivery, color, warranty..."
                />
                <button onClick={handleSendChat} className="rounded-lg bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white">
                  Send
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
