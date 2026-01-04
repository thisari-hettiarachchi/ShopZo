import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Products from '../pages/Products'
import ProductDetails from '../pages/ProductDetails'
import VendorStore from '../pages/VendorStore'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Login from '../pages/Login'
import Register from '../pages/Register'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/vendor/:id" element={<VendorStore />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}