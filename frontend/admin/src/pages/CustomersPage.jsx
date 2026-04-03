import { useEffect, useState } from "react";
import { getCustomers } from "../services/adminService";

function Avatar({ name }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = [
    "bg-violet-100 text-violet-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-600",
    "bg-cyan-100 text-cyan-600",
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0 ${color}`}>
      {initials}
    </span>
  );
}

function SpendBadge({ amount }) {
  const n = Number(amount || 0);
  const tier =
    n >= 1000 ? { label: "Top", cls: "bg-amber-50 text-amber-700 ring-amber-200" }
    : n >= 300  ? { label: "Mid", cls: "bg-blue-50 text-blue-600 ring-blue-200" }
    : null;
  if (!tier) return null;
  return (
    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${tier.cls}`}>
      {tier.label}
    </span>
  );
}

const SORT_FIELDS = ["name", "orderCount", "totalSpent", "lastOrderAt"];
const ROLE_FILTERS = ["All", "Admin", "User", "Vendor"];

const ROLE_STYLES = {
  Admin:  "bg-violet-50 text-violet-700 ring-violet-200",
  User:   "bg-blue-50 text-blue-700 ring-blue-200",
  Vendor: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function RoleBadge({ role }) {
  if (!role) return null;
  const label = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  const cls = ROLE_STYLES[label] || "bg-gray-100 text-gray-600 ring-gray-200";
  return (
    <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${cls}`}>
      {label}
    </span>
  );
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sort, setSort] = useState({ field: "totalSpent", dir: "desc" });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(requestError?.response?.data?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const toggleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "desc" }
    );
  };

  const processed = customers
    .filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
      const matchesRole = roleFilter === "All" || c.role?.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      let av = a[sort.field] ?? "";
      let bv = b[sort.field] ?? "";
      if (sort.field === "lastOrderAt") { av = av ? new Date(av) : 0; bv = bv ? new Date(bv) : 0; }
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sort.dir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const SortIcon = ({ field }) => {
    const active = sort.field === field;
    return (
      <span className={`ml-1 inline-flex flex-col gap-[1px] ${active ? "opacity-100" : "opacity-30"}`}>
        <svg className={`h-2 w-2 transition-colors ${active && sort.dir === "asc" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`} viewBox="0 0 8 5" fill="currentColor"><path d="M4 0L8 5H0z"/></svg>
        <svg className={`h-2 w-2 transition-colors ${active && sort.dir === "desc" ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`} viewBox="0 0 8 5" fill="currentColor"><path d="M4 5L0 0h8z"/></svg>
      </span>
    );
  };

  return (
    <section className="px-6 md:px-10 pt-8 pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
              {customers.length} {customers.length === 1 ? "customer" : "customers"} total
            </p>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"
          />
        </div>
      </div>

      {/* Role filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {ROLE_FILTERS.map((role) => {
          const active = roleFilter === role;
          const accentCls = {
            All:    active ? "bg-[var(--text-primary)] text-[var(--bg-main)] border-[var(--text-primary)]" : "",
            Admin:  active ? "bg-violet-600 text-white border-violet-600" : "text-violet-700 border-violet-200 hover:border-violet-400",
            User:   active ? "bg-blue-600 text-white border-blue-600"   : "text-blue-700 border-blue-200 hover:border-blue-400",
            Vendor: active ? "bg-emerald-600 text-white border-emerald-600" : "text-emerald-700 border-emerald-200 hover:border-emerald-400",
          }[role];
          return (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                active
                  ? accentCls
                  : `bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] ${accentCls}`
              }`}
            >
              {role !== "All" && (
                <span className={`h-1.5 w-1.5 rounded-full ${
                  active ? "bg-current opacity-80" : {
                    Admin: "bg-violet-400", User: "bg-blue-400", Vendor: "bg-emerald-400",
                  }[role]
                }`} />
              )}
              {role}
              {!loading && (
                <span className={`tabular-nums ${active ? "opacity-70" : "opacity-50"}`}>
                  {role === "All"
                    ? customers.length
                    : customers.filter((c) => c.role?.toLowerCase() === role.toLowerCase()).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-600">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Table card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        {loading ? (
          <div className="divide-y divide-[var(--border)]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="h-8 w-8 rounded-full bg-[var(--bg-main)] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 rounded bg-[var(--bg-main)] animate-pulse" />
                  <div className="h-3 w-48 rounded bg-[var(--bg-main)] animate-pulse" />
                </div>
                <div className="h-3 w-16 rounded bg-[var(--bg-main)] animate-pulse" />
                <div className="h-3 w-20 rounded bg-[var(--bg-main)] animate-pulse hidden sm:block" />
              </div>
            ))}
          </div>
        ) : processed.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <svg className="h-10 w-10 text-[var(--text-secondary)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1h5M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            </svg>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {search || roleFilter !== "All" ? "No customers match your filters" : "No customers yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-main)]/50">
                  {[
                    { label: "Customer", field: "name" },
                    { label: "Role",     field: "role" },
                    { label: "Orders",   field: "orderCount" },
                    { label: "Total Spent", field: "totalSpent" },
                    { label: "Last Order",  field: "lastOrderAt" },
                  ].map(({ label, field }) => (
                    <th
                      key={field}
                      onClick={() => toggleSort(field)}
                      className="cursor-pointer select-none whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <SortIcon field={field} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {processed.map((customer) => (
                  <tr
                    key={customer.id}
                    className="group transition-colors hover:bg-[var(--bg-main)]/60"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={customer.name} />
                        <div className="min-w-0">
                          <div className="flex items-center">
                            <p className="truncate font-medium text-[var(--text-primary)]">
                              {customer.name || "Customer"}
                            </p>
                            <SpendBadge amount={customer.totalSpent} />
                          </div>
                          <p className="truncate text-xs text-[var(--text-secondary)]">
                            {customer.email || "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <RoleBadge role={customer.role} />
                      {!customer.role && <span className="text-[var(--text-secondary)]">—</span>}
                    </td>

                    {/* Orders */}
                    <td className="px-6 py-4 tabular-nums text-[var(--text-primary)]">
                      <span className="inline-flex items-center justify-center rounded-lg bg-[var(--bg-main)] border border-[var(--border)] px-2.5 py-1 text-xs font-semibold">
                        {customer.orderCount || 0}
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-6 py-4 tabular-nums font-semibold text-[var(--text-primary)]">
                      ${Number(customer.totalSpent || 0).toFixed(2)}
                    </td>

                    {/* Last Order */}
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {customer.lastOrderAt
                        ? new Date(customer.lastOrderAt).toLocaleDateString(undefined, {
                            year: "numeric", month: "short", day: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && processed.length > 0 && (
          <div className="border-t border-[var(--border)] bg-[var(--bg-main)]/50 px-6 py-3">
            <p className="text-xs text-[var(--text-secondary)]">
              Showing <span className="font-medium text-[var(--text-primary)]">{processed.length}</span> of{" "}
              <span className="font-medium text-[var(--text-primary)]">{customers.length}</span> customers
            </p>
          </div>
        )}
      </div>
    </section>
  );
}