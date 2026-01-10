import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, LogOut } from "lucide-react";
import { getUserProfile, updateUserProfile } from "../../services/userService";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    accountType: "",
    password: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setUserData({
          name: res.data.name,
          email: res.data.email,
          accountType: res.data.role, 
          password: "", 
        });
      } catch (err) {
        alert(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchProfile();

    const handleWindowClose = () => {
      localStorage.removeItem("token");
    };
    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updateData = { ...userData };
      if (!updateData.password) delete updateData.password; 
      const res = await updateUserProfile(updateData);
      setUserData({
        ...res.data.user,
        password: "",
        accountType: res.data.user.role,
      });
      alert(res.data.message);
      setEditMode(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-6" style={{ backgroundColor: "var(--bg-main)" }}>
      <div className="w-full max-w-3xl p-8 rounded-2xl shadow-2xl" style={{ backgroundColor: "var(--bg-card)", boxShadow: "0 10px 40px var(--shadow)" }}>
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Profile</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg" style={{ color: "white", background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full flex items-center justify-center text-6xl font-bold" style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-primary)" }}>
              {userData.name.charAt(0)}
            </div>
          </div>

          <div className="flex-1 w-full">
            {/* Name */}
            <div className="mb-4 relative">
              <label className="block mb-1 font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3" style={{ color: "var(--text-muted)" }} />
                <input type="text" name="name" value={userData.name} onChange={handleInputChange} disabled={!editMode} className="w-full pl-11 pr-3 py-3 rounded-lg border-2 text-sm focus:outline-none transition-all duration-300" style={{ borderColor: editMode ? "var(--color-primary)" : "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }} />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4 relative">
              <label className="block mb-1 font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3" style={{ color: "var(--text-muted)" }} />
                <input type="email" name="email" value={userData.email} onChange={handleInputChange} disabled={!editMode} className="w-full pl-11 pr-3 py-3 rounded-lg border-2 text-sm focus:outline-none transition-all duration-300" style={{ borderColor: editMode ? "var(--color-primary)" : "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }} />
              </div>
            </div>

            {/* Account Type */}
            <div className="mb-4 relative">
              <label className="block mb-1 font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>Account Type</label>
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{userData.accountType}</span>
              </div>
            </div>

            {/* Password */}
            <div className="mb-4 relative">
              <label className="block mb-1 font-semibold text-sm" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3" style={{ color: "var(--text-muted)" }} />
                <input type="password" name="password" value={userData.password} onChange={handleInputChange} disabled={!editMode} className="w-full pl-11 pr-3 py-3 rounded-lg border-2 text-sm focus:outline-none transition-all duration-300" style={{ borderColor: editMode ? "var(--color-primary)" : "var(--border)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              {editMode ? (
                <>
                  <button onClick={handleSave} className="px-6 py-2 rounded-lg font-semibold text-white" style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}>Save</button>
                  <button onClick={() => setEditMode(false)} className="px-6 py-2 rounded-lg border-2 font-semibold" style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditMode(true)} className="px-6 py-2 rounded-lg font-semibold text-white" style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }}>Edit Profile</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
