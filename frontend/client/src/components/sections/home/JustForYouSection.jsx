import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";

export default function JustForYouSection({ products }) {
  return (
    <section className="py-20 px-4 bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-14 text-center">
          <span className="section-eyebrow mb-3">Personalized</span>
          <div className="flex items-center gap-5 w-full max-w-2xl">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-primary)] opacity-40" />
            <h2 className="display-font text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] font-black text-[var(--text-primary)] whitespace-nowrap leading-[1.0] tracking-tight">
              Just For <span className="italic text-[var(--color-primary)]">You</span>
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-primary)] opacity-40" />
          </div>
          <p className="text-[var(--text-muted)] text-sm mt-3 font-light">Curated picks based on your taste</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
          >
            Load More <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
