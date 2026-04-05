import { useEffect, useMemo, useState } from "react";
import { Store, Mail, Phone, MapPin, FileText, Save, ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVendorProfile, updateVendorProfile } from "../services/vendorService";
import { getVendorToken, readVendorSession, saveVendorSession } from "../utils/authStorage";

const STORAGE_KEY = "vendorProfile";

const safeParseJson = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialProfile = useMemo(() => {
    const stored = safeParseJson(localStorage.getItem(STORAGE_KEY));
    const vendor = readVendorSession();

    return {
      storeName: stored?.storeName || vendor?.storeName || "",
      email: stored?.email || vendor?.email || "",
      phone: stored?.phone || "",
      address: stored?.address || "",
      description: stored?.description || "",
      profileImage: stored?.profileImage || vendor?.profileImage || "",
    };
  }, []);

  const [profile, setProfile] = useState(initialProfile);

  useEffect(() => {
    const token = getVendorToken();
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
          profileImage: vendor.profileImage || "",
        });
        saveVendorSession({ token, vendor });
      })
      .catch(() => {
        // Fallback to local
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => {
      setSaved(false);
      navigate("/profile");
    }, 1500);
    return () => clearTimeout(timer);
  }, [saved, navigate]);

  const onChange = (key) => (e) => {
    setProfile((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfile((prev) => ({ ...prev, profileImage: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onSave = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    const token = getVendorToken();
    
    if (!token) {
      setSaved(true);
      return;
    }

    setLoading(true);
    try {
      const res = await updateVendorProfile({
        storeName: profile.storeName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        description: profile.description,
        profileImage: profile.profileImage,
      });
      if (res.data?.vendor) {
        saveVendorSession({ token, vendor: res.data.vendor });
      }
      setSaved(true);
    } catch (error) {
      setSaved(true); // Still proceed to exit or show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="p-2 -ml-2 rounded-full hover:bg-[var(--bg-muted)] transition"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <p className="text-sm text-[var(--text-secondary)]">Update your store information.</p>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border)] p-6">
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--bg-card)]">
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={profile.storeName || "Vendor"} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-xl font-bold text-white">
                {(profile.storeName || "V")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Profile Picture</p>
            <p className="text-xs text-[var(--text-secondary)]">Upload a square image for best results.</p>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-sm">
              <Camera size={16} />
              Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

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
                disabled
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

        <div className="mt-6 flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={onSave}
            disabled={loading || saved}
            className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Save size={18} />
            {saved ? "Saved successfully!" : loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
