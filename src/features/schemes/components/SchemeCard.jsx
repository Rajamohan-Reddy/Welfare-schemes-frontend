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
    color: "text-indigo-600 bg-indigo-50",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100/50",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
  },
  AGRICULTURE: {
    icon: Sprout,
    color: "text-emerald-600 bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop",
  },
  HEALTH: {
    icon: HeartPulse,
    color: "text-rose-600 bg-rose-50",
    badge: "bg-rose-50 text-rose-700 border-rose-100/50",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
  },
  HOUSING: {
    icon: Home,
    color: "text-orange-600 bg-orange-50",
    badge: "bg-orange-50 text-orange-700 border-orange-100/50",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600&auto=format&fit=crop",
  },
  PENSION: {
    icon: Wallet,
    color: "text-cyan-600 bg-cyan-50",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-100/50",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
  },
  WOMEN_WELFARE: {
    icon: Users,
    color: "text-pink-600 bg-pink-50",
    badge: "bg-pink-50 text-pink-700 border-pink-100/50",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  },
  EMPLOYMENT: {
    icon: Briefcase,
    color: "text-blue-600 bg-blue-50",
    badge: "bg-blue-50 text-blue-700 border-blue-100/50",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
  },
  DISABILITY: {
    icon: Accessibility,
    color: "text-purple-600 bg-purple-50",
    badge: "bg-purple-50 text-purple-700 border-purple-100/50",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  },
  STUDENT: {
    icon: BookOpen,
    color: "text-violet-600 bg-violet-50",
    badge: "bg-violet-50 text-violet-700 border-violet-100/50",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600&auto=format&fit=crop",
  },
  DEFAULT: {
    icon: GraduationCap,
    color: "text-slate-600 bg-slate-100",
    badge: "bg-slate-100 text-slate-700 border-slate-200/50",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
  },
};

function SchemeCard({ scheme }) {
  const navigate = useNavigate();

  const categoryKey = scheme?.categoryId?.categoryCode?.toUpperCase();
  const config = categoryConfig[categoryKey] || categoryConfig.DEFAULT;
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => navigate(`/citizen/schemes/${scheme._id}`)}
      className="group cursor-pointer flex flex-col h-full rounded-[30px] border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden"
    >
      {/* Category Image Banner Overlay */}
      <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
        <img
          src={config.image}
          alt={scheme?.categoryId?.categoryName || "Category Banner"}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.9]"
        />
        
        {/* Float Badge Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider backdrop-blur-md bg-white/90 shadow-sm ${config.badge}`}>
            <Icon size={12} className="shrink-0" />
            {scheme?.categoryId?.categoryName}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
            {scheme?.schemeCode || "AP-WELFARE"}
          </span>
          <h3 className="text-lg font-black text-[#071A52] leading-snug group-hover:text-blue-700 transition duration-150 line-clamp-2">
            {scheme?.schemeName}
          </h3>
          <p className="text-xs leading-relaxed text-slate-500 line-clamp-3">
            {scheme?.description}
          </p>
        </div>

        {/* Benefits Display */}
        <div className="pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Welfare Disbursal Amount
          </p>
          <h2 className="text-2xl font-black text-[#071A52] tracking-tight mt-0.5">
            ₹{Number(scheme?.benefitAmount || 0).toLocaleString()}
          </h2>
        </div>

        {/* Card Footer Details */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600 shrink-0">
            <Building2 size={12} className="text-slate-400" />
            {scheme?.department}
          </span>
          
          <button className="flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-700 transition group-hover:gap-2">
            Open File <ArrowRight size={14} className="transition-all" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default SchemeCard;
