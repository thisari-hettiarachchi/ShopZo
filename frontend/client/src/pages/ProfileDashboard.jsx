import React, { useState } from "react";
import { User, Home, MapPin, CreditCard, Gift, Box, XCircle, Star, Heart } from "lucide-react";
import MyProfile from "../pages/Profile/Profile";
import AddressBook from "../pages/Profile/AddressBook";
import PaymentOptions from "../pages/Profile/PaymentOptions";
import MyOrders from "./Profile/OrdersPage";
import MyReturns from "./Profile/ReturnsPage";
import MyCancellations from "./Profile/MyCancellations";

export default function ProfileDashboard() {
  const [activeSection, setActiveSection] = useState("My Profile");

  const menu = [
    {
      title: "Manage My Account",
      items: [
        { name: "My Profile", icon: <User size={18} /> },
        { name: "Address Book", icon: <MapPin size={18} /> },
        { name: "My Payment Options", icon: <CreditCard size={18} /> },
      ],
    },
    {
      title: "My Orders",
      items: [
        { name: "My Orders", icon: <Box size={18} /> },
        { name: "My Returns", icon: <XCircle size={18} /> },
        { name: "My Cancellations", icon: <XCircle size={18} /> },
      ],
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "My Profile":
        return <MyProfile />;
      case "Address Book":
        return <AddressBook />;
      case "My Payment Options":
        return <PaymentOptions />;
      case "My Orders":
        return <MyOrders />;
      case "My Returns":
        return <MyReturns />;
      case "My Cancellations":
        return <MyCancellations />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
      <aside className="w-64 p-6 bg-var(--bg-card) shadow-2xl" style={{ boxShadow: "0 10px 40px var(--shadow)" }}>
        {menu.map((section) => (
          <div key={section.title} className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
              {section.title}
            </h3>
            <ul className="flex flex-col gap-2">
              {section.items.map((item) => (
                <li
                  key={item.name}
                  onClick={() => setActiveSection(item.name)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeSection === item.name
                      ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-md"
                      : "hover:bg-[var(--bg-hover)]"
                  }`}
                  style={{ color: activeSection === item.name ? "white" : "var(--text-primary)" }}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{renderContent()}</main>
    </div>
  );
}
