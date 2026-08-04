import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Zap, PackageX } from "lucide-react";
import { getSettings, updateFlashSaleStatus, getFlashSaleProducts } from "../services/adminService";
import { updateProduct } from "../services/productService";

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-[var(--color-primary)]" : "bg-[var(--border)]"
      }`}
      style={{ width: 52 }}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function FlashSalePage() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setEnabled(Boolean(data?.flashSaleEnabled));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load flash sale settings");
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const data = await getFlashSaleProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load flash sale products");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    loadProducts();
  }, []);

  const handleToggle = async (next) => {
    setSaving(true);
    try {
      const data = await updateFlashSaleStatus(next);
      setEnabled(Boolean(data?.flashSaleEnabled));
      toast.success(next ? "Flash Sale enabled" : "Flash Sale disabled");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update flash sale status");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (product) => {
    setRemovingId(product._id);
    try {
      await updateProduct(product._id, { isFlashSale: false });
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success("Removed from Flash Sale");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove product");
    } finally {
      setRemovingId("");
    }
  };

  return (
    <section className="min-h-screen bg-[var(--bg-main)] px-6 pb-16 pt-8 text-[var(--text-primary)] md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight">Flash Sale</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Turn the storefront Flash Sale on or off, and manage which products vendors have added to it.
          </p>
        </div>

        {/* Toggle card */}
        <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                enabled ? "bg-gradient-to-br from-orange-500 to-amber-400" : "bg-[var(--bg-muted)]"
              }`}
            >
              <Zap className={enabled ? "text-white" : "text-[var(--text-secondary)]"} size={22} />
            </div>
            <div>
              <p className="text-base font-bold">
                Flash Sale is currently {loading ? "..." : enabled ? "ON" : "OFF"}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {enabled
                  ? "Vendors can add products to Flash Sale, and it's visible on the storefront."
                  : "Vendors cannot add products to Flash Sale, and the storefront section is hidden."}
              </p>
            </div>
          </div>
          <Toggle checked={enabled} onChange={handleToggle} disabled={loading || saving} />
        </div>

        {/* Products currently in flash sale */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-base font-bold">Products in Flash Sale</h2>
            <span className="text-xs text-[var(--text-secondary)]">{products.length} product(s)</span>
          </div>

          {productsLoading ? (
            <div className="px-6 py-10 text-center text-sm text-[var(--text-secondary)]">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-muted)]">
                <PackageX className="h-5 w-5 text-[var(--text-secondary)]" />
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                No vendor has added a product to Flash Sale yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {products.map((product) => (
                <div key={product._id} className="flex items-center gap-4 px-6 py-4">
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/60"}
                    alt={product.name}
                    className="h-14 w-14 shrink-0 rounded-lg border border-[var(--border)] bg-[var(--bg-muted)] object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{product.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {product.vendor?.storeName || "Vendor"} · Rs. {product.price}
                      {product.oldPrice ? (
                        <span className="ml-1 text-[var(--text-muted)] line-through">Rs. {product.oldPrice}</span>
                      ) : null}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(product)}
                    disabled={removingId === product._id}
                    className="shrink-0 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                  >
                    {removingId === product._id ? "Removing..." : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
