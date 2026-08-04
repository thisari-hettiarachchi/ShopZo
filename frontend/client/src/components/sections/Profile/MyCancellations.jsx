import React, { useEffect, useState } from "react";
import axios from "axios";
import { Ban } from "lucide-react";
import { API_BASE_URL } from "../../../api/base";
import ProfileSectionHeader from "./ProfileSectionHeader";

export default function MyCancellations() {
  const [cancellations, setCancellations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancellations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/user/cancellations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCancellations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCancellations();
  }, []);

  return (
    <div className="space-y-6">
      <ProfileSectionHeader
        icon={Ban}
        eyebrow="Orders"
        title="My Cancellations"
        description="Orders you cancelled and their status."
      />

      {loading ? (
        <p className="text-sm text-[var(--text-muted)]">Loading cancellations...</p>
      ) : cancellations.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] py-16 text-center shadow-[0_24px_60px_-36px_var(--shadow)]">
          <p className="text-[var(--text-secondary)]">No cancellations found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
          {cancellations.map((cancel) => (
            <div
              key={cancel._id}
              className="rounded-xl border border-[var(--border)] p-4"
            >
              <p className="font-semibold text-[var(--text-primary)]">
                {cancel.items?.[0]?.product?.name || "Product"}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Status: {cancel.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
