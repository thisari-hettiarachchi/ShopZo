import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  Megaphone,
  RectangleHorizontal,
  RectangleVertical,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  requestBannerApproval,
} from "../services/bannerService";
import { getVendorProfile } from "../services/vendorService";
import { readVendorSession } from "../utils/authStorage";

const EMPTY_FORM = { image: "", title: "", subtitle: "", layout: "landscape" };

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const STATUS_META = {
  pending: { label: "Pending review", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Live", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-rose-100 text-rose-700", icon: XCircle },
};

export default function PromotionsPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorStatus, setVendorStatus] = useState(
    () => readVendorSession()?.accountStatus || (readVendorSession()?.isApproved ? "approved" : "pending")
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [requestingId, setRequestingId] = useState("");

  const canManageBanners = vendorStatus === "approved";

  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await getBanners();
      setBanners(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load promotion banners");
    } finally {
      setLoading(false);
    }
  };

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
    loadBanners();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEditForm = (banner) => {
    setEditingId(banner._id);
    setForm({
      image: banner.image || "",
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      layout: banner.layout || "landscape",
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setForm((prev) => ({ ...prev, image: base64 }));
    } catch {
      toast.error("Failed to read image file");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.image) {
      toast.error("A banner image is required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateBanner(editingId, form);
        toast.success("Banner updated");
      } else {
        await createBanner(form);
        toast.success("Banner submitted for approval");
      }
      closeForm();
      await loadBanners();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBanner(deleteTarget._id);
      toast.success("Banner deleted");
      setDeleteTarget(null);
      await loadBanners();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  };

  const handleRequestApproval = async (banner) => {
    setRequestingId(banner._id);
    try {
      await requestBannerApproval(banner._id);
      toast.success("Resubmitted for approval");
      await loadBanners();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to request approval");
    } finally {
      setRequestingId("");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_20px_50px_-34px_var(--shadow)] md:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Marketing
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[var(--color-primary)]">Promotions</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Submit banners to be featured on the ShopZo homepage. Every banner is reviewed by an admin before it goes live.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddForm}
            disabled={!canManageBanners}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_var(--shadow)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Add Banner
          </button>
        </div>

        {!canManageBanners && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Promotion banners are locked until your vendor account is approved.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-muted)]">
              <Megaphone className="h-6 w-6 text-[var(--text-secondary)]" />
            </div>
            <p className="text-[var(--text-secondary)]">
              No promotion banners yet. Add one to get featured on the homepage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => {
              const status = STATUS_META[banner.status] || STATUS_META.pending;
              const StatusIcon = status.icon;
              return (
                <div
                  key={banner._id}
                  className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_16px_44px_-32px_var(--shadow)]"
                >
                  <div
                    className="relative w-full overflow-hidden bg-[linear-gradient(145deg,var(--bg-muted),var(--bg-card))]"
                    style={{ aspectRatio: banner.layout === "portrait" ? "3/4" : "16/9" }}
                  >
                    <img src={banner.image} alt={banner.title || "Promotion banner"} className="h-full w-full object-cover" />
                    <span
                      className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${status.color}`}
                    >
                      <StatusIcon size={11} />
                      {status.label}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                      {banner.layout === "portrait" ? <RectangleVertical size={11} /> : <RectangleHorizontal size={11} />}
                      {banner.layout === "portrait" ? "Portrait" : "Landscape"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="truncate text-base font-bold text-[var(--text-primary)]">
                      {banner.title || "Untitled banner"}
                    </h3>
                    {banner.subtitle && (
                      <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">{banner.subtitle}</p>
                    )}

                    {banner.status === "rejected" && banner.moderation?.rejectionReason && (
                      <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {banner.moderation.rejectionReason}
                      </p>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(banner)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] py-1.5 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(banner)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>

                    {banner.status === "rejected" && (
                      <button
                        type="button"
                        onClick={() => handleRequestApproval(banner)}
                        disabled={requestingId === banner._id}
                        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] py-1.5 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                      >
                        <Send size={12} />
                        {requestingId === banner._id ? "Requesting..." : "Request Approval"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {editingId ? "Edit Banner" : "Add Promotion Banner"}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {editingId
                ? "Editing an approved or pending banner does not change its review status."
                : "Your banner will be submitted for admin review automatically."}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Layout</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, layout: "landscape" }))}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                      form.layout === "landscape"
                        ? "border-[var(--color-primary)] bg-[var(--bg-muted)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <div className="h-9 w-16 rounded-md border border-[var(--border)] bg-[var(--bg-main)]" />
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                      <RectangleHorizontal size={13} /> Landscape
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, layout: "portrait" }))}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                      form.layout === "portrait"
                        ? "border-[var(--color-primary)] bg-[var(--bg-muted)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <div className="h-9 w-7 rounded-md border border-[var(--border)] bg-[var(--bg-main)]" />
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]">
                      <RectangleVertical size={13} /> Portrait
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">Banner Image</label>
                <div className="flex items-center gap-4">
                  <div
                    className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-muted)]"
                    style={{
                      width: form.layout === "portrait" ? 60 : 96,
                      height: form.layout === "portrait" ? 80 : 54,
                    }}
                  >
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <ImagePlus size={20} className="text-[var(--text-secondary)]" />
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
                    <ImagePlus size={14} />
                    {form.image ? "Change Image" : "Upload Image"}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Title <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Up to 40% Off"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Subtitle <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. Limited time offer"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="flex-1 rounded-lg border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-main)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Submit for Approval"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-[var(--text-primary)]">Delete Banner</h3>
            <p className="mb-6 text-center text-sm text-[var(--text-secondary)]">
              Are you sure you want to delete this banner? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-main)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
