import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../components/shared/SideBar";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/Products";
import AddProductPage from "../pages/AddProduct";
import OrdersPage from "../pages/Orders";
import CustomersPage from "../pages/CustomersPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ReviewsPage from "../pages/ReviewsPage";
import VendorProfilePage from "../pages/VendorProfile";
import EditProfilePage from "../pages/EditProfile";
import AuthPages from "../pages/Auth";

const getActiveFromPath = (pathname) => {
  if (pathname.startsWith("/products")) return "products";

  switch (pathname) {
    case "/orders":
      return "orders";
    case "/customers":
      return "customers";
    case "/analytics":
      return "analytics";
    case "/reviews":
      return "reviews";
    case "/profile":
      return "profile";
    case "/":
    default:
      return "overview";
  }
};

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

function VendorDashboardShell() {
  const location = useLocation();
  const active = getActiveFromPath(location.pathname);

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} />

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/profile" element={<VendorProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPages />} />

      <Route
        path="/*"
        element={
          <RequireAuth>
            <VendorDashboardShell />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
