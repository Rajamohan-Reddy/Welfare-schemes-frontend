import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Loader2, CheckCircle2, FileText } from "lucide-react";
import Button from "../../../components/ui/Button";

import { useNavigate, useParams } from "react-router-dom";

import { getSchemeByIdApi } from "../api/schemes.api";

import { uploadFileApi } from "../api/upload.api";

import { applySchemeApi } from "../api/applications.api";

function ApplySchemePage() {
  const { schemeId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [scheme, setScheme] = useState(null);

  const [remarks, setRemarks] = useState("");

  const [formData, setFormData] = useState({});

  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchScheme = async () => {
      try {
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

  const handleDocumentUpload = async (file, documentType) => {
    try {
      const uploaded = await uploadFileApi(file, documentType);
      setDocuments((prev) => [
        ...prev.filter((item) => item.documentType !== documentType),
        uploaded,
      ]);
      toast.success(`${documentType} uploaded successfully`);
    } catch (error) {
      console.error(error);
      toast.error(`Unable to upload ${documentType}`);
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.occupation?.trim()) {
      nextErrors.occupation = "Occupation is required.";
    }

    if (!formData.annualIncome?.trim()) {
      nextErrors.annualIncome = "Annual income is required.";
    } else if (!/^\d{3,15}$/.test(formData.annualIncome.trim())) {
      nextErrors.annualIncome = "Enter a valid income amount.";
    }

    if (!formData.district?.trim()) {
      nextErrors.district = "District is required.";
    }

    if (!formData.village?.trim()) {
      nextErrors.village = "Village is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please resolve the highlighted fields before submitting.");
      return;
    }

    const requiredDocuments = scheme?.requiredDocuments || [];
    const missing = requiredDocuments.filter(
      (document) => !documents.some((item) => item.documentType === document),
    );

    if (missing.length > 0) {
      toast.error(`Please upload: ${missing.join(", ")}`);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        schemeId,
        documents,
        dynamicFormData: formData,
        applicantRemarks: remarks,
      };

      const response = await applySchemeApi(payload);
      const applicationId = response?.data?.data?._id;

      if (!applicationId) {
        toast.error("Application submitted, but no application ID returned.");
        return;
      }

      toast.success("Application submitted successfully");
      navigate(`/citizen/tracking/${applicationId}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Unable to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          size={40}
          className="
            animate-spin
            text-blue-600
          "
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO */}

      <section className="rounded-[36px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-2xl ring-1 ring-white/10">
        <div className="inline-flex items-center rounded-full bg-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-200">
          Apply with confidence
        </div>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight">
          Apply for the {scheme?.schemeName}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
          Complete a refined application form with built-in validations and
          secure document uploads.
        </p>
      </section>

      {/* SCHEME SUMMARY */}

      <div className="rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900">Scheme Details</h2>

        <div
          className="
            mt-5
            grid
            gap-4
            md:grid-cols-3
          "
        >
          <SummaryCard title="Department" value={scheme.department} />

          <SummaryCard title="Benefit Type" value={scheme.benefitType} />

          <SummaryCard
            title="Benefit Amount"
            value={`₹ ${scheme.benefitAmount}`}
          />
        </div>
      </div>

      {/* APPLICATION FORM */}

      <div className="rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900">
          Applicant Information
        </h2>

        <div
          className="
            mt-6
            grid
            gap-5
            md:grid-cols-2
          "
        >
          <InputField
            label="Occupation"
            error={errors.occupation}
            placeholder="e.g. Small business owner"
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                occupation: value,
              }))
            }
          />

          <InputField
            label="Annual Income"
            type="number"
            error={errors.annualIncome}
            placeholder="e.g. 300000"
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                annualIncome: value,
              }))
            }
          />

          <InputField
            label="District"
            error={errors.district}
            placeholder="District name"
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                district: value,
              }))
            }
          />

          <InputField
            label="Village"
            error={errors.village}
            placeholder="Village or locality"
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                village: value,
              }))
            }
          />
        </div>
      </div>

      {/* DOCUMENTS */}

      <div className="rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900">Upload Documents</h2>

        <div className="mt-6 space-y-5">
          {scheme.requiredDocuments?.map((document) => (
            <DocumentUploader
              key={document}
              documentType={document}
              onUpload={handleDocumentUpload}
            />
          ))}
        </div>
      </div>

      {/* REMARKS */}

      <div className="rounded-[28px] bg-white p-6 shadow-xl ring-1 ring-slate-200/80">
        <h2 className="text-xl font-bold text-slate-900">Additional Remarks</h2>

        <textarea
          rows={5}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="mt-5 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder="Enter remarks..."
        />
      </div>

      {/* SUBMIT */}

      <Button
        onClick={handleSubmit}
        loading={submitting}
        variant="primary"
        className="mt-4 inline-flex items-center gap-3 rounded-3xl px-8 py-4 text-lg"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            Submit Application
          </>
        )}
      </Button>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-1 font-semibold">{value}</h3>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", error, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full rounded-2xl border px-4 text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 ${
          error ? "border-rose-500" : "border-slate-200"
        }`}
      />

      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function DocumentUploader({ documentType, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const [uploaded, setUploaded] = useState(false);

  const handleChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      await onUpload(file, documentType);

      setUploaded(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:shadow-lg">
      <div className="flex items-center gap-3">
        <FileText size={18} />

        <div>
          <p className="font-semibold text-slate-900">{documentType}</p>
          <p className="mt-1 text-xs text-slate-500">
            Upload a clear, legible copy to complete your application.
          </p>
        </div>
      </div>

      <label
        className="
          cursor-pointer
          rounded-xl
          bg-slate-100
          px-4
          py-2
        "
      >
        {uploading ? "Uploading..." : uploaded ? "Uploaded" : "Upload"}

        <input type="file" hidden onChange={handleChange} />
      </label>
    </div>
  );
}

export default ApplySchemePage;
