import React, { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { fetchReturns } from "../../../api/ordersApi";
import ProfileSectionHeader from "./ProfileSectionHeader";

export default function ReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReturns = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchReturns();
        setReturns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReturns();
  }, []);

  return (
    <div className="space-y-6">
      <ProfileSectionHeader
        icon={RotateCcw}
        eyebrow="Orders"
        title="My Returns"
        description="Review return requests and their current status."
      />

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading returns...</p>
      ) : returns.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] py-16 text-center shadow-[0_24px_60px_-36px_var(--shadow)]">
          <p className="text-[var(--text-secondary)]">No returns found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
          {returns.map((ret) => (
            <div
              key={ret._id}
              className="rounded-xl border border-[var(--border)] p-4"
            >
              <p className="font-semibold text-[var(--text-primary)]">
                {ret.order?.products?.[0]?.product?.name || "Product"}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Reason: {ret.reason}</p>
              <p className="text-sm text-[var(--text-secondary)]">Status: {ret.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
