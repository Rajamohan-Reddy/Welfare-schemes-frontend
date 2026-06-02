import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  Grid3X3,
  DollarSign,
  Activity,
  BarChart3,
  Loader2,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import toast from "react-hot-toast";
import { getDashboardAnalyticsApi } from "../api/admin-analytics.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

// Power BI Premium Color Palette
const COLORS_POWERBI = {
  primary: "#1F77B4",
  accent1: "#FF7F0E",
  accent2: "#2CA02C",
  accent3: "#D62728",
  accent4: "#9467BD",
  accent5: "#8C564B",
  accent6: "#E377C2",
  accent7: "#7F7F7F",
  accent8: "#BCBD22",
};

const GRADIENT_COLORS = [
  "#1F77B4",
  "#FF7F0E",
  "#2CA02C",
  "#D62728",
  "#9467BD",
  "#8C564B",
];

function AnalyticsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getDashboardAnalyticsApi();
      setAnalytics(response.data?.data || null);
    } catch (err) {
      console.error("Error loading analytics:", err);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const summary = analytics?.summary || {};
  const statusData = analytics?.applicationsByStatus?.map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];
  const monthlyData = analytics?.applicationsByMonth?.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    applications: item.count,
  })) || [];
  const rolesData = analytics?.usersByRole?.map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];
  const paymentsData = analytics?.paymentsByMonth?.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    amount: item.totalAmount,
    count: item.count,
  })) || [];
  const categoryData = analytics?.schemesByCategory?.map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-lg text-gray-600">Comprehensive system-wide insights and premium metrics</p>
            </div>
            <Button
              onClick={loadAnalytics}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards - Power BI Style with Unique Gradients */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            {
              icon: FileText,
              label: "Total Applications",
              value: summary.totalApplications || 0,
              gradient: "from-blue-600 to-blue-700",
              lightGradient: "from-blue-50 to-blue-100",
              textColor: "text-blue-700",
            },
            {
              icon: Users,
              label: "Total Users",
              value: summary.totalUsers || 0,
              gradient: "from-emerald-600 to-emerald-700",
              lightGradient: "from-emerald-50 to-emerald-100",
              textColor: "text-emerald-700",
            },
            {
              icon: Grid3X3,
              label: "Active Schemes",
              value: summary.totalSchemes || 0,
              gradient: "from-purple-600 to-purple-700",
              lightGradient: "from-purple-50 to-purple-100",
              textColor: "text-purple-700",
            },
            {
              icon: DollarSign,
              label: "Total Payments",
              value: summary.totalPayments || 0,
              gradient: "from-orange-600 to-orange-700",
              lightGradient: "from-orange-50 to-orange-100",
              textColor: "text-orange-700",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${item.lightGradient} rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className={`${item.textColor} text-sm font-bold mb-2`}>{item.label}</p>
                  <h3 className="text-3xl font-black text-gray-900">{item.value.toLocaleString()}</h3>
                </div>
                <div className={`bg-gradient-to-br ${item.gradient} p-3 rounded-xl shadow-lg`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className={`text-xs font-semibold ${item.textColor}`}>Premium Metric</div>
            </div>
          ))}
        </div>

        {/* Key Performance Indicators - Power BI KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            {
              title: "Approval Rate",
              value: summary.totalApplications > 0
                ? Math.round(
                    ((summary.approvedApplications || 0) / (summary.totalApplications || 1)) *
                      100
                  )
                : 0,
              icon: Activity,
              textColor: "text-emerald-600",
              bgColor: "from-emerald-50 to-emerald-100",
              barColor: "bg-emerald-500",
              trend: "+2.5%",
            },
            {
              title: "Rejection Rate",
              value: summary.totalApplications > 0
                ? Math.round(
                    ((summary.rejectedApplications || 0) / (summary.totalApplications || 1)) *
                      100
                  )
                : 0,
              icon: Activity,
              textColor: "text-red-600",
              bgColor: "from-red-50 to-red-100",
              barColor: "bg-red-500",
              trend: "-1.2%",
            },
            {
              title: "Disbursement Rate",
              value: summary.totalApplications > 0
                ? Math.round(
                    ((summary.paidApplications || 0) / (summary.totalApplications || 1)) * 100
                  )
                : 0,
              icon: DollarSign,
              textColor: "text-yellow-600",
              bgColor: "from-yellow-50 to-yellow-100",
              barColor: "bg-yellow-500",
              trend: "+5.8%",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-6 border-2 border-gray-200 shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <item.icon className={`w-6 h-6 ${item.textColor}`} />
              </div>
              <div className="mb-3">
                <p className={`text-5xl font-black ${item.textColor}`}>{item.value}%</p>
                <p className="text-sm text-gray-600 mt-1">Target KPI</p>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className={`${item.barColor} h-2 rounded-full`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
              <p className="text-xs font-semibold text-green-600 mt-2">{item.trend} this month</p>
            </div>
          ))}
        </div>

        {/* Main Charts Section - Power BI Style Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Applications Status Distribution */}
          <div className="bg-white rounded-2xl p-7 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Application Status</h3>
                <p className="text-sm text-gray-600">Distribution across all statuses</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>

          {/* Users by Role */}
          <div className="bg-white rounded-2xl p-7 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">User Distribution</h3>
                <p className="text-sm text-gray-600">Breakdown by role</p>
              </div>
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            {rolesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={rolesData}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F9FAFB",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Bar dataKey="value" fill="url(#colorBar)" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Trend Analysis - Power BI Multi-Series */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Applications Monthly Trend */}
          <div className="bg-white rounded-2xl p-7 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Monthly Applications</h3>
                <p className="text-sm text-gray-600">12-month trend analysis</p>
              </div>
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F9FAFB",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#1E40AF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTrend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>

          {/* Payments Multi-Series Trend */}
          <div className="bg-white rounded-2xl p-7 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Payments Analytics</h3>
                <p className="text-sm text-gray-600">Amount & transaction count</p>
              </div>
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            {paymentsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={paymentsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" yAxisId="left" />
                  <YAxis stroke="#6B7280" yAxisId="right" orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#F9FAFB",
                      border: "2px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    stroke="#FF7F0E"
                    strokeWidth={3}
                    dot={{ fill: "#FF7F0E", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="count"
                    stroke="#2CA02C"
                    strokeWidth={3}
                    dot={{ fill: "#2CA02C", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Schemes Category Distribution - Horizontal Bar */}
        <div className="bg-white rounded-2xl p-7 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Schemes by Category</h3>
              <p className="text-sm text-gray-600">Distribution across all scheme categories</p>
            </div>
            <Grid3X3 className="w-6 h-6 text-purple-600" />
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <defs>
                  {GRADIENT_COLORS.map((color, idx) => (
                    <linearGradient key={idx} id={`grad${idx}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={color} stopOpacity={1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="name" type="category" stroke="#6B7280" width={190} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#F9FAFB",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Bar dataKey="value" fill={GRADIENT_COLORS[0]} radius={[0, 12, 12, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboardPage;
         