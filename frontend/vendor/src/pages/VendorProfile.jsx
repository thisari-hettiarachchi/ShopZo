import { useEffect, useMemo, useState } from "react";
import { Phone, MapPin, Edit } from "lucide-react";
import { getVendorProfile } from "../services/vendorService";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "vendorProfile";

const safeParseJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export default function VendorProfilePage() {
  const navigate = useNavigate();

  const initialProfile = useMemo(() => {
    const stored = safeParseJson(localStorage.getItem(STORAGE_KEY));
    const vendor = safeParseJson(localStorage.getItem("vendor"));

    return {
      storeName: stored?.storeName || vendor?.storeName || "John's Store",
      email: stored?.email || vendor?.email || "vendor@email.com",
      phone: stored?.phone || "",
      address: stored?.address || "",
      description: stored?.description || "",
    };
  }, []);

  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;
    getVendorProfile()
      .then((res) => {
        if (cancelled) return;
        const vendor = res.data?.vendor;
        if (!vendor) return;
        setProfile({
          storeName: vendor.storeName || "",
          email: vendor.email || "",
          phone: vendor.phone || "",
          address: vendor.address || "",
          description: vendor.description || "",
        });
        localStorage.setItem("vendor", JSON.stringify(vendor));
      })
      .catch(() => {
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const initials = useMemo(() => {
    const words = (profile.storeName || "V").trim().split(/\s+/).filter(Boolean);
    const first = words[0]?.[0] || "V";
    const second = words[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [profile.storeName]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-3 md:px-6">
      <div className="mb-6 rounded-3xl border border-[var(--border)] bg-[var(--bg-card)]/80 px-5 py-5 shadow-[0_18px_44px_-30px_var(--shadow)] backdrop-blur md:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] mb-4 text-[var(--text-secondary)]">Vendor Identity</p>
        <h2 className="text-3xl font-extrabold mb-4 text-[var(--color-primary)]">Store Profile</h2>
        <p className="text-sm text-[var(--text-secondary)]">View your store details and public appearance.</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_22px_56px_-34px_var(--shadow)]">
        {/* Banner area */}
        <div className="relative h-36 bg-[linear-gradient(125deg,var(--color-primary),var(--color-secondary))]">
          <div className="absolute right-8 top-6 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-3 left-20 h-16 w-16 rounded-full bg-white/15 blur-xl" />
        </div>
        
        {/* Profile Pic & Main Details */}
        <div className="relative px-6 pb-8 md:px-8">
          <div className="mb-7 flex flex-col items-start gap-4 sm:-mt-12 sm:flex-row sm:items-end">
            <div className="h-24 w-24 rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-1.5 shadow-lg">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-3xl font-bold text-white">
                {initials}
              </div>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{profile.storeName || "Vendor"}</h1>
              <p className="text-[var(--text-secondary)]">{profile.email || ""}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-muted)]">
                      <Phone size={18} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Phone Number</p>
                      <p className="font-medium">{profile.phone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-muted)]">
                      <MapPin size={18} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Address</p>
                      <p className="font-medium">{profile.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">About the Store</h3>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-5">
                <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed text-sm min-h-[100px]">
                  {profile.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end border-t border-[var(--border)] pt-6">
            <button
              onClick={() => navigate("/profile/edit")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_16px_32px_-20px_var(--shadow)] transition hover:opacity-90"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
