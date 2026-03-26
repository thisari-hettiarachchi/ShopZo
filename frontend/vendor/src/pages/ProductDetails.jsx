import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, ArrowLeft } from "lucide-react";
import { getProductById } from "../services/productService";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setError("Product not found or failed to fetch.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-[var(--text-secondary)]">
        <Loader className="animate-spin mr-2" /> Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-12 text-center text-[var(--text-secondary)]">
        <p>{error || "Product not found."}</p>
        <button
          className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="inline mr-2" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        className="mb-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} className="inline mr-2" /> Back
      </button>
      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="aspect-video bg-[var(--bg-muted)] flex items-center justify-center overflow-hidden">
          <img
            src={product.images?.[0] || "https://via.placeholder.com/300x200"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
          <p className="mb-2 text-[var(--text-secondary)]">{product.description}</p>
          <div className="flex gap-4 mb-2">
            <span className="text-lg font-semibold text-[var(--color-primary)]">${product.price}</span>
            <span className="text-sm text-[var(--text-secondary)]">Stock: {product.stock}</span>
            <span className="text-sm text-[var(--text-secondary)]">Status: {product.status}</span>
          </div>
          <div className="text-sm text-[var(--text-secondary)] mb-2">Category: {product.category?.name || product.category}</div>
          <div className="text-sm text-[var(--text-secondary)]">Rating: {product.rating || 0} | Sales: {product.sales || 0}</div>
        </div>
      </div>
    </div>
  );
}
