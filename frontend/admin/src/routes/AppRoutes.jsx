import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../components/shared/SideBar";
import Dashboard from "../pages/Dashboard";
import CommissionPage from "../pages/Commission";
import AnalyticsPage from "../pages/AnalyticsPage";
import VendorsPage from "../pages/VendorsPage";
import CategoriesPage from "../pages/CategoriesPage";
import FlashSalePage from "../pages/FlashSalePage";
import PromotionsPage from "../pages/PromotionsPage";
import AdminProfilePage from "../pages/AdminProfile";
import EditProfilePage from "../pages/EditProfile";
import NotificationsPage from "../pages/NotificationsPage";
import AuthPages from "../pages/Auth";

const getActiveFromPath = (pathname) => {
	switch (pathname) {
		case "/commission":
		case "/payments":
			return "commission";
		case "/vendors":
			return "vendors";
		case "/categories":
			return "categories";
		case "/flash-sale":
			return "flash-sale";
		case "/promotions":
			return "promotions";
		case "/analytics":
			return "analytics";
		case "/profile":
		case "/profile/edit":
		case "/notifications":
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
					<Route path="/commission" element={<CommissionPage />} />
					<Route path="/payments" element={<Navigate to="/commission" replace />} />
					<Route path="/vendors" element={<VendorsPage />} />
					<Route path="/categories" element={<CategoriesPage />} />
					<Route path="/flash-sale" element={<FlashSalePage />} />
					<Route path="/promotions" element={<PromotionsPage />} />
					<Route path="/analytics" element={<AnalyticsPage />} />
					<Route path="/profile" element={<AdminProfilePage />} />
					<Route path="/profile/edit" element={<EditProfilePage />} />
					<Route path="/notifications" element={<NotificationsPage />} />
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
