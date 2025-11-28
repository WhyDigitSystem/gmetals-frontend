import {
  Activity,
  ArrowDown,
  ArrowUp,
  Award,
  Calendar,
  ClipboardList,
  DollarSign,
  Download,
  FileCheck,
  FileText,
  MessageCircle,
  Package,
  Receipt,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sample data - Replace with actual API data
  const salesData = [
    { month: "Jan", sales: 45, revenue: 125000, target: 40 },
    { month: "Feb", sales: 52, revenue: 142000, target: 45 },
    { month: "Mar", sales: 48, revenue: 138000, target: 50 },
    { month: "Apr", sales: 60, revenue: 165000, target: 55 },
    { month: "May", sales: 55, revenue: 152000, target: 52 },
    { month: "Jun", sales: 68, revenue: 185000, target: 60 },
  ];

  const inventoryData = [
    { name: "Steel Plates", value: 35, color: "#4f46e5" },
    { name: "Aluminum", value: 25, color: "#06b6d4" },
    { name: "Copper", value: 20, color: "#10b981" },
    { name: "Brass", value: 15, color: "#f59e0b" },
    { name: "Other", value: 5, color: "#ef4444" },
  ];

  const statsCards = [
    {
      title: "Total Revenue",
      value: "RM 92,000",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="h-6 w-6" />,
      gradient: "from-green-500 to-emerald-600",
      bgGradient:
        "from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10",
    },
    {
      title: "Orders Processed",
      value: "248",
      change: "+8.2%",
      trend: "up",
      icon: <ShoppingCart className="h-6 w-6" />,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient:
        "from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/10",
    },
    {
      title: "Inventory Items",
      value: "1,284",
      change: "-2.1%",
      trend: "down",
      icon: <Package className="h-6 w-6" />,
      gradient: "from-purple-500 to-pink-600",
      bgGradient:
        "from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/10",
    },
    {
      title: "Active Clients",
      value: "89",
      change: "+5.6%",
      trend: "up",
      icon: <Users className="h-6 w-6" />,
      gradient: "from-orange-500 to-amber-600",
      bgGradient:
        "from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/10",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "order",
      message: "New order #ORD-2847 received",
      time: "2 min ago",
      status: "completed",
    },
    {
      id: 2,
      type: "payment",
      message: "Payment received for INV-4821",
      time: "15 min ago",
      status: "completed",
    },
    {
      id: 3,
      type: "inventory",
      message: "Low stock alert for Steel Plates",
      time: "1 hour ago",
      status: "warning",
    },
    {
      id: 4,
      type: "shipment",
      message: "Shipment #SH-8472 dispatched",
      time: "2 hours ago",
      status: "completed",
    },
  ];

  const handleQuickAction = (actionLabel) => {
    switch (actionLabel) {
      case "Add Inventory":
        navigate("/inventory/add");
        break;
      case "New Client":
        navigate("/clients/new");
        break;
      case "Create Invoice":
        navigate("/invoices/create");
        break;
      case "Schedule":
        navigate("/schedule");
        break;
      case "Enquiry":
        navigate("/Enquiry");
        break;
      case "Order Booking":
        navigate("/order-booking");
        break;
      case "Invoice":
        navigate("/invoices");
        break;
      case "Forms":
        navigate("/forms");
        break;
      case "Certificates":
        navigate("/certificates");
        break;
      default:
        console.log(`Navigation for ${actionLabel} not configured`);
    }
  };

  const quickActions = [
    {
      icon: <Package className="h-5 w-5" />,
      label: "Add Inventory",
      color:
        "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "New Client",
      color:
        "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Create Invoice",
      color:
        "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      color:
        "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
    },
  ];

  const additionalQuickActions = [
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Enquiry",
      color:
        "bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700",
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: "Order Booking",
      color:
        "bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700",
    },
    {
      icon: <Receipt className="h-5 w-5" />,
      label: "Invoice",
      color:
        "bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700",
    },
    {
      icon: <FileCheck className="h-5 w-5" />,
      label: "Forms",
      color:
        "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700",
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Certificates",
      color:
        "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    },
  ];

  // Combined quick actions for easier mapping
  const allQuickActions = [...quickActions, ...additionalQuickActions];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Welcome back! Here's what's happening with Ganapathy Metals
                today.
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25">
                <Download className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 backdrop-blur-sm border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <div
                    className={`flex items-center mt-2 text-sm ${
                      stat.trend === "up"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions - Horizontal below stats cards */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Quick Actions
          </h3>

          {/* All Quick Actions in Horizontal Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4">
            {allQuickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.label)}
                className={`${action.color} p-4 rounded-xl text-white flex flex-col items-center justify-center aspect-square transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer`}
              >
                {action.icon}
                <span className="text-xs font-medium text-center mt-2">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Sales & Revenue
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Sales
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">
                    Revenue
                  </span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    className="dark:stroke-gray-600"
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#666"
                    className="dark:stroke-gray-400"
                  />
                  <YAxis stroke="#666" className="dark:stroke-gray-400" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      color: "#1f2937",
                    }}
                    className="dark:[&>div]:bg-gray-800 dark:[&>div]:border-gray-600 dark:[&>div]:text-white"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#4f46e5"
                    fill="url(#colorSales)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Chart */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Inventory Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      backdropFilter: "blur(10px)",
                      color: "#1f2937",
                    }}
                    className="dark:[&>div]:bg-gray-800 dark:[&>div]:border-gray-600 dark:[&>div]:text-white"
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                    }}
                    className="[&>ul]:text-gray-600 dark:[&>ul]:text-gray-300"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section - Recent Activities Only */}
        <div className="grid grid-cols-1">
          {/* Recent Activities */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-gray-700/50 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center p-4 rounded-xl bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 border border-gray-100 dark:border-gray-600 hover:border-indigo-100 dark:hover:border-indigo-400/30 transition-all duration-200 group hover:shadow-md"
                >
                  <div
                    className={`p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                        : "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                    }`}
                  >
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {activity.time}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === "completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                    }`}
                  >
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
