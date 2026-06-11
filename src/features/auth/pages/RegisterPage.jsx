import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useRegisterMutation } from "../../../store/services/auth.api";

const passwordStrength = (pw) => {
  if (!pw) return null;
  if (pw.length < 8)
    return { label: "Too short", color: "bg-rose-500", width: "w-1/4" };
  if (pw.length < 10 || !/[A-Z]/.test(pw))
    return { label: "Weak", color: "bg-orange-400", width: "w-2/4" };
  if (!/[^a-zA-Z0-9]/.test(pw))
    return { label: "Good", color: "bg-yellow-400", width: "w-3/4" };
  return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
};

function FieldGroup({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
          <span className="h-1 w-1 rounded-full bg-rose-500 inline-block" />{" "}
          {error}
        </p>
      )}
    </div>
  );
}

function InputWrap({ error, icon: Icon, children, className = "" }) {
  return (
    <div
      className={`group relative flex items-center rounded-2xl border px-4 py-3 transition-all duration-200 ${
        error
          ? "border-rose-400 bg-rose-50/30 shadow-[0_0_0_3px_rgba(244,63,94,0.08)]"
          : "border-slate-200 bg-slate-50/70 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
      } ${className}`}
    >
      {Icon && (
        <Icon
          size={15}
          className="shrink-0 text-slate-400 group-focus-within:text-blue-500 transition mr-3"
        />
      )}
      {children}
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading: loading }] = useRegisterMutation();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 2-step registration

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep1 = () => {
    const nextErrors = {};
    if (!form.firstName.trim())
      nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!form.email.trim()) nextErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Enter a valid email address.";
    if (!form.phoneNumber.trim())
      nextErrors.phoneNumber = "Phone number is required.";
    // Backend expects exactly 10 digits for phone number
    else if (!/^\d{10}$/.test(form.phoneNumber))
      nextErrors.phoneNumber = "Enter a valid 10-digit mobile number.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/;
    if (!form.password) nextErrors.password = "Password is required.";
    else if (!passwordRegex.test(form.password))
      nextErrors.password =
        "Password must be 8-20 chars and include uppercase, lowercase, number and special character.";
    if (form.password !== form.confirmPassword)
      nextErrors.confirmPassword = "Passwords must match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setErrors({});
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      }).unwrap();
      toast.success("Account registered successfully!");
      navigate("/login");
    } catch (error) {
      const resp = error?.data;
      // If backend returned validation errors array, surface them and attach to fields when possible
      if (resp?.errors && Array.isArray(resp.errors) && resp.errors.length) {
        toast.error(resp.errors.join("; "));
        const fieldErrs = {};
        resp.errors.forEach((m) => {
          const msg = String(m || "");
          const lower = msg.toLowerCase();
          if (lower.includes("first name")) fieldErrs.firstName = msg;
          else if (lower.includes("last name")) fieldErrs.lastName = msg;
          else if (lower.includes("email")) fieldErrs.email = msg;
          else if (lower.includes("phone")) fieldErrs.phoneNumber = msg;
          else if (lower.includes("password")) fieldErrs.password = msg;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrs }));
      } else if (resp?.message) {
        toast.error(resp.message);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="w-full max-w-[440px]">
      {/* Header */}
      <div className="mb-7 space-y-2">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black transition-all duration-300 ${
                  s < step
                    ? "bg-emerald-500 text-white"
                    : s === step
                      ? "bg-[#071A52] text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {s < step ? <CheckCircle size={12} /> : s}
              </div>
              <span
                className={`text-[10px] font-bold ${s === step ? "text-[#071A52]" : "text-slate-400"}`}
              >
                {s === 1 ? "Identity" : "Security"}
              </span>
              {s < 2 && (
                <div
                  className={`h-px w-8 ${step > s ? "bg-emerald-400" : "bg-slate-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        <h1 className="text-[28px] font-black text-[#071A52] tracking-tight leading-tight">
          {step === 1 ? "Create Your Account" : "Secure Your Account"}
        </h1>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          {step === 1
            ? "Provide details matching your official Aadhaar documents."
            : "Set a strong password to protect your citizen profile."}
        </p>
      </div>

      {/* Step 1 — Identity */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="First Name" error={errors.firstName}>
              <InputWrap error={errors.firstName} icon={User}>
                <input
                  id="reg-firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Ravi"
                  className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none"
                />
              </InputWrap>
            </FieldGroup>

            <FieldGroup label="Last Name" error={errors.lastName}>
              <InputWrap error={errors.lastName} icon={User}>
                <input
                  id="reg-lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Kumar"
                  className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none"
                />
              </InputWrap>
            </FieldGroup>
          </div>

          <FieldGroup label="Email Address" error={errors.email}>
            <InputWrap error={errors.email} icon={Mail}>
              <input
                id="reg-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none"
              />
            </InputWrap>
          </FieldGroup>

          <FieldGroup label="Mobile Number" error={errors.phoneNumber}>
            <InputWrap error={errors.phoneNumber} icon={Phone}>
              <input
                id="reg-phone"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none"
              />
            </InputWrap>
          </FieldGroup>

          <button
            id="reg-next"
            type="submit"
            className="group mt-2 w-full rounded-2xl bg-[#071A52] hover:bg-[#0e2a7d] text-white font-bold text-[14px] py-4 shadow-lg shadow-blue-950/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            Continue to Security
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[13px] text-slate-500">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-800 transition hover:underline"
              >
                Sign In →
              </Link>
            </p>
          </div>
        </form>
      )}

      {/* Step 2 — Security */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldGroup label="Password" error={errors.password}>
            <InputWrap error={errors.password} icon={Lock}>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                autoComplete="new-password"
                className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </InputWrap>

            {/* Strength meter */}
            {strength && (
              <div className="mt-2 space-y-1">
                <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`}
                  />
                </div>
                <p
                  className={`text-[10px] font-bold ${
                    strength.label === "Strong"
                      ? "text-emerald-600"
                      : strength.label === "Good"
                        ? "text-yellow-600"
                        : "text-orange-600"
                  }`}
                >
                  Password strength: {strength.label}
                </p>
              </div>
            )}
          </FieldGroup>

          <FieldGroup label="Confirm Password" error={errors.confirmPassword}>
            <InputWrap error={errors.confirmPassword} icon={Lock}>
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none"
              />
            </InputWrap>
          </FieldGroup>

          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 bg-slate-50/70 border border-slate-200 rounded-2xl px-4 py-3">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            Your data is protected under AP Government Data Privacy Standards
            and never shared with third parties.
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setStep(1);
              }}
              className="w-1/3 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-[13px] py-4 hover:bg-slate-50 transition cursor-pointer"
            >
              ← Back
            </button>
            <button
              id="reg-submit"
              type="submit"
              disabled={loading}
              className="group flex-1 rounded-2xl bg-[#071A52] hover:bg-[#0e2a7d] text-white font-bold text-[14px] py-4 shadow-lg shadow-blue-950/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating
                  Account...
                </>
              ) : (
                <>
                  <CheckCircle size={15} /> Create Account
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default RegisterPage;
