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
    },
    {
      name: "Jagananna Vidya Deevena",
      color: "from-[#2563EB] to-[#60A5FA]",
    },
    {
      name: "YSR Rythu Bharosa",
      color: "from-[#059669] to-[#34D399]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* HERO */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          bg-gradient-to-r
          from-[#071A52]
          via-[#12307A]
          to-[#1E4ED8]
          p-7
          text-white
          shadow-[0_15px_40px_rgba(7,26,82,0.18)]
        "
      >
        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-1
            bg-gradient-to-b
            from-[#D4AF37]
            to-[#FFD95A]
          "
        />

        <div
          className="
            absolute
            right-6
            top-6
            text-right
          "
        >
          <p className="text-xs text-blue-200">{currentDate}</p>

          <p className="text-sm font-medium">{currentTime}</p>
        </div>

        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between gap-8">
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#FFD95A]/20
                bg-[#FFD95A]/10
                px-4
                py-2
                text-xs
                font-semibold
                text-[#FFE68A]
              "
            >
              <Sparkles size={14} />
              Citizen Service Center
            </div>

            <h1
              className="
                mt-5
                text-4xl
                font-extrabold
                tracking-tight
              "
            >
              Good Morning, {user?.firstName} 👋
            </h1>

            <p
              className="
                mt-3
                max-w-xl
                text-base
                leading-7
                text-blue-100
              "
            >
              Discover welfare schemes, manage applications, and access
              government services through one unified citizen platform.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate(ROUTES.CITIZEN_SCHEMES)}
                className="
                  rounded-2xl
                  bg-white
                  px-5
                  py-3
                  font-semibold
                  text-[#071A52]
                "
              >
                Browse Schemes
              </button>

              <button
                onClick={() => navigate(ROUTES.CITIZEN_APPLICATIONS)}
                className="
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  px-5
                  py-3
                  font-semibold
                "
              >
                My Applications
              </button>
            </div>
          </div>

          <div
            className="
              hidden
              lg:block
              rounded-3xl
              border
              border-white/10
              bg-white/10
              p-4
              backdrop-blur-xl
            "
          >
            <p className="text-xs text-blue-100">Profile Status</p>

            <div className="mt-2 flex items-end gap-2">
              <span className="text-4xl font-bold">65%</span>

              <span className="mb-1 text-xs">Complete</span>
            </div>

            <div className="mt-3 h-2 rounded-full bg-white/20">
              <div
                className="
                  h-full
                  w-[65%]
                  rounded-full
                  bg-gradient-to-r
                  from-[#D4AF37]
                  to-[#FFD95A]
                "
              />
            </div>

            <button
              className="
                mt-4
                text-sm
                font-semibold
                text-[#FFD95A]
              "
            >
              Complete Profile →
            </button>
          </div>
        </div>
      </motion.div>

      {/* SERVICES */}

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Citizen Services</h2>

        <p className="mt-1 text-slate-500">
          Quick access to frequently used welfare services.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
      </div>

      {/* ELIGIBILITY */}

      <SectionCard title="Eligibility Insights">
        <div className="grid gap-5 md:grid-cols-3">
          <InsightCard
            title="YSR Pension Kanuka"
            icon={BadgeCheck}
            status="Eligible"
            color="green"
          />

          <InsightCard
            title="Jagananna Vidya Deevena"
            icon={Landmark}
            status="Likely Eligible"
            color="blue"
          />

          <InsightCard
            title="Rythu Bharosa"
            icon={Wallet}
            status="Check Eligibility"
            color="gold"
          />
        </div>
      </SectionCard>

      {/* RECOMMENDED SCHEMES */}

      <SectionCard title="Recommended Schemes">
        <div className="grid gap-6 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <div
              key={scheme.name}
              className="
                rounded-[30px]
                border
                border-slate-100
                bg-gradient-to-br
                from-white
                via-white
                to-slate-50
                p-6
                shadow-[0_10px_35px_rgba(15,23,42,0.05)]
                transition-all
                hover:-translate-y-1
                hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]
              "
            >
              <div
                className={`
                  mb-5
                  h-1.5
                  rounded-full
                  bg-gradient-to-r
                  ${scheme.color}
                `}
              />

              <h3 className="text-lg font-bold text-slate-900">
                {scheme.name}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Welfare assistance available for eligible citizens.
              </p>

              <button
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  font-semibold
                  text-[#1E3A8A]
                "
              >
                View Details
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* TIMELINE */}

      <SectionCard title="Application Journey">
        <div className="space-y-5">
          <TimelineItem
            icon={CheckCircle2}
            title="Application Submitted"
            description="YSR Pension Kanuka"
            color="green"
          />

          <TimelineItem
            icon={Clock3}
            title="Officer Review"
            description="Verification in progress"
            color="amber"
          />
        </div>
      </SectionCard>
    </div>
  );
}

function InsightCard({ title, icon: Icon, status, color }) {
  const styles = {
    green: "bg-emerald-50 border-emerald-100 text-emerald-700",
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    gold: "bg-yellow-50 border-yellow-100 text-yellow-700",
  };

  return (
    <div
      className={`
        rounded-[28px]
        border
        p-5
        ${styles[color]}
      `}
    >
      <Icon size={22} />

      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm">{status}</p>
    </div>
  );
}

function TimelineItem({ icon: Icon, title, description, color }) {
  const styles = {
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`
          rounded-2xl
          p-3
          ${styles[color]}
        `}
      >
        <Icon size={18} />
      </div>

      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>

        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export default CitizenDashboardPage;
