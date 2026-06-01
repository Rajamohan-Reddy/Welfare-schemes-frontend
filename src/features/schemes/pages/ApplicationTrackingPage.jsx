import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileCheck,
  Eye,
  Download,
  ShieldCheck,
  Wallet,
  XCircle,
  Loader2,
  BadgeCheck,
  MessageSquareMore,
  Sparkles,
  Building,
  Activity,
  Heart,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { getApplicationByIdApi } from "../api/applications.api";
import Card from "../../../components/ui/Card";

function ApplicationTrackingPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const canvasRef = useRef(null);

  const API_BASE_URL = "http://localhost:5000";

  const loadApplication = async () => {
    try {
      const response = await getApplicationByIdApi(applicationId);
      setApplication(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
    const refreshInterval = setInterval(loadApplication, 15000);
    return () => clearInterval(refreshInterval);
  }, [applicationId]);

  // Confetti Animation Engine
  useEffect(() => {
    if (application?.status === "BENEFIT_DISBURSED" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      let animationFrameId;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = ["#FFD95A", "#60A5FA", "#34D399", "#F472B6", "#A78BFA", "#F59E0B"];

      class Particle {
        constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height - canvas.height;
          this.r = Math.random() * 6 + 4;
          this.d = Math.random() * canvas.height;
          this.color = colors[Math.floor(Math.random() * colors.length)];
          this.tilt = Math.random() * 10 - 5;
          this.tiltAngleIncremental = Math.random() * 0.07 + 0.02;
          this.tiltAngle = 0;
        }

        draw() {
          ctx.beginPath();
          ctx.lineWidth = this.r / 2;
          ctx.strokeStyle = this.color;
          ctx.moveTo(this.x + this.tilt + this.r / 2, this.y);
          ctx.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 2);
          ctx.stroke();
        }

        update() {
          this.tiltAngle += this.tiltAngleIncremental;
          this.y += (Math.cos(this.d) + 3 + this.r / 2) / 2;
          this.x += Math.sin(this.tiltAngle);
          this.tilt = Math.sin(this.tiltAngle - this.r / 2) * 5;

          if (this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.tilt = Math.random() * 10 - 5;
          }
        }
      }

      // Initial particles burst
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener("resize", handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [application?.status]);

  const statusSteps = [
    "SUBMITTED",
    "UNDER_VERIFICATION",
    "VERIFIED",
    "APPROVED",
    "BENEFIT_DISBURSED",
  ];

  const currentStep = statusSteps.indexOf(application?.status);

  const progressMap = {
    SUBMITTED: 20,
    UNDER_VERIFICATION: 45,
    VERIFIED: 70,
    APPROVED: 90,
    BENEFIT_DISBURSED: 100,
  };

  const progress = progressMap[application?.status] || 0;

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={42} className="animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-400">Querying System Registry...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-[36px] bg-white p-16 text-center border border-slate-200 shadow-sm space-y-4">
        <XCircle size={40} className="mx-auto text-slate-300" />
        <h3 className="text-lg font-bold text-[#071A52]">Registry File Missing</h3>
        <p className="text-xs text-slate-400">We couldn't retrieve the requested application tracking log.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 relative">
      {/* Canvas for Disbursal Confetti celebration overlay */}
      {application?.status === "BENEFIT_DISBURSED" && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        />
      )}

      {/* Back button */}
      <button
        onClick={() => navigate("/citizen/applications")}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4.5 py-2 text-xs font-bold text-slate-700 transition"
      >
        <ArrowLeft size={14} /> Back to Applications
      </button>

      {/* Hero tracking banner */}
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#071A52] via-[#0F4C81] to-[#2563EB] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-10 h-32 w-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border border-white/20 bg-white/10 tracking-wider">
              <Sparkles size={12} className="text-[#FFD95A]" /> REAL-TIME TIMELINE TRACKER
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {application.applicationNumber}
            </h1>
            <p className="text-sm leading-relaxed text-blue-100/90 max-w-xl">
              Track verification updates, document validation checkpoints, and final benefit disbursals securely.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submitted Date</span>
                <span className="text-sm font-bold mt-1 block">{new Date(application.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Registry Sync</span>
                <span className="text-sm font-bold mt-1 block">
                  {new Date(application.updatedAt || application.approvedAt || application.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive progress wheel */}
          <div className="w-full lg:w-[42%] rounded-3xl bg-white/5 border border-white/10 p-6 shadow-inner backdrop-blur-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Processing Stage</span>
              <span className="text-xs font-bold text-[#FFD95A]">{progress}% Done</span>
            </div>
            
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFD95A]" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 bg-slate-950/40 rounded-2xl px-4 py-3 text-xs font-bold uppercase border border-white/5">
              <span className="truncate">{application.status.replaceAll("_", " ")}</span>
              <button
                onClick={loadApplication}
                className="rounded-full bg-white text-[#071A52] px-3.5 py-1 text-[10px] font-extrabold hover:bg-slate-100 transition shrink-0"
              >
                Refresh Log
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Celebration disbursal notification card */}
      {application?.status === "BENEFIT_DISBURSED" && (
        <div className="rounded-[32px] bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white shadow-xl relative overflow-hidden flex items-center gap-6 animate-bounce-short">
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center text-white shadow-inner shrink-0 animate-pulse">
            <Heart size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">Congratulations! Welfare Released 🎉</h2>
            <p className="text-sm text-emerald-100 mt-1 leading-relaxed max-w-xl">
              Direct Benefit Transfer (DBT) funds successfully released and mapped to your verified bank account ledger!
            </p>
          </div>
        </div>
      )}

      {/* Parameters Overview Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <InfoSummaryCard title="Program Code" val={application.applicationNumber} />
        <InfoSummaryCard title="Welfare Program" val={application.schemeId?.schemeName} />
        <InfoSummaryCard title="Verification State" val={application.status.replaceAll("_", " ")} active />
        <InfoSummaryCard title="Logged Date" val={new Date(application.submittedAt).toLocaleDateString()} />
      </div>

      {/* Visual application journey timeline */}
      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-black text-[#071A52]">Application Milestone Timeline</h2>
            <p className="text-xs text-slate-400 mt-0.5">Verification checkpoint progress mapping.</p>
          </div>

          <div className="space-y-4">
            {statusSteps.map((step, index) => (
              <TimelineTrackerItem
                key={step}
                title={step}
                completed={index <= currentStep}
                current={index === currentStep}
                last={index === statusSteps.length - 1}
              />
            ))}
          </div>
        </Card>

        {/* Uploaded Documents List */}
        <div className="space-y-6">
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-[#071A52]">Uploaded Files Registry</h2>
              <p className="text-xs text-slate-400 mt-0.5">Verified checklist documents.</p>
            </div>

            <div className="space-y-4">
              {application.documents?.map((document, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="h-10 w-10 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                      <FileCheck size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#071A52] truncate">{document.documentType}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Checklist Verified</p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => window.open(`${API_BASE_URL}/${document.fileUrl}`, "_blank")}
                      title="Preview"
                      className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-100 transition"
                    >
                      <Eye size={13} />
                    </button>
                    <a
                      href={`${API_BASE_URL}/${document.fileUrl}`}
                      download
                      title="Download"
                      className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition"
                    >
                      <Download size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoSummaryCard({ title, val, active }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
      <h3 className={`mt-2 text-sm font-extrabold ${active ? "text-blue-600 uppercase" : "text-slate-800"}`}>{val}</h3>
    </div>
  );
}

function TimelineTrackerItem({ title, completed, current, last }) {
  const color = completed
    ? "bg-emerald-500 border-emerald-600 text-white"
    : current
      ? "bg-blue-600 border-blue-700 text-white animate-pulse"
      : "bg-slate-50 border-slate-200 text-slate-400";

  return (
    <div className="relative flex items-start gap-4">
      {/* Connector line */}
      {!last && (
        <span className={`absolute left-5.5 top-11 h-6 w-[2px] ${completed ? "bg-emerald-500" : "bg-slate-200"}`} />
      )}

      <div className={`h-11 w-11 rounded-full border flex items-center justify-center shrink-0 shadow-sm ${color}`}>
        {completed ? (
          <CheckCircle2 size={16} />
        ) : current ? (
          <ShieldCheck size={16} />
        ) : (
          <Wallet size={16} />
        )}
      </div>

      <div className="pt-2">
        <h3 className="text-sm font-extrabold text-[#071A52]">{title.replaceAll("_", " ")}</h3>
        <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-widest">
          {completed ? "Completed Checkpoint" : current ? "Current Verification Stage" : "Scheduled Checkpoint"}
        </p>
      </div>
    </div>
  );
}

export default ApplicationTrackingPage;
