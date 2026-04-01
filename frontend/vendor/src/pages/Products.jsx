import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, Edit, Eye, Trash2, Plus, Loader } from "lucide-react";
import { getProducts, deleteProduct } from "../services/productService";

// Function to determine status color
const getStatusColor = (status) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800";
    case "Limited":
      return "bg-yellow-100 text-yellow-800";
    case "Out of Stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Removed sample products

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-3 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
      {/* Search & Filter */}
      <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Inventory Workspace
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              Products
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Manage listings, stock, and pricing in one place.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-secondary)]">
            {filteredProducts.length} total items
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 relative min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] py-2.5 pl-10 pr-4 text-sm focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => navigate("/products/new")}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90"
        >
          <Plus size={18} />
          Add
        </button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-16 text-[var(--text-secondary)]">
          <Loader className="animate-spin mr-2" />
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-16 text-center shadow-[0_20px_50px_-34px_var(--shadow)]">
          <p className="text-[var(--text-secondary)] mb-4">No products found.</p>
          <button
            onClick={() => navigate("/products/new")}
            className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 text-white shadow-md transition hover:opacity-90"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_16px_44px_-32px_var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_64px_-30px_var(--shadow)]"
            >
              <div className="aspect-video overflow-hidden bg-[linear-gradient(145deg,var(--bg-muted),var(--bg-card))]">
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/300x200'} 
                  alt={product.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-xl group-hover:text-[var(--color-primary)] transition-colors">{product.name}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">{product.rating || 0}</span>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)]">• {product.sales || 0} sold</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">${product.price}</span>
                  <span className="text-sm text-[var(--text-secondary)]">Stock: {product.stock}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2 text-white shadow-md transition hover:opacity-90"
                    onClick={() => navigate(`/products/edit/${product._id}`)}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    className="flex items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 shadow-sm transition hover:bg-[var(--bg-muted)]"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="flex items-center justify-center rounded-xl border border-red-300 px-4 py-2 text-red-500 shadow-sm transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
