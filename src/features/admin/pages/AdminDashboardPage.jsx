import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Download,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  Layers,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  DollarSign,
  Loader2,
  RefreshCcw,
  Plus,
} from "lucide-react";
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
} from "recharts";
import {
  useGetAdminDashboardQuery,
  useGetApplicationStatusChartQuery,
  useGetMonthlyApplicationsChartQuery,
  useGetDashboardAnalyticsQuery,
} from "../../../store/services/dashboard.api";
import { useGetRecentAuditLogsQuery } from "../../../store/services/reports.api";
import {
  useApproveApplicationMutation,
  useRejectApplicationMutation,
} from "../../../store/services/verification.api";
import { useLazyGetApplicationsByStatusQuery } from "../../../store/services/admin.api";
import {
  useGetAllCategoriesQuery,
  useCreateSchemeMutation,
  useCreateSchemeCategoryMutation,
} from "../../../store/services/schemes.api";
import { useUploadFileMutation } from "../../../store/services/upload.api";
import { useReleasePaymentMutation } from "../../../store/services/payments.api";
import { API_BASE_URL } from "../../../store/services/baseApi";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

const COLORS = [
  "#2563EB", // Primary Blue
  "#10B981", // Success Emerald
  "#F59E0B", // Warning Gold
  "#EF4444", // Danger Red
  "#8B5CF6", // Purple Accent
  "#06B6D4", // Cyan
];

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // overview, approvals, intelligence, operations
  const {
    data: stats = {},
    isLoading: dashboardLoading,
    refetch: refetchDashboard,
  } = useGetAdminDashboardQuery();
  const { data: statusChartData = [], isLoading: statusLoading } =
    useGetApplicationStatusChartQuery();
  const { data: monthlyChartData = [], isLoading: monthlyLoading } =
    useGetMonthlyApplicationsChartQuery();
  const { data: analytics, isLoading: analyticsLoading } =
    useGetDashboardAnalyticsQuery(undefined, { skip: activeTab !== "intelligence" });
  const { data: recentAuditLogs = [], isLoading: auditLogsLoading } =
    useGetRecentAuditLogsQuery(undefined, { skip: activeTab !== "intelligence" });
  const [fetchApplicationsByStatus] = useLazyGetApplicationsByStatusQuery();
  const { data: schemeCategories = [], refetch: refetchCategories } =
    useGetAllCategoriesQuery();
  const [createScheme] = useCreateSchemeMutation();
  const [createSchemeCategory] = useCreateSchemeCategoryMutation();
  const [uploadFile] = useUploadFileMutation();
  const [approveApplication] = useApproveApplicationMutation();
  const [rejectApplication] = useRejectApplicationMutation();
  const [releasePayment] = useReleasePaymentMutation();
  const loading = dashboardLoading || statusLoading || monthlyLoading;
  const [downloadLoading, setDownloadLoading] = useState(false);

  // Real-life approvals queues
  const [approvalsQueue, setApprovalsQueue] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
  const [remarks, setRemarks] = useState({}); // Per-application remarks
  const [actionLoadingId, setActionLoadingId] = useState(null); // Track which app is being processed

  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [operationType, setOperationType] = useState(null);
  const [operationSubmitting, setOperationSubmitting] = useState(false);
  const [operationErrors, setOperationErrors] = useState({});
  const [schemeForm, setSchemeForm] = useState({
    schemeCode: "",
    schemeName: "",
    description: "",
    department: "",
    categoryId: "",
    benefitType: "",
    startDate: "",
    endDate: "",
    media: {
      bannerImage: "",
      thumbnailImage: "",
    },
  });
  const [schemeMediaFiles, setSchemeMediaFiles] = useState({
    bannerImage: null,
    thumbnailImage: null,
  });
  const [categoryForm, setCategoryForm] = useState({
    categoryCode: "",
    categoryName: "",
    description: "",
  });

  useEffect(() => {
    if (activeTab === "approvals") {
      loadApprovalsQueue();
    }
  }, [activeTab]);

  const load = () => {
    refetchDashboard();
    refetchCategories();
  };

  const loadApprovalsQueue = async () => {
    try {
      setApprovalsLoading(true);
      const response = await fetchApplicationsByStatus({
        status: "FIELD_VERIFIED",
        page: 1,
        limit: 100,
      }).unwrap();

      const queueData = Array.isArray(response?.applications)
        ? response.applications
        : Array.isArray(response?.data?.applications)
          ? response.data.applications
          : [];

      const sortedQueue = [...queueData].sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
      );

      setApprovalsQueue(sortedQueue);
    } catch (err) {
      console.error("❌ Error loading approvals:", err);
      toast.error("Failed to query approvals registry");
    } finally {
      setApprovalsLoading(false);
    }
  };

  const loadCategories = () => {
    refetchCategories();
  };

  const resetOperationForms = () => {
    setSchemeForm({
      schemeCode: "",
      schemeName: "",
      description: "",
      department: "",
      categoryId: "",
      benefitType: "",
      startDate: "",
      endDate: "",
      media: {
        bannerImage: "",
        thumbnailImage: "",
      },
    });
    setSchemeMediaFiles({ bannerImage: null, thumbnailImage: null });
    setCategoryForm({ categoryCode: "", categoryName: "", description: "" });
    setOperationErrors({});
    setOperationSubmitting(false);
    setOperationType(null);
  };

  const openOperationModal = (type) => {
    resetOperationForms();
    setOperationType(type);
    setOperationModalOpen(true);
  };

  const closeOperationModal = () => {
    setOperationModalOpen(false);
    resetOperationForms();
  };

  const validateSchemeForm = () => {
    const nextErrors = {};
    if (!schemeForm.schemeCode.trim()) nextErrors.schemeCode = "Scheme code is required.";
    if (!schemeForm.schemeName.trim()) nextErrors.schemeName = "Scheme name is required.";
    if (!schemeForm.description.trim()) nextErrors.description = "Description is required.";
    if (!schemeForm.department.trim()) nextErrors.department = "Department is required.";
    if (!schemeForm.categoryId) nextErrors.categoryId = "Category is required.";
    if (!schemeForm.benefitType) nextErrors.benefitType = "Benefit type is required.";
    if (!schemeForm.startDate) nextErrors.startDate = "Start date is required.";
    if (!schemeForm.endDate) nextErrors.endDate = "End date is required.";

    setOperationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateCategoryForm = () => {
    const nextErrors = {};
    if (!categoryForm.categoryCode.trim()) nextErrors.categoryCode = "Category code is required.";
    if (!categoryForm.categoryName.trim()) nextErrors.categoryName = "Category name is required.";

    setOperationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const uploadMediaFile = async (file) => {
    if (!file) return null;

    const uploaded = await uploadFile({ file, documentType: "scheme-media" }).unwrap();
    return uploaded?.fileUrl || null;
  };

  const benefitTypeOptions = [
    { value: "DIRECT_BENEFIT_TRANSFER", label: "Direct Benefit Transfer" },
    { value: "PENSION", label: "Pension" },
    { value: "SCHOLARSHIP", label: "Scholarship" },
    { value: "SUBSIDY", label: "Subsidy" },
    { value: "REIMBURSEMENT", label: "Reimbursement" },
    { value: "HEALTH_ASSISTANCE", label: "Health Assistance" },
    { value: "HOUSING_ASSISTANCE", label: "Housing Assistance" },
    { value: "LOAN_ASSISTANCE", label: "Loan Assistance" },
    { value: "INSURANCE", label: "Insurance" },
    { value: "TRAINING_SUPPORT", label: "Training Support" },
    { value: "EMPLOYMENT_SUPPORT", label: "Employment Support" },
    { value: "EQUIPMENT_ASSISTANCE", label: "Equipment Assistance" },
  ];

  const handleOperationSubmit = async (event) => {
    event.preventDefault();

    if (operationType === "scheme") {
      if (!validateSchemeForm()) {
        toast.error("Please fix the highlighted scheme fields.");
        return;
      }
    }

    if (operationType === "category") {
      if (!validateCategoryForm()) {
        toast.error("Please fix the highlighted category fields.");
        return;
      }
    }

    try {
      setOperationSubmitting(true);

      if (operationType === "scheme") {
        const payload = {
          ...schemeForm,
          categoryId: schemeForm.categoryId,
        };

        if (schemeMediaFiles.bannerImage) {
          const bannerUrl = await uploadMediaFile(schemeMediaFiles.bannerImage);
          if (bannerUrl) payload.media = { ...payload.media, bannerImage: bannerUrl };
        }

        if (schemeMediaFiles.thumbnailImage) {
          const thumbnailUrl = await uploadMediaFile(schemeMediaFiles.thumbnailImage);
          if (thumbnailUrl) payload.media = { ...payload.media, thumbnailImage: thumbnailUrl };
        }

        if (payload.media?.bannerImage === "" && payload.media?.thumbnailImage === "") {
          delete payload.media;
        }

        await createScheme(payload).unwrap();
        toast.success("Scheme created successfully.");
        load();
      }

      if (operationType === "category") {
        await createSchemeCategory({
          categoryCode: categoryForm.categoryCode,
          categoryName: categoryForm.categoryName,
          description: categoryForm.description,
        }).unwrap();
        toast.success("Scheme category created successfully.");
        loadCategories();
      }

      closeOperationModal();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Unable to complete the request.");
    } finally {
      setOperationSubmitting(false);
    }
  };

  const handleApprove = async (appId) => {
    const appRemarks = remarks[appId] || "";
    if (!appRemarks.trim()) {
      toast.error("Decisions require tracking remarks.");
      return;
    }
    try {
      setActionLoadingId(appId);
      // Step 1: Approve the application
      await approveApplication({ applicationId: appId, remarks: appRemarks }).unwrap();
      toast.success("Application approved!");

      try {
        await releasePayment(appId).unwrap();
        toast.success("Direct Benefit Transfer (DBT) released! 🎉");
      } catch (paymentErr) {
        console.error("Payment error:", paymentErr);
        toast.error("Application approved but payment disbursement had an issue. Check manually.");
      }

      setRemarks({ ...remarks, [appId]: "" });
      loadApprovalsQueue();
      load();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Approval failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (appId) => {
    const appRemarks = remarks[appId] || "";
    if (!appRemarks.trim()) {
      toast.error("Decisions require tracking remarks.");
      return;
    }
    try {
      setActionLoadingId(appId);
      await rejectApplication({ applicationId: appId, remarks: appRemarks }).unwrap();
      toast.success("Application rejected. Citizen will be notified.");
      setRemarks({ ...remarks, [appId]: "" });
      loadApprovalsQueue();
      load();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Rejection failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const downloadApplicationsReport = async () => {
    try {
      setDownloadLoading(true);
      const response = await fetch(`${API_BASE_URL}/reports/applications`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
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

  const approvalRate = useMemo(() => {
    if (!stats.totalApplications) return 0;
    return Math.round(
      ((stats.approvedApplications || 0) / stats.totalApplications) * 100,
    );
  }, [stats]);

  const averageProcessing = useMemo(() => {
    return stats.averageProcessingDays ?? 3.4;
  }, [stats]);

  const intelligenceSummary = useMemo(() => {
    const summary = analytics?.summary || {};
    const totalApps = summary.totalApplications || stats.totalApplications || 0;
    const approvedApps =
      summary.approvedApplications || stats.approvedApplications || 0;
    const totalPayments = summary.totalPayments || 0;

    return {
      totalUsers: summary.totalUsers || stats.totalUsers || 0,
      totalSchemes: summary.totalSchemes || stats.totalSchemes || 0,
      totalApps,
      approvedApps,
      totalPayments,
      approvalRate:
        totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 0,
    };
  }, [analytics, stats]);

  const auditLogEntries = useMemo(() => {
    if (Array.isArray(recentAuditLogs)) return recentAuditLogs;
    return recentAuditLogs?.logs || [];
  }, [recentAuditLogs]);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-semibold text-slate-500">Loading Enterprise Command...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      {/* Compact premium command header */}
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#071A52] to-[#1340A0] px-7 py-5 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05)_0,transparent_70%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: greeting + tabs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-widest text-[#FFD95A]">
                <ShieldCheck size={11} /> SUPREME COMMAND
              </div>
              <span className="text-[10px] font-semibold text-blue-300/60">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl font-black tracking-tight">{getGreeting()}, Director</h1>
              <span className="text-base">👋</span>
            </div>

            {/* Tab bar — inline */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: "overview", label: "Overview" },
                { key: "approvals", label: "Approvals" },
                { key: "intelligence", label: "Intelligence" },
                { key: "operations", label: "Operations" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition ${
                    activeTab === key
                      ? "bg-[#FFD95A] text-[#071A52]"
                      : "bg-white/10 text-white/80 hover:bg-white/15"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: compact KPI chips */}
          <div className="flex flex-wrap gap-3 shrink-0">
            {[
              { label: "Velocity", val: `${stats.processingVelocity || 74}%`, color: "text-emerald-400" },
              { label: "Fidelity", val: `${stats.verificationAccuracy || 96}%`, color: "text-[#FFD95A]" },
              { label: "Avg Cycle", val: `${averageProcessing}d`, color: "text-indigo-300" },
              { label: "Approval Rate", val: `${approvalRate}%`, color: "text-sky-300" },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex flex-col items-center justify-center rounded-2xl bg-white/8 border border-white/10 px-5 py-3 min-w-[80px] backdrop-blur-sm">
                <span className={`text-xl font-black ${color}`}>{val}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Redesigned Metric Cards with Very Light Gradients */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <GradientMetricCard
                title="Active Citizens"
                value={stats.totalUsers}
                description="Registered user profiles"
                icon={Users}
                gradient="from-blue-50/80 via-blue-100/50 to-blue-200/20 text-[#1E3A8A] border-blue-200/40"
              />
              <GradientMetricCard
                title="Welfare Programs"
                value={stats.totalSchemes}
                description="Live active schemes"
                icon={Layers}
                gradient="from-indigo-50/80 via-indigo-100/50 to-indigo-200/20 text-indigo-900 border-indigo-200/40"
              />
              <GradientMetricCard
                title="Submissions"
                value={stats.totalApplications}
                description="Total files submitted"
                icon={FileText}
                gradient="from-emerald-50/80 via-emerald-100/50 to-emerald-200/20 text-emerald-950 border-emerald-200/40"
              />
              <GradientMetricCard
                title="Pending Verification"
                value={stats.pendingApplications}
                description="Awaiting action"
                icon={Clock}
                gradient="from-amber-50/80 via-amber-100/50 to-amber-200/20 text-amber-950 border-amber-200/40"
              />
            </div>

            {/* Custom charts overview */}
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/2">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Volume analytics</span>
                    <h2 className="text-2xl font-black text-[#071A52] tracking-tight mt-0.5">Disbursal Trends</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/admin/reports")}
                      fullWidth={false}
                      className="h-10 px-5 rounded-full text-xs font-bold"
                    >
                      Audit reports
                    </Button>
                    <Button
                      onClick={downloadApplicationsReport}
                      loading={downloadLoading}
                      fullWidth={false}
                      className="h-10 px-5 rounded-full text-xs font-bold gap-2 bg-[#071A52] text-white hover:bg-blue-900"
                    >
                      <Download size={14} /> Export Sheet
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Status distribution */}
                  <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5">
                    <h4 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider mb-4">Pipeline Status</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <defs>
                            {statusChartData.map((entry, index) => (
                              <linearGradient key={`grad-${index}`} id={`pieGrad-${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.8} />
                                <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie
                            data={statusChartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                          >
                            {statusChartData.map((entry, index) => (
                              <Cell key={entry.name} fill={`url(#pieGrad-${index})`} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "#071A52",
                              borderRadius: "16px",
                              color: "#fff",
                              border: "none",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly cycles */}
                  <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5">
                    <h4 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider mb-4">Caseload Trends</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                              <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.7} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 9, fontWeight: "bold" }} />
                          <YAxis stroke="#94A3B8" tick={{ fontSize: 9, fontWeight: "bold" }} />
                          <Tooltip
                            contentStyle={{
                              background: "#071A52",
                              borderRadius: "16px",
                              color: "#fff",
                              border: "none",
                            }}
                          />
                          <Bar dataKey="applications" fill="url(#adminBarGrad)" radius={[6, 6, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Side logs */}
              <div className="space-y-6">
                <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFD95A]">Live Activity</span>
                    <h3 className="text-xl font-extrabold text-[#071A52] tracking-tight mt-0.5">Command Signals</h3>
                  </div>

                  <div className="space-y-4">
                    <SignalLogText text="Officer Ramesh verified files for Application #AP-4122" time="2 mins ago" />
                    <SignalLogText text="Direct Benefit Transfer payout log sync completed successfully" time="15 mins ago" />
                    <SignalLogText text="Roster audit invite cleared for new Verification Admin" time="2 hours ago" />
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "intelligence" && (
          <motion.div
            key="intelligence"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-violet-600">
                    Enterprise Intelligence
                  </span>
                  <h2 className="text-2xl font-black text-[#071A52] tracking-tight mt-0.5">
                    Audit Signals & Performance Analytics
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/admin/analytics")}
                    fullWidth={false}
                    className="h-10 px-5 rounded-full text-xs font-bold"
                  >
                    Full Analytics
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/admin/reports")}
                    fullWidth={false}
                    className="h-10 px-5 rounded-full text-xs font-bold"
                  >
                    Audit Reports
                  </Button>
                  <Button
                    onClick={downloadApplicationsReport}
                    loading={downloadLoading}
                    fullWidth={false}
                    className="h-10 px-5 rounded-full text-xs font-bold gap-2 bg-[#071A52] text-white hover:bg-blue-900"
                  >
                    <Download size={14} /> Export Sheet
                  </Button>
                </div>
              </div>

              {analyticsLoading ? (
                <div className="flex justify-center items-center py-16 text-xs font-semibold text-slate-500">
                  <Loader2 size={16} className="animate-spin text-blue-600 mr-2" />
                  Loading intelligence metrics...
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <GradientMetricCard
                    title="Registered Citizens"
                    value={intelligenceSummary.totalUsers}
                    description="Active user profiles"
                    icon={Users}
                    gradient="from-blue-50/80 via-blue-100/50 to-blue-200/20 text-[#1E3A8A] border-blue-200/40"
                  />
                  <GradientMetricCard
                    title="Live Schemes"
                    value={intelligenceSummary.totalSchemes}
                    description="Programs in circulation"
                    icon={Layers}
                    gradient="from-indigo-50/80 via-indigo-100/50 to-indigo-200/20 text-indigo-900 border-indigo-200/40"
                  />
                  <GradientMetricCard
                    title="Approval Rate"
                    value={`${intelligenceSummary.approvalRate}%`}
                    description={`${intelligenceSummary.approvedApps} of ${intelligenceSummary.totalApps} approved`}
                    icon={TrendingUp}
                    gradient="from-emerald-50/80 via-emerald-100/50 to-emerald-200/20 text-emerald-950 border-emerald-200/40"
                  />
                  <GradientMetricCard
                    title="Total Disbursed"
                    value={`₹${intelligenceSummary.totalPayments.toLocaleString("en-IN")}`}
                    description="Cumulative benefit payouts"
                    icon={DollarSign}
                    gradient="from-amber-50/80 via-amber-100/50 to-amber-200/20 text-amber-950 border-amber-200/40"
                  />
                </div>
              )}
            </Card>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/2">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                    Volume analytics
                  </span>
                  <h3 className="text-xl font-extrabold text-[#071A52] tracking-tight mt-0.5">
                    Caseload & Pipeline Trends
                  </h3>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5">
                    <h4 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider mb-4">
                      Pipeline Status
                    </h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusChartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                          >
                            {statusChartData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "#071A52",
                              borderRadius: "16px",
                              color: "#fff",
                              border: "none",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5">
                    <h4 className="text-xs font-extrabold text-[#071A52] uppercase tracking-wider mb-4">
                      Monthly Caseload
                    </h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyChartData}
                          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                          <XAxis
                            dataKey="month"
                            stroke="#94A3B8"
                            tick={{ fontSize: 9, fontWeight: "bold" }}
                          />
                          <YAxis
                            stroke="#94A3B8"
                            tick={{ fontSize: 9, fontWeight: "bold" }}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#071A52",
                              borderRadius: "16px",
                              color: "#fff",
                              border: "none",
                            }}
                          />
                          <Bar
                            dataKey="applications"
                            fill="#2563EB"
                            radius={[6, 6, 0, 0]}
                            barSize={20}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#FFD95A]">
                    Compliance Feed
                  </span>
                  <h3 className="text-xl font-extrabold text-[#071A52] tracking-tight mt-0.5">
                    Recent Audit Activity
                  </h3>
                </div>

                {auditLogsLoading ? (
                  <div className="flex justify-center items-center py-12 text-xs font-semibold text-slate-500">
                    <Loader2 size={16} className="animate-spin text-blue-600 mr-2" />
                    Syncing audit logs...
                  </div>
                ) : auditLogEntries.length === 0 ? (
                  <div className="rounded-[28px] bg-slate-50 border border-slate-100 p-10 text-center text-slate-500 space-y-2">
                    <Activity size={28} className="mx-auto text-slate-300" />
                    <p className="text-sm font-semibold text-[#071A52]">No audit events yet</p>
                    <p className="text-xs text-slate-400">
                      Administrator and officer actions will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {auditLogEntries.slice(0, 12).map((log) => (
                      <div
                        key={log._id}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#071A52] uppercase tracking-wide">
                            {log.module}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {log.createdAt
                              ? new Date(log.createdAt).toLocaleString("en-IN")
                              : ""}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-700">{log.action}</p>
                        <p className="text-slate-500 leading-relaxed">{log.description}</p>
                        {(log.performedBy?.firstName || log.performedBy?.lastName) && (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {log.performedBy.firstName} {log.performedBy.lastName}
                            {log.performedBy.role ? ` · ${log.performedBy.role}` : ""}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === "operations" && (
          <motion.div
            key="operations"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#4338CA]">Program Operations</span>
                  <h2 className="text-2xl font-black text-[#071A52] tracking-tight mt-0.5">Create Schemes & Categories</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => openOperationModal("scheme")}
                    className="rounded-full bg-blue-50 hover:bg-blue-100/85 text-blue-700 px-4 py-2 text-xs font-black uppercase tracking-wider border border-blue-200/50 shadow-sm transition inline-flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={14} /> Create Scheme
                  </button>
                  <button
                    onClick={() => openOperationModal("category")}
                    className="rounded-full bg-indigo-50 hover:bg-indigo-100/85 text-indigo-700 px-4 py-2 text-xs font-black uppercase tracking-wider border border-indigo-200/50 shadow-sm transition inline-flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={14} /> Create Category
                  </button>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-6 space-y-3">
                  <h3 className="text-lg font-black text-[#071A52]">Scheme Operations</h3>
                  <p className="text-sm text-slate-500">Create new welfare schemes quickly from the admin command center. Schemes are immediately available after creation.</p>
                  <div className="flex flex-col gap-2 text-xs text-slate-600">
                    <p><span className="font-semibold text-slate-800">Categories loaded:</span> {schemeCategories.length}</p>
                    <p><span className="font-semibold text-slate-800">Benefit types:</span> {benefitTypeOptions.length}</p>
                  </div>
                </div>
                <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-6 space-y-3">
                  <h3 className="text-lg font-black text-[#071A52]">Category Operations</h3>
                  <p className="text-sm text-slate-500">Create classifications for scheme types and improve scheme discovery across the platform.</p>
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">Ready to add:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Category code</li>
                      <li>Category display name</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Real-Life Approvals Queue Desk */}
        {activeTab === "approvals" && (
          <motion.div
            key="approvals"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0D9488]">Direct verification desk</span>
                  <h2 className="text-2xl font-black text-[#071A52] tracking-tight mt-0.5">Pending Approvals & Disbursals Queue</h2>
                </div>
                <button
                  onClick={loadApprovalsQueue}
                  className="rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-5.5 py-2 text-xs font-bold border shadow-sm transition inline-flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <RefreshCcw size={12} className={approvalsLoading ? "animate-spin" : ""} /> Refresh Queue
                </button>
              </div>

              {approvalsLoading ? (
                <div className="flex justify-center items-center py-20 text-xs font-semibold text-slate-500">
                  <Loader2 size={16} className="animate-spin text-blue-600 mr-2" /> Querying Approvals Registry...
                </div>
              ) : approvalsQueue.length === 0 ? (
                <div className="rounded-[28px] bg-slate-50 border border-slate-100 p-16 text-center text-slate-500 space-y-3">
                  <ShieldCheck size={36} className="mx-auto text-slate-300" />
                  <h3 className="text-base font-bold text-[#071A52]">Queue Fully Cleared</h3>
                  <p className="text-xs text-slate-400">There are no citizen application files awaiting final approval in this deck.</p>
                </div>
              ) : (
                <div className="grid gap-5">
                  {approvalsQueue.map((item) => (
                    <div
                      key={item._id}
                      className="rounded-3xl border border-slate-200 p-5 bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow transition"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-slate-400 text-[10px] font-bold">
                          <span className="inline-flex rounded-full bg-blue-50 border border-blue-100 text-blue-600 px-2 py-0.5 uppercase tracking-wide">
                            {item.status?.replaceAll("_", " ")}
                          </span>
                          <span>Submitted: {new Date(item.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-lg font-black text-[#071A52] truncate">{item.applicationNumber}</h3>
                        <p className="text-xs text-slate-600 truncate">{item.schemeId?.schemeName || "Welfare Scheme"}</p>
                        <p className="text-xs text-slate-500">
                          Applicant: {item.citizenId?.firstName} {item.citizenId?.lastName}
                        </p>
                      </div>

                      {/* Decisive trigger controls directly connected to verified statuses */}
                      <div className="flex flex-col gap-3.5 shrink-0 w-full md:w-auto">
                        {item.status === "FIELD_VERIFIED" ? (
                          <div className="space-y-3">
                            <input
                              value={remarks[item._id] || ""}
                              onChange={(e) =>
                                setRemarks({ ...remarks, [item._id]: e.target.value })
                              }
                              placeholder="Write approval remarks (required)"
                              className="w-full md:w-64 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500"
                            />
                            
                            <div className="flex gap-3 flex-col sm:flex-row">
                              <button
                                onClick={() => handleApprove(item._id)}
                                disabled={actionLoadingId === item._id}
                                className="flex-1 sm:flex-auto rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-black text-xs uppercase py-3.5 shadow-lg shadow-emerald-500/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 border border-emerald-400/20 hover:border-emerald-300/40"
                              >
                                {actionLoadingId === item._id ? (
                                  <>
                                    <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={16} />
                                    Approve & Disburse
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(item._id)}
                                disabled={actionLoadingId === item._id}
                                className="flex-1 sm:flex-auto rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-black text-xs uppercase py-3.5 shadow-lg shadow-red-500/30 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 border border-red-400/20 hover:border-red-300/40"
                              >
                                {actionLoadingId === item._id ? (
                                  <>
                                    <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={16} />
                                    Reject Application
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">✓ Processed</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {operationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl h-[calc(100vh-4rem)] overflow-hidden rounded-[30px] bg-white shadow-2xl border border-slate-200/60 animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Program Command Registry</span>
                <h2 className="mt-1 text-base font-black text-[#071A52]">
                  {operationType === "scheme" ? "Create New Scheme" : "Create Scheme Category"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeOperationModal}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <XCircle size={16} />
              </button>
            </div>

            <form onSubmit={handleOperationSubmit} className="space-y-4 p-6 overflow-y-auto h-full min-h-0">
              {operationType === "scheme" ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheme Code</label>
                      <input
                        value={schemeForm.schemeCode}
                        onChange={(e) => setSchemeForm({ ...schemeForm, schemeCode: e.target.value })}
                        placeholder="e.g. MNREGA"
                        className={`w-full rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.schemeCode ? "border-rose-500" : "border-slate-200"}`}
                      />
                      {operationErrors.schemeCode && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.schemeCode}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheme Name</label>
                      <input
                        value={schemeForm.schemeName}
                        onChange={(e) => setSchemeForm({ ...schemeForm, schemeName: e.target.value })}
                        placeholder="e.g. Rural Employment Guarantee"
                        className={`w-full rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.schemeName ? "border-rose-500" : "border-slate-200"}`}
                      />
                      {operationErrors.schemeName && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.schemeName}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</label>
                      <input
                        value={schemeForm.department}
                        onChange={(e) => setSchemeForm({ ...schemeForm, department: e.target.value })}
                        placeholder="e.g. Rural Development"
                        className={`w-full rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.department ? "border-rose-500" : "border-slate-200"}`}
                      />
                      {operationErrors.department && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.department}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                      <select
                        value={schemeForm.categoryId}
                        onChange={(e) => setSchemeForm({ ...schemeForm, categoryId: e.target.value })}
                        className={`w-full rounded-2xl border bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.categoryId ? "border-rose-500" : "border-slate-200"}`}
                      >
                        <option value="">Select category</option>
                        {schemeCategories.map((category) => (
                          <option key={category._id} value={category._id}>{category.categoryName}</option>
                        ))}
                      </select>
                      {operationErrors.categoryId && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.categoryId}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Benefit Type</label>
                      <select
                        value={schemeForm.benefitType}
                        onChange={(e) => setSchemeForm({ ...schemeForm, benefitType: e.target.value })}
                        className={`w-full rounded-2xl border bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.benefitType ? "border-rose-500" : "border-slate-200"}`}
                      >
                        <option value="">Select benefit type</option>
                        {benefitTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {operationErrors.benefitType && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.benefitType}</p>}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</label>
                        <input
                          type="date"
                          value={schemeForm.startDate}
                          onChange={(e) => setSchemeForm({ ...schemeForm, startDate: e.target.value })}
                          className={`w-full rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.startDate ? "border-rose-500" : "border-slate-200"}`}
                        />
                        {operationErrors.startDate && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.startDate}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Date</label>
                        <input
                          type="date"
                          value={schemeForm.endDate}
                          onChange={(e) => setSchemeForm({ ...schemeForm, endDate: e.target.value })}
                          className={`w-full rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.endDate ? "border-rose-500" : "border-slate-200"}`}
                        />
                        {operationErrors.endDate && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.endDate}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                    <textarea
                      value={schemeForm.description}
                      onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                      placeholder="Add a short summary for the scheme"
                      className={`w-full min-h-[120px] rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.description ? "border-rose-500" : "border-slate-200"}`}
                    />
                    {operationErrors.description && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.description}</p>}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Banner Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSchemeMediaFiles({ ...schemeMediaFiles, bannerImage: e.target.files[0] || null })}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs text-slate-800 outline-none transition"
                      />
                      {schemeMediaFiles.bannerImage && (
                        <p className="text-[10px] text-slate-500">Selected: {schemeMediaFiles.bannerImage.name}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Thumbnail Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSchemeMediaFiles({ ...schemeMediaFiles, thumbnailImage: e.target.files[0] || null })}
                        className="w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-xs text-slate-800 outline-none transition"
                      />
                      {schemeMediaFiles.thumbnailImage && (
                        <p className="text-[10px] text-slate-500">Selected: {schemeMediaFiles.thumbnailImage.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Code</label>
                      <input
                        value={categoryForm.categoryCode}
                        onChange={(e) => setCategoryForm({ ...categoryForm, categoryCode: e.target.value.toUpperCase() })}
                        placeholder="e.g. AGR"
                        className={`w-full rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.categoryCode ? "border-rose-500" : "border-slate-200"}`}
                      />
                      {operationErrors.categoryCode && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.categoryCode}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Name</label>
                      <input
                        value={categoryForm.categoryName}
                        onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                        placeholder="e.g. Agriculture & Farmers Welfare"
                        className={`w-full rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition ${operationErrors.categoryName ? "border-rose-500" : "border-slate-200"}`}
                      />
                      {operationErrors.categoryName && <p className="text-[10px] text-red-500 font-semibold">{operationErrors.categoryName}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Description</label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Optional summary for the category"
                      className="w-full min-h-[100px] rounded-2xl border px-3 py-2 text-xs font-semibold text-slate-800 outline-none transition border-slate-200"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeOperationModal}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 text-xs font-bold transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationSubmitting}
                  className="rounded-full bg-[#071A52] hover:bg-blue-900 text-white px-5 py-2 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-950/10 cursor-pointer"
                >
                  {operationSubmitting ? "Saving..." : (
                    <>
                      <Plus size={13} /> Save {operationType === "scheme" ? "Scheme" : "Category"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GradientMetricCard({ title, value, description, icon: Icon, gradient }) {
  return (
    <div className={`rounded-[32px] border p-6 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${gradient}`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#071A52]/75 block">{title}</span>
          <h3 className="mt-3.5 text-3xl font-black tracking-tight">{value ?? 0}</h3>
          <p className="mt-1.5 text-xs font-bold text-[#071A52]/65 leading-relaxed">{description}</p>
        </div>

        <div className="h-11 w-11 rounded-2xl bg-white/40 border border-white/50 flex items-center justify-center text-[#071A52] shadow-sm shrink-0">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function SignalLogText({ text, time }) {
  return (
    <div className="flex gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
      <span className="h-2 w-2 mt-1.5 rounded-full bg-blue-600 shrink-0" />
      <div>
        <p className="font-bold text-slate-800 leading-relaxed">{text}</p>
        <p className="text-[10px] text-slate-400 font-semibold mt-1">{time}</p>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
