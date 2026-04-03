import { useEffect, useMemo, useState } from "react";
import { Plus, TicketPercent, Trash2 } from "lucide-react";
import { createCoupon, deleteCoupon, getCoupons, updateCoupon } from "../services/featureService";

const initialForm = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  minOrderAmount: "",
  maxDiscountAmount: "",
  usageLimit: "",
  expiresAt: "",
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await getCoupons();
      setCoupons(res.data || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const stats = useMemo(() => {
    const active = coupons.filter((coupon) => coupon.isActive).length;
    const expiringSoon = coupons.filter((coupon) => {
      if (!coupon.expiresAt) return false;
      const diff = new Date(coupon.expiresAt).getTime() - Date.now();
      return diff > 0 && diff < 1000 * 60 * 60 * 24 * 7;
    }).length;
    return { total: coupons.length, active, expiringSoon };
  }, [coupons]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await createCoupon({
        ...form,
        value: Number(form.value || 0),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      });
      setForm(initialForm);
      await loadCoupons();
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleToggle = async (coupon) => {
    await updateCoupon(coupon._id, { isActive: !coupon.isActive });
    await loadCoupons();
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm("Delete this coupon?")) return;
    await deleteCoupon(couponId);
    await loadCoupons();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_20px_55px_-38px_var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">Marketing Tools</p>
          <h1 className="mt-2 text-3xl font-black text-[var(--text-primary)]">Discounts & Coupons</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Create targeted offers and keep conversion high with controlled discount campaigns.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Coupons", value: stats.total },
            { label: "Active", value: stats.active },
            { label: "Expiring < 7 Days", value: stats.expiringSoon },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)]">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-[var(--text-primary)]">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <form onSubmit={handleCreate} className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <h2 className="text-lg font-bold">Create Coupon</h2>
            <div className="mt-4 grid gap-3">
              <input placeholder="Code (e.g. SUMMER20)" value={form.code} onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm" required />
              <input placeholder="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm">
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat Amount</option>
                </select>
                <input type="number" min="0" placeholder="Value" value={form.value} onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min="0" placeholder="Min Order" value={form.minOrderAmount} onChange={(event) => setForm((prev) => ({ ...prev, minOrderAmount: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm" />
                <input type="number" min="0" placeholder="Max Discount" value={form.maxDiscountAmount} onChange={(event) => setForm((prev) => ({ ...prev, maxDiscountAmount: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min="1" placeholder="Usage Limit" value={form.usageLimit} onChange={(event) => setForm((prev) => ({ ...prev, usageLimit: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm" />
                <input type="datetime-local" value={form.expiresAt} onChange={(event) => setForm((prev) => ({ ...prev, expiresAt: event.target.value }))} className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm" />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white">
                <Plus size={16} />
                Create Coupon
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <h2 className="text-lg font-bold">Coupon Library</h2>
            {loading ? (
              <p className="mt-4 text-sm text-[var(--text-secondary)]">Loading coupons...</p>
            ) : coupons.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--text-secondary)]">No coupons yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <TicketPercent size={16} className="text-[var(--color-primary)]" />
                        <p className="font-semibold tracking-wide">{coupon.code}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${coupon.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                        {coupon.isActive ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{coupon.description || "No description"}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <span>Value: {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}</span>
                      <span>Used: {coupon.usedCount}</span>
                      {coupon.expiresAt && <span>Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</span>}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => handleToggle(coupon)} className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--bg-muted)]">
                        {coupon.isActive ? "Pause" : "Activate"}
                      </button>
                      <button onClick={() => handleDelete(coupon._id)} className="inline-flex items-center gap-1 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
