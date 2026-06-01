import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Card from "../../../components/ui/Card";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email or phone number.");
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(
        "If this account exists, our support team will contact you with reset instructions.",
      );
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Unable to process reset request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[500px] rounded-[28px] p-8">
      <div className="mb-6">
        <div className="mb-3 inline-flex rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700">
          Account recovery
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Forgot Password?</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter your registered email or phone number and we will send you the next steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email or Phone"
          icon={Mail}
          name="identifier"
          placeholder="Enter your registered email or phone"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button type="submit" loading={loading}>
          <span className="flex items-center justify-center gap-2">
            Send reset request
            <ArrowRight size={18} />
          </span>
        </Button>

        <div className="pt-2 text-center text-sm text-slate-600">
          Remembered your password?{
          " "}
          <Link className="font-semibold text-[#1E3A8A] hover:underline" to="/login">
            Back to login
          </Link>
        </div>
      </form>
    </Card>
  );
}

export default ResetPasswordPage;
