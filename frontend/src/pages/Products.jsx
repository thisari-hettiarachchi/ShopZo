import ProductGrid from "../components/product/ProductGrid";

export default function Products() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
      price: "24,990",
      oldPrice: "29,990",
      rating: 5,
      reviews: 128,
    },
    {
      id: 2,
      name: "Smart Watch Series X",
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
      price: "18,500",
      rating: 4,
      reviews: 76,
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      image: "https://images.unsplash.com/photo-1585386959984-a4155224a1f4",
      price: "9,990",
      oldPrice: "12,500",
      rating: 4,
      reviews: 54,
    },
    {
      id: 4,
      name: "Gaming Mouse RGB",
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
      price: "4,750",
      rating: 5,
      reviews: 92,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Products
          </h1>
          <span className="text-[var(--text-secondary)]">
            {products.length} items
          </span>
        </div>

        {/* Products Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
