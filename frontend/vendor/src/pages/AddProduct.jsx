import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus, Save } from "lucide-react";
import { addProduct } from "../services/productService";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    status: "Available",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.image ? [form.image] : ["https://via.placeholder.com/150"],
      });
      navigate("/products");
    } catch (error) {
      console.error("Failed to add product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>
          <h2 className="text-xl font-bold mt-2">Add Product</h2>
          <p className="text-sm text-[var(--text-secondary)]">Create a new product for your store.</p>
        </div>
        <button
          type="submit"
          form="add-product-form"
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center gap-2"
        >
          <Save size={18} />
          Save
        </button>
      </div>

      <form
        id="add-product-form"
        onSubmit={onSubmit}
        className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <div className="relative">
              <PackagePlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                value={form.name}
                onChange={onChange("name")}
                className="w-full pl-10 pr-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="e.g. Wireless Headphones"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={form.status}
              onChange={onChange("status")}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="Available">Available</option>
              <option value="Limited">Limited</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              value={form.price}
              onChange={onChange("price")}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="29.99"
              inputMode="decimal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              value={form.stock}
              onChange={onChange("stock")}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="50"
              inputMode="numeric"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              value={form.image}
              onChange={onChange("image")}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={onChange("description")}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Short description about the product..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-4 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
