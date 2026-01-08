import React, { useState, useEffect } from "react";
import { Edit2, Plus, X } from "lucide-react";
import { getAddresses, addAddress, setDefaultAddress } from "../../services/addressService";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    addressLine: "",
    region: "",
    phone: "",
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  // Fetch addresses on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getAddresses();
        setAddresses(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load addresses");
      }
    };
    fetchAll();
  }, []);

  // Handle input changes for new address form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save new address to backend
  const handleSaveNewAddress = async () => {
    try {
      const res = await addAddress(newAddress); 
      setAddresses((prev) => [...prev, res.data]); 
      setNewAddress({
        fullName: "",
        addressLine: "",
        region: "",
        phone: "",
        isDefaultShipping: false,
        isDefaultBilling: false,
      });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add address");
    }
  };

  const handleSetDefault = async (id, type) => {
    try {
      await setDefaultAddress(id, type);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefaultShipping: type === "shipping" ? addr.id === id : addr.isDefaultShipping,
          isDefaultBilling: type === "billing" ? addr.id === id : addr.isDefaultBilling,
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update default address");
    }
  };

  const editAddress = (id) => alert(`Edit Address ID: ${id}`);

  return (
    <div className="p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: "var(--bg-card)", boxShadow: "0 10px 40px var(--shadow)" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Address Book</h2>

      <div className="flex flex-col gap-6">
        {/* Existing Addresses */}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="p-5 rounded-2xl border-2 border-[var(--border)] flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            style={{ backgroundColor: "var(--bg-muted)" }}
          >
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{addr.fullName}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{addr.addressLine}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{addr.region}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{addr.phone}</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3 md:mt-0">
              <button
                onClick={() => handleSetDefault(addr.id, "shipping")}
                className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all duration-300 ${
                  addr.isDefaultShipping
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-transparent"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                Default Shipping
              </button>
              <button
                onClick={() => handleSetDefault(addr.id, "billing")}
                className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all duration-300 ${
                  addr.isDefaultBilling
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-transparent"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                Default Billing
              </button>
              <button
                onClick={() => editAddress(addr.id)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-sm font-medium border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-300"
              >
                <Edit2 size={16} /> EDIT
              </button>
            </div>
          </div>
        ))}

        {/* Add New Address Form */}
        {showAddForm && (
          <div className="p-5 rounded-2xl border-2 border-[var(--border)] flex flex-col gap-3" style={{ backgroundColor: "var(--bg-muted)" }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Add New Address</h3>
              <button onClick={() => setShowAddForm(false)}><X size={20} /></button>
            </div>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={newAddress.fullName}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border-2 border-[var(--border)]"
            />
            <input
              type="text"
              name="addressLine"
              placeholder="Address"
              value={newAddress.addressLine}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border-2 border-[var(--border)]"
            />
            <input
              type="text"
              name="region"
              placeholder="Province / Region"
              value={newAddress.region}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border-2 border-[var(--border)]"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border-2 border-[var(--border)]"
            />

            <div className="flex gap-2 mt-2">
              <label className="flex items-center gap-1">
                <input type="checkbox" name="isDefaultShipping" checked={newAddress.isDefaultShipping} onChange={handleInputChange} />
                Default Shipping
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" name="isDefaultBilling" checked={newAddress.isDefaultBilling} onChange={handleInputChange} />
                Default Billing
              </label>
            </div>

            <button
              onClick={handleSaveNewAddress}
              className="mt-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
            >
              Save Address
            </button>
          </div>
        )}

        {/* Add New Address Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed text-[var(--color-primary)] font-semibold hover:bg-[var(--bg-hover)] transition-all duration-300 justify-center"
          >
            <Plus size={20} /> ADD NEW ADDRESS
          </button>
        )}
      </div>
    </div>
  );
}
