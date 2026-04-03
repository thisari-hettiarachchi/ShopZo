import React, { useState, useEffect } from "react";
import { Edit2, Plus, X } from "lucide-react";
import {
  getAddresses,
  addAddress,
  setDefaultAddress,
  deleteAddress,
} from "../../../services/addressService";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

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

  // Handle input changes (Add)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle input changes (Edit)
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save new address
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

  // Set default address
  const handleSetDefault = async (id, type) => {
    try {
      await setDefaultAddress(id, type);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefaultShipping:
            type === "shipping" ? addr.id === id : addr.isDefaultShipping,
          isDefaultBilling:
            type === "billing" ? addr.id === id : addr.isDefaultBilling,
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update default address");
    }
  };

  // Open edit popup
  const editAddress = (address) => {
    setEditingAddress(address);
    setShowEditForm(true);
  };

  // Save edited address
  const handleUpdateAddress = async () => {
    try {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id ? editingAddress : addr
        )
      );
      setShowEditForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update address");
    }
  };

  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this address?");
    if (!confirmed) return;

    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete address");
    }
  };

  return (
    <div
      className="p-6 rounded-2xl shadow-2xl"
      style={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 10px 40px var(--shadow)",
      }}
    >
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Address Book
      </h2>

      <div className="flex flex-col gap-6">
        {/* Existing Addresses */}
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="p-5 rounded-2xl border-2 border-[var(--border)] flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            style={{ backgroundColor: "var(--bg-muted)" }}
          >
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {addr.fullName}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {addr.addressLine}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {addr.region}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {addr.phone}
              </p>
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
                onClick={() => editAddress(addr)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-sm font-medium border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-300"
              >
                <Edit2 size={16} /> EDIT
              </button>

              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="px-3 py-1 rounded-lg border-2 text-sm font-medium border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add New Address Form */}
        {showAddForm && (
          <div
            className="p-5 rounded-2xl border-2 border-[var(--border)] flex flex-col gap-3"
            style={{ backgroundColor: "var(--bg-muted)" }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3
                className="font-semibold text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                Add New Address
              </h3>
              <button onClick={() => setShowAddForm(false)}>
                <X size={20} />
              </button>
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
                <input
                  type="checkbox"
                  name="isDefaultShipping"
                  checked={newAddress.isDefaultShipping}
                  onChange={handleInputChange}
                />
                Default Shipping
              </label>

              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="isDefaultBilling"
                  checked={newAddress.isDefaultBilling}
                  onChange={handleInputChange}
                />
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

        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed text-[var(--color-primary)] font-semibold hover:bg-[var(--bg-hover)] transition-all duration-300 justify-center"
          >
            <Plus size={20} /> ADD NEW ADDRESS
          </button>
        )}
      </div>

      {/* Edit Popup */}
      {showEditForm && editingAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="w-full max-w-lg p-6 rounded-2xl"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h3 className="text-xl font-bold mb-4">Edit Address</h3>

            <div className="flex flex-col gap-3">
              <input
                name="fullName"
                value={editingAddress.fullName}
                onChange={handleEditChange}
                className="p-3 rounded-lg border-2 border-[var(--border)]"
              />

              <input
                name="addressLine"
                value={editingAddress.addressLine}
                onChange={handleEditChange}
                className="p-3 rounded-lg border-2 border-[var(--border)]"
              />

              <input
                name="region"
                value={editingAddress.region}
                onChange={handleEditChange}
                className="p-3 rounded-lg border-2 border-[var(--border)]"
              />

              <input
                name="phone"
                value={editingAddress.phone}
                onChange={handleEditChange}
                className="p-3 rounded-lg border-2 border-[var(--border)]"
              />

              <div className="flex gap-4">
                <label>
                  <input
                    type="checkbox"
                    name="isDefaultShipping"
                    checked={editingAddress.isDefaultShipping}
                    onChange={handleEditChange}
                  />{" "}
                  Default Shipping
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="isDefaultBilling"
                    checked={editingAddress.isDefaultBilling}
                    onChange={handleEditChange}
                  />{" "}
                  Default Billing
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingAddress(null);
                  }}
                  className="px-5 py-2 rounded-xl border-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateAddress}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
