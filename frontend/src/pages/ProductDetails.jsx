import React, { useState } from "react";
import { ShoppingCart, Heart, Star, Truck } from "lucide-react";

export default function Product() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 bg-[var(--bg-card)] p-6 rounded-2xl shadow-md">

        {/* Product Image */}
        <div className="bg-[var(--bg-muted)] rounded-xl p-6 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db"
            alt="Product"
            className="w-full h-[350px] object-contain animate-fade-in"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Premium Wireless Headphones
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-5 h-5 fill-[var(--color-primary)] text-[var(--color-primary)]"
              />
            ))}
            <span className="text-sm text-[var(--text-secondary)]">(128 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-[var(--color-primary)]">
              Rs. 24,990
            </span>
            <span className="line-through text-[var(--text-muted)]">
              Rs. 29,990
            </span>
          </div>

          {/* Description */}
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Experience crystal-clear sound with active noise cancellation,
            premium comfort, and long-lasting battery life. Perfect for work,
            travel, and entertainment.
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-medium text-[var(--text-primary)]">Quantity</span>
            <div className="flex items-center border border-[var(--border)] rounded-lg">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="px-3 py-2 text-lg hover:bg-[var(--bg-muted)]"
              >
                −
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-lg hover:bg-[var(--bg-muted)]"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 transition">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>

            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--border)] text-[var(--color-primary)] hover:bg-[var(--bg-muted)] transition">
              <Heart className="w-5 h-5" />
              Wishlist
            </button>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-3 pt-4 text-sm text-[var(--text-secondary)]">
            <Truck className="w-5 h-5 text-[var(--color-primary)]" />
            Free delivery within 3–5 working days
          </div>
        </div>
      </div>
    </div>
  );
}
