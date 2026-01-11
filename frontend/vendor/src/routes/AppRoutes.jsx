import { useState } from "react";
import Sidebar from "../components/shared/SideBar";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/Products";
import OrdersPage from "../pages/Orders";
import CustomersPage from "../pages/CustomersPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ReviewsPage from "../pages/ReviewsPage";

export default function App() {
  const [active, setActive] = useState("overview");

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 overflow-auto">
        {active === "overview" && <Dashboard active={active} />}
        {active === "products" && <ProductsPage active={active} />}
        {active === "orders" && <OrdersPage active={active} />}
        {active === "customers" && <CustomersPage active={active} />}
        {active === "analytics" && <AnalyticsPage active={active} />}
        {active === "reviews" && <ReviewsPage active={active} />}
      </main>
    </div>
  );
}
