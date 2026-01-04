import { useEffect, useState } from "react";
import ProductGrid from "../components/product/ProductGrid";
import { fetchProducts } from "../api/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Products
          </h1>
          <span className="text-[var(--text-secondary)]">
            {products.length} items
          </span>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
