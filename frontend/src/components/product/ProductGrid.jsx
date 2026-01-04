import ProductCard from './ProductCard'

const products = [
  { id: 1, name: 'Wireless Headphones', price: 120 },
  { id: 2, name: 'Smart Watch', price: 90 },
  { id: 3, name: 'Gaming Mouse', price: 40 }
]

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}