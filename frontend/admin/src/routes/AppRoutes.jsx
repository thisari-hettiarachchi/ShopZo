import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../components/shared/SideBar";
import Dashboard from "../pages/Dashboard";
import ProductsPage from "../pages/Products";
import AddProductPage from "../pages/AddProduct";
import EditProductPage from "../pages/EditProduct";
import ProductDetailsPage from "../pages/ProductDetails";
import OrdersPage from "../pages/Orders";
import CustomersPage from "../pages/CustomersPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import ReviewsPage from "../pages/ReviewsPage";
import AdminProfilePage from "../pages/AdminProfile";
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
	const token = sessionStorage.getItem("adminToken") || sessionStorage.getItem("token");
	if (!token) return <Navigate to="/auth" replace />;
	return children;
}

function AdminDashboardShell() {
	const location = useLocation();
	const active = getActiveFromPath(location.pathname);

	return (
		<div className="flex min-h-screen">
			<Sidebar active={active} />

			<main className="flex-1 overflow-auto ml-64">
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/products" element={<ProductsPage />} />
					<Route path="/products/new" element={<AddProductPage />} />
					<Route path="/products/edit/:id" element={<EditProductPage />} />
					<Route path="/products/:id" element={<ProductDetailsPage />} />
					<Route path="/orders" element={<OrdersPage />} />
					<Route path="/customers" element={<CustomersPage />} />
					<Route path="/analytics" element={<AnalyticsPage />} />
					<Route path="/reviews" element={<ReviewsPage />} />
					<Route path="/profile" element={<AdminProfilePage />} />
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
						<AdminDashboardShell />
					</RequireAuth>
				}
			/>
		</Routes>
	);
}
