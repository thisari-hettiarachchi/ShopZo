
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProducts, updateProduct } from "../services/productService";
import { Save, ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "General",
    rating: 0,
    sizes: ["S", "M", "L"],
  });
  const [images, setImages] = useState([""]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProducts();
        const product = res.data.find((p) => p._id === id);
        if (!product) {
          setError("Product not found");
          return;
        }
        setForm({
          name: product.name || "",
          price: product.price || "",
          stock: product.stock || "",
          description: product.description || "",
          category: product.category || "General",
          rating: product.rating || 0,
          sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L"],
        });
        setImages(product.images && product.images.length > 0 ? product.images : [""]);
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const onChange = (key) => (e) => {
    let value = e.target.value;
    // For sizes (comma separated)
    if (key === "sizes") {
      value = value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    // For rating and price/stock
    if (key === "rating" || key === "price" || key === "stock") {
      value = Number(value);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };


  // For file input
  // Helper to convert file to base64
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
    // For preview, create local URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages(urls);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let imagesToSend = images;
      // If new files are selected, convert them to base64
      if (selectedFiles.length > 0) {
        imagesToSend = await Promise.all(selectedFiles.map(fileToBase64));
      } else {
        // If no new files, keep only valid images (not blob URLs)
        imagesToSend = images.filter((img) => img && !img.startsWith("blob:"));
      }
      // If no images, use a placeholder for preview, but don't send to backend
      if (imagesToSend.length === 0) {
        setError("Please select at least one product image.");
        setLoading(false);
        return;
      }
      // Ensure required fields are always valid
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: (imagesToSend.length > 0 ? imagesToSend : ["https://via.placeholder.com/150"]),
        category: form.category,
        rating: Number(form.rating),
        sizes: (form.sizes && form.sizes.length > 0) ? form.sizes : ["S", "M", "L"],
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

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

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
          <h2 className="text-xl font-bold mt-2">Edit Product</h2>
          <p className="text-sm text-[var(--text-secondary)]">Update your product details.</p>
        </div>
        <button
          type="submit"
          form="edit-product-form"
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center gap-2"
        >
          <Save size={18} />
          Save
        </button>
      </div>
      <form
        id="edit-product-form"
        onSubmit={onSubmit}
        className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <input
                        value={form.category}
                        onChange={onChange("category")}
                        className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="Category"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <input
                        type="number"
                        value={form.rating}
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={onChange("rating")}
                        className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="Rating (0-5)"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
                      <input
                        value={form.sizes.join(", ")}
                        onChange={onChange("sizes")}
                        className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                        placeholder="e.g. S, M, L, XL"
                        required
                      />
                    </div>
          <div>
            <label className="block text-sm font-medium mb-2">Product Name</label>
            <input
              value={form.name}
              onChange={onChange("name")}
              className="w-full px-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="e.g. Wireless Headphones"
              required
            />
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
            <label className="block text-sm font-medium mb-2">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:opacity-90"
            />
            {(selectedFiles.length > 0 || (images.length > 0 && images[0])) && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img && !img.startsWith("blob:") ? img : "https://placehold.co/100x100?text=No+Image"}
                    alt={`Preview ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
