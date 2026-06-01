import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  getOfficerDashboardApi,
  getApplicationStatusChartApi,
} from "../../dashboard/api/dashboard.api";
import { getApplicationByIdApi } from "../../schemes/api/applications.api";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

function OfficerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [statusData, setStatusData] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [application, setApplication] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [resp, statusResp] = await Promise.all([
        getOfficerDashboardApi(),
        getApplicationStatusChartApi(),
      ]);

      setStats(resp.data.data || {});
      setStatusData(statusResp.data.data || []);
      setLastSync(new Date());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load officer dashboard");
    } finally {
      setLoading(false);
    }
  };

  const lookup = async () => {
    if (!searchId) {
      toast.error("Please enter an application ID to lookup.");
      return;
    }

    try {
      const resp = await getApplicationByIdApi(searchId);
      setApplication(resp.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Application not found or access denied");
    }
  };

  const totalActive =
    (stats.pendingVerification || 0) +
    (stats.documentVerified || 0) +
    (stats.fieldVerified || 0);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-[0.35em] text-sky-300">
          Officer Workbench
        </p>
        <h1 className="mt-4 text-4xl font-extrabold">
          Verification Control Center
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Fast-track document review, field verification and application
          approval with premium workflow controls.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-900/5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
              Total active cases
            </p>
            <p className="mt-2 text-3xl font-semibold">{totalActive}</p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-900/5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
              Last sync
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {lastSync
                ? lastSync.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-900/5">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
              Pending approvals
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {stats.pendingVerification ?? 0}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          title="Pending Verification"
          value={stats.pendingVerification}
          variant="sky"
          subtitle="Action required"
        />
        <StatCard
          title="Document Verified"
          value={stats.documentVerified}
          variant="emerald"
          subtitle="Ready for field review"
        />
        <StatCard
          title="Field Verified"
          value={stats.fieldVerified}
          variant="indigo"
          subtitle="Ready for approval"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Verification flow
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Queue analytics
              </h2>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Updated every 30 seconds
              </p>
              <p className="text-sm text-slate-600">
                {totalActive} cases in active workflows
              </p>
            </div>
          </div>

          <div className="mt-6 min-h-[340px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{ top: 10, right: 6, left: -6, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748B"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#64748B" />
                  <Tooltip cursor={{ fill: "rgba(14,165,233,0.08)" }} />
                  <Bar
                    dataKey="value"
                    fill="#0EA5E9"
                    radius={[10, 10, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[28px] border border-slate-200 bg-slate-50 text-slate-500">
                No queue analytics available yet.
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              Queue visualization for submitted and verified application states.
            </div>
            <Button
              onClick={() => navigate("/officer/queue")}
              fullWidth={false}
            >
              Open review queue
            </Button>
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Quick lookup
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Pull an application record instantly for targeted verification.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter application ID"
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-sky-500"
            />
            <Button onClick={lookup} className="w-full">
              Lookup
            </Button>
          </div>

          {application && (
            <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">Found application</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {application.status?.replaceAll("_", " ")}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {application.applicationNumber}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {application.schemeId?.schemeName}
              </p>
              <pre className="mt-4 max-h-40 overflow-auto rounded-3xl bg-white p-4 text-xs text-slate-700">
                {JSON.stringify(application, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, variant, subtitle }) {
  const colors = {
    sky: "from-sky-500 to-sky-700 text-white",
    emerald: "from-emerald-500 to-emerald-600 text-white",
    indigo: "from-indigo-500 to-indigo-700 text-white",
  };

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm">
      <div
        className={`inline-flex rounded-full bg-gradient-to-r ${colors[variant] || colors.sky} px-4 py-2 text-sm font-semibold`}
      >
        {title}
      </div>
      <p className="mt-5 text-sm text-slate-500">{subtitle}</p>
      <h3 className="mt-3 text-4xl font-bold text-slate-900">{value ?? 0}</h3>
    </div>
  );
}

export default OfficerDashboardPage;
