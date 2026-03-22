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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Store Profile</h2>
        <p className="text-sm text-[var(--text-secondary)]">View your store details and public appearance.</p>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {/* Banner area */}
        <div className="h-32 bg-[var(--color-primary)] opacity-90 relative"></div>
        
        {/* Profile Pic & Main Details */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-6 gap-4">
            <div className="w-24 h-24 rounded-full bg-[var(--bg-card)] p-1.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white flex items-center justify-center font-bold text-3xl">
                {initials}
              </div>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold">{profile.storeName || "Vendor"}</h1>
              <p className="text-[var(--text-secondary)]">{profile.email || ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center">
                      <Phone size={18} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Phone Number</p>
                      <p className="font-medium">{profile.phone || "Not provided"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center">
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
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">About the Store</h3>
              <div className="bg-[var(--bg-muted)] p-5 rounded-xl">
                <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed text-sm min-h-[100px]">
                  {profile.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[var(--border)] flex justify-end">
            <button
              onClick={() => navigate("/profile/edit")}
              className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center gap-2 transition"
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
