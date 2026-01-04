import ProductGrid from '../components/product/ProductGrid'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Featured Products</h1>
      <ProductGrid />
    </div>
  )
}