import { useState } from "react";
import Sidebar from "../components/shared/SideBar";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/Products";
import OrdersPage from "../pages/Orders";

export default function App() {
  const [active, setActive] = useState("overview");

  return (
    <div className="flex min-h-screen">
      <Sidebar active={active} setActive={setActive} />

      <main className="flex-1 overflow-auto">
        {active === "overview" && <Dashboard active={active} />}
        {active === "products" && <ProductsPage active={active} />}
        {active === "orders" && <OrdersPage active={active} />}
      </main>
    </div>
  );
}
