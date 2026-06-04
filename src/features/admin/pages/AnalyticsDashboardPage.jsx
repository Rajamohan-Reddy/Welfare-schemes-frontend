import { useEffect, useState, useMemo } from "react";
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
  Zap,
  Target,
  Clock,
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
} from "recharts";
import toast from "react-hot-toast";
import { getDashboardAnalyticsApi } from "../api/admin-analytics.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

// Industrial Grade Color System
const COLORS = {
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    600: "#475569",
    900: "#0f172a",
  },
  blue: { 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8" },
  emerald: { 500: "#10b981", 600: "#059669", 700: "#047857" },
  amber: { 500: "#f59e0b", 600: "#d97706" },
  rose: { 500: "#f43f5e", 600: "#e11d48" },
  violet: { 500: "#a78bfa", 600: "#8b5cf6" },
};

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
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

  // Compute all metrics from real API data
  const computedMetrics = useMemo(() => {
    if (!analytics) return null;

    const summary = analytics?.summary || {};
    const statusRaw = analytics?.applicationsByStatus || [];
    const monthlyRaw = analytics?.applicationsByMonth || [];
    const rolesRaw = analytics?.usersByRole || [];
    const paymentsRaw = analytics?.paymentsByMonth || [];
    const categoriesRaw = analytics?.schemesByCategory || [];

    // Transform data
    const statusData = statusRaw.map((item) => ({
      name: item._id,
      value: item.count,
    }));
    const monthlyData = monthlyRaw
      .map((item) => ({
        month: `${item._id.month}/${item._id.year}`,
        applications: item.count,
        raw: item,
      }))
      .sort((a, b) => {
        const [aM, aY] = a.month.split("/").map(Number);
        const [bM, bY] = b.month.split("/").map(Number);
        return aY === bY ? aM - bM : aY - bY;
      });

    const rolesData = rolesRaw.map((item) => ({
      name: item._id,
      value: item.count,
    }));
    const paymentsData = paymentsRaw
      .map((item) => ({
        month: `${item._id.month}/${item._id.year}`,
        amount: item.totalAmount,
        count: item.count,
        raw: item,
      }))
      .sort((a, b) => {
        const [aM, aY] = a.month.split("/").map(Number);
        const [bM, bY] = b.month.split("/").map(Number);
        return aY === bY ? aM - bM : aY - bY;
      });

    const categoryData = categoriesRaw.map((item) => ({
      name: item._id,
      value: item.count,
    }));

    // Calculate real metrics
    const total = summary.totalApplications || 0;
    const approved = summary.approvedApplications || 0;
    const rejected = summary.rejectedApplications || 0;
    const pending = Math.max(total - approved - rejected, 0);
    const paid = summary.paidApplications || 0;

    // Calculate trend: last month vs previous month
    const getMonthTrend = (data) => {
      if (data.length < 2)
        return { change: 0, direction: "neutral", prev: 0, curr: 0 };
      const curr =
        data[data.length - 1]?.applications ||
        data[data.length - 1]?.amount ||
        0;
      const prev =
        data[data.length - 2]?.applications ||
        data[data.length - 2]?.amount ||
        0;
      const change = prev === 0 ? 0 : ((curr - prev) / prev) * 100;
      return {
        change: Math.round(change * 10) / 10,
        direction: change >= 0 ? "up" : "down",
        prev,
        curr,
      };
    };

    const appTrend = getMonthTrend(monthlyData);
    const paymentTrend = getMonthTrend(paymentsData);

    return {
      summary,
      statusData,
      monthlyData,
      rolesData,
      paymentsData,
      categoryData,
      metrics: {
        total,
        approved,
        rejected,
        pending,
        paid,
        approvalRate: total > 0 ? (approved / total) * 100 : 0,
        rejectionRate: total > 0 ? (rejected / total) * 100 : 0,
        disbursementRate: total > 0 ? (paid / total) * 100 : 0,
        appTrend,
        paymentTrend,
      },
    };
  }, [analytics]);

  if (loading || !computedMetrics) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-700 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time system metrics
            </p>
          </div>
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg text-slate-600 hover:text-slate-900 transition-all duration-200 disabled:opacity-50 border border-slate-100"
            title="Refresh data"
          >
            <RefreshCcw
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Grid - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "Total Applications",
              value: computedMetrics.summary.totalApplications || 0,
              icon: FileText,
              trend: computedMetrics.metrics.appTrend,
              color: "blue",
            },
            {
              label: "Active Users",
              value: computedMetrics.summary.totalUsers || 0,
              icon: Users,
              trend: { change: 0, direction: "neutral" },
              color: "emerald",
            },
            {
              label: "Active Schemes",
              value: computedMetrics.summary.totalSchemes || 0,
              icon: Grid3X3,
              trend: { change: 0, direction: "neutral" },
              color: "violet",
            },
            {
              label: "Total Payments",
              value: `₹${(computedMetrics.summary.totalPayments || 0).toLocaleString()}`,
              icon: DollarSign,
              trend: computedMetrics.metrics.paymentTrend,
              color: "amber",
            },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background accent */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-${kpi.color}-100 opacity-20 -mr-12 -mt-12 blur-xl`}
              ></div>

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-lg bg-${kpi.color}-100`}>
                    <kpi.icon className={`w-5 h-5 text-${kpi.color}-600`} />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-3xl font-bold text-slate-900">
                    {kpi.value}
                  </div>
                </div>

                {kpi.trend && kpi.trend.change !== 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    {kpi.trend.direction === "up" ? (
                      <>
                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">
                          {kpi.trend.change.toFixed(1)}%
                        </span>
                        <span className="text-slate-500">vs last month</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-600 font-semibold">
                          {Math.abs(kpi.trend.change).toFixed(1)}%
                        </span>
                        <span className="text-slate-500">vs last month</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Metrics Row - Calculated Rates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Approval Rate",
              value: computedMetrics.metrics.approvalRate.toFixed(1),
              icon: Target,
              color: "emerald",
            },
            {
              label: "Rejection Rate",
              value: computedMetrics.metrics.rejectionRate.toFixed(1),
              icon: Activity,
              color: "rose",
            },
            {
              label: "Disbursement Rate",
              value: computedMetrics.metrics.disbursementRate.toFixed(1),
              icon: Zap,
              color: "amber",
            },
          ].map((metric, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {metric.label}
                </span>
                <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
              </div>

              <div className="mb-4">
                <div className="text-5xl font-bold text-slate-900">
                  {metric.value}%
                </div>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 rounded-full transition-all`}
                  style={{
                    width: `${Math.min(100, parseFloat(metric.value))}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Applications Trend */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Applications Trend
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Monthly application submissions
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>

            {computedMetrics.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={computedMetrics.monthlyData}>
                  <defs>
                    <linearGradient
                      id="appGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#appGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No data
              </div>
            )}
          </div>

          {/* Payments Trend */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Payments Analytics
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Transaction amount & count
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>

            {computedMetrics.paymentsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={computedMetrics.paymentsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                    yAxisId="left"
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                    yAxisId="right"
                    orientation="right"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No data
              </div>
            )}
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Application Status
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Current distribution
                </p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>

            {computedMetrics.statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={computedMetrics.statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {computedMetrics.statusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No data
              </div>
            )}
          </div>

          {/* User Roles */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">User Roles</h3>
                <p className="text-sm text-slate-500 mt-1">Distribution</p>
              </div>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>

            {computedMetrics.rolesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={computedMetrics.rolesData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No data
              </div>
            )}
          </div>

          {/* Scheme Categories */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Schemes</h3>
                <p className="text-sm text-slate-500 mt-1">By category</p>
              </div>
              <Grid3X3 className="w-5 h-5 text-violet-600" />
            </div>

            {computedMetrics.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={computedMetrics.categoryData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => value.toLocaleString()}
                  />
                  <Bar dataKey="value" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                No data
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Approved",
              value: computedMetrics.metrics.approved,
              icon: "✓",
              bgColor: "bg-emerald-50",
              textColor: "text-emerald-700",
            },
            {
              label: "Rejected",
              value: computedMetrics.metrics.rejected,
              icon: "✕",
              bgColor: "bg-rose-50",
              textColor: "text-rose-700",
            },
            {
              label: "Pending",
              value: computedMetrics.metrics.pending,
              icon: "⏱",
              bgColor: "bg-amber-50",
              textColor: "text-amber-700",
            },
            {
              label: "Paid",
              value: computedMetrics.metrics.paid,
              icon: "₹",
              bgColor: "bg-blue-50",
              textColor: "text-blue-700",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bgColor} rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 hover:-translate-y-0.5`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboardPage;
