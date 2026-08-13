import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Cart from '../pages/Cart/Cart';
import Wishlist from '../pages/Wishlist/Wishlist';
import Contact from '../pages/Static/Contact';
import About from '../pages/Static/About';
import AuthPages from '../pages/Auth/Auth';
import Product from '../pages/Products/Products';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import AllCategoriesPage from '../pages/Categories/AllCategories';
import ProfilePage from '../pages/Profile/ProfileDashboard';
import CheckoutPage from '../pages/Checkout/Checkout';
import ProceedToPay from '../pages/Checkout/ProceedToPay';
import OrderSuccess from '../pages/Checkout/OrderSuccess';
import OrderCancel from '../pages/Checkout/OrderCancel';
import OrderDetails from '../pages/Orders/OrderDetails';
import VendorStorePage from '../pages/Vendor/VendorStore';
import MessagePage from '../pages/Vendor/VendorMessage';
import FlashSalePage from '../pages/FlashSale/FlashSale';
import NewsletterUnsubscribe from '../pages/Newsletter/Unsubscribe';

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
      <Route path="/categories" element={<AllCategoriesPage />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/vendors/:id" element={<VendorStorePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path='/checkout' element={<CheckoutPage />} />
      <Route path='/proceedtopay' element={<ProceedToPay />} />
      <Route path='/order/success' element={<OrderSuccess />} />
      <Route path='/order/cancel' element={<OrderCancel />} />
      <Route path='/messages/:id' element={<MessagePage />} />
      <Route path='/flashsale' element={<FlashSalePage />} />
      <Route path="/newsletter/unsubscribe" element={<NewsletterUnsubscribe />} />
    </Routes>
  );
}
