import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, PackagePlus, Save, Zap, ImagePlus, X } from "lucide-react";
import { addProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getVendorProfile } from "../services/vendorService";
import { getFlashSaleStatus } from "../services/settingsService";
import { readVendorSession } from "../utils/authStorage";
import {
  getDefaultSizesForCategory,
  getSizeFieldLabel,
  getSizeOptionsForCategory,
} from "../utils/productSizeOptions";
import {
  PRODUCT_COLOR_OPTIONS,
  MAX_COLOR_IMAGES,
  normalizeColors,
} from "../utils/productColorOptions";
import PageHeader from "../components/shared/PageHeader";

const MAX_IMAGES = 5;

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
    sizes: [],
    colors: [],
    oldPrice: 0,
    discount: 0,
    isFlashSale: false,
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [flashSaleEnabled, setFlashSaleEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendorStatus, setVendorStatus] = useState(() => readVendorSession()?.accountStatus || (readVendorSession()?.isApproved ? "approved" : "pending"));

  const categoryOptions = Array.from(
    new Set(categories.map((cat) => cat?.name).filter(Boolean))
  );
  const hasCategories = categoryOptions.length > 0;
  const sizeOptions = getSizeOptionsForCategory(form.category);
  const sizeLabel = getSizeFieldLabel(form.category);

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
        setCategoriesError("");
        const res = await getCategories();
        const list = Array.isArray(res.data) ? res.data : [];
        setCategories(list);
        if (list.length > 0) {
          setForm((prev) => {
            const nextCategory = prev.category || list[0].name;
            return {
              ...prev,
              category: nextCategory,
              sizes: prev.category
                ? prev.sizes
                : getDefaultSizesForCategory(nextCategory),
            };
          });
        } else {
          setCategoriesError(
            "No categories have been added by the admin yet. Please check back later."
          );
        }
      } catch (err) {
        setCategories([]);
        setCategoriesError(
          "Could not load categories. Make sure the admin/vendor API is running, then refresh."
        );
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
    if (["price", "stock", "oldPrice", "discount"].includes(key)) {
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

  const toggleColor = (color) => {
    setForm((prev) => {
      const exists = prev.colors.some(
        (item) => item.hex.toLowerCase() === color.hex.toLowerCase()
      );
      const colors = exists
        ? prev.colors.filter((item) => item.hex.toLowerCase() !== color.hex.toLowerCase())
        : [...prev.colors, { ...color, images: [] }];
      return { ...prev, colors };
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

  const onColorFileChange = async (hex, e) => {
    const incoming = Array.from(e.target.files || []);
    e.target.value = "";
    if (!incoming.length) return;

    const current =
      form.colors.find((c) => c.hex.toLowerCase() === hex.toLowerCase())?.images || [];
    const remaining = MAX_COLOR_IMAGES - current.length;
    if (remaining <= 0) {
      toast.error(`Max ${MAX_COLOR_IMAGES} photos per color.`);
      return;
    }

    const filesToAdd = incoming.slice(0, remaining);
    if (incoming.length > remaining) {
      toast.info(`Only ${remaining} more photo${remaining === 1 ? "" : "s"} for this color.`);
    }

    try {
      const base64s = await Promise.all(filesToAdd.map(fileToBase64));
      setForm((prev) => ({
        ...prev,
        colors: prev.colors.map((c) =>
          c.hex.toLowerCase() === hex.toLowerCase()
            ? {
                ...c,
                images: [...(c.images || []), ...base64s].slice(0, MAX_COLOR_IMAGES),
              }
            : c
        ),
      }));
    } catch {
      toast.error("Failed to read color images");
    }
  };

  const removeColorImage = (hex, index) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c) =>
        c.hex.toLowerCase() === hex.toLowerCase()
          ? { ...c, images: (c.images || []).filter((_, i) => i !== index) }
          : c
      ),
    }));
  };

  const onFileChange = (e) => {
    const incoming = Array.from(e.target.files || []);
    e.target.value = "";
    if (!incoming.length) return;

    const remaining = MAX_IMAGES - selectedFiles.length;
    if (remaining <= 0) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const filesToAdd = incoming.slice(0, remaining);
    if (incoming.length > remaining) {
      toast.info(`Only ${remaining} more image${remaining === 1 ? "" : "s"} can be added (max ${MAX_IMAGES}).`);
    }

    const urls = filesToAdd.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...filesToAdd].slice(0, MAX_IMAGES));
    setImagePreviews((prev) => [...prev, ...urls].slice(0, MAX_IMAGES));
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
    if (!canAddProducts) {
      toast.error("Your vendor account must be approved before you can add products.");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please upload at least 1 product image.");
      return;
    }
    if (selectedFiles.length > MAX_IMAGES) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }
    setLoading(true);
    try {
      const base64Images = await Promise.all(selectedFiles.map(fileToBase64));
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: base64Images.slice(0, MAX_IMAGES),
        category: form.category,
        sizes: Array.isArray(form.sizes) ? form.sizes : [],
        colors: normalizeColors(form.colors),
        oldPrice: Number(form.oldPrice),
        discount: Number(form.discount),
        isFlashSale: flashSaleEnabled ? Boolean(form.isFlashSale) : false,
        description: form.description || "No description provided.",
      };
      await addProduct(payload);
      navigate("/products");
    } catch (error) {
      console.error("Failed to add product", error);
      toast.error(error?.response?.data?.message || "Failed to add product");
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
              {!hasCategories && categoriesError && (
                <p className="mt-1.5 text-xs text-amber-600">{categoriesError}</p>
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
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                {sizeLabel}
              </label>
              <details className={`group relative ${!canAddProducts ? "pointer-events-none opacity-60" : ""}`}>
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
                  Default product images
                </label>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {imagePreviews.length}/{MAX_IMAGES}
                </span>
              </div>
              <label
                className={`flex min-h-[46px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-main)] px-3 py-3 text-center transition hover:border-[var(--color-primary)] ${
                  !canAddProducts || imagePreviews.length >= MAX_IMAGES
                    ? "pointer-events-none opacity-60"
                    : ""
                }`}
              >
                <ImagePlus size={18} className="text-[var(--color-primary)]" />
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {imagePreviews.length >= MAX_IMAGES
                    ? "Maximum 5 images reached"
                    : "Click to upload images"}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  PNG, JPG — up to {MAX_IMAGES}. Used when a color has no photos.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                  disabled={!canAddProducts || imagePreviews.length >= MAX_IMAGES}
                  className="hidden"
                />
              </label>
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {imagePreviews.map((img, idx) => (
                    <div key={`${img}-${idx}`} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="h-16 w-16 rounded-xl border border-[var(--border)] object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        disabled={!canAddProducts}
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                Colors
              </label>
              <div className={`flex flex-wrap gap-2.5 ${!canAddProducts ? "pointer-events-none opacity-60" : ""}`}>
                {PRODUCT_COLOR_OPTIONS.map((color) => {
                  const checked = form.colors.some(
                    (item) => item.hex.toLowerCase() === color.hex.toLowerCase()
                  );
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      title={color.name}
                      onClick={() => toggleColor(color)}
                      className={`relative h-9 w-9 rounded-full border-2 transition ${
                        checked
                          ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                          : "border-[var(--border)] hover:border-[var(--color-primary)]/50"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-pressed={checked}
                    >
                      {checked && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                            color.hex.toLowerCase() === "#ffffff" || color.hex.toLowerCase() === "#d6c3a5"
                              ? "text-gray-800"
                              : "text-white"
                          }`}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                Optional — tick the color circles customers can choose from.
                {form.colors.length > 0 ? ` Selected: ${form.colors.map((c) => c.name).join(", ")}` : ""}
              </p>

              {form.colors.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Photos by color
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      Add photos for each color so shoppers see that look when they select it.
                    </p>
                  </div>
                  {form.colors.map((color) => {
                    const colorImages = color.images || [];
                    return (
                      <div
                        key={color.hex}
                        className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-3"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-5 w-5 rounded-full border border-[var(--border)]"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {color.name}
                            </span>
                          </div>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {colorImages.length}/{MAX_COLOR_IMAGES}
                          </span>
                        </div>
                        <label
                          className={`flex min-h-[40px] cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] px-3 py-2 text-xs transition hover:border-[var(--color-primary)] ${
                            !canAddProducts || colorImages.length >= MAX_COLOR_IMAGES
                              ? "pointer-events-none opacity-60"
                              : ""
                          }`}
                        >
                          <ImagePlus size={14} className="text-[var(--color-primary)]" />
                          <span>
                            {colorImages.length >= MAX_COLOR_IMAGES
                              ? "Maximum reached"
                              : `Upload ${color.name} photos`}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={!canAddProducts || colorImages.length >= MAX_COLOR_IMAGES}
                            onChange={(e) => onColorFileChange(color.hex, e)}
                          />
                        </label>
                        {colorImages.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {colorImages.map((img, idx) => (
                              <div key={`${color.hex}-${idx}`} className="relative">
                                <img
                                  src={img}
                                  alt={`${color.name} ${idx + 1}`}
                                  className="h-14 w-14 rounded-lg object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeColorImage(color.hex, idx)}
                                  className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-0.5 text-white"
                                  aria-label="Remove"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
