import {
  Search,
  FileCheck,
  User,
  Bell,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock3,
  BadgeCheck,
  Landmark,
  Wallet,
  Calendar,
  Activity,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUser } from "../../../utils/storage";
import QuickActionCard from "../../../components/dashboard/QuickActionCard";
import SectionCard from "../../../components/dashboard/SectionCard";
import { ROUTES } from "../../../constants/routes";

function CitizenDashboardPage() {
  const navigate = useNavigate();
  const user = getUser();
  const now = new Date();

  const currentDate = now.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const actions = [
    {
      title: "Browse Schemes",
      description: "Discover welfare benefits",
      icon: Search,
      route: ROUTES.CITIZEN_SCHEMES,
    },
    {
      title: "Applications",
      description: "Track submitted requests",
      icon: FileCheck,
      route: ROUTES.CITIZEN_APPLICATIONS,
    },
    {
      title: "Notifications",
      description: "Latest updates",
      icon: Bell,
      route: ROUTES.CITIZEN_NOTIFICATIONS,
    },
    {
      title: "Profile",
      description: "Manage personal details",
      icon: User,
      route: ROUTES.CITIZEN_PROFILE,
    },
  ];

  const schemes = [
    {
      name: "YSR Pension Kanuka",
      color: "from-[#D4AF37] to-[#FFD95A]",
      desc: "Welfare monthly pension support program directed for senior citizens, widows, and physically challenged individuals.",
    },
    {
      name: "Jagananna Vidya Deevena",
      color: "from-[#2563EB] to-[#60A5FA]",
      desc: "Full fee reimbursement program supporting higher education pathways for underprivileged students across the state.",
    },
    {
      name: "YSR Rythu Bharosa",
      color: "from-[#059669] to-[#34D399]",
      desc: "Financial assistance initiative offering direct cash crops support to active state farmers and leaseholders.",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Dynamic Personalized Hero Panel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#071A52] via-[#133A72] to-[#1E4ED8] p-6 text-white shadow-2xl"
      >
        <div className="absolute right-0 top-0 h-full w-1/4 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0,transparent_100%)] pointer-events-none" />
        <div className="absolute top-4 right-4 text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{currentDate}</p>
          <p className="text-xs font-semibold mt-1">{currentTime}</p>
        </div>

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD95A]/25 bg-[#FFD95A]/10 px-3 py-1 text-[10px] font-bold text-[#FFE68A] uppercase tracking-[0.18em]">
              <Sparkles size={12} /> Citizen Service
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {getGreeting()}, {user?.firstName || "Citizen"}.
            </h1>

            <p className="text-sm leading-relaxed text-blue-100/90 max-w-lg">
              A lighter dashboard for your welfare journey. Start with schemes, track your application, and check officer updates in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(ROUTES.CITIZEN_SCHEMES)}
                className="rounded-full bg-[#FFD95A] hover:bg-[#FFE07D] text-[#071A52] px-5 py-2.5 font-bold text-xs shadow-lg transition duration-200"
              >
                Browse Schemes
              </button>
              <button
                onClick={() => navigate(ROUTES.CITIZEN_APPLICATIONS)}
                className="rounded-full bg-white/10 hover:bg-white/15 border border-white/20 px-5 py-2.5 font-bold text-xs transition duration-200"
              >
                Track Application
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/20 bg-white/10 p-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-100 text-left shadow-inner">
            <p className="text-[9px] text-blue-200 mb-2">Premium match</p>
            <p className="text-sm font-black text-white">Speed lane recommended</p>
            <p className="mt-2 text-[11px] text-blue-100/80">Your profile is on a priority track for benefit processing when you keep documents current.</p>
          </div>
        </div>
      </motion.div>

      {/* Citizen Services Desk */}
      <section className="space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Quick Access</span>
          <h2 className="text-2xl font-black text-[#071A52] tracking-tight">Citizen Core Desk</h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((item) => (
            <QuickActionCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
              onClick={() => navigate(item.route)}
            />
          ))}
        </div>
      </section>

      {/* Dynamic Eligibility Match */}
      <SectionCard title="Direct Eligibility Matches">
        <div className="grid gap-6 md:grid-cols-3">
          <InsightCard
            title="YSR Pension Kanuka"
            icon={BadgeCheck}
            status="Matched & Eligible"
            color="green"
          />
          <InsightCard
            title="Jagananna Vidya Deevena"
            icon={Landmark}
            status="High Match Probability"
            color="blue"
          />
          <InsightCard
            title="Rythu Bharosa"
            icon={Wallet}
            status="Eligibility Check Required"
            color="gold"
          />
        </div>
      </SectionCard>

      {/* Recommended Schemes Overhaul */}
      <SectionCard title="Recommended Programs">
        <div className="grid gap-8 lg:grid-cols-3">
          {schemes.map((scheme, index) => (
            <div
              key={scheme.name}
              className="rounded-[32px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/2 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className={`mb-4 h-1.5 rounded-full bg-gradient-to-r ${scheme.color}`} />
                <h3 className="text-xl font-bold text-[#071A52]">{scheme.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{scheme.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => navigate(ROUTES.CITIZEN_SCHEMES)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#071A52] hover:text-blue-700 transition"
                >
                  Verify Details <ArrowRight size={14} />
                </button>
                <span className="text-[10px] font-bold text-slate-400">Direct DBT</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Application Timeline Journey */}
      <SectionCard title="Case Decision Journey">
        <div className="rounded-[28px] border border-slate-100 bg-slate-50/50 p-6 space-y-6">
          <TimelineItem
            icon={CheckCircle2}
            title="File Submitted & Logged"
            description="YSR Pension Kanuka - Identity verified via Aadhaar vault"
            color="green"
            date="Logged: Yesterday"
          />
          <TimelineItem
            icon={Clock3}
            title="Caseload Under Officer Evaluation"
            description="Document review checkpoint in progress at Mandal desk"
            color="amber"
            date="Status: Processing"
            active
          />
        </div>
      </SectionCard>
    </div>
  );
}

function InsightCard({ title, icon: Icon, status, color }) {
  const styles = {
    green: "bg-emerald-50 border-emerald-100/60 text-emerald-700",
    blue: "bg-blue-50 border-blue-100/60 text-blue-700",
    gold: "bg-yellow-50/50 border-yellow-100/60 text-yellow-700",
  };

  const statusColors = {
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    gold: "bg-amber-500",
  };

  return (
    <div className={`group rounded-[28px] border p-6 shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between min-h-[140px]`}>
      <div className="flex justify-between items-start">
        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${styles[color]}`}>
          <Icon size={20} />
        </div>
        <span className={`h-2 w-2 rounded-full ${statusColors[color]}`} />
      </div>

      <div className="mt-4">
        <h3 className="font-extrabold text-[#071A52] text-base">{title}</h3>
        <p className="mt-1 text-xs text-slate-400 font-semibold">{status}</p>
      </div>
    </div>
  );
}

function TimelineItem({ icon: Icon, title, description, color, date, active }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-100/60",
    amber: "bg-amber-50 text-amber-700 border-amber-100/60 animate-pulse",
  };

  return (
    <div className="flex items-start gap-4">
      <div className={`rounded-2xl p-3 border shrink-0 ${styles[color]}`}>
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h4 className="font-extrabold text-[#071A52] text-sm sm:text-base">{title}</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{date}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default CitizenDashboardPage;
