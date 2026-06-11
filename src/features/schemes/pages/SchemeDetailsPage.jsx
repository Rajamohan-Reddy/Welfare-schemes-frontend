import { useState } from "react";
import {
  Calendar,
  Building2,
  Wallet,
  FileText,
  Users,
  ArrowRight,
  Loader2,
  BadgeCheck,
  CheckCircle,
  HelpCircle,
  Building,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetSchemeByIdQuery } from "../../../store/services/schemes.api";
import Card from "../../../components/ui/Card";

const categoryCovers = {
  EDUCATION: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
  AGRICULTURE: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
  HEALTH: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop",
  HOUSING: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
  PENSION: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
  WOMEN_WELFARE: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop",
  EMPLOYMENT: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
  DEFAULT: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
};

function SchemeDetailsPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { data: scheme, isLoading: loading } = useGetSchemeByIdQuery(schemeId);
  const [activeTab, setActiveTab] = useState("overview"); // overview, eligibility, documents

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={42} />
          <p className="text-xs font-semibold text-slate-400">Loading Program Details...</p>
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="rounded-[36px] bg-white p-16 text-center border border-slate-200 shadow-sm space-y-4">
        <HelpCircle size={40} className="mx-auto text-slate-300" />
        <h3 className="text-lg font-bold text-[#071A52]">Program File Missing</h3>
        <p className="text-xs text-slate-400">We couldn't retrieve the requested welfare scheme. Please verify the ID or link.</p>
      </div>
    );
  }

  const categoryKey = scheme.categoryId?.categoryCode?.toUpperCase() || "DEFAULT";
  const coverImage = categoryCovers[categoryKey] || categoryCovers.DEFAULT;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
      >
        <ChevronLeft size={18} />
        Back
      </button>

      {/* High-Fidelity Banner Card */}
      <section className="relative overflow-hidden rounded-[36px] bg-slate-900 text-white shadow-2xl h-80 flex items-end">
        <img
          src={coverImage}
          alt={scheme.schemeName}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A52] via-slate-950/20 to-transparent" />
        
        <div className="relative z-10 p-8 sm:p-10 space-y-4 w-full flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="space-y-3 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border border-white/20 bg-white/10 tracking-wider backdrop-blur-md">
              <BadgeCheck size={12} className="text-[#FFD95A]" />
              Government Welfare Program
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight truncate">
              {scheme.schemeName}
            </h1>
          </div>

          <button
            onClick={() => navigate(`/citizen/apply/${scheme._id}`)}
            className="rounded-full bg-[#FFD95A] hover:bg-[#FFE07D] text-[#071A52] px-8 py-3.5 font-extrabold text-sm shadow-xl transition-all hover:scale-[1.02] shrink-0 inline-flex items-center gap-2 self-start md:self-end"
          >
            Launch Application Form <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Program Summary Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <HighlightCard icon={Wallet} title="Benefit Amount" value={`₹ ${Number(scheme.benefitAmount || 0).toLocaleString()}`} />
        <HighlightCard icon={Building2} title="Hosting Department" value={scheme.department} />
        <HighlightCard icon={Users} title="Program Group" value={scheme.benefitType} />
        <HighlightCard icon={Calendar} title="Channel Status" value={scheme.isActive ? "ONLINE ACTIVE" : "OFFLINE"} />
      </div>

      {/* Structured Tab Divisions */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Hand Details Tab Container */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/2 space-y-6">
            {/* Tabs Control */}
            <div className="flex bg-slate-50 border border-slate-100 rounded-full p-1.5 font-semibold text-xs text-slate-500">
              {["overview", "eligibility", "documents"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 uppercase tracking-wide transition-all w-1/3 text-center ${
                    activeTab === tab ? "bg-[#071A52] text-white shadow-sm font-bold" : "hover:text-[#071A52]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-black text-[#071A52]">Program Overview</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{scheme.description}</p>
                </motion.div>
              )}

              {activeTab === "eligibility" && (
                <motion.div
                  key="eligibility"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-black text-[#071A52]">Criteria Guidelines</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <CriteriaCard label="Minimum Age Limit" val={scheme.eligibility?.minAge ? `${scheme.eligibility.minAge} Years` : "No limit"} />
                    <CriteriaCard label="Maximum Age Limit" val={scheme.eligibility?.maxAge ? `${scheme.eligibility.maxAge} Years` : "No limit"} />
                    <CriteriaCard label="Annual Income Limit" val={scheme.eligibility?.maxAnnualIncome ? `₹ ${Number(scheme.eligibility.maxAnnualIncome).toLocaleString()}` : "No limit"} />
                    <CriteriaCard label="Target Gender Group" val={scheme.eligibility?.gender?.join(", ") || "All Genders"} />
                  </div>
                </motion.div>
              )}

              {activeTab === "documents" && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-black text-[#071A52]">Required Checklist Files</h3>
                  
                  <div className="grid gap-3">
                    {scheme.requiredDocuments?.map((doc, index) => (
                      <div key={index} className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-700">
                        <span className="h-5 w-5 bg-indigo-50 border border-indigo-100/50 rounded-lg flex items-center justify-center text-indigo-600 text-[10px] font-black shrink-0">
                          {index + 1}
                        </span>
                        <span className="truncate">{doc}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Hand Sidebar Program Parameters */}
        <div className="space-y-6">
          <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 space-y-5">
            <h3 className="text-lg font-black text-[#071A52]">Application Timeline</h3>
            
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4.5 space-y-3.5 text-xs font-bold text-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Launch Date</span>
                <span className="text-[#071A52]">{new Date(scheme.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200/60 pt-3">
                <span className="text-slate-400">Deadline Date</span>
                <span className="text-[#071A52]">{new Date(scheme.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-4 text-[11px] font-semibold text-blue-800 flex gap-2">
              <Sparkles size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <span>Verify that all details and documentation criteria are complete before launching the registration desk.</span>
            </div>

            <button
              onClick={() => navigate(`/citizen/apply/${scheme._id}`)}
              className="w-full rounded-full bg-[#071A52] hover:bg-blue-900 text-white font-extrabold text-xs py-4 shadow-lg transition"
            >
              Access Application Desk
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HighlightCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition">
      <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#071A52] shrink-0 shadow-sm">
        <Icon size={18} />
      </div>
      
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
        <p className="text-xs font-extrabold text-slate-800 mt-1 truncate">{value}</p>
      </div>
    </div>
  );
}

function CriteriaCard({ label, val }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between min-h-[80px]">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-sm font-black text-slate-800 mt-2">{val}</span>
    </div>
  );
}

export default SchemeDetailsPage;
