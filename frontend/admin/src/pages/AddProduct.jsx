import { useEffect, useState } from "react";
import { createProduct, getVendors } from "../services/adminService";

const initialForm = {
  name: "",
  price: "",
  stock: "",
  description: "",
  category: "",
  images: "",
  sizes: "",
  rating: "0",
  oldPrice: "",
  discount: "",
  vendor: "",
};

export default function AddProductPage() {
  const [form, setForm] = useState(initialForm);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const data = await getVendors();
        setVendors(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Failed to load vendors");
      } finally {
        setVendorsLoading(false);
      }
    };

    loadVendors();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock || 0),
        description: form.description.trim(),
        category: form.category.trim(),
        images: form.images.split(",").map((item) => item.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
        rating: Number(form.rating || 0),
      };

      if (form.oldPrice !== "") payload.oldPrice = Number(form.oldPrice);
      if (form.discount !== "") payload.discount = Number(form.discount);
      if (form.vendor) payload.vendor = form.vendor;

      await createProduct(payload);
      setSuccess("Product created successfully");
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Add Product</h1>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 space-y-4 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Old Price</label>
            <input name="oldPrice" type="number" min="0" step="0.01" value={form.oldPrice} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Discount</label>
            <input name="discount" type="number" min="0" step="0.01" value={form.discount} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Rating</label>
            <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Vendor</label>
            <select name="vendor" value={form.vendor} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2">
              <option value="">Select a vendor</option>
              {vendorsLoading ? <option>Loading vendors...</option> : vendors.map((vendor) => <option key={vendor._id} value={vendor._id}>{vendor.storeName || vendor.email || vendor._id}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Images</label>
            <input name="images" value={form.images} onChange={handleChange} placeholder="https://... , https://..." className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Sizes</label>
            <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L" className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold disabled:opacity-60">
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </section>
  );
}
