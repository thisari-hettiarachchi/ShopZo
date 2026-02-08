import { useEffect, useMemo, useState } from "react";
import { Store, Mail, Phone, MapPin, FileText, Save } from "lucide-react";
import { getVendorProfile, updateVendorProfile } from "../services/vendorService";

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
  const [saved, setSaved] = useState(false);

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
        setProfile((prev) => ({
          ...prev,
          storeName: vendor.storeName ?? prev.storeName,
          email: vendor.email ?? prev.email,
          phone: vendor.phone ?? prev.phone,
          address: vendor.address ?? prev.address,
          description: vendor.description ?? prev.description,
        }));
      })
      .catch(() => {
        // Silent fallback to local state/localStorage
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [saved]);

  const initials = useMemo(() => {
    const words = (profile.storeName || "V").trim().split(/\s+/).filter(Boolean);
    const first = words[0]?.[0] || "V";
    const second = words[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [profile.storeName]);

  const onChange = (key) => (e) => {
    setProfile((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    const token = localStorage.getItem("token");
    if (!token) {
      setSaved(true);
      return;
    }

    updateVendorProfile({
      storeName: profile.storeName,
      email: profile.email,
      phone: profile.phone,
      address: profile.address,
      description: profile.description,
    })
      .then((res) => {
        if (res.data?.vendor) {
          localStorage.setItem("vendor", JSON.stringify(res.data.vendor));
        }
        setSaved(true);
      })
      .catch(() => {
        // Keep local save, but don't block the UI
        setSaved(true);
      });
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Vendor Profile</h2>
          <p className="text-sm text-[var(--text-secondary)]">Manage your store details.</p>
        </div>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center gap-2"
        >
          <Save size={18} />
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary card */}
        <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold truncate">{profile.storeName || "Vendor"}</p>
              <p className="text-sm text-[var(--text-secondary)] truncate">{profile.email || ""}</p>
            </div>
          </div>

          {saved && (
            <div className="mt-4 text-sm font-medium text-green-600">Saved.</div>
          )}

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Store size={16} className="text-[var(--color-primary)]" />
              <span className="truncate">{profile.storeName || ""}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Mail size={16} className="text-[var(--color-primary)]" />
              <span className="truncate">{profile.email || ""}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Phone size={16} className="text-[var(--color-primary)]" />
              <span className="truncate">{profile.phone || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <MapPin size={16} className="text-[var(--color-primary)]" />
              <span className="truncate">{profile.address || "—"}</span>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Store Name</label>
              <div className="relative">
                <Store size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  value={profile.storeName}
                  onChange={onChange("storeName")}
                  className="w-full pl-10 pr-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Your store name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={onChange("email")}
                  className="w-full pl-10 pr-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="you@store.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  value={profile.phone}
                  onChange={onChange("phone")}
                  className="w-full pl-10 pr-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="+1 555 000 0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  value={profile.address}
                  onChange={onChange("address")}
                  className="w-full pl-10 pr-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-3 text-[var(--text-secondary)]" />
                <textarea
                  rows={5}
                  value={profile.description}
                  onChange={onChange("description")}
                  className="w-full pl-10 pr-3 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Tell customers what you sell and what makes your store special..."
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
