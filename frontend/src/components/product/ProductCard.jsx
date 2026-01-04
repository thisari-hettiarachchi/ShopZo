export default function ProductCard({ product }) {
  return (
    <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-sm text-gray-500 mt-1">Vendor Store</p>
      <p className="text-xl font-bold mt-3">${product.price}</p>
      <button className="mt-4 w-full py-2 rounded-lg bg-[var(--color-primary)] text-white">
        Add to Cart
      </button>
    </div>
  )
}