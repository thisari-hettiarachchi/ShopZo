import { useParams } from 'react-router-dom'

export default function ProductDetails() {
  const { id } = useParams()
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Details - ID: {id}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p>Product details will be displayed here.</p>
      </div>
    </div>
  )
}