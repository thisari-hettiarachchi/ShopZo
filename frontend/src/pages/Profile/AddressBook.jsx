import React, { useState } from "react";
import { Edit2, Plus } from "lucide-react";

export default function AddressBook() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      fullName: "Thisari Hettiarachchi",
      addressLine: "HOME313/3, Ashokarama Road, Ihala Bomiriya, Kaduwela",
      region: "Western - Colombo - Greater - Kaduwela",
      phone: "701405126",
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
    // Add more addresses here if needed
  ]);

  const setDefault = (id, type) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (type === "shipping") {
          return { ...addr, isDefaultShipping: addr.id === id };
        } else if (type === "billing") {
          return { ...addr, isDefaultBilling: addr.id === id };
        }
        return addr;
      })
    );
  };

  const editAddress = (id) => {
    alert(`Edit Address ID: ${id}`);
  };

  const addNewAddress = () => {
    alert("Add New Address");
  };

  return (
    <div className="p-6 rounded-2xl shadow-2xl" style={{ backgroundColor: "var(--bg-card)", boxShadow: "0 10px 40px var(--shadow)" }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>Address Book</h2>

      <div className="flex flex-col gap-6">
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
                onClick={() => setDefault(addr.id, "shipping")}
                className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all duration-300 ${
                  addr.isDefaultShipping
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-transparent"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                Default Shipping Address
              </button>
              <button
                onClick={() => setDefault(addr.id, "billing")}
                className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all duration-300 ${
                  addr.isDefaultBilling
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-transparent"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                Default Billing Address
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

        {/* Add New Address */}
        <button
          onClick={addNewAddress}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed text-[var(--color-primary)] font-semibold hover:bg-[var(--bg-hover)] transition-all duration-300 justify-center"
        >
          <Plus size={20} /> ADD NEW ADDRESS
        </button>
      </div>
    </div>
  );
}
