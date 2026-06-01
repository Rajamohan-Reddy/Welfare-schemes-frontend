import { useEffect, useState } from "react";

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
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";

import { getApplicationByIdApi } from "../api/applications.api";

function ApplicationTrackingPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);

  const API_BASE_URL = "http://localhost:5000";

  const loadApplication = async () => {
    try {
      setLoading(true);

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
        <Loader2 size={42} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center">
        Application not found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[40px]
          bg-gradient-to-r
          from-[#071A52]
          via-[#0F4C81]
          to-[#2563EB]
          p-8
          text-white
          shadow-xl
        "
      >
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <button
            onClick={() => navigate("/citizen/applications")}
            className="
              mb-6
              flex
              items-center
              gap-2
              rounded-xl
              bg-white/10
              px-4
              py-2
              backdrop-blur-md
              transition
              hover:bg-white/20
            "
          >
            <ArrowLeft size={18} />
            Back to Applications
          </button>

          <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.28em] text-sky-200">
                Citizen Application Tracking
              </div>

              <h1 className="mt-5 text-5xl font-extrabold tracking-tight">
                {application.applicationNumber}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-200">
                Keep an eye on every verification milestone and approval update in a polished enterprise-ready tracker.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-100 shadow-xl ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Submitted</p>
                  <p className="mt-2 text-lg font-semibold">{new Date(application.submittedAt).toLocaleDateString()}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-100 shadow-xl ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Last updated</p>
                  <p className="mt-2 text-lg font-semibold">
                    {new Date(application.updatedAt || application.approvedAt || application.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white/5 p-5 shadow-inner ring-1 ring-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Processing progress
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">{progress}%</p>
                </div>
                <button
                  type="button"
                  onClick={loadApplication}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                >
                  Refresh
                </button>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 rounded-full bg-slate-950/80 px-4 py-2 text-sm font-semibold text-slate-100">
                {application.status.replaceAll("_", " ")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUMMARY */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="Application Number"
          value={application.applicationNumber}
        />

        <InfoCard title="Scheme" value={application.schemeId?.schemeName} />

        <InfoCard
          title="Current Status"
          value={application.status.replaceAll("_", " ")}
          success
        />

        <InfoCard
          title="Submitted"
          value={new Date(application.submittedAt).toLocaleDateString()}
        />
      </div>

      {/* STATUS + HEALTH */}

      <div className="grid gap-6 xl:grid-cols-2">
        <div
          className="
            rounded-[32px]
            border
            border-blue-100
            bg-gradient-to-r
            from-blue-50
            to-white
            p-6
          "
        >
          <div className="flex items-center gap-4">
            <Clock3 size={28} className="text-blue-600" />

            <div>
              <h2 className="text-xl font-bold">Current Status</h2>

              <p className="mt-1 text-slate-600">
                {application.status.replaceAll("_", " ")}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-green-600" />

            <h2 className="text-xl font-bold">Application Health</h2>
          </div>

          <div className="mt-6 space-y-4">
            <HealthItem text="Application Submitted" success />

            <HealthItem text="Documents Uploaded" success />

            <HealthItem text="Under Government Review" pending />
          </div>
        </div>
      </div>

      {/* TIMELINE */}

      <div className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Application Journey</h2>
            <p className="mt-2 text-sm text-slate-500">
              Track each verification and approval milestone with crisp progress markers.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-slate-900">
            <ShieldCheck size={16} className="text-sky-600" />
            Verified by Government
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {statusSteps.map((step, index) => (
            <TimelineItem
              key={step}
              title={step}
              completed={index <= currentStep}
              current={index === currentStep}
              last={index === statusSteps.length - 1}
            />
          ))}
        </div>
      </div>

      {/* DOCUMENTS */}

      <div className="rounded-[32px] bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <FileCheck size={24} className="text-blue-600" />

          <h2 className="text-2xl font-bold">Uploaded Documents</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {application.documents?.map((document, index) => (
            <div
              key={index}
              className="
                  rounded-3xl
                  border
                  border-slate-200
                  bg-gradient-to-br
                  from-white
                  to-slate-50
                  p-5
                "
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold">{document.documentType}</h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Uploaded Successfully
                  </p>
                </div>

                <BadgeCheck className="text-green-500" size={22} />
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() =>
                    window.open(`${API_BASE_URL}/${document.fileUrl}`, "_blank")
                  }
                  className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-blue-50
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-blue-700
                    "
                >
                  <Eye size={16} />
                  Preview
                </button>

                <a
                  href={`${API_BASE_URL}/${document.fileUrl}`}
                  download
                  className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-green-50
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      text-green-700
                    "
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REMARKS */}

      {(application.officerRemarks || application.applicantRemarks) && (
        <div className="rounded-[32px] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Remarks</h2>

          {application.applicantRemarks && (
            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <h4 className="font-semibold">Applicant Remarks</h4>

              <p className="mt-2 text-slate-600">
                {application.applicantRemarks}
              </p>
            </div>
          )}

          {application.officerRemarks && (
            <div className="mt-5 rounded-2xl bg-blue-50 p-5">
              <h4 className="font-semibold">Officer Remarks</h4>

              <p className="mt-2 text-slate-600">
                {application.officerRemarks}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUPPORT */}

      <div
        className="
          rounded-[32px]
          bg-gradient-to-r
          from-slate-900
          to-slate-800
          p-8
          text-white
        "
      >
        <div className="flex items-center gap-3">
          <MessageSquareMore size={24} />
          <h2 className="text-2xl font-bold">Need Assistance?</h2>
        </div>

        <p className="mt-4 text-slate-300">
          Contact AP Welfare Citizen Support.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-400">Helpline</p>
            <h3 className="font-bold">1902</h3>
          </div>

          <div>
            <p className="text-sm text-slate-400">Email</p>
            <h3 className="font-bold">support@apwelfare.gov.in</h3>
          </div>

          <div>
            <p className="text-sm text-slate-400">Service Window</p>
            <h3 className="font-bold">Mon - Sat</h3>
          </div>
        </div>
      </div>

      {/* REJECTED */}

      {application.status === "REJECTED" && (
        <div className="rounded-[32px] border border-red-200 bg-red-50 p-8">
          <div className="flex gap-3">
            <XCircle size={22} className="text-red-600" />

            <div>
              <h3 className="font-bold text-red-700">Application Rejected</h3>

              <p className="mt-2 text-red-600">{application.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 font-bold text-slate-900">{value}</h3>
    </div>
  );
}

function HealthItem({ text, success, pending }) {
  return (
    <div className="flex items-center gap-3">
      {success ? (
        <CheckCircle2 size={18} className="text-green-500" />
      ) : (
        <Clock3 size={18} className="text-amber-500" />
      )}

      <span>{text}</span>
    </div>
  );
}

function TimelineItem({ title, completed, current, last }) {
  const Icon = completed ? CheckCircle2 : current ? ShieldCheck : Wallet;

  return (
    <div className="relative flex gap-5 pb-10">
      {!last && (
        <div
          className="
            absolute
            left-[18px]
            top-10
            h-full
            w-[2px]
            bg-slate-200
          "
        />
      )}

      <div
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          ${
            completed
              ? "bg-green-500 text-white"
              : current
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-500"
          }
        `}
      >
        <Icon size={18} />
      </div>

      <div>
        <h3 className="font-semibold">{title.replaceAll("_", " ")}</h3>
      </div>
    </div>
  );
}

export default ApplicationTrackingPage;
