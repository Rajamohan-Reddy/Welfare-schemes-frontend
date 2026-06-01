import { motion } from "framer-motion";

function StatCard({ title, value, icon: Icon, subtitle, color = "blue" }) {
  const colorMap = {
    blue: {
      bg: "from-blue-50 via-white to-white",
      iconBg: "bg-blue-100",
      iconText: "text-blue-700",
      accent: "bg-blue-600",
    },

    green: {
      bg: "from-emerald-50 via-white to-white",
      iconBg: "bg-emerald-100",
      iconText: "text-emerald-700",
      accent: "bg-emerald-600",
    },

    amber: {
      bg: "from-amber-50 via-white to-white",
      iconBg: "bg-amber-100",
      iconText: "text-amber-700",
      accent: "bg-amber-500",
    },

    gold: {
      bg: "from-yellow-50 via-white to-white",
      iconBg: "bg-yellow-100",
      iconText: "text-yellow-700",
      accent: "bg-[#D4AF37]",
    },
  };

  const styles = colorMap[color];

  return (
    <motion.div
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-slate-100
        bg-gradient-to-br
        ${styles.bg}
        p-6
        shadow-[0_10px_35px_rgba(15,23,42,0.06)]
        transition-all
        hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]
      `}
    >
      <div
        className={`
          absolute
          left-0
          top-0
          h-full
          w-1.5
          ${styles.accent}
        `}
      />

      <div className="flex items-start justify-between">
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-slate-500
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-3
              text-4xl
              font-extrabold
              text-slate-900
            "
          >
            {value}
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`
            rounded-3xl
            p-3
            ${styles.iconBg}
            ${styles.iconText}
          `}
        >
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;
