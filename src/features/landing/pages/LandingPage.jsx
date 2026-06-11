import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight, CheckCircle, Users, FileText, TrendingUp, LogIn,
  Shield, HelpCircle, Phone, ChevronDown, Award, Zap,
  Building, Star, Lock, Clock, Globe, ChevronRight,
} from "lucide-react";
import { useGetAllSchemesQuery } from "../../../store/services/schemes.api";
import useAuth from "../../../hooks/useAuth";
import Logo from "../../../assets/images/ap-logo.png";

/* ─── Animated counter ──────────────────────────────────────────────────── */
function AnimatedCount({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
    const step = numericTarget / 60;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= numericTarget) { setCount(numericTarget); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {target.includes("K") ? `${count}K` : target.includes("%") ? `${count}%` : count}
      {suffix}
    </span>
  );
}

const faqs = [
  { q: "How do I apply for a welfare scheme?", a: "Register a citizen account, complete your profile, browse available schemes, check eligibility, fill the application form, upload required documents, and submit. The entire process is online and paperless." },
  { q: "How can I track my application status?", a: "Log in to your citizen dashboard and navigate to 'My Applications', or use your unique tracking ID to view real-time verification progress and officer notes." },
  { q: "What is the role of verification officers?", a: "Verification officers validate submitted documents, conduct field reviews when required, and update application statuses — ensuring authentic, tamper-proof distribution of benefits." },
  { q: "Is there any charge for applying?", a: "No. All welfare scheme applications on this official portal are completely free of charge. Beware of fraudulent agents claiming fees." },
  { q: "How long does approval take?", a: "Most applications are reviewed within 7–14 working days from submission. Urgent grievances are escalated automatically via the fast-track queue." },
];

const deliveryPillars = [
  { icon: Shield, color: "blue", title: "Direct & Protected", desc: "DBT links bank accounts securely through Aadhaar architecture — zero middlemen, zero leakage." },
  { icon: FileText, color: "purple", title: "Audit-Grade Logs", desc: "Every application flows through state-verified officer pipelines with digital compliance trails." },
  { icon: Zap, color: "emerald", title: "Rapid Decisions", desc: "Automated queue logic lets verification officials review, clear, and escalate files in record time." },
  { icon: Globe, color: "indigo", title: "24×7 Availability", desc: "Access your welfare workspace from any device, anytime — the portal never goes offline." },
];

const colorMap = {
  blue: { bg: "bg-blue-100", text: "text-blue-700", glow: "group-hover:shadow-blue-500/15" },
  purple: { bg: "bg-purple-100", text: "text-purple-700", glow: "group-hover:shadow-purple-500/15" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", glow: "group-hover:shadow-emerald-500/15" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700", glow: "group-hover:shadow-indigo-500/15" },
};

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: allSchemes = [], isLoading: loading } = useGetAllSchemesQuery();
  const schemes = allSchemes.slice(0, 6);
  const [activeFaq, setActiveFaq] = useState(null);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) navigate(`/${user.role.toLowerCase()}/dashboard`);
    else navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans antialiased">

      {/* ─── Announcement Bar ──────────────────────────────────────────────── */}
      <div className="bg-[#071A52] text-white text-[11px] font-semibold py-2.5 px-6 text-center tracking-wide">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFD95A] animate-pulse" />
          Official Welfare Portal — Government of Andhra Pradesh &nbsp;·&nbsp; Delivering transparency, speed, and trust.
          <Star size={10} className="text-[#FFD95A]" />
        </span>
      </div>

      {/* ─── Navigation ───────────────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        navScrolled ? "bg-white/90 backdrop-blur-xl shadow-md shadow-slate-900/5 border-b border-slate-200/60" : "bg-white border-b border-slate-200/40"
      }`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src={Logo} alt="AP Gov Logo" className="h-10 w-10 object-contain drop-shadow-sm" />
            <div>
              <p className="text-[9px] uppercase font-extrabold tracking-[0.15em] text-slate-500">Government of</p>
              <p className="text-[16px] font-black tracking-tight text-[#071A52]">Andhra Pradesh Welfare</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-600">
            <button onClick={() => navigate("/citizen/schemes")} className="hover:text-[#071A52] transition">Schemes</button>
            <button onClick={() => navigate("/citizen/eligibility")} className="hover:text-[#071A52] transition">Eligibility</button>
            <a href="#faq" className="hover:text-[#071A52] transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={handleGetStarted}
                className="rounded-full bg-[#071A52] px-5 py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-blue-900 transition"
              >
                Go to Dashboard →
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-1.5 text-[13px] font-bold text-[#071A52] hover:text-blue-700 transition"
                >
                  <LogIn size={15} /> Sign In
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-full bg-[#071A52] px-5 py-2.5 text-[13px] font-bold text-white shadow-md hover:bg-blue-900 transition hover:scale-[1.02]"
                >
                  Register Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF2FF] via-[#F5F7FF] to-white py-20 lg:py-28 px-6">
        {/* Mesh blobs */}
        <div className="absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #2563EB 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-[11px] font-bold text-blue-800 shadow-sm">
                <Award size={12} className="text-blue-700" />
                State-of-the-Art Digital Governance · 2026
              </div>

              <h1 className="text-[44px] sm:text-[52px] lg:text-[58px] font-black leading-[1.07] tracking-tight text-[#071A52]">
                Welfare Benefits,{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Delivered with
                  </span>
                </span>{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Absolute Trust.
                </span>
              </h1>

              <p className="text-[16px] sm:text-[18px] leading-relaxed text-slate-500 max-w-lg">
                Empowering Andhra Pradesh's citizens through a secure, transparent, and direct welfare portal. Explore programs, verify eligibility, and track outcomes — online, anytime.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  id="hero-get-started"
                  onClick={handleGetStarted}
                  className="group flex items-center gap-2.5 rounded-2xl bg-[#071A52] px-8 py-4 text-[15px] font-bold text-white shadow-xl shadow-blue-950/25 hover:bg-[#0e2a7d] hover:-translate-y-0.5 transition-all duration-200"
                >
                  Access Your Workspace
                  <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/citizen/eligibility")}
                  className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-[15px] font-bold text-slate-700 hover:border-blue-500 hover:text-blue-700 hover:bg-blue-50/40 transition-all duration-200"
                >
                  Check Eligibility <ChevronRight size={16} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                {[
                  { icon: Lock, text: "Aadhaar Verified" },
                  { icon: Shield, text: "NIC Certified" },
                  { icon: CheckCircle, text: "100% Free Service" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-500">
                    <Icon size={13} className="text-emerald-500" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero visual card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative mx-auto max-w-[400px] rounded-[36px] bg-white p-6 shadow-2xl shadow-slate-900/12 ring-1 ring-slate-200/70">
                {/* Browser chrome */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-[#FFD95A]" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-500">
                    <Lock size={9} /> welfare-portal.ap.gov.in
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Building, color: "blue", label: "Direct Benefit Transfer", val: "₹ 12,000 disbursed" },
                    { icon: Shield, color: "emerald", label: "Verification Status", val: "✓ Aadhaar Linked" },
                    { icon: Clock, color: "amber", label: "Application Progress", val: "Field Review — Day 3" },
                    { icon: CheckCircle, color: "indigo", label: "Scheme Match", val: "8 Eligible Schemes" },
                  ].map(({ icon: Icon, color, label, val }) => (
                    <div key={label} className={`flex items-center gap-3 rounded-2xl p-4 border ${
                      color === "blue" ? "bg-blue-50/70 border-blue-100/50" :
                      color === "emerald" ? "bg-emerald-50/70 border-emerald-100/50" :
                      color === "amber" ? "bg-amber-50/70 border-amber-100/50" :
                      "bg-indigo-50/70 border-indigo-100/50"
                    }`}>
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 ${
                        color === "blue" ? "bg-blue-600" :
                        color === "emerald" ? "bg-emerald-600" :
                        color === "amber" ? "bg-amber-500" : "bg-indigo-600"
                      }`}>
                        <Icon size={17} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-semibold">{label}</p>
                        <p className="text-[13px] font-bold text-slate-800">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 text-center text-[10px] font-semibold text-slate-400">
                  AP Welfare Command Network · Live & Secured
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 rounded-2xl bg-[#071A52] text-white text-[11px] font-black px-4 py-2 shadow-lg">
                98.4% Success Rate 🎯
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────────── */}
      <section className="bg-[#071A52] py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, target: "50K+", label: "Registered Citizens" },
              { icon: FileText, target: "25+", label: "Active Programs" },
              { icon: TrendingUp, target: "100K+", label: "Decisions Logged" },
              { icon: CheckCircle, target: "98%", label: "Fidelity Rate" },
            ].map(({ icon: Icon, target, label }) => (
              <div key={label} className="text-center text-white space-y-2">
                <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon size={20} className="text-blue-300" />
                </div>
                <p className="text-3xl font-black tracking-tight"><AnimatedCount target={target} /></p>
                <p className="text-[12px] text-blue-200/70 font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Schemes ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Featured Programs
              </div>
              <h2 className="text-[36px] font-black text-[#071A52] tracking-tight">Empowering Communities</h2>
              <p className="mt-3 text-[15px] text-slate-500 max-w-xl">
                Explore government-backed initiatives, review eligibility criteria, and apply for programs tailored to support you.
              </p>
            </div>
            <button
              onClick={() => navigate("/citizen/schemes")}
              className="group shrink-0 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-700 hover:border-[#071A52] hover:text-[#071A52] transition-all shadow-sm"
            >
              Explore All <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 animate-pulse rounded-[28px] bg-slate-200" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {schemes.map((scheme, index) => (
                <motion.div
                  key={scheme._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  onClick={() => navigate(`/citizen/schemes/${scheme._id}`)}
                  className="group cursor-pointer rounded-[28px] border border-slate-200/80 bg-white p-7 hover:border-blue-400/70 hover:shadow-2xl hover:shadow-blue-900/7 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-100/50 px-3 py-1 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                      {scheme.schemeCode || "Welfare"}
                    </div>
                    <h3 className="mb-2.5 text-[18px] font-bold text-[#071A52] group-hover:text-blue-700 transition duration-200 leading-snug">
                      {scheme.schemeName}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-slate-500 line-clamp-2">{scheme.description}</p>
                  </div>
                  <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">View Details</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#071A52] group-hover:text-white transition-all duration-200">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Delivery Pillars ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Our Core Delivery Model
            </div>
            <h2 className="text-[34px] font-black text-[#071A52] tracking-tight">Built for Trust & Speed</h2>
            <p className="mt-4 text-[15px] text-slate-500 leading-relaxed">
              Operating with the highest integrity — benefits reach authorized beneficiaries directly, with zero middlemen and full audit trails.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {deliveryPillars.map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className={`group rounded-[28px] border border-slate-100 bg-white p-7 hover:shadow-2xl ${colorMap[color].glow} transition-all duration-300 flex flex-col gap-5`}
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colorMap[color].bg} ${colorMap[color].text}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-[#071A52] mb-2">{title}</h3>
                  <p className="text-[13px] leading-relaxed text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-[#F8FAFC] border-t border-slate-100">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600 mb-3">
              <HelpCircle size={13} /> Frequently Asked Questions
            </div>
            <h2 className="text-[34px] font-black text-[#071A52] tracking-tight">Got Questions?</h2>
            <p className="mt-3 text-[15px] text-slate-500">Everything you need to know about the AP Welfare Portal.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`overflow-hidden rounded-[20px] border transition-all duration-200 ${
                  activeFaq === idx ? "border-blue-200 bg-white shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-[15px] font-bold text-[#071A52]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 ml-4 text-slate-400 transition-transform duration-300 ${activeFaq === idx ? "rotate-180 text-blue-600" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 text-[14px] leading-relaxed text-slate-500 border-t border-slate-100 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#071A52] py-24 px-6 text-center text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.4)_0%,transparent_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="mx-auto max-w-3xl relative z-10 space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-bold text-blue-300 tracking-wider">
            <Star size={11} /> OFFICIALLY ENDORSED BY GOVT. OF AP
          </div>
          <h2 className="text-[38px] sm:text-[48px] font-black tracking-tight leading-tight">
            Apply Today.<br />
            <span className="text-[#FFD95A]">Receive Benefits Directly.</span>
          </h2>
          <p className="text-[16px] text-blue-100/80 max-w-xl mx-auto leading-relaxed">
            Take command of your welfare access. Securely check eligibility and submit your file today — no agents, no delays.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              id="cta-get-started"
              onClick={handleGetStarted}
              className="group rounded-2xl bg-[#FFD95A] hover:bg-[#FFE07D] px-10 py-4 text-[15px] font-extrabold text-[#071A52] shadow-xl shadow-yellow-900/10 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              Sign Up or Login <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/citizen/schemes")}
              className="rounded-2xl border border-white/20 bg-white/8 hover:bg-white/15 backdrop-blur-sm px-10 py-4 text-[15px] font-bold transition-all"
            >
              Browse Schemes
            </button>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#040F2E] text-slate-300 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="AP Gov" className="h-9 w-9 object-contain brightness-0 invert opacity-90" />
                <span className="font-extrabold text-white text-[15px]">AP Welfare Portal</span>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-400">
                Official unified portal of the Government of Andhra Pradesh for automated welfare scheme application, validation, and DBT disbursement.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-[12px] mb-5 tracking-[0.12em] uppercase">Quick Links</h4>
              <ul className="space-y-2.5 text-[13px]">
                {[["Sign In", "/login"], ["Register Account", "/register"], ["Eligibility Checker", "/citizen/eligibility"]].map(([label, href]) => (
                  <li key={label}>
                    <button onClick={() => navigate(href)} className="hover:text-white transition flex items-center gap-1.5 group">
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition -ml-1" />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-[12px] mb-5 tracking-[0.12em] uppercase">Support</h4>
              <ul className="space-y-2.5 text-[13px]">
                {["Citizen Grievance", "Officer Direct Portal", "Terms & Privacy", "Accessibility"].map((label) => (
                  <li key={label}>
                    <a href="#" className="hover:text-white transition flex items-center gap-1.5 group">
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition -ml-1" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white text-[12px] tracking-[0.12em] uppercase">Toll-Free Helpline</h4>
              <div className="flex items-center gap-3.5 bg-white/5 border border-white/8 rounded-2xl p-4">
                <Phone size={20} className="text-[#FFD95A] shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Citizen call center</p>
                  <p className="text-xl font-black text-white">1902</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <Clock size={11} /> 24×7 Operations
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 Government of Andhra Pradesh. All rights reserved. Managed by Department of e-Governance.</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
