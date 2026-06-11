import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { useLoginMutation } from "../../../store/services/auth.api";
import { useLazyGetMyProfileQuery } from "../../../store/services/profile.api";
import { setCredentials } from "../../../store/slices/auth.slice";
import { ROUTES } from "../../../constants/routes";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading: loading }] = useLoginMutation();
  const [fetchProfile] = useLazyGetMyProfileQuery();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateLogin = () => {
    const nextErrors = {};
    if (!form.identifier.trim())
      nextErrors.identifier = "Email or mobile number is required.";
    if (!form.password) nextErrors.password = "Password is required.";
    else if (form.password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    try {
      const payload = await login(form).unwrap();
      const user = payload?.user ?? payload;

      if (!user?.role) {
        throw new Error("Invalid login response from server");
      }

      let fullProfile = user;

      try {
        const profile = await fetchProfile().unwrap();
        fullProfile = { ...user, profileImage: profile?.profileImage };
      } catch {
        // Profile enrichment is optional
      }

      dispatch(setCredentials(fullProfile));

      toast.success("Welcome back, " + (user.firstName || "User"));
      if (user.role === "ADMIN") navigate(ROUTES.ADMIN_DASHBOARD);
      else if (user.role === "OFFICER") navigate(ROUTES.OFFICER_DASHBOARD);
      else navigate(ROUTES.CITIZEN_DASHBOARD);
    } catch (error) {
      const errorMsg = error?.data?.message?.toLowerCase() || "";
      let displayMessage = "Authentication failed";

      if (errorMsg.includes("invalid") || errorMsg.includes("incorrect")) {
        displayMessage = "❌ Invalid email/mobile or password";
      } else if (
        errorMsg.includes("not found") ||
        errorMsg.includes("does not exist")
      ) {
        displayMessage = "❌ User account not found";
      } else if (errorMsg.includes("inactive")) {
        displayMessage = "❌ Your account is inactive";
      } else if (errorMsg) {
        displayMessage = error?.data?.message || "Authentication failed";
      }

      toast.error(displayMessage, { duration: 4000 });
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-blue-700">
          <Fingerprint size={12} />
          Secure Citizen Access
        </div>
        <h1 className="text-[30px] font-black text-[#071A52] tracking-tight leading-tight">
          Welcome Back
        </h1>
        <p className="text-[13px] text-slate-400 leading-relaxed">
          Sign in to access your welfare dashboard and track your applications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Identifier */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
            Email or Mobile Number
          </label>
          <div
            className={`group relative flex items-center rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
              errors.identifier
                ? "border-rose-400 bg-rose-50/30 shadow-[0_0_0_3px_rgba(244,63,94,0.08)]"
                : "border-slate-200 bg-slate-50/70 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
            }`}
          >
            <Mail
              size={15}
              className="shrink-0 text-slate-400 group-focus-within:text-blue-500 transition mr-3"
            />
            <input
              id="login-identifier"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="name@email.com or 9876543210"
              autoComplete="username"
              className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none"
            />
          </div>
          {errors.identifier && (
            <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
              <span className="h-1 w-1 rounded-full bg-rose-500 inline-block" />
              {errors.identifier}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition"
            >
              Forgot password?
            </Link>
          </div>
          <div
            className={`group relative flex items-center rounded-2xl border px-4 py-3.5 transition-all duration-200 ${
              errors.password
                ? "border-rose-400 bg-rose-50/30 shadow-[0_0_0_3px_rgba(244,63,94,0.08)]"
                : "border-slate-200 bg-slate-50/70 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
            }`}
          >
            <Lock
              size={15}
              className="shrink-0 text-slate-400 group-focus-within:text-blue-500 transition mr-3"
            />
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full bg-transparent text-[14px] font-medium text-slate-800 placeholder-slate-400 outline-none pr-8"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
              <span className="h-1 w-1 rounded-full bg-rose-500 inline-block" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="group mt-2 w-full rounded-2xl bg-[#071A52] hover:bg-[#0e2a7d] text-white font-bold text-[14px] py-4 shadow-lg shadow-blue-950/25 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              Sign In to Portal
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </>
          )}
        </button>

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
          <ShieldCheck size={12} className="text-emerald-500" />
          256-bit AES Encrypted · NIC Certified Gateway
        </div>

        {/* Register link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[13px] text-slate-500">
            New to the portal?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-600 hover:text-blue-800 transition hover:underline"
            >
              Create your account →
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
