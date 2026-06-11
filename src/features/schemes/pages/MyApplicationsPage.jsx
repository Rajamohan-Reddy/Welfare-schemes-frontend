import { useMemo, useState } from "react";

import {
  FileText,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
  ShieldCheck,
  Search,
  Layers3,
  CalendarDays,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useGetMyApplicationsQuery } from "../../../store/services/applications.api";
import {
  getApplicationProgress,
  getStageLabel,
  normalizeApplicationStatus,
} from "../../../utils/applicationStatus";

function MyApplicationsPage() {
  const navigate = useNavigate();
  const { data: applications = [], isLoading: loading } =
    useGetMyApplicationsQuery();
  const [search, setSearch] = useState("");

  const getStatusConfig = (status) => {
    const normalized = normalizeApplicationStatus(status);
    const progress = getApplicationProgress(status);
    const label = getStageLabel(status);

    switch (normalized) {
      case "SUBMITTED":
        return {
          color: "from-amber-400 to-amber-500",
          badge: "bg-amber-50 text-amber-700 border border-amber-200",
          icon: Clock3,
          progress,
          label,
        };

      case "DOCUMENT_VERIFIED":
        return {
          color: "from-sky-500 to-sky-600",
          badge: "bg-sky-50 text-sky-700 border border-sky-200",
          icon: ShieldCheck,
          progress,
          label,
        };

      case "FIELD_VERIFIED":
        return {
          color: "from-violet-500 to-violet-600",
          badge: "bg-violet-50 text-violet-700 border border-violet-200",
          icon: ShieldCheck,
          progress,
          label,
        };

      case "APPROVED":
        return {
          color: "from-emerald-500 to-green-600",
          badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
          icon: CheckCircle2,
          progress,
          label,
        };

      case "PAID":
        return {
          color: "from-teal-500 to-emerald-600",
          badge: "bg-teal-50 text-teal-700 border border-teal-200",
          icon: CheckCircle2,
          progress,
          label,
        };

      case "REJECTED":
        return {
          color: "from-rose-500 to-rose-600",
          badge: "bg-rose-50 text-rose-700 border border-rose-200",
          icon: XCircle,
          progress,
          label,
        };

      default:
        return {
          color: "from-slate-400 to-slate-500",
          badge: "bg-slate-100 text-slate-600 border border-slate-200",
          icon: Clock3,
          progress,
          label,
        };
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = `${application.applicationNumber}
         ${application?.schemeId?.schemeName || ""}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const approvedCount = applications.filter(
    (app) => app.status === "APPROVED",
  ).length;

  const verificationCount = applications.filter(
    (app) => app.status === "UNDER_VERIFICATION",
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "REJECTED",
  ).length;

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 size={42} className="animate-spin text-blue-600" />
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
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div
            className="
              inline-flex
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              backdrop-blur-md
            "
          >
            Citizen Services Portal
          </div>

          <h1 className="mt-5 text-5xl font-extrabold">My Applications</h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Track every welfare scheme application submitted through the portal
            and monitor verification, approval, and benefit disbursement
            progress.
          </p>
        </div>
      </section>

      {/* STATS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={applications.length}
          icon={Layers3}
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle2}
          success
        />

        <StatCard
          title="Under Review"
          value={verificationCount}
          icon={ShieldCheck}
          warning
        />

        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={XCircle}
          danger
        />
      </div>

      {/* SEARCH */}

      <div
        className="
          rounded-[32px]
          border
          border-white/40
          bg-white/80
          p-5
          backdrop-blur-xl
          shadow-sm
        "
      >
        <div className="relative">
          <Search
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search by application number or scheme name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-white
              py-4
              pl-12
              pr-4
              outline-none
              focus:border-blue-500
            "
          />
        </div>
      </div>

      {/* EMPTY */}

      {filteredApplications.length === 0 ? (
        <div
          className="
            rounded-[36px]
            bg-white
            p-14
            text-center
            shadow-sm
          "
        >
          <FileText
            size={64}
            className="
              mx-auto
              text-slate-300
            "
          />

          <h2 className="mt-6 text-2xl font-bold">No Applications Found</h2>

          <p className="mt-3 text-slate-500">
            You have not submitted any welfare scheme applications.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => {
            const config = getStatusConfig(application.status);

            return (
              <div
                key={application._id}
                className="
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-100
        bg-white
        p-7
        shadow-[0_10px_40px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
              >
                {/* Premium Glow */}

                <div
                  className="
          absolute
          right-0
          top-0
          h-40
          w-40
          rounded-full
          bg-slate-50
          blur-3xl
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
                />

                <div className="relative z-10">
                  <div
                    className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
                  >
                    {/* LEFT */}

                    <div className="flex gap-4">
                      <div
                        className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-slate-100
                text-slate-700
              "
                      >
                        <FileText size={20} />
                      </div>

                      <div>
                        <p
                          className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-400
                "
                        >
                          Application Number
                        </p>

                        <h3
                          className="
                  mt-1
                  font-mono
                  text-lg
                  font-bold
                  tracking-wide
                  text-slate-900
                "
                        >
                          {application.applicationNumber}
                        </h3>

                        <h2
                          className="
                  mt-3
                  text-xl
                  font-bold
                  text-slate-900
                "
                        >
                          {application?.schemeId?.schemeName}
                        </h2>

                        <div
                          className="
                  mt-3
                  flex
                  items-center
                  gap-2
                "
                        >
                          <div
                            className="
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-500
                  "
                          />

                          <span
                            className="
                    text-sm
                    text-slate-500
                  "
                          >
                            Government Service Request
                          </span>
                        </div>

                        <div
                          className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-500
                "
                        >
                          <CalendarDays size={14} />
                          Submitted on{" "}
                          {new Date(
                            application.submittedAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}

                    <div className="w-full max-w-xs">
                      <div className="flex items-center justify-between">
                        <span
                          className={`
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  shadow-sm
                  ${config.badge}
                `}
                        >
                          {application.status.replaceAll("_", " ")}
                        </span>

                        <span
                          className="
                  text-sm
                  font-medium
                  text-slate-500
                "
                        >
                          {config.progress}%
                        </span>
                      </div>

                      <div
                        className="
                mt-4
                h-2.5
                overflow-hidden
                rounded-full
                bg-slate-100
                shadow-inner
              "
                      >
                        <div
                          className="
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#D4AF37]
                  via-[#FDE68A]
                  to-[#F59E0B]
                  shadow-[0_0_20px_rgba(212,175,55,0.2)]
                "
                          style={{
                            width: `${config.progress}%`,
                          }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>{config.label || application.status.replaceAll("_", " ")}</span>
                        <span>{config.progress}% complete</span>
                      </div>

                      <div className="mt-5 flex justify-end">
                        <button
                          onClick={() =>
                            navigate(`/citizen/tracking/${application._id}`)
                          }
                          className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  transition-all
                  hover:bg-slate-800
                "
                        >
                          Track
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, success, warning, danger }) {
  let iconBg = "bg-gradient-to-r from-blue-600 to-indigo-600";

  if (success) {
    iconBg = "bg-gradient-to-r from-emerald-500 to-green-600";
  }

  if (warning) {
    iconBg = "bg-gradient-to-r from-amber-500 to-orange-500";
  }

  if (danger) {
    iconBg = "bg-gradient-to-r from-red-500 to-rose-600";
  }

  return (
    <div
      className="
        rounded-[32px]
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="mt-3 text-4xl font-bold">{value}</h3>
        </div>

        <div
          className={`
            rounded-2xl
            p-4
            text-white
            ${iconBg}
          `}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default MyApplicationsPage;
