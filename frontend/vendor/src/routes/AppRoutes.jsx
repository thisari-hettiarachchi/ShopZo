import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../components/shared/SideBar";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/Products";
import OrdersPage from "../pages/Orders";
import CustomersPage from "../pages/CustomersPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ReviewsPage from "../pages/ReviewsPage";
import VendorProfilePage from "../pages/VendorProfile";
import AuthPages from "../pages/Auth";

const getActiveFromPath = (pathname) => {
  switch (pathname) {
    case "/products":
      return "products";
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
        {active === "overview" && <Dashboard />}
        {active === "products" && <ProductsPage />}
        {active === "orders" && <OrdersPage />}
        {active === "customers" && <CustomersPage />}
        {active === "analytics" && <AnalyticsPage />}
        {active === "reviews" && <ReviewsPage />}
        {active === "profile" && <VendorProfilePage />}
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
