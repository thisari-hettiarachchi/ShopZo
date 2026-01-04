import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchProductById } from "../api/productApi";
import { ShoppingCart, Heart, Star, Truck } from "lucide-react";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <p className="text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-[var(--bg-card)] p-6 rounded-2xl">

        <img
          src={product.image}
          className="h-[350px] object-contain mx-auto"
        />

        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < product.rating
                    ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-2xl font-bold text-[var(--color-primary)]">
            Rs. {product.price}
          </p>

          <p>{product.description}</p>

          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
