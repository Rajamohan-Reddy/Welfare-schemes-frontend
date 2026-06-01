import { motion } from "framer-motion";
import { ShieldCheck, FileText, Users, Award, CheckCircle, Globe } from "lucide-react";
import Logo from "../../../assets/images/ap-logo.png";

const stats = [
  { icon: FileText, value: "250+", label: "Welfare Schemes" },
  { icon: Users, value: "12L+", label: "Beneficiaries" },
  { icon: CheckCircle, value: "98.4%", label: "Success Rate" },
  { icon: ShieldCheck, value: "100%", label: "Aadhaar Secure" },
];

const features = [
  "Direct Benefit Transfer (DBT) Integration",
  "Real-time Application Tracking",
  "Automated Eligibility Matching",
  "Field Officer Verification Network",
];

function AuthHero() {
  return (
    <div className="relative hidden lg:flex flex-col overflow-hidden bg-[#040F2E] px-12 py-10 text-white h-full">
      {/* Layered mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.35)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.25)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Logo & branding */}
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-white shadow-2xl shadow-blue-900/40 ring-1 ring-white/20">
          <img src={Logo} alt="AP Government Seal" className="h-[46px] w-[46px] object-contain" />
        </div>
        <div>
          <p className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-blue-400">
            Government of Andhra Pradesh
          </p>
          <p className="text-[17px] font-black tracking-tight text-white mt-0.5">
            Welfare Services Portal
          </p>
        </div>
      </div>

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 flex-1 flex flex-col justify-center py-8 space-y-8"
      >
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] text-blue-300 backdrop-blur-md">
            <Globe size={11} />
            DIGITAL GOVERNANCE PLATFORM — AP 2026
          </div>

          <h1 className="text-[40px] font-black leading-[1.12] tracking-tight">
            One Portal.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Every Benefit.
            </span>
          </h1>

          <p className="text-[15px] leading-[1.7] text-blue-100/75 max-w-[400px]">
            Apply for welfare schemes, upload documents, track real-time approvals, and receive government benefits — all through a single, Aadhaar-secured platform.
          </p>
        </div>

        {/* Features list */}
        <ul className="space-y-3">
          {features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex items-center gap-3 text-sm font-medium text-blue-100/80"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 border border-blue-400/20">
                <CheckCircle size={11} className="text-blue-400" />
              </span>
              {f}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Stats grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3">
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.07 }}
            className="rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-xl"
          >
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-400/15">
              <item.icon size={15} className="text-blue-300" />
            </div>
            <p className="text-xl font-black text-white tracking-tight">{item.value}</p>
            <p className="text-[11px] text-blue-200/60 font-semibold mt-0.5">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom trust badge */}
      <div className="relative z-10 mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-semibold text-blue-300/50">
        <div className="flex items-center gap-1.5">
          <Award size={11} />
          NIC Certified Portal
        </div>
        <span>© 2026 Govt. of Andhra Pradesh</span>
      </div>
    </div>
  );
}

export default AuthHero;
