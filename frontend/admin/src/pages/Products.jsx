import { Link } from "react-router-dom";

export default function ProductsPage() {
  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          to="/products/new"
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <p className="text-[var(--text-secondary)]">Manage all products from this panel.</p>
      </div>
    </section>
  );
}
