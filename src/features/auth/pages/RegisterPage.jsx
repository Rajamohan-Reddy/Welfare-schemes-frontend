import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerApi } from "../api/auth.api";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateRegistration = () => {
    const nextErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10,12}$/.test(form.phoneNumber)) {
      nextErrors.phoneNumber = "Enter a valid mobile number.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRegistration()) return;

    try {
      setLoading(true);

      await registerApi({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className="
        w-full
        max-w-[560px]
        rounded-[32px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-2xl
      "
    >
      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300 shadow-sm">
          Citizen Registration
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
          Start your premium welfare journey
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Create your account with modern enterprise-level fields and validation
          before applying for schemes.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Enter first name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email Address"
          placeholder="Enter email address"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Mobile Number"
          placeholder="Enter mobile number"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Password"
            placeholder="Create password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="mt-2 h-14 w-full rounded-3xl text-lg"
        >
          Create Account
        </Button>

        <div className="pt-1 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?
            <Link
              to="/login"
              className="
                ml-1
                font-semibold
                text-[#1E3A8A]
                hover:underline
              "
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}

export default RegisterPage;
