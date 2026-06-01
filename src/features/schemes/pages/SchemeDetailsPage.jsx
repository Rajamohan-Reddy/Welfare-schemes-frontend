import { useEffect, useState } from "react";

import {
  Calendar,
  Building2,
  Wallet,
  FileText,
  Users,
  ArrowRight,
  Loader2,
  BadgeCheck,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { getSchemeByIdApi } from "../api/schemes.api";

function SchemeDetailsPage() {
  const { schemeId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [scheme, setScheme] = useState(null);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);

        const response = await getSchemeByIdApi(schemeId);
        setScheme(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [schemeId]);

  if (loading) {
    return (
      <div
        className="
          flex
          h-[70vh]
          items-center
          justify-center
        "
      >
        <Loader2
          className="
            animate-spin
            text-blue-600
          "
          size={42}
        />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div
        className="
          rounded-3xl
          bg-white
          p-10
          text-center
        "
      >
        Scheme not found
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl ring-1 ring-white/10">
        <div
          className="
            absolute
            -right-16
            -top-16
            h-72
            w-72
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-sm text-sky-200">
            <BadgeCheck size={16} />
            Government Welfare Scheme
          </div>

          <h1
            className="
              mt-5
              text-5xl
              font-extrabold
              leading-tight
            "
          >
            {scheme.schemeName}
          </h1>

          <p
            className="
              mt-4
              max-w-3xl
              text-lg
              text-blue-100
            "
          >
            {scheme.description}
          </p>

          <button
            onClick={() => navigate(`/citizen/apply/${scheme._id}`)}
            className="mt-8 inline-flex items-center gap-2 rounded-3xl bg-white px-6 py-4 font-semibold text-[#071A52] shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
          >
            Apply Now
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* HIGHLIGHTS */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        <InfoCard
          icon={Wallet}
          title="Benefit Amount"
          value={`₹ ${scheme.benefitAmount || 0}`}
        />

        <InfoCard
          icon={Building2}
          title="Department"
          value={scheme.department}
        />

        <InfoCard
          icon={Users}
          title="Benefit Type"
          value={scheme.benefitType}
        />

        <InfoCard
          icon={Calendar}
          title="Status"
          value={scheme.isActive ? "Active" : "Inactive"}
        />
      </div>

      {/* DETAILS */}

      <div
        className="
          grid
          gap-8
          lg:grid-cols-3
        "
      >
        {/* LEFT */}

        <div className="lg:col-span-2">
          <div
            className="
              rounded-[32px]
              bg-white
              p-8
              shadow-sm
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
              "
            >
              Scheme Overview
            </h2>

            <p
              className="
                mt-5
                leading-8
                text-slate-600
              "
            >
              {scheme.description}
            </p>
          </div>

          {/* ELIGIBILITY */}

          <div className="mt-8 rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200/80">
            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Eligibility Criteria
            </h2>

            <div
              className="
                mt-6
                grid
                gap-4
                md:grid-cols-2
              "
            >
              <EligibilityCard
                label="Minimum Age"
                value={scheme.eligibility?.minAge || "-"}
              />

              <EligibilityCard
                label="Maximum Age"
                value={scheme.eligibility?.maxAge || "-"}
              />

              <EligibilityCard
                label="Income Limit"
                value={
                  scheme.eligibility?.maxAnnualIncome
                    ? `₹ ${scheme.eligibility.maxAnnualIncome}`
                    : "-"
                }
              />

              <EligibilityCard
                label="Gender"
                value={scheme.eligibility?.gender?.join(", ") || "All"}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div>
          <div
            className="
              rounded-[32px]
              bg-white
              p-8
              shadow-sm
            "
          >
            <h2
              className="
                text-xl
                font-bold
              "
            >
              Required Documents
            </h2>

            <div className="mt-5 space-y-3">
              {scheme.requiredDocuments?.map((doc) => (
                <div
                  key={doc}
                  className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      bg-slate-50
                      p-4
                    "
                >
                  <FileText size={18} />

                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[32px] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="font-bold text-slate-900">Application Period</h3>

            <p className="mt-3 text-sm text-blue-700">
              Start: {new Date(scheme.startDate).toLocaleDateString()}
            </p>

            <p className="mt-1 text-sm text-blue-700">
              End: {new Date(scheme.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
      <div className="inline-flex rounded-3xl bg-slate-100 p-3 text-slate-900">
        <Icon size={20} />
      </div>

      <p
        className="
          mt-4
          text-sm
          text-slate-500
        "
      >
        {title}
      </p>

      <h3
        className="
          mt-1
          text-lg
          font-bold
          text-slate-900
        "
      >
        {value}
      </h3>
    </div>
  );
}

function EligibilityCard({ label, value }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        p-4
      "
    >
      <p
        className="
          text-sm
          text-slate-500
        "
      >
        {label}
      </p>

      <h4
        className="
          mt-1
          font-semibold
        "
      >
        {value}
      </h4>
    </div>
  );
}

export default SchemeDetailsPage;
