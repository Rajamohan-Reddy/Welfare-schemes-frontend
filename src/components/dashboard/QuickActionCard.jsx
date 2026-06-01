import { motion } from "framer-motion";

function QuickActionCard({ title, description, icon: Icon, onClick }) {
  return (
    <motion.button
      whileHover={{
        y: -6,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-[30px]
        border
        border-slate-100
        bg-gradient-to-br
        from-white
        via-white
        to-slate-50
        p-6
        text-left
        shadow-[0_10px_35px_rgba(15,23,42,0.05)]
        transition-all
        hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)]
      "
    >
      <div
        className="
          absolute
          -right-5
          -top-5
          h-24
          w-24
          rounded-full
          bg-[#D4AF37]/10
          blur-2xl
        "
      />

      <div
        className="
          relative
          mb-5
          inline-flex
          rounded-3xl
          bg-gradient-to-r
          from-[#071A52]
          via-[#1E3A8A]
          to-[#2563EB]
          p-3.5
          text-white
          shadow-lg
        "
      >
        <Icon size={22} />
      </div>

      <h3
        className="
          relative
          text-lg
          font-bold
          text-slate-900
        "
      >
        {title}
      </h3>

      <p
        className="
          relative
          mt-2
          text-sm
          leading-6
          text-slate-500
        "
      >
        {description}
      </p>

      <div
        className="
          relative
          mt-5
          flex
          items-center
          gap-2
          text-sm
          font-semibold
          text-[#1E3A8A]
          transition-all
          group-hover:translate-x-1
        "
      >
        Open Service →
      </div>
    </motion.button>
  );
}

export default QuickActionCard;
