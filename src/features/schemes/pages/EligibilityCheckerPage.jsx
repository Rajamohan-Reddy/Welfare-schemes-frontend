import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  XCircle,
  Search,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Wallet,
  HeartPulse,
  Home,
  Sprout,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { getAllSchemesApi } from "../api/schemes.api";

const categoryIcons = {
  EDUCATION: GraduationCap,
  AGRICULTURE: Sprout,
  HEALTH: HeartPulse,
  HOUSING: Home,
  PENSION: Wallet,
};

function EligibilityCheckerPage() {
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    age: "",

    gender: "",

    caste: "",

    annualIncome: "",

    student: false,

    farmer: false,

    widow: false,

    disabled: false,
  });

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const response = await getAllSchemesApi();

      setSchemes(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const eligibleSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const eligibility = scheme.eligibility || {};

      if (eligibility.minAge && Number(form.age) < eligibility.minAge) {
        return false;
      }

      if (eligibility.maxAge && Number(form.age) > eligibility.maxAge) {
        return false;
      }

      if (
        eligibility.maxAnnualIncome &&
        Number(form.annualIncome) > eligibility.maxAnnualIncome
      ) {
        return false;
      }

      if (
        eligibility.gender?.length > 0 &&
        !eligibility.gender.includes(form.gender)
      ) {
        return false;
      }

      if (
        eligibility.casteCategories?.length > 0 &&
        !eligibility.casteCategories.includes(form.caste)
      ) {
        return false;
      }

      if (eligibility.studentRequired && !form.student) {
        return false;
      }

      if (eligibility.farmerRequired && !form.farmer) {
        return false;
      }

      if (eligibility.widowRequired && !form.widow) {
        return false;
      }

      if (eligibility.disabledRequired && !form.disabled) {
        return false;
      }

      return true;
    });
  }, [schemes, form]);

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
          via-[#12307A]
          to-[#2563EB]
          p-8
          text-white
        "
      >
        <div
          className="
            absolute
            -right-10
            -top-10
            h-72
            w-72
            rounded-full
            bg-white/10
            blur-3xl
          "
        />

        <div className="relative z-10">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white/10
              px-4
              py-2
            "
          >
            <Sparkles size={14} />
            Smart Eligibility Check
          </div>

          <h1
            className="
              mt-5
              text-5xl
              font-extrabold
            "
          >
            Find Schemes You Can Apply For
          </h1>

          <p
            className="
              mt-4
              max-w-2xl
              text-blue-100
            "
          >
            Enter your details and instantly discover welfare schemes matching
            your profile.
          </p>
        </div>
      </section>

      <div
        className="
          grid
          gap-8
          lg:grid-cols-[420px_1fr]
        "
      >
        {/* LEFT PANEL */}

        <div
          className="
            rounded-[32px]
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="flex items-center gap-2">
            <Search size={20} className="text-blue-600" />

            <h2
              className="
                text-xl
                font-bold
              "
            >
              Eligibility Details
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <InputField
              label="Age"
              type="number"
              value={form.age}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  age: value,
                }))
              }
            />

            <SelectField
              label="Gender"
              value={form.gender}
              options={["MALE", "FEMALE", "OTHER"]}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  gender: value,
                }))
              }
            />

            <SelectField
              label="Caste"
              value={form.caste}
              options={["OC", "BC", "SC", "ST", "EWS"]}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  caste: value,
                }))
              }
            />

            <InputField
              label="Annual Income"
              type="number"
              value={form.annualIncome}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  annualIncome: value,
                }))
              }
            />

            <CheckboxField
              label="Student"
              checked={form.student}
              onChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  student: checked,
                }))
              }
            />

            <CheckboxField
              label="Farmer"
              checked={form.farmer}
              onChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  farmer: checked,
                }))
              }
            />

            <CheckboxField
              label="Widow"
              checked={form.widow}
              onChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  widow: checked,
                }))
              }
            />

            <CheckboxField
              label="Disabled"
              checked={form.disabled}
              onChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  disabled: checked,
                }))
              }
            />
          </div>
        </div>

        {/* RESULTS */}

        <div>
          <div
            className="
              mb-5
              flex
              items-center
              justify-between
            "
          >
            <h2
              className="
                text-2xl
                font-bold
              "
            >
              Eligible Schemes
            </h2>

            <div
              className="
                rounded-full
                bg-blue-100
                px-4
                py-2
                text-sm
                font-semibold
                text-blue-700
              "
            >
              {eligibleSchemes.length} Found
            </div>
          </div>

          {loading ? (
            <div
              className="
                rounded-[32px]
                bg-white
                p-12
                text-center
              "
            >
              Loading...
            </div>
          ) : eligibleSchemes.length === 0 ? (
            <div
              className="
                rounded-[32px]
                bg-white
                p-12
                text-center
                shadow-sm
              "
            >
              <XCircle
                size={50}
                className="
                  mx-auto
                  text-red-400
                "
              />

              <h3
                className="
                  mt-5
                  text-xl
                  font-bold
                "
              >
                No Matching Schemes
              </h3>

              <p className="mt-2 text-slate-500">Try updating your details.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {eligibleSchemes.map((scheme) => {
                const Icon =
                  categoryIcons[scheme?.categoryId?.categoryCode] || Wallet;

                return (
                  <div
                    key={scheme._id}
                    className="
                        rounded-[32px]
                        bg-white
                        p-6
                        shadow-sm
                        transition-all
                        hover:shadow-lg
                      "
                  >
                    <div
                      className="
                          flex
                          items-start
                          justify-between
                        "
                    >
                      <div
                        className="
                            flex
                            gap-4
                          "
                      >
                        <div
                          className="
                              rounded-2xl
                              bg-blue-50
                              p-3
                              text-blue-700
                            "
                        >
                          <Icon size={22} />
                        </div>

                        <div>
                          <h3
                            className="
                                text-xl
                                font-bold
                              "
                          >
                            {scheme.schemeName}
                          </h3>

                          <p
                            className="
                                mt-2
                                text-slate-500
                              "
                          >
                            {scheme.department}
                          </p>
                        </div>
                      </div>

                      <CheckCircle2
                        className="
                            text-green-500
                          "
                        size={28}
                      />
                    </div>

                    <div
                      className="
                          mt-5
                          grid
                          gap-4
                          md:grid-cols-3
                        "
                    >
                      <MiniInfo
                        label="Benefit"
                        value={`₹ ${scheme.benefitAmount}`}
                      />

                      <MiniInfo label="Type" value={scheme.benefitType} />

                      <MiniInfo
                        label="Category"
                        value={scheme?.categoryId?.categoryName}
                      />
                    </div>

                    <button
                      onClick={() => navigate(`/citizen/schemes/${scheme._id}`)}
                      className="
                          mt-6
                          flex
                          items-center
                          gap-2
                          font-semibold
                          text-blue-700
                        "
                    >
                      View Scheme
                      <ArrowRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div
      className="
        rounded-2xl
        bg-slate-50
        p-4
      "
    >
      <p
        className="
          text-xs
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

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-slate-200
          px-4
          outline-none
        "
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-sm
          font-medium
        "
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-slate-200
          px-4
          outline-none
        "
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-200
        p-4
      "
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <span>{label}</span>
    </label>
  );
}

export default EligibilityCheckerPage;
