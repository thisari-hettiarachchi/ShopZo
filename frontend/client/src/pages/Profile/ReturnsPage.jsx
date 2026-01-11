import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReturnsPage() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/user/returns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReturns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  if (loading) return <p>Loading returns...</p>;

  return (
    <div className="p-6 rounded-2xl shadow-2xl bg-[var(--bg-card)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        My Returns
      </h2>

      {returns.length === 0 ? (
        <p className="text-center text-[var(--text-secondary)] py-10">
          No returns found ↩️
        </p>
      ) : (
        returns.map((ret) => (
          <div
            key={ret._id}
            className="p-4 mb-4 rounded-xl border border-[var(--border)]"
          >
            <p className="font-semibold text-[var(--text-primary)]">
              {ret.items[0]?.product?.name}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Status: {ret.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
