import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, PackagePlus, Save, Zap, ImagePlus } from "lucide-react";
import { addProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getVendorProfile } from "../services/vendorService";
import { getFlashSaleStatus } from "../services/settingsService";
import { readVendorSession } from "../utils/authStorage";
import PageHeader from "../components/shared/PageHeader";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2.5 text-sm focus:border-[var(--color-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

export default function AddProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    sizes: ["S", "M", "L"],
    rating: 0,
    oldPrice: 0,
    discount: 0,
    isFlashSale: false,
  });
  const [images, setImages] = useState([""]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flashSaleEnabled, setFlashSaleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendorStatus, setVendorStatus] = useState(() => readVendorSession()?.accountStatus || (readVendorSession()?.isApproved ? "approved" : "pending"));

  const categoryOptions = Array.from(
    new Set(categories.map((cat) => cat?.name).filter(Boolean))
  );
  const hasCategories = categoryOptions.length > 0;

  useEffect(() => {
    const fetchProfileStatus = async () => {
      try {
        const res = await getVendorProfile();
        const vendor = res.data?.vendor;
        if (vendor) {
          setVendorStatus(String(vendor.accountStatus || (vendor.isApproved ? "approved" : "pending")).toLowerCase());
        }
      } catch {
        // keep session fallback
      }
    };

    fetchProfileStatus();

    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const list = Array.isArray(res.data) ? res.data : [];
        setCategories(list);
        if (list.length > 0) {
          setForm((prev) => ({ ...prev, category: prev.category || list[0].name }));
        }
      } catch (err) {
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
    // eslint-disable-next-line
  }, []);

  const canAddProducts = vendorStatus === "approved";

  const onChange = (key) => (e) => {
    let value = e.target.value;
    if (key === "sizes") {
      value = value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (["price", "stock", "rating", "oldPrice", "discount"].includes(key)) {
      value = Number(value);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canAddProducts) {
      toast.error("Your vendor account must be approved before you can add products.");
      return;
    }
    setLoading(true);
    try {
      let base64Images = [];
      if (selectedFiles.length > 0) {
        base64Images = await Promise.all(selectedFiles.map(fileToBase64));
      }
      const filteredImages = base64Images.length > 0
        ? base64Images
        : images.filter((img) => img.trim() !== "");
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: (filteredImages.length > 0 ? filteredImages : ["https://via.placeholder.com/150"]),
        category: form.category,
        sizes: (form.sizes && form.sizes.length > 0) ? form.sizes : ["S", "M", "L"],
        rating: Number(form.rating),
        oldPrice: Number(form.oldPrice),
        discount: Number(form.discount),
        isFlashSale: flashSaleEnabled ? Boolean(form.isFlashSale) : false,
        description: form.description || "No description provided.",
      };
      await addProduct(payload);
      navigate("/products");
    } catch (error) {
      console.error("Failed to add product", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Inventory Workspace"
          title="Add Product"
          description="Create a new listing with pricing, stock, and media."
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
                form="add-product-form"
                disabled={!canAddProducts || loading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save"}
              </button>
            </>
          }
        />

        {!canAddProducts && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Product creation is disabled until an admin approves your vendor account. Use the dashboard request button to notify them.
          </div>
        )}

        <form
          id="add-product-form"
          onSubmit={onSubmit}
          className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Product Name</label>
              <div className="relative">
                <PackagePlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  value={form.name}
                  onChange={onChange("name")}
                  disabled={!canAddProducts}
                  className={`${inputClass} pl-10`}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Category</label>
              <select
                value={form.category}
                onChange={onChange("category")}
                disabled={!canAddProducts || !hasCategories}
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
              {!hasCategories && (
                <p className="mt-1.5 text-xs text-amber-600">
                  No categories have been added by the admin yet. Please check back later.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Price</label>
              <input
                value={form.price}
                onChange={onChange("price")}
                disabled={!canAddProducts}
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
                disabled={!canAddProducts}
                className={inputClass}
                placeholder="50"
                inputMode="numeric"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Sizes (comma separated)</label>
              <input
                value={form.sizes.join(", ")}
                onChange={onChange("sizes")}
                disabled={!canAddProducts}
                className={inputClass}
                placeholder="e.g. S, M, L, XL"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">Product Images</label>
              <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-main)] px-4 py-6 text-center transition hover:border-[var(--color-primary)] ${!canAddProducts ? "pointer-events-none opacity-60" : ""}`}>
                <ImagePlus size={22} className="text-[var(--color-primary)]" />
                <span className="text-sm font-medium text-[var(--text-primary)]">Click to upload images</span>
                <span className="text-xs text-[var(--text-secondary)]">PNG, JPG — multiple files supported</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                  disabled={!canAddProducts}
                  className="hidden"
                />
              </label>
              {selectedFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
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
                    disabled={!canAddProducts}
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
                disabled={!canAddProducts}
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
              disabled={loading || !canAddProducts}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
