import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShoppingCart, Heart, Star, Truck } from "lucide-react";
import { fetchProductById } from "../api/productApi";
import { addToCartApi } from "../api/cartApi";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  fetchWishlistApi,
} from "../api/wishlistApi";

export default function ProductDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  /* ---------------- Fetch Product ---------------- */
  useEffect(() => {
    fetchProductById(id).then((data) => {
      setProduct(data);
      setMainImage(data.images?.[0]);
    });
  }, [id]);

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

  if (!product) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-[var(--bg-card)] p-6 rounded-2xl">

        {/* -------- Images -------- */}
        <div>
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-[350px] object-contain rounded-lg mb-4"
          />

          <div className="flex gap-2 overflow-x-auto">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i + 1}`}
                className={`w-24 h-24 object-contain rounded-lg cursor-pointer border ${
                  mainImage === img
                    ? "border-[var(--color-primary)]"
                    : "hover:border-[var(--color-primary)]"
                }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* -------- Product Info -------- */}
        <div className="space-y-5">

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold leading-tight">
              {product.name}
            </h1>

            <button
              onClick={handleWishlistClick}
              className="p-2 rounded-full border border-[var(--border)] hover:bg-[var(--bg-muted)] transition"
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

          <p className="text-[var(--text-secondary)] leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-1">
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
            <span className="text-sm text-[var(--text-secondary)]">
              ({product.reviews ?? 0} reviews)
            </span>
          </div>

          <p className="text-2xl font-bold text-[var(--color-primary)]">
            Rs. {product.price}
          </p>

          {/* -------- Quantity -------- */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantity</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2 hover:bg-[var(--bg-muted)]"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-[var(--bg-muted)]"
              >
                +
              </button>
            </div>
          </div>

          {/* -------- Actions -------- */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:opacity-90"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>

            <button
              onClick={handleWishlistClick}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--color-primary)] hover:bg-[var(--bg-muted)]"
            >
              Buy Now
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4 text-sm text-[var(--text-secondary)]">
            <Truck className="w-5 h-5 text-[var(--color-primary)]" />
            Free delivery within 3–5 working days
          </div>
        </div>
      </div>
    </div>
  );
}
