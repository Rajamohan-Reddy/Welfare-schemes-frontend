import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, CheckCircle2, FileText, UploadCloud, FileCheck, ArrowLeft, Landmark, User, MapPin, Briefcase } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import { useGetSchemeByIdQuery } from "../../../store/services/schemes.api";
import { useUploadFileMutation } from "../../../store/services/upload.api";
import { useApplySchemeMutation } from "../../../store/services/applications.api";

function ApplySchemePage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const { data: scheme, isLoading: loading } = useGetSchemeByIdQuery(schemeId);
  const [uploadFile] = useUploadFileMutation();
  const [applyScheme, { isLoading: submitting }] = useApplySchemeMutation();

  const [remarks, setRemarks] = useState("");
  const [formData, setFormData] = useState({
    occupation: "",
    annualIncome: "",
    district: "",
    village: "",
  });
  const [documents, setDocuments] = useState([]);
  const [errors, setErrors] = useState({});

  const handleDocumentUpload = async (file, documentType) => {
    try {
      const uploaded = await uploadFile({ file, documentType }).unwrap();
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
    } else if (!/^\d{3,10}$/.test(formData.annualIncome.trim())) {
      nextErrors.annualIncome = "Enter a valid income amount (numbers only).";
    }

    if (!formData.district?.trim()) {
      nextErrors.district = "District is required.";
    }

    if (!formData.village?.trim()) {
      nextErrors.village = "Village or ward locality is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please complete all highlighted fields correctly.");
      return;
    }

    const requiredDocuments = scheme?.requiredDocuments || [];
    const missing = requiredDocuments.filter(
      (document) => !documents.some((item) => item.documentType === document),
    );

    if (missing.length > 0) {
      toast.error(`Mandatory files missing: ${missing.join(", ")}`);
      return;
    }

    try {
      const payload = {
        schemeId,
        documents,
        dynamicFormData: formData,
        applicantRemarks: remarks,
      };

      const response = await applyScheme(payload).unwrap();
      const applicationId = response?._id ?? response?.data?._id;

      if (!applicationId) {
        toast.error("Application submitted, but no tracking ID returned.");
        return;
      }

      toast.success("Application submitted successfully");
      navigate(`/citizen/tracking/${applicationId}`);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Unable to submit application");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-blue-600" />
          <p className="text-xs font-semibold text-slate-400">Loading Application Desk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Back button */}
      <button
        onClick={() => navigate(`/citizen/schemes/${schemeId}`)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 px-4.5 py-2 text-xs font-bold text-slate-700 transition"
      >
        <ArrowLeft size={14} /> Back to Details
      </button>

      {/* Header Info Cover */}
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#071A52] via-[#0B256B] to-[#2563EB] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border border-white/20 bg-white/10 tracking-wider">
            <CheckCircle2 size={12} className="text-[#FFD95A]" /> SECURE APPLICATION DESK
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Apply: {scheme?.schemeName}
          </h1>
          <p className="text-sm leading-relaxed text-blue-100/90 max-w-xl">
            Please fill out the following parameters correctly. Double check and verify your answers before submission.
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Left Side Form Fields */}
        <div className="space-y-8">
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-[#071A52]">Applicant Parameters</h2>
              <p className="text-xs text-slate-400 mt-0.5">Contact, income, and geographical boundaries.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Occupation"
                icon={Briefcase}
                error={errors.occupation}
                placeholder="e.g. Small Farmer, Shop owner"
                value={formData.occupation}
                onChange={(val) => setFormData((prev) => ({ ...prev, occupation: val }))}
              />
              <InputField
                label="Annual Income"
                type="number"
                icon={Landmark}
                error={errors.annualIncome}
                placeholder="e.g. 180000"
                value={formData.annualIncome}
                onChange={(val) => setFormData((prev) => ({ ...prev, annualIncome: val }))}
              />
              <InputField
                label="District"
                icon={MapPin}
                error={errors.district}
                placeholder="e.g. Guntur, Krishna"
                value={formData.district}
                onChange={(val) => setFormData((prev) => ({ ...prev, district: val }))}
              />
              <InputField
                label="Village / Locality"
                icon={MapPin}
                error={errors.village}
                placeholder="e.g. Tenali"
                value={formData.village}
                onChange={(val) => setFormData((prev) => ({ ...prev, village: val }))}
              />
            </div>
          </Card>

          {/* Upload Documents Section */}
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-[#071A52]">Upload Documents</h2>
              <p className="text-xs text-slate-400 mt-0.5">Please upload clean, legible copy to verify parameters.</p>
            </div>

            <div className="space-y-4">
              {scheme?.requiredDocuments?.map((document) => {
                const isUploaded = documents.some((item) => item.documentType === document);
                return (
                  <DocumentUploader
                    key={document}
                    documentType={document}
                    uploaded={isUploaded}
                    onUpload={handleDocumentUpload}
                  />
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side Info & Remarks */}
        <div className="space-y-6">
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-5">
            <h3 className="text-lg font-black text-[#071A52]">Additional Remarks</h3>
            <p className="text-xs text-slate-400 leading-normal">
              State any additional contexts or remarks matches your eligibility verification.
            </p>
            <textarea
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white placeholder:text-slate-400"
              placeholder="Provide context remarks (optional)..."
            />
          </Card>

          {/* Submission Card */}
          <Card className="rounded-[36px] border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-4">
            <h3 className="text-lg font-black text-[#071A52]">Commit Application</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Clicking commit validates all fields and logs your files into the officer queue pipelines.
            </p>

            <Button
              onClick={handleSubmit}
              loading={submitting}
              className="w-full rounded-full bg-[#071A52] hover:bg-blue-900 text-white font-extrabold text-xs py-4 shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? "Committing File..." : "Commit Application"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", error, icon: Icon, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</label>
      <div className={`relative flex items-center bg-slate-50 border rounded-2xl px-3.5 py-2.5 transition ${
        error ? "border-rose-500 focus-within:border-rose-500 bg-rose-50/20" : "border-slate-200 focus-within:border-blue-500 focus-within:bg-white"
      }`}>
        <Icon size={16} className="text-slate-400 shrink-0 mr-2" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
        />
      </div>
      {error && <p className="text-[11px] font-semibold text-rose-500 mt-0.5">{error}</p>}
    </div>
  );
}

function DocumentUploader({ documentType, onUpload, uploaded }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null); // base64 or "pdf"
  const [fileName, setFileName] = useState("");

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    // Generate preview
    if (file.type === "application/pdf") {
      setPreview("pdf");
    } else if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(file);
    }

    try {
      setUploading(true);
      await onUpload(file, documentType);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`rounded-2xl border transition ${
      uploaded ? "border-emerald-200 bg-emerald-50/30" : "border-slate-200 bg-slate-50/30"
    }`}>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex gap-3 items-center min-w-0">
          {/* Preview Box */}
          <div className={`h-12 w-12 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden ${
            uploaded
              ? "border-emerald-100 bg-emerald-50"
              : "border-slate-200 bg-slate-100"
          }`}>
            {preview && preview !== "pdf" ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : preview === "pdf" ? (
              <div className="flex flex-col items-center justify-center">
                <FileCheck size={18} className="text-rose-500" />
                <span className="text-[7px] font-black text-rose-500 mt-0.5">PDF</span>
              </div>
            ) : uploaded ? (
              <FileCheck size={18} className="text-emerald-600" />
            ) : (
              <FileText size={18} className="text-slate-400" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#071A52] truncate">{documentType}</p>
            {fileName ? (
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5 truncate max-w-[160px]">{fileName}</p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPEG, or PNG · max 5 MB</p>
            )}
          </div>
        </div>

        <label className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold shrink-0 transition ${
          uploaded
            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
        }`}>
          {uploading ? "Uploading…" : uploaded ? "Replace" : "Choose File"}
          <input type="file" hidden accept="image/*,application/pdf" onChange={handleChange} />
        </label>
      </div>
    </div>
  );
}

export default ApplySchemePage;
