import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldCheck,
  Search,
  RefreshCw,
  Clock,
  FileCheck2,
  MapPin,
  ChevronRight,
  TrendingUp,
  User,
  Calendar,
  Layers,
} from "lucide-react";
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
  const [syncing, setSyncing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setSyncing(true);

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
      setSyncing(false);
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
      toast.success("Application pulled successfully");
    } catch (err) {
      console.error(err);
      toast.error("Application not found or access denied");
    }
  };

  const totalActive =
    (stats.pendingVerification || 0) +
    (stats.documentVerified || 0) +
    (stats.fieldVerified || 0);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
          <p className="text-sm font-semibold text-slate-500">Initializing Officer Workbench...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Officer Workbench Banner */}
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0D9488] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#FFD95A]">
              <ShieldCheck size={14} /> SECURITY CLEARANCE WORKBENCH
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
              Verification Command
            </h1>
            <p className="mt-3 text-sm text-slate-200 leading-relaxed max-w-xl">
              Conduct detailed verification protocols. Review citizen documentation, execute field audit reports, and authorize direct benefit payouts securely.
            </p>
          </div>

          {/* Banner Stats Indicators */}
          <div className="grid gap-4 sm:grid-cols-2 lg:w-[40%]">
            <div className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-inner backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Active Workload</p>
              <p className="mt-2 text-3xl font-black text-emerald-400">{totalActive} files</p>
            </div>
            <div className="rounded-3xl bg-white/5 border border-white/10 p-5 shadow-inner backdrop-blur-sm flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Last Sync</p>
                <p className="mt-2 text-xl font-bold">
                  {lastSync
                    ? lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "—"}
                </p>
              </div>
              <button
                onClick={() => load(true)}
                disabled={syncing}
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all text-white shrink-0"
              >
                <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Verification Queue KPIs */}
      <div className="grid gap-6 lg:grid-cols-3">
        <QueueCard
          title="Pending Verification"
          value={stats.pendingVerification}
          icon={Clock}
          color="sky"
          subtitle="Verification steps pending"
        />
        <QueueCard
          title="Document Verified"
          value={stats.documentVerified}
          icon={FileCheck2}
          color="emerald"
          subtitle="Ready for field evaluation"
        />
        <QueueCard
          title="Field Verified"
          value={stats.fieldVerified}
          icon={MapPin}
          color="teal"
          subtitle="Approved for final sign-off"
        />
      </div>

      {/* Analytics Chart & Quick Lookup Grid */}
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Verification Queue Chart */}
        <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-teal-600">Fidelity Monitors</span>
              <h2 className="mt-1 text-2xl font-black text-[#071A52] tracking-tight">Queue Case Loading</h2>
            </div>
            <Button
              onClick={() => navigate("/officer/queue")}
              fullWidth={false}
              className="h-10 px-6 rounded-full text-xs font-extrabold bg-[#0F172A] text-white hover:bg-slate-800"
            >
              Open Active Stack
            </Button>
          </div>

          <div className="h-80">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="officerBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0D9488" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2DD4BF" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10, fontWeight: "bold" }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fontWeight: "bold" }} />
                  <Tooltip
                    contentStyle={{
                      background: "#0F172A",
                      borderRadius: "16px",
                      color: "#fff",
                      border: "none",
                    }}
                    cursor={{ fill: "rgba(13,148,136,0.06)" }}
                  />
                  <Bar dataKey="value" fill="url(#officerBarGradient)" radius={[8, 8, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[28px] border border-slate-100 bg-slate-50/50 text-slate-500">
                No active caseload charts plotted.
              </div>
            )}
          </div>
        </Card>

        {/* Secure Application Lookup Widget */}
        <div className="space-y-6">
          <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F59E0B]">Audit Finder</span>
              <h2 className="mt-1 text-xl font-extrabold text-[#071A52] tracking-tight">Fidelity Lookup</h2>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Application File ID"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-11 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white"
              />
            </div>
            <Button onClick={lookup} className="mt-3.5 w-full rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3">
              Query System Registry
            </Button>

            {/* Structured pulled application renderer */}
            <AnimatePresence>
              {application && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 border-t border-slate-100 pt-5 space-y-4"
                >
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Status</p>
                      <p className="text-sm font-bold text-[#071A52] mt-0.5">{application.status?.replaceAll("_", " ")}</p>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="grid gap-3.5 text-xs">
                    <LookupItem icon={Layers} label="Scheme Name" val={application.schemeId?.schemeName || "n/a"} />
                    <LookupItem icon={User} label="Applicant ID" val={application.userId || "n/a"} />
                    <LookupItem icon={Calendar} label="Submitted Date" val={application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "n/a"} />
                  </div>

                  <button
                    onClick={() => navigate(`/officer/review/${application._id}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold p-4.5 mt-3 shadow-md"
                  >
                    <span>Launch Verification Desk</span>
                    <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QueueCard({ title, value, icon: Icon, color, subtitle }) {
  const colors = {
    sky: "bg-sky-50 text-sky-700 border-sky-100/70",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100/70",
    teal: "bg-teal-50 text-teal-700 border-teal-100/70",
  };

  return (
    <div className={`rounded-[32px] border bg-white p-6 shadow-xl shadow-slate-900/2 hover:shadow-2xl transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{title}</span>
          <h3 className="mt-3.5 text-4xl font-black text-[#071A52] tracking-tight">{value ?? 0}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-500">{subtitle}</p>
        </div>

        <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center ${colors[color] || colors.sky}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function LookupItem({ icon: Icon, label, val }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
      <Icon size={16} className="text-slate-500 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{val}</p>
      </div>
    </div>
  );
}

export default OfficerDashboardPage;
