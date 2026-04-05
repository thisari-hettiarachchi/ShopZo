import api from "./api";

export const createProduct = async (payload) => {
	const { data } = await api.post("/api/admin/products", payload);
	return data;
};

export const getOrders = async () => {
	const { data } = await api.get("/api/admin/orders");
	return data;
};

export const updateOrderStatus = async (id, status) => {
	const { data } = await api.patch(`/api/admin/orders/${id}/status`, { status });
	return data;
};

export const getCustomers = async () => {
	const { data } = await api.get("/api/admin/customers");
	return data;
};

export const getAnalytics = async () => {
	const { data } = await api.get("/api/admin/analytics");
	return data;
};

export const getDashboardInsights = async () => {
	const { data } = await api.get("/api/admin/insights");
	return data;
};

export const getReviews = async () => {
	const { data } = await api.get("/api/admin/reviews");
	return data;
};

export const getVendors = async () => {
	const { data } = await api.get("/api/admin/vendors");
	return data;
};

export const approveVendor = async (id, payload) => {
	const { data } = await api.patch(`/api/admin/vendors/${id}/approval`, payload);
	return data;
};

export const updateVendorStatus = async (id, payload) => {
	const { data } = await api.patch(`/api/admin/vendors/${id}/status`, payload);
	return data;
};

export const getAdminProfile = async () => {
	const { data } = await api.get("/api/admin/auth/me");
	return data;
};

export const updateAdminProfile = async (payload) => {
	const { data } = await api.put("/api/admin/auth/me", payload);
	return data;
};