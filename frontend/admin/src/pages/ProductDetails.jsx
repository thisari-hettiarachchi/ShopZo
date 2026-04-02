import { useParams } from "react-router-dom";

export default function ProductDetailsPage() {
  const { id } = useParams();

  return (
    <section className="px-6 md:px-10 pt-8 pb-10 bg-[var(--bg-main)] text-[var(--text-primary)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
        <p className="text-[var(--text-secondary)]">Viewing product ID: {id}</p>
      </div>
    </section>
  );
}
