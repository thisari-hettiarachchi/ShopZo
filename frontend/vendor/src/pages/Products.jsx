import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Download, Star, Edit, Eye, Trash2, Plus, Loader } from "lucide-react";
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
    <div className="p-6 md:p-10 bg-[var(--bg-main)] min-h-screen">
      {/* Search & Filter */}
      <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] flex flex-wrap gap-4 mb-8 shadow-lg items-center">
        <div className="flex-1 relative min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <button
          type="button"
          onClick={() => navigate("/products/new")}
          className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-muted)] flex items-center gap-2"
        >
          <Plus size={18} />
          Add
        </button>
        {/* Filter and Export buttons removed */}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-16 text-[var(--text-secondary)]">
          <Loader className="animate-spin mr-2" />
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center p-16 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-lg">
          <p className="text-[var(--text-secondary)] mb-4">No products found.</p>
          <button
            onClick={() => navigate("/products/new")}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 shadow-md"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-[var(--bg-card)] rounded-3xl shadow-lg border border-[var(--border)] overflow-hidden hover:shadow-2xl transition-all duration-200 group"
            >
              <div className="aspect-video bg-[var(--bg-muted)] flex items-center justify-center overflow-hidden">
                <img 
                  src={product.images?.[0] || 'https://via.placeholder.com/300x200'} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                    className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:opacity-90 flex items-center justify-center gap-2 shadow-md"
                    onClick={() => navigate(`/products/edit/${product._id}`)}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    className="px-4 py-2 border border-[var(--border)] rounded-xl hover:bg-[var(--bg-muted)] flex items-center justify-center shadow-sm"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-2 border border-red-300 text-red-500 rounded-xl hover:bg-red-50 flex items-center justify-center shadow-sm"
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
  );
}
