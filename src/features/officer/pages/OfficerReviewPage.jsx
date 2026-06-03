import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, ShieldCheck, XCircle, FileText, User, MapPin, Landmark, Eye, Download } from "lucide-react";
import { getApplicationByIdApi } from "../../schemes/api/applications.api";
import {
  documentVerifyApi,
  fieldVerifyApi,
} from "../../verification/api/verification.api";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import toast from "react-hot-toast";

function OfficerReviewPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const resp = await getApplicationByIdApi(applicationId);
      setApplication(resp.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load application");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (apiCall, successMsg) => {
    if (!remarks.trim()) {
      toast.error("Review remarks are required to execute actions.");
      return;
    }

    // Gate check: Field verification requires document verification to be completed first
    if (apiCall === fieldVerifyApi && application?.status !== "DOCUMENT_VERIFIED") {
      toast.error("❌ Document verification must be completed first before proceeding to field verification.");
      return;
    }

    try {
      setActionLoading(true);
      await apiCall(applicationId, { remarks });
      toast.success(successMsg);
      navigate("/officer/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="text-xs font-semibold text-slate-400">Loading Application Review...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-[36px] bg-white p-16 text-center border border-slate-200 shadow-sm space-y-4">
        <XCircle size={40} className="mx-auto text-slate-300" />
        <h3 className="text-lg font-bold text-[#071A52]">Application Missing</h3>
        <p className="text-xs text-slate-400">We couldn't retrieve the requested application.</p>
      </div>
    );
  }

  const citizen = application.citizenId || {};
  const formData = application.dynamicFormData || {};

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Back button */}
      <button
        onClick={() => navigate("/officer/queue")}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4.5 py-2 text-xs font-bold text-slate-700 transition"
      >
        <ArrowLeft size={14} /> Back to Queue
      </button>

      {/* Hero reviewing header */}
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0D9488] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-white/20 bg-white/10 tracking-wider">
            <ShieldCheck size={12} className="text-[#FFD95A]" /> OFFICER DECISION GATEWAY
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Review: {application.applicationNumber}
          </h1>
          <p className="text-sm leading-relaxed text-slate-200 max-w-xl">
            Evaluate applicant contact parameters, verify uploaded document checklist, and log official verifications.
          </p>
        </div>
      </section>

      {/* Side-by-side Dual Panel Layout */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Panel: Citizen Parameters and Documents */}
        <div className="space-y-8">
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-[#071A52]">Applicant Parameters</h2>
              <p className="text-xs text-slate-400 mt-0.5">Demographics and dynamic registry data.</p>
            </div>

            {/* Profile Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <ReviewParam icon={User} label="Applicant Name" val={`${citizen.firstName || ""} ${citizen.lastName || ""}`} />
              <ReviewParam icon={Landmark} label="Aadhaar ID" val={citizen.aadhaarNumber || "n/a"} />
              <ReviewParam icon={User} label="Occupation" val={formData.occupation || "n/a"} />
              <ReviewParam icon={Landmark} label="Reported Annual Income" val={formData.annualIncome ? `₹ ${Number(formData.annualIncome).toLocaleString()}` : "n/a"} />
              <ReviewParam icon={MapPin} label="District Boundary" val={formData.district || "n/a"} />
              <ReviewParam icon={MapPin} label="Village / Locality" val={formData.village || "n/a"} />
            </div>

            {/* Applicant Remarks */}
            {application.applicantRemarks && (
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Applicant Remarks</span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{application.applicantRemarks}</p>
              </div>
            )}
          </Card>

          {/* Uploaded Documents preview checklist */}
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-[#071A52]">Documents Checklist</h2>
              <p className="text-xs text-slate-400 mt-0.5">Preview and verify files matches required guidelines.</p>
            </div>

            <div className="space-y-4">
              {application.documents?.map((document, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="flex gap-3 items-center min-w-0">
                    <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#071A52] truncate">{document.documentType}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Uploaded Copy</p>
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

        {/* Right Panel: Official Remarks & Decision Pipelines */}
        <div className="space-y-6">
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-5">
            <h3 className="text-lg font-black text-[#071A52]">Officer Review</h3>
            <p className="text-xs text-slate-400 leading-normal">
              State clear review parameters, verifications completed, and official findings. (Remarks are mandatory to lock actions).
            </p>

            <textarea
              rows={5}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white placeholder:text-slate-400"
              placeholder="State verification observations here..."
            />

            {/* Decision Trigger Buttons */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Caseload Decision Pathways</p>
              
              {/* Document Verify (SUBMITTED -> DOCUMENT_VERIFIED) */}
              <button
                onClick={() => handleAction(documentVerifyApi, "Document verification completed")}
                disabled={actionLoading}
                className="w-full rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 shadow flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                Verify Documents Checkpoint
              </button>

              {/* Field Verify (DOCUMENT_VERIFIED -> FIELD_VERIFIED) & Submit to Admin */}
              <button
                onClick={() => handleAction(fieldVerifyApi, "Application submitted to Admin for approval! File will now be reviewed by Admin for final decision.")}
                disabled={actionLoading}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs py-3.5 shadow flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
              >
                ✓ Verify Field & Submit to Admin
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ReviewParam({ icon: Icon, label, val }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <Icon size={16} className="text-slate-500 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{val}</p>
      </div>
    </div>
  );
}

function Loader2({ size, className }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      style={{ width: size, height: size }}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default OfficerReviewPage;
