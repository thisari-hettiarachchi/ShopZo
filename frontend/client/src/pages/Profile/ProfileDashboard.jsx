import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  CreditCard,
  Package,
  RotateCcw,
  Ban,
  Bell,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import MyProfile from "../../components/sections/Profile/Profile";
import AddressBook from "../../components/sections/Profile/AddressBook";
import PaymentOptions from "../../components/sections/Profile/PaymentOptions";
import MyOrders from "../../components/sections/Profile/OrdersPage";
import MyReturns from "../../components/sections/Profile/ReturnsPage";
import MyCancellations from "../../components/sections/Profile/MyCancellations";
import ProfileNotifications from "../../components/sections/Profile/ProfileNotifications";

const MENU = [
  {
    title: "Account",
    items: [
      { name: "My Profile", icon: User, hint: "Personal details" },
      { name: "Address Book", icon: MapPin, hint: "Delivery addresses" },
      { name: "My Payment Options", icon: CreditCard, hint: "How you pay" },
    ],
  },
  {
    title: "Orders",
    items: [
      { name: "My Orders", icon: Package, hint: "Track purchases" },
      { name: "My Returns", icon: RotateCcw, hint: "Return requests" },
      { name: "My Cancellations", icon: Ban, hint: "Cancelled orders" },
    ],
  },
  {
    title: "Communication",
    items: [{ name: "My Notifications", icon: Bell, hint: "Alerts & updates" }],
  },
];

const ALL_ITEMS = MENU.flatMap((group) => group.items);

export default function ProfileDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState("My Profile");

  useEffect(() => {
    const sectionFromQuery = searchParams.get("section");
    if (sectionFromQuery && ALL_ITEMS.some((item) => item.name === sectionFromQuery)) {
      setActiveSection(sectionFromQuery);
    }
  }, [searchParams]);

  const selectSection = (sectionName) => {
    setActiveSection(sectionName);
    setSearchParams({ section: sectionName });
  };

  const activeMeta = ALL_ITEMS.find((item) => item.name === activeSection) || ALL_ITEMS[0];
  const ActiveIcon = activeMeta.icon;

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
      case "My Notifications":
        return <ProfileNotifications />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-main)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% -10%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 0%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:px-6 lg:px-8">
        {/* Mobile section picker */}
        <div className="md:hidden">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_12px_28px_-18px_var(--shadow)]">
              <ActiveIcon className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Account
              </p>
              <h1
                className="text-xl font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                {activeSection}
              </h1>
            </div>
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ALL_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => selectSection(item.name)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_10px_24px_-12px_rgba(249,115,22,0.55)]"
                      : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                  }`}
                >
                  <Icon size={15} />
                  {item.name.replace(/^My\s/, "")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 md:block lg:w-80">
          <div className="sticky top-24 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
            <div className="mb-6 border-b border-[var(--border)] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                ShopZo Account
              </p>
              <h2
                className="mt-1 text-2xl font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "'Sora', sans-serif" }}
              >
                Profile Hub
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Manage your details, orders, and alerts.
              </p>
            </div>

            <nav className="flex flex-col gap-6">
              {MENU.map((section) => (
                <div key={section.title}>
                  <h3 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {section.title}
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = activeSection === item.name;
                      return (
                        <li key={item.name}>
                          <button
                            type="button"
                            onClick={() => selectSection(item.name)}
                            className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-200 ${
                              active
                                ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_12px_28px_-14px_rgba(249,115,22,0.6)]"
                                : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                                active
                                  ? "bg-white/20"
                                  : "border border-[var(--border)] bg-[var(--bg-main)] text-[var(--color-primary)] group-hover:border-[var(--color-primary)]"
                              }`}
                            >
                              <Icon size={16} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold leading-tight">
                                {item.name}
                              </span>
                              <span
                                className={`block text-xs ${
                                  active ? "text-white/80" : "text-[var(--text-muted)]"
                                }`}
                              >
                                {item.hint}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 animate-fade-in">{renderContent()}</main>
      </div>
    </div>
  );
}
