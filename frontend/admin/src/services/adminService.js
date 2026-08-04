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

export const getPayments = async () => {
	const { data } = await api.get("/api/admin/payments");
	return data;
};

export const refundOrder = async (id) => {
	const { data } = await api.post(`/api/admin/orders/${id}/refund`);
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

export const getAllReviews = async () => {
	const { data } = await api.get("/api/admin/reviews/all");
	return data;
};

export const deleteReview = async (id) => {
	const { data } = await api.delete(`/api/admin/reviews/${id}`);
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

export const reviewVendorDocuments = async (id, payload) => {
	const { data } = await api.patch(`/api/admin/vendors/${id}/documents`, payload);
	return data;
};

export const suspendCustomer = async (id, payload) => {
	const { data } = await api.patch(`/api/admin/customers/${id}/suspend`, payload);
	return data;
};

export const getCategories = async () => {
	const { data } = await api.get("/api/admin/categories");
	return data;
};

export const createCategory = async (payload) => {
	const { data } = await api.post("/api/admin/categories", payload);
	return data;
};

export const updateCategory = async (id, payload) => {
	const { data } = await api.put(`/api/admin/categories/${id}`, payload);
	return data;
};

export const deleteCategory = async (id) => {
	const { data } = await api.delete(`/api/admin/categories/${id}`);
	return data;
};

export const getSettings = async () => {
	const { data } = await api.get("/api/admin/settings");
	return data;
};

export const updateFlashSaleStatus = async (enabled) => {
	const { data } = await api.patch("/api/admin/settings/flash-sale", { enabled });
	return data;
};

export const getFlashSaleProducts = async () => {
	const { data } = await api.get("/api/admin/settings/flash-sale/products");
	return data;
};

export const getBanners = async (status) => {
	const { data } = await api.get("/api/admin/banners", { params: status ? { status } : {} });
	return data;
};

export const updateBannerStatus = async (id, payload) => {
	const { data } = await api.patch(`/api/admin/banners/${id}/status`, payload);
	return data;
};

export const updateBannerActive = async (id, isActive) => {
	const { data } = await api.patch(`/api/admin/banners/${id}/active`, { isActive });
	return data;
};

export const deleteBanner = async (id) => {
	const { data } = await api.delete(`/api/admin/banners/${id}`);
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