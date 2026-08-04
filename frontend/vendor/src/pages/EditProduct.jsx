import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import { Save, ArrowLeft, Zap, ImagePlus, Loader } from "lucide-react";
import { getCategories } from "../services/categoryService";
import { getFlashSaleStatus } from "../services/settingsService";
import PageHeader from "../components/shared/PageHeader";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    rating: 0,
    sizes: ["S", "M", "L"],
    isFlashSale: false,
  });
  const [images, setImages] = useState([""]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flashSaleEnabled, setFlashSaleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const categoryOptions = Array.from(
    new Set(
      [form.category, ...categories.map((cat) => cat?.name)].filter(Boolean)
    )
  );
  const hasCategories = categoryOptions.length > 0;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();

    const fetchFlashSaleStatus = async () => {
      try {
        const res = await getFlashSaleStatus();
        setFlashSaleEnabled(Boolean(res.data?.flashSaleEnabled));
      } catch {
        setFlashSaleEnabled(false);
      }
    };
    fetchFlashSaleStatus();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetching(true);
        const res = await getProductById(id);
        const product = res.data;
        if (!product) {
          setError("Product not found");
          return;
        }
        setForm({
          name: product.name || "",
          price: product.price || "",
          stock: product.stock || "",
          description: product.description || "",
          category: product.category || "",
          rating: product.rating || 0,
          sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L"],
          isFlashSale: Boolean(product.isFlashSale),
        });
        setImages(product.images && product.images.length > 0 ? product.images : [""]);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to fetch product");
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id]);

  const onChange = (key) => (e) => {
    let value = e.target.value;
    if (key === "sizes") {
      value = value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (key === "rating" || key === "price" || key === "stock") {
      value = Number(value);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let imagesToSend = images;
      if (selectedFiles.length > 0) {
        imagesToSend = await Promise.all(selectedFiles.map(fileToBase64));
      } else {
        imagesToSend = images.filter((img) => img && !img.startsWith("blob:"));
      }
      if (imagesToSend.length === 0) {
        setError("Please select at least one product image.");
        setLoading(false);
        return;
      }
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: (imagesToSend.length > 0 ? imagesToSend : ["https://via.placeholder.com/150"]),
        category: form.category,
        rating: Number(form.rating),
        sizes: (form.sizes && form.sizes.length > 0) ? form.sizes : ["S", "M", "L"],
        isFlashSale: flashSaleEnabled ? Boolean(form.isFlashSale) : false,
        description: form.description || "No description provided.",
      };
      await updateProduct(id, payload);
      navigate("/products");
    } catch (err) {
      setError("Failed to update product. Please check all required fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] text-[var(--text-secondary)]">
        <Loader className="mr-2 animate-spin" />
        Loading product...
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
            {error}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text-primary)]"
              >
                <ArrowLeft size={16} />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Inventory Workspace"
          title="Edit Product"
          description="Update pricing, stock, media, and listing details."
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
                form="edit-product-form"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          }
        />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          id="edit-product-form"
          onSubmit={onSubmit}
          className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Product Name</label>
              <input
                value={form.name}
                onChange={onChange("name")}
                className={inputClass}
                placeholder="e.g. Wireless Headphones"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Category</label>
              <select
                value={form.category}
                onChange={onChange("category")}
                disabled={!hasCategories}
                className={inputClass}
                required
              >
                {hasCategories ? (
                  categoryOptions.map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Price</label>
              <input
                value={form.price}
                onChange={onChange("price")}
                className={inputClass}
                placeholder="29.99"
                inputMode="decimal"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Stock</label>
              <input
                value={form.stock}
                onChange={onChange("stock")}
                className={inputClass}
                placeholder="50"
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Rating</label>
              <input
                type="number"
                value={form.rating}
                min={0}
                max={5}
                step={0.1}
                onChange={onChange("rating")}
                className={inputClass}
                placeholder="Rating (0-5)"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Sizes (comma separated)</label>
              <input
                value={form.sizes.join(", ")}
                onChange={onChange("sizes")}
                className={inputClass}
                placeholder="e.g. S, M, L, XL"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Product Images</label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-main)] px-4 py-6 text-center transition hover:border-[var(--color-primary)]">
                <ImagePlus size={22} className="text-[var(--color-primary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Click to replace images</span>
                <span className="text-xs text-[var(--text-secondary)]">PNG, JPG — multiple files supported</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                  className="hidden"
                />
              </label>
              {(selectedFiles.length > 0 || (images.length > 0 && images[0])) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img || "https://placehold.co/100x100?text=No+Image"}
                      alt={`Preview ${idx + 1}`}
                      className="h-20 w-20 rounded-xl border border-[var(--border)] object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {flashSaleEnabled && (
              <div className="md:col-span-2">
                <label
                  htmlFor="isFlashSale"
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition ${
                    form.isFlashSale
                      ? "border-orange-300 bg-orange-50"
                      : "border-[var(--border)] bg-[var(--bg-main)]"
                  }`}
                >
                  <input
                    id="isFlashSale"
                    type="checkbox"
                    checked={form.isFlashSale}
                    onChange={(e) => setForm((prev) => ({ ...prev, isFlashSale: e.target.checked }))}
                    className="h-4 w-4 accent-orange-500"
                  />
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <Zap size={16} className="text-orange-500" />
                    Add this product to Flash Sale
                  </span>
                </label>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Description</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={onChange("description")}
                className={inputClass}
                placeholder="Short description about the product..."
              />
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
