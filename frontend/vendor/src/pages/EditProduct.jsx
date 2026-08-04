import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import { toast } from "react-toastify";
import { Save, ArrowLeft, Zap, ImagePlus, Loader, X } from "lucide-react";
import { getCategories } from "../services/categoryService";
import { getFlashSaleStatus } from "../services/settingsService";
import {
  getDefaultSizesForCategory,
  getSizeFieldLabel,
  getSizeOptionsForCategory,
} from "../utils/productSizeOptions";
import PageHeader from "../components/shared/PageHeader";

const MAX_IMAGES = 5;

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
    sizes: [],
    isFlashSale: false,
  });
  const [imagePreviews, setImagePreviews] = useState([]);
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
  const sizeOptions = [
    ...getSizeOptionsForCategory(form.category),
    ...form.sizes.filter(
      (size) => !getSizeOptionsForCategory(form.category).includes(size)
    ),
  ];
  const sizeLabel = getSizeFieldLabel(form.category);

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
          sizes:
            product.sizes && product.sizes.length > 0
              ? product.sizes
              : getDefaultSizesForCategory(product.category || ""),
          isFlashSale: Boolean(product.isFlashSale),
        });
        const existingImages = Array.isArray(product.images)
          ? product.images.filter(Boolean).slice(0, MAX_IMAGES)
          : [];
        setImagePreviews(existingImages);
        setSelectedFiles(existingImages.map(() => null));
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
    if (key === "price" || key === "stock") {
      value = Number(value);
    }

    if (key === "category") {
      setForm((prev) => ({
        ...prev,
        category: value,
        sizes: getDefaultSizesForCategory(value),
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSize = (size) => {
    setForm((prev) => {
      const exists = prev.sizes.includes(size);
      const sizes = exists
        ? prev.sizes.filter((item) => item !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
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
    const incoming = Array.from(e.target.files || []);
    e.target.value = "";
    if (!incoming.length) return;

    const remaining = MAX_IMAGES - imagePreviews.length;
    if (remaining <= 0) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const filesToAdd = incoming.slice(0, remaining);
    if (incoming.length > remaining) {
      toast.info(`Only ${remaining} more image${remaining === 1 ? "" : "s"} can be added (max ${MAX_IMAGES}).`);
    }

    const urls = filesToAdd.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...urls].slice(0, MAX_IMAGES));
    setSelectedFiles((prev) => [...prev, ...filesToAdd].slice(0, MAX_IMAGES));
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => {
      const url = prev[index];
      if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (imagePreviews.length === 0) {
        setError("Please keep or upload at least 1 product image.");
        setLoading(false);
        return;
      }

      const imagesToSend = await Promise.all(
        imagePreviews.map(async (preview, index) => {
          const file = selectedFiles[index];
          if (file) return fileToBase64(file);
          return preview;
        })
      );

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: imagesToSend.slice(0, MAX_IMAGES),
        category: form.category,
        sizes: Array.isArray(form.sizes) ? form.sizes : [],
        isFlashSale: flashSaleEnabled ? Boolean(form.isFlashSale) : false,
        description: form.description || "No description provided.",
      };
      await updateProduct(id, payload);
      navigate("/products");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to update product. Please check all required fields and try again."
      );
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
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                {sizeLabel}
              </label>
              <details className="group relative">
                <summary className={`${inputClass} flex list-none cursor-pointer items-center justify-between gap-2 [&::-webkit-details-marker]:hidden`}>
                  <span className={form.sizes.length ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}>
                    {form.sizes.length > 0 ? form.sizes.join(", ") : "None (optional)"}
                  </span>
                  <span className="text-[var(--text-secondary)] transition group-open:rotate-180">▾</span>
                </summary>
                <div className="absolute z-20 mt-2 max-h-52 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-2 shadow-lg">
                  {sizeOptions.map((size) => {
                    const checked = form.sizes.includes(size);
                    return (
                      <label
                        key={size}
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm hover:bg-[var(--bg-main)]"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSize(size)}
                          className="h-3.5 w-3.5 accent-[var(--color-primary)]"
                        />
                        <span className="text-[var(--text-primary)]">{size}</span>
                      </label>
                    );
                  })}
                </div>
              </details>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                Optional — leave empty if this product has no size or variant. Options update by category.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="block text-sm font-medium text-[var(--text-primary)]">
                  Product Images
                </label>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {imagePreviews.length}/{MAX_IMAGES}
                </span>
              </div>
              <label
                className={`flex min-h-[46px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-main)] px-3 py-3 text-center transition hover:border-[var(--color-primary)] ${
                  imagePreviews.length >= MAX_IMAGES ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <ImagePlus size={18} className="text-[var(--color-primary)]" />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {imagePreviews.length >= MAX_IMAGES
                    ? "Maximum 5 images reached"
                    : "Click to add more images"}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  PNG, JPG — up to {MAX_IMAGES}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                  disabled={imagePreviews.length >= MAX_IMAGES}
                  className="hidden"
                />
              </label>
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imagePreviews.map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative">
                      <img
                        src={img || "https://placehold.co/100x100?text=No+Image"}
                        alt={`Preview ${idx + 1}`}
                        className="h-16 w-16 rounded-xl border border-[var(--border)] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow"
                        aria-label={`Remove image ${idx + 1}`}
                      >
                        <X size={12} />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          Cover
                        </span>
                      )}
                    </div>
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
