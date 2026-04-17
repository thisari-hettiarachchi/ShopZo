import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	AlertTriangle,
	ArrowDownRight,
	ArrowUpRight,
	Bell,
	Clock3,
	Download,
	Package,
	RefreshCw,
	ShieldAlert,
	ShoppingBag,
	Store,
	TrendingUp,
	Users,
} from "lucide-react";
import { API_BASE_URL } from "../services/api";
import { downloadReportPdf } from "../utils/pdf";
import { getDashboardInsights } from "../services/adminService";

const CARD_META = [
	{ key: "orders", title: "Total Orders", icon: ShoppingBag, tone: "from-orange-500 to-amber-400" },
	{ key: "products", title: "Active Products", icon: Package, tone: "from-slate-900 to-slate-700" },
	{ key: "customers", title: "Customers", icon: Users, tone: "from-emerald-500 to-teal-400" },
	{ key: "vendors", title: "Vendors", icon: Store, tone: "from-blue-500 to-indigo-500" },
	{ key: "vendorRequests", title: "Vendor Requests", icon: Bell, tone: "from-amber-500 to-orange-500" },
];

const SEVERITY_STYLES = {
	info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-200",
	warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200",
	danger: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200",
};

const currency = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatDate = (value) =>
	value ? new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "-";

function PulseDot() {
	return <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_0_rgba(16,185,129,0.45)] animate-pulse" />;
}

function StatCard({ title, value, icon: Icon, tone, delta }) {
	return (
		<div className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[0_18px_60px_-35px_var(--shadow)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-1">
			<div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">{title}</p>
					<p className="mt-3 text-3xl font-black tracking-tight text-[var(--text-primary)]">{value}</p>
					{delta && (
						<div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--text-primary)] px-2.5 py-1 text-xs font-medium text-[var(--bg-main)]">
							{delta > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
							{Math.abs(delta)}% vs last week
						</div>
					)}
				</div>
				<div className={`rounded-2xl bg-gradient-to-br ${tone} p-3 text-white shadow-lg`}>
					<Icon size={22} />
				</div>
			</div>
		</div>
	);
}

function SectionTitle({ eyebrow, title, subtitle, action }) {
	return (
		<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
			<div>
				<p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-500">{eyebrow}</p>
				<h2 className="mt-1 text-2xl font-black tracking-tight text-[var(--text-primary)]">{title}</h2>
				{subtitle && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
			</div>
			{action}
		</div>
	);
}

export default function Dashboard() {
	const navigate = useNavigate();
	const [insights, setInsights] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [live, setLive] = useState(true);
	const eventSourceRef = useRef(null);

	useEffect(() => {
		const loadInsights = async () => {
			try {
				const data = await getDashboardInsights();
				setInsights(data);
			} catch (requestError) {
				setError(requestError?.response?.data?.message || "Failed to load dashboard insights");
			} finally {
				setLoading(false);
			}
		};

		loadInsights();
	}, []);

	useEffect(() => {
		const token = sessionStorage.getItem("adminToken");
		if (!token) return undefined;

		const streamUrl = API_BASE_URL
			? `${API_BASE_URL.replace(/\/$/, "")}/api/admin/notifications/stream?token=${encodeURIComponent(token)}`
			: `/api/admin/notifications/stream?token=${encodeURIComponent(token)}`;
		const source = new EventSource(streamUrl);
		eventSourceRef.current = source;

		source.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				setInsights(data);
				setLive(true);
			} catch {
				setLive(false);
			}
		};

		source.onerror = () => setLive(false);

		return () => {
			source.close();
			eventSourceRef.current = null;
		};
	}, []);

	const stats = insights?.stats || {};
	const notifications = insights?.notifications || [];
	const revenuePerVendor = insights?.revenuePerVendor || [];
	const topSellingProducts = insights?.topSellingProducts || [];
	const vendorRequests = insights?.vendorRequests || [];
	const suspiciousOrders = insights?.suspiciousOrders || [];
	const revenueData = insights?.revenueData || [];
	const latestOrders = insights?.newOrders || [];
	const maxVendorRevenue = Math.max(1, ...revenuePerVendor.map((item) => item.revenue || 0));
	const maxTrendRevenue = Math.max(1, ...revenueData.map((item) => item.revenue || 0));

	const overviewCards = useMemo(
		() => [
			{ key: "sales", title: "Revenue", value: currency(stats.sales), icon: TrendingUp, tone: "from-orange-500 to-amber-400" },
			...CARD_META.map((card) => ({ ...card, value: Number(stats[card.key] || 0).toLocaleString() })),
		],
		[stats]
	);

	const handleRefresh = async () => {
		setLoading(true);
		try {
			const data = await getDashboardInsights();
			setInsights(data);
		} catch (requestError) {
			setError(requestError?.response?.data?.message || "Failed to refresh dashboard insights");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="relative min-h-screen overflow-hidden bg-[var(--bg-main)] px-6 pb-16 pt-8 text-[var(--text-primary)] md:px-10">
			<div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/20" />
			<div className="pointer-events-none absolute left-0 top-28 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />

			<div className="relative mx-auto max-w-7xl space-y-8">
				<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_80px_-40px_var(--shadow)] backdrop-blur-xl md:p-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
						<div className="max-w-3xl">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300">
								<PulseDot />
								{live ? "Live insights connected" : "Live feed reconnecting"}
							</div>
							<h1 className="text-4xl font-black tracking-tight text-[var(--text-primary)] md:text-5xl">
								Command center for orders, risk, and vendor activity.
							</h1>
							<p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
								Monitor new orders, approval requests, revenue per vendor, and top-selling products in one live dashboard. Export a PDF report or invoice with one click.
							</p>
						</div>

						<div className="flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => downloadReportPdf(insights)}
								disabled={!insights}
								className="inline-flex items-center gap-2 rounded-2xl bg-[var(--text-primary)] px-4 py-3 text-sm font-semibold text-[var(--bg-main)] shadow-lg shadow-black/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
							>
								<Download size={16} />
								Export PDF Report
							</button>
							<button
								type="button"
								onClick={handleRefresh}
								className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:text-orange-600"
							>
								<RefreshCw size={16} className={loading ? "animate-spin" : ""} />
								Refresh
							</button>
						</div>
					</div>

					{error && <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">{error}</div>}
				</div>

				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{overviewCards.map((card, index) => {
						const { key, ...statCardProps } = card;
						return (
							<motion.div key={key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
								<StatCard {...statCardProps} delta={index === 0 ? 12 : 4} />
							</motion.div>
						);
					})}
				</div>

				<div className="grid gap-6 xl:grid-cols-2">
					<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_80px_-45px_var(--shadow)] backdrop-blur-xl">
						<SectionTitle eyebrow="Live Feed" title="Real-time notifications" subtitle="New orders, vendor requests, and suspicious activity stream in continuously." />
						<div className="space-y-3">
							{loading && !insights ? (
								<div className="space-y-3">{[...Array(4)].map((_, index) => <div key={index} className="h-16 animate-pulse rounded-2xl bg-[var(--bg-muted)]" />)}</div>
							) : notifications.length === 0 ? (
								<p className="text-sm text-[var(--text-secondary)]">No live notifications yet.</p>
							) : (
								notifications.slice(0, 6).map((item) => (
									<div key={item.id} className={`rounded-2xl border px-4 py-3 ${SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.info}`}>
										<div className="flex items-start gap-3">
											<div className="mt-0.5 rounded-xl bg-[var(--bg-elevated)] p-2 text-[var(--text-primary)] shadow-sm">
												{item.type === "order" && <ShoppingBag size={16} />}
												{item.type === "vendor-request" && <Store size={16} />}
												{item.type === "suspicious-order" && <AlertTriangle size={16} />}
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center justify-between gap-2">
													<p className="font-semibold text-[var(--text-primary)]">{item.title}</p>
													<span className="inline-flex items-center gap-1 text-xs opacity-70"><Clock3 size={12} />{formatDate(item.createdAt)}</span>
												</div>
												<p className="mt-1 text-sm text-[var(--text-secondary)]">{item.description}</p>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>

					<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_80px_-45px_var(--shadow)] backdrop-blur-xl">
						<SectionTitle eyebrow="Analytics" title="Revenue per vendor" subtitle="Track which vendors are generating the most sales." />
						<div className="space-y-3">
							{revenuePerVendor.length === 0 ? (
								<p className="text-sm text-[var(--text-secondary)]">No revenue data available yet.</p>
							) : (
								revenuePerVendor.slice(0, 6).map((vendor) => (
									<div key={vendor.vendorId}>
										<div className="mb-1 flex items-center justify-between text-sm">
											<span className="font-medium text-[var(--text-primary)]">{vendor.vendorName}</span>
											<span className="text-[var(--text-secondary)]">{currency(vendor.revenue)}</span>
										</div>
										<div className="h-2.5 rounded-full bg-[var(--bg-muted)]">
											<div className="h-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.max(8, (vendor.revenue / maxVendorRevenue) * 100)}%` }} />
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				<div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
					<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_80px_-45px_var(--shadow)] backdrop-blur-xl">
						<SectionTitle eyebrow="Merchandise" title="Top-selling products" subtitle="Volume and revenue for your strongest items." />
						<div className="space-y-3">
							{topSellingProducts.length === 0 ? (
								<p className="text-sm text-[var(--text-secondary)]">No top-selling products yet.</p>
							) : (
								topSellingProducts.map((product, index) => (
									<div key={product.productId} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-3">
										<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--text-primary)] text-sm font-bold text-[var(--bg-main)]">
											{String(index + 1).padStart(2, "0")}
										</div>
										{product.image ? (
											<img src={product.image} alt={product.productName} className="h-11 w-11 rounded-2xl object-cover" />
										) : (
											<div className="h-11 w-11 rounded-2xl bg-[var(--bg-muted)]" />
										)}
										<div className="min-w-0 flex-1">
											<p className="truncate font-semibold text-[var(--text-primary)]">{product.productName}</p>
											<p className="text-xs text-[var(--text-secondary)]">{product.quantity} sold</p>
										</div>
										<p className="text-sm font-bold text-[var(--text-primary)]">{currency(product.revenue)}</p>
									</div>
								))
							)}
						</div>
					</div>

					<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_80px_-45px_var(--shadow)] backdrop-blur-xl">
						<SectionTitle
							eyebrow="Controls"
							title="Vendor requests"
							subtitle="Pending approvals waiting in the queue."
							action={
								<button
									type="button"
									onClick={() => navigate("/vendors")}
									className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)] transition hover:-translate-y-0.5"
								>
									Manage vendors
								</button>
							}
						/>
						<div className="space-y-3">
							{vendorRequests.length === 0 ? (
								<p className="text-sm text-[var(--text-secondary)]">No pending vendor requests.</p>
							) : (
								vendorRequests.slice(0, 6).map((vendor) => (
									<div key={vendor._id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/30 dark:bg-amber-500/10">
										<p className="font-semibold text-[var(--text-primary)]">{vendor.storeName}</p>
										<p className="mt-1 text-sm text-[var(--text-secondary)]">{vendor.email || "No email provided"}</p>
										<div className="mt-3 inline-flex rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200 dark:text-amber-300">
											Pending approval
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				<div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
					
					<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_80px_-45px_var(--shadow)] backdrop-blur-xl">
						<SectionTitle eyebrow="Operations" title="New orders" subtitle="Most recent orders currently entering the pipeline." />
						<div className="space-y-3">
							{latestOrders.length === 0 ? (
								<p className="text-sm text-[var(--text-secondary)]">No orders available yet.</p>
							) : (
								latestOrders.slice(0, 6).map((order) => (
									<div key={order._id} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
										<div className="flex items-center justify-between gap-3">
											<div>
												<p className="font-semibold text-[var(--text-primary)]">Order #{String(order._id).slice(-6).toUpperCase()}</p>
												<p className="text-sm text-[var(--text-secondary)]">{order.user?.name || "Unknown customer"}</p>
											</div>
											<span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] ring-1 ring-[var(--border)]">{order.status || "Pending"}</span>
										</div>
										<p className="mt-3 text-sm text-[var(--text-secondary)]">Vendor: {order.vendor?.storeName || "Unknown vendor"}</p>
										<p className="text-sm text-[var(--text-secondary)]">Total: {currency(order.total)}</p>
									</div>
								))
							)}
						</div>
					</div>

					<div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_80px_-45px_var(--shadow)] backdrop-blur-xl">
						<SectionTitle eyebrow="Trend" title="Revenue over time" subtitle="Simple trend view for the current order stream." />
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							{revenueData.length === 0 ? (
								<p className="text-sm text-[var(--text-secondary)]">No revenue trend available yet.</p>
							) : (
								revenueData.map((point) => (
									<div key={point.day} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4">
										<div className="mb-2 flex items-center justify-between">
											<p className="font-semibold text-[var(--text-primary)]">{point.day}</p>
											<span className="text-sm text-[var(--text-secondary)]">{currency(point.revenue)}</span>
										</div>
										<div className="h-2 rounded-full bg-[var(--bg-elevated)]">
											<div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.min(100, Math.max(8, (point.revenue / maxTrendRevenue) * 100))}%` }} />
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}