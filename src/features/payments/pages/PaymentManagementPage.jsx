import { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Check,
  XCircle,
  Loader2,
  RefreshCcw,
  Download,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Send,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { getPaymentsApi, getPaymentsAnalyticsApi } from "../api/payments.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const COLORS_APPLE = ["#34C759", "#FF3B30", "#FFA500", "#5AC8FA"];

function PaymentManagementPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load payments
      let paymentsList = [];
      try {
        console.log("🔄 Fetching payments...");
        const paymentsResp = await getPaymentsApi();
        console.log("📦 Payments response:", paymentsResp);
        
        paymentsList = Array.isArray(paymentsResp.data?.data)
          ? paymentsResp.data.data
          : Array.isArray(paymentsResp.data)
          ? paymentsResp.data
          : [];
        console.log("✅ Payments loaded:", paymentsList.length, "items");
      } catch (paymentErr) {
        console.error("❌ Error loading payments:", paymentErr);
        toast.error("Failed to load payments. Please try again.");
        setPayments([]);
      }

      // Load analytics (optional - doesn't block if fails)
      let analyticsData = {};
      try {
        console.log("🔄 Fetching analytics...");
        const analyticsResp = await getPaymentsAnalyticsApi();
        console.log("📦 Analytics response:", analyticsResp);
        
        analyticsData = analyticsResp.data?.data || {};
        console.log("✅ Analytics loaded");
      } catch (analyticsErr) {
        console.error("⚠️ Analytics failed (non-blocking):", analyticsErr);
        analyticsData = {};
      }

      setPayments(paymentsList);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error("Error in loadData:", err);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (statusFilter !== "all" && payment.paymentStatus !== statusFilter) {
      return false;
    }
    return true;
  });

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handleDownloadReport = async () => {
    try {
      const csvData = [
        ["Payment ID", "Application ID", "Amount", "Status", "Date", "Processed By"],
        ...payments.map((p) => [
          p._id,
          p.applicationId,
          p.amount,
          p.paymentStatus,
          new Date(p.paymentDate).toLocaleDateString(),
          p.processedBy || "N/A",
        ]),
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," +
        csvData.map((row) => row.join(",")).join("\n");

      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `payments_report_${Date.now()}.csv`);
      link.click();

      toast.success("Report downloaded successfully");
    } catch (err) {
      toast.error("Failed to download report");
    }
  };

  const statusBadgeStyle = (status) => {
    const styles = {
      SUCCESS: "bg-emerald-100 text-emerald-700",
      FAILED: "bg-red-100 text-red-700",
      PENDING: "bg-yellow-100 text-yellow-700",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Apple Style */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Payments</h1>
          <p className="text-lg text-gray-600">Track and manage all welfare disbursements with precision</p>
        </div>

        {/* Analytics Cards - Apple Premium Style */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Total Disbursed Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 border border-green-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-700 text-sm font-semibold mb-2">Total Disbursed</p>
                  <h2 className="text-4xl font-bold text-green-900 mb-3">
                    ₹{(analytics.totalDisbursed || 0).toLocaleString("en-IN")}
                  </h2>
                  <div className="flex items-center text-green-700 text-sm">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    {analytics.successfulPayments || 0} successful transfers
                  </div>
                </div>
                <div className="bg-white rounded-full p-4 shadow-md">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Total Payments Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 border border-blue-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-semibold mb-2">Total Payments</p>
                  <h2 className="text-4xl font-bold text-blue-900 mb-3">{analytics.totalPayments || 0}</h2>
                  <div className="text-blue-700 text-sm">All payment records</div>
                </div>
                <div className="bg-white rounded-full p-4 shadow-md">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Average Payment Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 border border-purple-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-semibold mb-2">Average Payment</p>
                  <h2 className="text-4xl font-bold text-purple-900 mb-3">
                    ₹
                    {analytics.totalPayments > 0
                      ? Math.round(
                          (analytics.totalDisbursed || 0) / (analytics.totalPayments || 1)
                        ).toLocaleString("en-IN")
                      : "0"}
                  </h2>
                  <div className="text-purple-700 text-sm">Per transaction</div>
                </div>
                <div className="bg-white rounded-full p-4 shadow-md">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Distribution Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Status Pie Chart */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Payment Status Distribution</h3>
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            {payments.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: "Successful",
                        value: payments.filter((p) => p.paymentStatus === "SUCCESS").length,
                      },
                      {
                        name: "Failed",
                        value: payments.filter((p) => p.paymentStatus === "FAILED").length,
                      },
                      {
                        name: "Pending",
                        value: payments.filter((p) => p.paymentStatus === "PENDING").length,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_APPLE[index]} />
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

          {/* Recent Status Summary */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Status Summary</h3>
            <div className="space-y-4">
              {[
                {
                  label: "Successful",
                  value: payments.filter((p) => p.paymentStatus === "SUCCESS").length,
                  color: "text-green-600",
                  bgColor: "bg-green-50",
                },
                {
                  label: "Failed",
                  value: payments.filter((p) => p.paymentStatus === "FAILED").length,
                  color: "text-red-600",
                  bgColor: "bg-red-50",
                },
                {
                  label: "Pending",
                  value: payments.filter((p) => p.paymentStatus === "PENDING").length,
                  color: "text-orange-600",
                  bgColor: "bg-orange-50",
                },
              ].map((item, idx) => (
                <div key={idx} className={`${item.bgColor} rounded-2xl p-4 flex items-center justify-between`}>
                  <span className="text-gray-700 font-semibold">{item.label}</span>
                  <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 bg-white text-gray-900 rounded-2xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="SUCCESS">Successful</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadData}
              variant="outline"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl border-gray-300 text-gray-900 hover:bg-gray-50"
            >
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Payments Table - Apple Style */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Payment ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((payment, idx) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {payment._id?.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {payment.applicationId?.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{payment.amount?.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.paymentStatus === "SUCCESS"
                              ? "bg-green-100 text-green-700"
                              : payment.paymentStatus === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {payment.paymentStatus || "UNKNOWN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payment.paymentDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4">
                        {payment.paymentStatus === "PENDING" ? (
                          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">
                            <Send className="w-4 h-4" />
                            Process
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            {payment.paymentStatus === "SUCCESS" ? "Completed" : "Failed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="text-xs px-4 py-2 rounded-xl border-gray-300"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="text-xs px-4 py-2 rounded-xl border-gray-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentManagementPage;
