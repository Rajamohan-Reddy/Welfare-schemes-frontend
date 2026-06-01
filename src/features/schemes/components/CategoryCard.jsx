import {
  GraduationCap,
  HeartPulse,
  Sprout,
  Home,
  Wallet,
  Users,
  Briefcase,
  Accessibility,
  BookOpen,
  ArrowRight,
  Check,
} from "lucide-react";

import { motion } from "framer-motion";

const categoryConfig = {
  EDUCATION: {
    icon: GraduationCap,
    bg: "from-indigo-50 via-blue-50 to-cyan-100",
    iconBg: "from-indigo-500 to-blue-600",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },

  AGRICULTURE: {
    icon: Sprout,
    bg: "from-emerald-50 via-green-50 to-lime-100",
    iconBg: "from-emerald-500 to-green-600",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },

  HEALTH: {
    icon: HeartPulse,
    bg: "from-rose-50 via-red-50 to-orange-100",
    iconBg: "from-rose-500 to-red-600",
    text: "text-rose-700",
    border: "border-rose-200",
  },

  HOUSING: {
    icon: Home,
    bg: "from-orange-50 via-amber-50 to-yellow-100",
    iconBg: "from-orange-500 to-amber-600",
    text: "text-orange-700",
    border: "border-orange-200",
  },

  PENSION: {
    icon: Wallet,
    bg: "from-cyan-50 via-sky-50 to-blue-100",
    iconBg: "from-cyan-500 to-sky-600",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },

  WOMEN_WELFARE: {
    icon: Users,
    bg: "from-pink-50 via-rose-50 to-red-100",
    iconBg: "from-pink-500 to-rose-600",
    text: "text-pink-700",
    border: "border-pink-200",
  },

  EMPLOYMENT: {
    icon: Briefcase,
    bg: "from-blue-50 via-indigo-50 to-violet-100",
    iconBg: "from-blue-500 to-indigo-600",
    text: "text-blue-700",
    border: "border-blue-200",
  },

  DISABILITY: {
    icon: Accessibility,
    bg: "from-purple-50 via-fuchsia-50 to-pink-100",
    iconBg: "from-purple-500 to-fuchsia-600",
    text: "text-purple-700",
    border: "border-purple-200",
  },

  STUDENT: {
    icon: BookOpen,
    bg: "from-indigo-50 via-violet-50 to-purple-100",
    iconBg: "from-indigo-500 to-violet-600",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },

  DEFAULT: {
    icon: GraduationCap,
    bg: "from-slate-50 via-slate-100 to-slate-200",
    iconBg: "from-slate-600 to-slate-800",
    text: "text-slate-700",
    border: "border-slate-200",
  },
};

function CategoryCard({ title, count, selected, onClick }) {
  const key = title?.replace(/\s/g, "_")?.toUpperCase();

  const config = categoryConfig[key] || categoryConfig.DEFAULT;

  const Icon = config.icon;

  return (
    <motion.button
      whileHover={{
        y: -5,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        border
        bg-gradient-to-br
        ${config.bg}
        p-5
        text-left
        transition-all
        duration-300
        ${
          selected
            ? `${config.border} shadow-xl ring-2 ring-white`
            : `${config.border} hover:shadow-lg`
        }
      `}
    >
      {/* Glow */}

      <div
        className="
          absolute
          -right-8
          -top-8
          h-28
          w-28
          rounded-full
          bg-white/50
          blur-3xl
          opacity-0
          transition-all
          duration-300
          group-hover:opacity-100
        "
      />

      <div className="relative z-10">
        {/* Top Row */}

        <div className="flex items-start justify-between">
          <div
            className={`
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              ${config.iconBg}
              text-white
              shadow-lg
            `}
          >
            <Icon size={28} />
          </div>

          {selected && (
            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-md
              "
            >
              <Check size={16} className={config.text} />
            </div>
          )}
        </div>

        {/* Title */}

        <h3
          className="
            mt-5
            min-h-[56px]
            text-lg
            font-bold
            leading-snug
            text-slate-900
          "
        >
          {title}
        </h3>

        {/* Bottom */}

        <div className="mt-5 flex items-center justify-between">
          <span
            className={`
              rounded-full
              bg-white/80
              px-3
              py-1
              text-xs
              font-semibold
              backdrop-blur-md
              ${config.text}
            `}
          >
            {count} Schemes
          </span>

          <div
            className={`
              flex
              items-center
              gap-1
              text-sm
              font-semibold
              ${config.text}
            `}
          >
            View
            <ArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default CategoryCard;
