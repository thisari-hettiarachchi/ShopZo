import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Contact from '../pages/Contact'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}