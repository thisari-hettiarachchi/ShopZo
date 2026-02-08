import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag,
  Users,
  Star 
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Dashboard() {
  // Stats cards
  const stats = [
    { title: "Sales", value: "$12,430", change: "+12%", up: true, bg: "bg-yellow-100", icon: TrendingUp, iconColor: "text-yellow-500" },
    { title: "Orders", value: "320", change: "-5%", up: false, bg: "bg-red-100", icon: ShoppingBag, iconColor: "text-red-500" },
    { title: "Customers", value: "1,024", change: "+8%", up: true, bg: "bg-green-100", icon: Users, iconColor: "text-green-500" },
    { title: "Reviews", value: "85", change: "+2%", up: true, bg: "bg-blue-100", icon: Star, iconColor: "text-blue-500" },
  ];

  const categoryData = [
    { name: "Electronics", value: 45, color: "#F59E0B" },
    { name: "Clothing", value: 30, color: "#3B82F6" },
    { name: "Accessories", value: 25, color: "#10B981" },
  ];

  const revenueData = [
    { day: "Mon", revenue: 1200 },
    { day: "Tue", revenue: 2100 },
    { day: "Wed", revenue: 800 },
    { day: "Thu", revenue: 1600 },
    { day: "Fri", revenue: 900 },
  ];

  const orders = [
    { id: 101, customer: "Alice", amount: 250 },
    { id: 102, customer: "Bob", amount: 120 },
    { id: 103, customer: "Charlie", amount: 300 },
    { id: 104, customer: "Diana", amount: 180 },
    { id: 105, customer: "Ethan", amount: 75 },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--border)] hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)] mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                      <div className="flex items-center gap-1">
                        {stat.up ? <TrendingUp size={14} className="text-green-600" /> : <TrendingDown size={14} className="text-red-600" />}
                        <span className={`text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={stat.iconColor} size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Category Distribution */}
              <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--border)]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Category Distribution</h3>
                  <button className="text-sm text-[var(--color-primary)] hover:underline">Details</button>
                </div>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-sm text-[var(--text-secondary)]">{cat.name}</span>
                      <span className="text-sm font-medium ml-auto">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Revenue & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Revenue */}
              <div className="lg:col-span-2 bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-6">Weekly Revenue</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-card)', 
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="revenue" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activity */}
              <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--border)]">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-start gap-3 pb-3 border-b border-[var(--border)] last:border-0">
                      <div className="p-2 bg-[var(--bg-muted)] rounded-lg">
                        <ShoppingBag size={16} className="text-[var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Order #{order.id}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{order.customer}</p>
                      </div>
                      <span className="text-sm font-semibold">${order.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
