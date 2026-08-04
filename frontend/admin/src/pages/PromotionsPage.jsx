import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Megaphone,
  Check,
  X,
  Trash2,
  EyeOff,
  Eye,
  RectangleHorizontal,
  RectangleVertical,
  Store,
} from "lucide-react";
import {
  getBanners,
  updateBannerStatus,
  updateBannerActive,
  deleteBanner,
} from "../services/adminService";
import PageHeader from "../components/shared/PageHeader";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const STATUS_BADGE = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function PromotionsPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actingId, setActingId] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadBanners = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBanners();
      setBanners(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to load promotion banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return banners;
    return banners.filter((b) => b.status === filter);
  }, [banners, filter]);

  const counts = useMemo(() => {
    return banners.reduce(
      (acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );
  }, [banners]);

  const handleApprove = async (banner) => {
    setActingId(banner._id);
    try {
      await updateBannerStatus(banner._id, { decision: "approve" });
      toast.success("Banner approved and is now live");
      await loadBanners();
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Failed to approve banner");
    } finally {
      setActingId("");
    }
  };

  const openRejectModal = (banner) => {
    setRejectTarget(banner);
    setRejectReason("");
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setActingId(rejectTarget._id);
    try {
      await updateBannerStatus(rejectTarget._id, {
        decision: "reject",
        reason: rejectReason.trim() || "Does not meet our promotion guidelines.",
      });
      toast.success("Banner rejected");
      setRejectTarget(null);
      setRejectReason("");
      await loadBanners();
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Failed to reject banner");
    } finally {
      setActingId("");
    }
  };

  const handleToggleActive = async (banner) => {
    setActingId(banner._id);
    try {
      await updateBannerActive(banner._id, !banner.isActive);
      toast.success(banner.isActive ? "Banner unpublished" : "Banner republished");
      await loadBanners();
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Failed to update banner");
    } finally {
      setActingId("");
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
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Failed to delete banner");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[var(--bg-main)] px-5 pb-10 pt-8 text-[var(--text-primary)] md:px-10 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="Marketing"
          title="Promotions"
          description="Review vendor-submitted promotion banners before they go live on the homepage."
          meta={`${banners.length} banners`}
        >
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
                  filter === f.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                }`}
              >
                {f.label}
                {f.id !== "all" && counts[f.id] ? ` (${counts[f.id]})` : ""}
              </button>
            ))}
          </div>
        </PageHeader>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-muted)]">
              <Megaphone className="h-6 w-6 text-[var(--text-secondary)]" />
            </div>
            <p className="text-[var(--text-secondary)]">No {filter !== "all" ? filter : ""} banners to show.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((banner) => (
              <div
                key={banner._id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]"
              >
                <div
                  className="relative w-full overflow-hidden bg-[var(--bg-muted)]"
                  style={{ aspectRatio: banner.layout === "portrait" ? "3/4" : "16/9" }}
                >
                  <img
                    src={banner.image}
                    alt={banner.title || "Promotion banner"}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                      STATUS_BADGE[banner.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {banner.status}
                  </span>
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                    {banner.layout === "portrait" ? <RectangleVertical size={11} /> : <RectangleHorizontal size={11} />}
                    {banner.layout === "portrait" ? "Portrait" : "Landscape"}
                  </span>
                  {banner.status === "approved" && !banner.isActive && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white">
                      Unpublished
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                    <Store size={12} />
                    {banner.vendor?.storeName || "Unknown vendor"}
                  </div>
                  <h3 className="mt-1 truncate text-base font-bold text-[var(--text-primary)]">
                    {banner.title || "Untitled banner"}
                  </h3>
                  {banner.subtitle && (
                    <p className="truncate text-xs text-[var(--text-secondary)]">{banner.subtitle}</p>
                  )}
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                    Submitted {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString() : "-"}
                  </p>

                  {banner.status === "rejected" && banner.moderation?.rejectionReason && (
                    <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      {banner.moderation.rejectionReason}
                    </p>
                  )}

                  <div className="mt-3 flex gap-2">
                    {banner.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApprove(banner)}
                          disabled={actingId === banner._id}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                        >
                          <Check size={13} />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openRejectModal(banner)}
                          disabled={actingId === banner._id}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                        >
                          <X size={13} />
                          Reject
                        </button>
                      </>
                    )}

                    {banner.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => handleToggleActive(banner)}
                        disabled={actingId === banner._id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] py-1.5 text-xs font-semibold text-[var(--text-primary)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-60"
                      >
                        {banner.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                        {banner.isActive ? "Unpublish" : "Republish"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(banner)}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 ${
                        banner.status === "rejected" ? "flex-1" : "px-3"
                      }`}
                    >
                      <Trash2 size={13} />
                      {banner.status === "rejected" ? "Delete" : ""}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject reason modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">Reject Banner</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Let the vendor know why this banner was rejected so they can fix it and resubmit.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Image resolution too low, please re-upload."
              rows={3}
              className="mt-4 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                disabled={actingId === rejectTarget._id}
                className="flex-1 rounded-lg border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--bg-main)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actingId === rejectTarget._id}
                className="flex-1 rounded-lg bg-rose-500 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
              >
                {actingId === rejectTarget._id ? "Rejecting..." : "Reject Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-400/30 bg-red-500/10">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="mb-2 text-center text-lg font-semibold text-[var(--text-primary)]">Delete Banner</h3>
            <p className="mb-6 text-center text-sm text-[var(--text-secondary)]">
              Are you sure you want to permanently delete this banner?
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
    </section>
  );
}
