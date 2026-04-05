import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import api from "../services/api";

export default function AdminAuthPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (sessionStorage.getItem("adminToken")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/admin/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      sessionStorage.setItem("adminToken", data.token);
      sessionStorage.setItem("admin", JSON.stringify(data.admin));

      alert("Admin login successful");
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ backgroundColor: "var(--bg-main)" }}
    >
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}
        <div
          className="hidden md:flex flex-col justify-center p-12 relative"
          style={{
            background:
              "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
          }}
        >
          <div className="absolute top-[10%] -right-12 opacity-10">
            <ShieldCheck size={200} color="white" />
          </div>

          <div className="relative z-10">
            <ShieldCheck size={50} color="white" className="mb-6" />

            <h2 className="text-4xl font-bold text-white mb-4">
              Admin Panel Access
            </h2>

            <p className="text-white opacity-90 mb-8">
              Securely sign in to manage ShopZo platform, vendors, products, and users.
            </p>

            <div className="flex flex-col gap-4 text-white text-sm">
              <div className="flex items-center gap-3">
                ✔ Full Platform Control
              </div>
              <div className="flex items-center gap-3">
                ✔ Vendor & Product Management
              </div>
              <div className="flex items-center gap-3">
                ✔ Secure Admin Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="p-12"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Admin Sign In
          </h1>

          <p
            className="text-sm mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Enter admin credentials to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* EMAIL */}
            <div className="relative">
              <label className="text-sm font-semibold mb-2 block">
                Email Address
              </label>
              <Mail size={18} className="absolute left-3 top-[42px]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                className="w-full pl-11 pr-3 py-3 rounded-lg border-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                }}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="text-sm font-semibold mb-2 block">
                Password
              </label>
              <Lock size={18} className="absolute left-3 top-[42px]" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
                className="w-full pl-11 pr-11 py-3 rounded-lg border-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                }}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg text-white font-semibold flex items-center justify-center gap-2"
              style={{
                background:
                  "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}