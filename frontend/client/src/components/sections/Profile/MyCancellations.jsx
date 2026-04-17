import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api/base";

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
        const res = await axios.get(
          `${API_BASE_URL}/user/cancellations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCancellations(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCancellations();
  }, []);

  if (loading) return <p>Loading cancellations...</p>;

  return (
    <div className="p-6 rounded-2xl shadow-2xl bg-[var(--bg-card)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        My Cancellations
      </h2>

      {cancellations.length === 0 ? (
        <p className="text-center text-[var(--text-secondary)] py-10">
          No cancellations found ❌
        </p>
      ) : (
        cancellations.map((cancel) => (
          <div
            key={cancel._id}
            className="p-4 mb-4 rounded-xl border border-[var(--border)]"
          >
            <p className="font-semibold text-[var(--text-primary)]">
              {cancel.items[0]?.product?.name}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Status: {cancel.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
