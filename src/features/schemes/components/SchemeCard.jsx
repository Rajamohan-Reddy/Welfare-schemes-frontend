import {
  ArrowRight,
  GraduationCap,
  HeartPulse,
  Sprout,
  Home,
  Wallet,
  Building2,
  Users,
  Briefcase,
  Accessibility,
  BookOpen,
} from "lucide-react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categoryConfig = {
  EDUCATION: {
    icon: GraduationCap,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    badge: "bg-indigo-50 text-indigo-700",
  },

  AGRICULTURE: {
    icon: Sprout,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-700",
  },

  HEALTH: {
    icon: HeartPulse,
    color: "text-rose-600",
    bg: "bg-rose-50",
    badge: "bg-rose-50 text-rose-700",
  },

  HOUSING: {
    icon: Home,
    color: "text-orange-600",
    bg: "bg-orange-50",
    badge: "bg-orange-50 text-orange-700",
  },

  PENSION: {
    icon: Wallet,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    badge: "bg-cyan-50 text-cyan-700",
  },

  WOMEN_WELFARE: {
    icon: Users,
    color: "text-pink-600",
    bg: "bg-pink-50",
    badge: "bg-pink-50 text-pink-700",
  },

  EMPLOYMENT: {
    icon: Briefcase,
    color: "text-blue-600",
    bg: "bg-blue-50",
    badge: "bg-blue-50 text-blue-700",
  },

  DISABILITY: {
    icon: Accessibility,
    color: "text-purple-600",
    bg: "bg-purple-50",
    badge: "bg-purple-50 text-purple-700",
  },

  STUDENT: {
    icon: BookOpen,
    color: "text-violet-600",
    bg: "bg-violet-50",
    badge: "bg-violet-50 text-violet-700",
  },

  DEFAULT: {
    icon: GraduationCap,
    color: "text-slate-600",
    bg: "bg-slate-100",
    badge: "bg-slate-100 text-slate-700",
  },
};

function SchemeCard({ scheme }) {
  const navigate = useNavigate();

  const categoryKey = scheme?.categoryId?.categoryCode?.toUpperCase();

  const config = categoryConfig[categoryKey] || categoryConfig.DEFAULT;

  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        group
        flex
        h-full
        flex-col
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        hover:border-slate-300
        hover:shadow-lg
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            ${config.bg}
            ${config.color}
          `}
        >
          <Icon size={22} />
        </div>

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${config.badge}
          `}
        >
          {scheme?.categoryId?.categoryName}
        </span>
      </div>

      {/* Title */}
      <h3
        className="
          mt-5
          line-clamp-2
          text-xl
          font-bold
          leading-tight
          text-slate-900
        "
      >
        {scheme?.schemeName}
      </h3>

      {/* Description */}
      <p
        className="
          mt-3
          line-clamp-3
          flex-1
          text-sm
          leading-6
          text-slate-500
        "
      >
        {scheme?.description}
      </p>

      {/* Benefit */}
      <div className="mt-6">
        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-wider
            text-slate-400
          "
        >
          Maximum Benefit
        </p>

        <h2
          className="
            mt-1
            text-3xl
            font-bold
            tracking-tight
            text-slate-900
          "
        >
          ₹{Number(scheme?.benefitAmount || 0).toLocaleString()}
        </h2>
      </div>

      {/* Department */}
      <div
        className="
          mt-5
          inline-flex
          w-fit
          items-center
          gap-2
          rounded-full
          bg-slate-100
          px-3
          py-2
          text-xs
          font-medium
          text-slate-700
        "
      >
        <Building2 size={14} />
        {scheme?.department}
      </div>

      {/* Footer */}
      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          pt-4
        "
      >
        <div>
          <p className="text-xs text-slate-400">Benefit Type</p>

          <p
            className="
              mt-1
              text-sm
              font-medium
              text-slate-700
            "
          >
            {scheme?.benefitType || "General"}
          </p>
        </div>

        <button
          onClick={() => navigate(`/citizen/schemes/${scheme._id}`)}
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-blue-600
            transition-all
            group-hover:gap-3
          "
        >
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default SchemeCard;
