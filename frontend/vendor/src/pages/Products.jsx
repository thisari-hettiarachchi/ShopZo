import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Download, Star, Edit, Eye, Trash2, Plus } from "lucide-react";

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

// Sample products
const sampleProducts = [
  { id: 1, name: "Product 1", image: "📦", status: "Available", rating: 4.5, sales: 120, price: 29.99, stock: 50 },
  { id: 2, name: "Product 2", image: "📦", status: "Limited", rating: 4.0, sales: 80, price: 19.99, stock: 15 },
  { id: 3, name: "Product 3", image: "📦", status: "Out of Stock", rating: 3.8, sales: 45, price: 39.99, stock: 0 },
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products] = useState(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Search & Filter */}
      <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] flex gap-4 mb-6">
        <div className="flex-1 relative">
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
        <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-muted)] flex items-center gap-2">
          <Filter size={18} />
          Filter
        </button>
        <button className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-muted)] flex items-center gap-2">
          <Download size={18} />
          Export
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden hover:shadow-md transition"
          >
            <div className="aspect-video bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-6xl">
              {product.image}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{product.name}</h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                >
                  {product.status}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">• {product.sales} sold</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-[var(--color-primary)]">${product.price}</span>
                <span className="text-sm text-[var(--text-secondary)]">Stock: {product.stock}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 flex items-center justify-center gap-2">
                  <Edit size={16} /> Edit
                </button>
                <button className="px-3 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-muted)] flex items-center justify-center">
                  <Eye size={16} />
                </button>
                <button className="px-3 py-2 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
