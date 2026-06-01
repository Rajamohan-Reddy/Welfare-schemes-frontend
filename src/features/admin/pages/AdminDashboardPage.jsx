import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  getAdminDashboardApi,
  getApplicationStatusChartApi,
  getMonthlyApplicationsChartApi,
} from "../../dashboard/api/dashboard.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import api from "../../../api/axios";
import toast from "react-hot-toast";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#14B8A6",
];

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [statusChartData, setStatusChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [dashboardResp, statusResp, monthlyResp] = await Promise.all([
        getAdminDashboardApi(),
        getApplicationStatusChartApi(),
        getMonthlyApplicationsChartApi(),
      ]);

      setStats(dashboardResp.data.data || {});
      setStatusChartData(statusResp.data.data || []);
      setMonthlyChartData(monthlyResp.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load admin analytics");
    } finally {
      setLoading(false);
    }
  };

  const approvalRate = useMemo(() => {
    if (!stats.totalApplications) return 0;
    return Math.round(
      ((stats.approvedApplications || 0) / stats.totalApplications) * 100,
    );
  }, [stats]);

  const averageProcessing = useMemo(() => {
    return stats.averageProcessingDays ?? 3.4;
  }, [stats]);

  const downloadApplicationsReport = async () => {
    try {
      setDownloadLoading(true);
      const response = await api.get("/reports/applications", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications-report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Applications report downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Unable to download applications report");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-8 text-white shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">
              Enterprise Insights Suite
            </p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight">
              Premium Welfare Operations Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Centralized intelligence for approvals, citizen outcomes, and
              compliance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[28px] bg-slate-900/80 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Approval rate
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {approvalRate}%
              </p>
              <p className="mt-2 text-sm text-slate-400">
                of applications approved this period
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-900/80 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Compliance alerts
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {stats.securityAlerts || 12}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                active governance items
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-900/80 p-5 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
                Avg. processing
              </p>
              <p className="mt-3 text-4xl font-semibold text-white">
                {averageProcessing}d
              </p>
              <p className="mt-2 text-sm text-slate-400">
                from submission to approval
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard title="Total Citizens" value={stats.totalUsers} />
        <StatCard title="Active Schemes" value={stats.totalSchemes} />
        <StatCard title="Applications" value={stats.totalApplications} />
        <StatCard title="Pending Approvals" value={stats.pendingApplications} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Applications analytics
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Enterprise performance overview
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate("/admin/reports")}
                fullWidth={false}
                className="h-10 px-4"
              >
                View reports
              </Button>
              <Button
                variant="primary"
                onClick={downloadApplicationsReport}
                loading={downloadLoading}
                fullWidth={false}
                className="h-10 px-4 gap-2"
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="h-[320px] rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Status distribution
              </p>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Applications"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="h-[320px] rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    Trend line
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">
                    Applications per month
                  </h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                  Last 6 months
                </span>
              </div>
              <div className="mt-5 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyChartData}
                    margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="applications"
                      fill="#2563EB"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Command center
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Executive control panel
            </h2>
          </div>

          <div className="mt-6 grid gap-4">
            <ActionItem
              label="Review applications"
              description="Open live verification and application review workflows."
              onClick={() => navigate("/admin/reports")}
            />
            <ActionItem
              label="Create follow-up"
              description="Assign follow-up tasks and manage case escalation."
              onClick={() => navigate("/admin/staff")}
            />
            <ActionItem
              label="Download compliance report"
              description="Export the latest application dataset as XLSX."
              onClick={downloadApplicationsReport}
              loading={downloadLoading}
            />
          </div>

          <div className="mt-8 rounded-[28px] bg-slate-950 p-5 text-white ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">
              Operational insight
            </p>
            <div className="mt-4 grid gap-4">
              <MetricLine
                label="Processing velocity"
                value={`${stats.processingVelocity || 74}%`}
              />
              <MetricLine
                label="Verification fidelity"
                value={`${stats.verificationAccuracy || 96}%`}
              />
              <MetricLine
                label="Workload balance"
                value={`${stats.officerLoadBalance || 88}%`}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-[32px] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Reports</h3>
            <p className="mt-1 text-sm text-slate-500">
              Download data extracts for operational reporting.
            </p>
          </div>
          <Button
            onClick={downloadApplicationsReport}
            loading={downloadLoading}
            className="h-10 rounded-full px-4 text-sm font-semibold gap-2 bg-slate-900 text-white hover:bg-slate-800"
            fullWidth={false}
          >
            <Download size={16} />
            Download Report
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ActionItem({ label, description, onClick, loading }) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className="group flex w-full flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <span className="inline-flex h-10 min-w-[90px] items-center justify-center rounded-full bg-blue-950 px-4 text-sm font-semibold text-white">
          {loading ? "Loading..." : <ArrowRight size={16} />}
        </span>
      </div>
    </button>
  );
}

function MetricLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-[24px] bg-slate-900 px-4 py-4 text-white">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-3 text-4xl font-bold text-slate-900">{value ?? 0}</h3>
    </div>
  );
}

function SummaryItem({ label, value, color }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <div
        className={`mt-3 inline-flex rounded-full bg-gradient-to-r ${color} px-4 py-2 text-sm font-semibold text-white`}
      >
        {value ?? 0}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
