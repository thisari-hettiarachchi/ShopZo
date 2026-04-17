import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus, Save } from "lucide-react";
import { addProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { getVendorProfile } from "../services/vendorService";
import { readVendorSession } from "../utils/authStorage";

export default function AddProductPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "General",
    sizes: ["S", "M", "L"],
    rating: 0,
    oldPrice: 0,
    discount: 0,
  });
  const [images, setImages] = useState([""]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vendorStatus, setVendorStatus] = useState(() => readVendorSession()?.accountStatus || (readVendorSession()?.isApproved ? "approved" : "pending"));

  const categoryOptions = Array.from(
    new Set([
      "General",
      ...categories.map((cat) => cat?.name).filter(Boolean),
    ])
  );

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
        setCategories(res.data);
        // Set default category if not set
        if (res.data.length > 0 && !form.category) {
          setForm((prev) => ({ ...prev, category: res.data[0].name }));
        }
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const canAddProducts = vendorStatus === "approved";

  const onChange = (key) => (e) => {
    let value = e.target.value;
    // For sizes (comma separated)
    if (key === "sizes") {
      value = value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    // For rating, price, stock, oldPrice, discount
    if (["price", "stock", "rating", "oldPrice", "discount"].includes(key)) {
      value = Number(value);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };


  // For file input
  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    // For preview, create local URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
  };

  const addImageField = () => {
    setImages((prev) => [...prev, ""]);
  };

  const removeImageField = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // Helper to convert File to base64
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
      alert("Your vendor account must be approved before you can add products.");
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
      // Ensure required fields are always valid
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
          disabled={!canAddProducts}
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center gap-2"
        >
          <Save size={18} />
          Save
        </button>
      </div>

      {!canAddProducts && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Product creation is disabled until an admin approves your vendor account. Use the dashboard request button to notify them.
        </div>
      )}

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
                disabled={!canAddProducts}
                className="w-full pl-10 pr-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="e.g. Wireless Headphones"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              value={form.price}
              onChange={onChange("price")}
              disabled={!canAddProducts}
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
              disabled={!canAddProducts}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="50"
              inputMode="numeric"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium mb-2">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFileChange}
              disabled={!canAddProducts}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:opacity-90"
            />
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={form.category}
              onChange={onChange("category")}
              disabled={!canAddProducts}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            >
              {categoryOptions.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
            <input
              value={form.sizes.join(", ")}
              onChange={onChange("sizes")}
              disabled={!canAddProducts}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="e.g. S, M, L, XL"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={onChange("description")}
              disabled={!canAddProducts}
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
            disabled={loading || !canAddProducts}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
