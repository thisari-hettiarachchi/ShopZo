import { useEffect, useMemo, useState } from "react";
import {
  approveVendor,
  getVendors,
  updateVendorStatus,
} from "../services/adminService";

const STATUS_TONE = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  suspended: "bg-orange-50 text-orange-700 ring-orange-200",
  banned: "bg-red-50 text-red-700 ring-red-200",
};

const readStatus = (vendor) => vendor.accountStatus || (vendor.isApproved ? "approved" : "pending");

function Badge({ value, toneMap = STATUS_TONE }) {
  const normalized = String(value || "pending").toLowerCase();
  const cls = toneMap[normalized] || "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {normalized}
    </span>
  );
}

function ActionButton({ label, onClick, variant = "default", disabled = false }) {
  const classes = {
    default: "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    warn: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
    danger: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${classes[variant]} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {label}
    </button>
  );
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState("");

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter((vendor) => {
      const status = readStatus(vendor);
      return (
        (vendor.storeName || "").toLowerCase().includes(q) ||
        (vendor.email || "").toLowerCase().includes(q) ||
        status.includes(q)
      );
    });
  }, [vendors, search]);

  const runAction = async (vendorId, callback) => {
    try {
      setSavingId(vendorId);
      await callback();
      await loadVendors();
    } catch (requestError) {
      alert(requestError?.response?.data?.message || "Action failed");
    } finally {
      setSavingId("");
    }
  };

  const askReason = (label) => window.prompt(`${label} reason (optional)`)?.trim() || "";

  return (
    <section className="min-h-screen bg-[var(--bg-main)] px-6 pb-16 pt-8 text-[var(--text-primary)] md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Vendor Workflow</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Approve or reject registrations, suspend or ban vendors, and manage verification checks.
            </p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vendor..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm outline-none sm:w-72"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          <table className="min-w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-main)]/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Vendor</th>
                <th className="px-4 py-3 text-left font-semibold">Account</th>
                <th className="px-4 py-3 text-left font-semibold">Moderation</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                    Loading vendors...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                filtered.map((vendor) => {
                  const status = readStatus(vendor);
                  const isSaving = savingId === String(vendor._id);

                  return (
                    <tr key={vendor._id} className="align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold">{vendor.storeName || "Vendor"}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{vendor.email || "No email"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge value={status} />
                      </td>
                      <td className="px-4 py-4 text-xs text-[var(--text-secondary)]">
                        {vendor?.moderation?.note || vendor?.moderation?.rejectionReason || vendor?.moderation?.suspensionReason || vendor?.moderation?.banReason || "-"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <ActionButton
                            label="Approve"
                            variant="success"
                            disabled={isSaving}
                            onClick={() =>
                              runAction(vendor._id, () =>
                                approveVendor(vendor._id, { decision: "approve", note: askReason("Approval") })
                              )
                            }
                          />
                          <ActionButton
                            label="Reject"
                            variant="danger"
                            disabled={isSaving}
                            onClick={() =>
                              runAction(vendor._id, () =>
                                approveVendor(vendor._id, {
                                  decision: "reject",
                                  reason: askReason("Rejection") || "Rejected by admin",
                                })
                              )
                            }
                          />
                          <ActionButton
                            label="Suspend"
                            variant="warn"
                            disabled={isSaving}
                            onClick={() =>
                              runAction(vendor._id, () =>
                                updateVendorStatus(vendor._id, {
                                  status: "suspended",
                                  reason: askReason("Suspension") || "Suspended by admin",
                                })
                              )
                            }
                          />
                          <ActionButton
                            label="Ban"
                            variant="danger"
                            disabled={isSaving}
                            onClick={() =>
                              runAction(vendor._id, () =>
                                updateVendorStatus(vendor._id, {
                                  status: "banned",
                                  reason: askReason("Ban") || "Banned by admin",
                                })
                              )
                            }
                          />
                          <ActionButton
                            label="Activate"
                            disabled={isSaving}
                            onClick={() =>
                              runAction(vendor._id, () => updateVendorStatus(vendor._id, { status: "approved" }))
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
