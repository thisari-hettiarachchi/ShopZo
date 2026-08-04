import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { createProduct, getVendors } from "../services/adminService";
import PageHeader from "../components/shared/PageHeader";

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
  const navigate = useNavigate();
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

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none";

  return (
    <section className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Inventory"
          title="Add Product"
          description="Create a new catalog listing and assign it to a vendor."
          actions={
            <>
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)]"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="submit"
                form="add-admin-product-form"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? "Creating..." : "Create"}
              </button>
            </>
          }
        />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form
          id="add-admin-product-form"
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <input name="category" value={form.category} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Price</label>
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Stock</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Old Price</label>
              <input name="oldPrice" type="number" min="0" step="0.01" value={form.oldPrice} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Discount</label>
              <input name="discount" type="number" min="0" step="0.01" value={form.discount} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Rating</label>
              <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Vendor</label>
              <select name="vendor" value={form.vendor} onChange={handleChange} className={inputClass}>
                <option value="">Select a vendor</option>
                {vendorsLoading ? (
                  <option>Loading vendors...</option>
                ) : (
                  vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.storeName || vendor.email || vendor._id}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea name="description" rows={4} value={form.description} onChange={handleChange} className={inputClass} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Images</label>
              <input name="images" value={form.images} onChange={handleChange} placeholder="https://... , https://..." className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Sizes</label>
              <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L" className={inputClass} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[var(--border)] pt-6">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium transition hover:bg-[var(--bg-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:opacity-60"
            >
              <Save size={18} />
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
