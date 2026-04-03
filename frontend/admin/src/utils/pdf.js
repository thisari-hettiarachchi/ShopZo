import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

export const downloadReportPdf = (insights) => {
	const doc = new jsPDF();
	const stats = insights?.stats || {};
	const revenuePerVendor = insights?.revenuePerVendor || [];
	const topSellingProducts = insights?.topSellingProducts || [];
	const suspiciousOrders = insights?.suspiciousOrders || [];

	doc.setFillColor(249, 115, 22);
	doc.rect(0, 0, 210, 24, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(18);
	doc.text("ShopZo Admin Report", 14, 15);
	doc.setFontSize(9);
	doc.text(`Generated ${new Date().toLocaleString()}`, 14, 21);

	doc.setTextColor(17, 24, 39);
	doc.setFontSize(12);
	doc.text("Overview", 14, 34);

	const overviewRows = [
		["Sales", formatCurrency(stats.sales)],
		["Orders", String(stats.orders || 0)],
		["Customers", String(stats.customers || 0)],
		["Products", String(stats.products || 0)],
		["Vendors", String(stats.vendors || 0)],
		["Vendor Requests", String(stats.vendorRequests || 0)],
		["Suspicious Orders", String(stats.suspiciousOrders || 0)],
	];

	autoTable(doc, {
		startY: 38,
		head: [["Metric", "Value"]],
		body: overviewRows,
		theme: "grid",
		headStyles: { fillColor: [249, 115, 22] },
		styles: { fontSize: 9 },
	});

	let cursorY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : 55;
	doc.setFontSize(12);
	doc.text("Top-Selling Products", 14, cursorY);
	cursorY += 4;
	autoTable(doc, {
		startY: cursorY,
		head: [["Product", "Qty", "Revenue"]],
		body: topSellingProducts.slice(0, 8).map((item) => [item.productName, String(item.quantity || 0), formatCurrency(item.revenue)]),
		theme: "striped",
		headStyles: { fillColor: [15, 23, 42] },
		styles: { fontSize: 8 },
	});

	cursorY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : cursorY + 35;
	doc.setFontSize(12);
	doc.text("Revenue Per Vendor", 14, cursorY);
	cursorY += 4;
	autoTable(doc, {
		startY: cursorY,
		head: [["Vendor", "Orders", "Revenue"]],
		body: revenuePerVendor.slice(0, 8).map((item) => [item.vendorName, String(item.orders || 0), formatCurrency(item.revenue)]),
		theme: "striped",
		headStyles: { fillColor: [16, 185, 129] },
		styles: { fontSize: 8 },
	});

	const finalY = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : cursorY + 35;
	doc.setFontSize(12);
	doc.text("Suspicious Orders", 14, finalY);
	autoTable(doc, {
		startY: finalY + 4,
		head: [["Order", "Flags"]],
		body: suspiciousOrders.slice(0, 8).map((entry) => [
			`#${String(entry.order?._id || "").slice(-6).toUpperCase()}`,
			(entry.flags || []).join(", "),
		]),
		theme: "grid",
		headStyles: { fillColor: [239, 68, 68] },
		styles: { fontSize: 8 },
	});

	doc.save(`shopzo-admin-report-${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const downloadInvoicePdf = (order) => {
	const doc = new jsPDF();
	const orderId = String(order?._id || "invoice");
	const items = Array.isArray(order?.products) ? order.products : [];

	doc.setFillColor(15, 23, 42);
	doc.rect(0, 0, 210, 28, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(18);
	doc.text("ShopZo Invoice", 14, 16);
	doc.setFontSize(10);
	doc.text(`Order #${orderId.slice(-8).toUpperCase()}`, 14, 23);

	doc.setTextColor(17, 24, 39);
	doc.setFontSize(11);
	doc.text(`Customer: ${order?.user?.name || "Unknown customer"}`, 14, 40);
	doc.text(`Email: ${order?.user?.email || "-"}`, 14, 47);
	doc.text(`Vendor: ${order?.vendor?.storeName || "Unknown vendor"}`, 14, 54);
	doc.text(`Status: ${order?.status || "Pending"}`, 14, 61);

	autoTable(doc, {
		startY: 70,
		head: [["Product", "Qty", "Price", "Total"]],
		body: items.map((item) => {
			const quantity = Number(item.quantity || 0);
			const price = Number(item.price || 0);
			return [item.product?.name || "Product", String(quantity), formatCurrency(price), formatCurrency(quantity * price)];
		}),
		theme: "striped",
		headStyles: { fillColor: [249, 115, 22] },
		styles: { fontSize: 9 },
	});

	const total = Number(order?.total || 0);
	doc.setFontSize(12);
	doc.text(`Grand Total: ${formatCurrency(total)}`, 14, doc.lastAutoTable?.finalY + 12 || 120);
	doc.save(`invoice-${orderId.slice(-8)}.pdf`);
};