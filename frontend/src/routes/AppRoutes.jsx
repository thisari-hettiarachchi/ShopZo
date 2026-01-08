import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Contact from '../pages/Contact';
import About from '../pages/About';
import AuthPages from '../pages/Auth';
import Product from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import ProfilePage from '../pages/ProfileDashboard';
import CheckoutPage from '../pages/Checkout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/auth" element={<AuthPages />} /> 
      <Route path="/products/*" element={<Product />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path='/checkout' element={<CheckoutPage />} />
    </Routes>
  );
}
