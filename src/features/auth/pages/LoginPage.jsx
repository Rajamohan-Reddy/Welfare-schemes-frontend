import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginApi } from "../api/auth.api";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

import { setAccessToken, setUser } from "../../../utils/storage";
import { ROUTES } from "../../../constants/routes";

function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateLogin = () => {
    const nextErrors = {};
    const identifier = form.identifier.trim();
    const password = form.password.trim();

    if (!identifier) {
      nextErrors.identifier = "Enter your email or phone number.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateLogin()) return;

    try {
      setLoading(true);

      const response = await loginApi(form);

      const user = response.data.user;
      const token = response.data.accessToken;

      setUser(user);
      setAccessToken(token);

      toast.success("Login successful");

      if (user.role === "ADMIN") {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else if (user.role === "OFFICER") {
        navigate(ROUTES.OFFICER_DASHBOARD);
      } else {
        navigate(ROUTES.CITIZEN_DASHBOARD);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[500px] rounded-[32px] border border-slate-200 bg-white shadow-2xl p-8">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300 shadow-sm">
          Citizen Login
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
          Secure access to your benefits
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Sign in with email or mobile number and continue managing your welfare
          applications with premium security.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email or Phone Number"
          placeholder="Enter email or phone number"
          icon={Mail}
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          error={errors.identifier}
        />

        <div className="relative">
          <Input
            label="Password"
            placeholder="Enter password"
            icon={Lock}
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[42px] text-slate-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <p className="text-sm text-slate-500">
          Tip: Use your registered email or mobile number and a strong password
          of 8+ characters.
        </p>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#1E3A8A] hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" loading={loading}>
          <span className="flex items-center justify-center gap-2">
            Login
            <ArrowRight size={18} />
          </span>
        </Button>

        <div className="pt-2 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#1E3A8A] hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}

export default LoginPage;
