import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";

export default function EditProductPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);
        setForm({
          name: product?.name || "",
          price: product?.price ?? "",
          stock: product?.stock ?? "",
          description: product?.description || "",
        });
      } catch (requestError) {
        const message = requestError?.response?.data?.message || "Failed to load product";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateProduct(id, {
        name: form.name,
        price: form.price === "" ? undefined : Number(form.price),
        stock: form.stock === "" ? undefined : Number(form.stock),
        description: form.description,
      });
      setSuccess("Product updated successfully");
    } catch (requestError) {
      const message = requestError?.response?.data?.message || "Failed to update product";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

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

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        {loading ? (
          <p className="text-[var(--text-secondary)]">Loading product...</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <p className="text-sm text-[var(--text-secondary)]">Editing product ID: {id}</p>

            <div>
              <label className="block text-sm mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-1" htmlFor="stock">
                  Stock
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
