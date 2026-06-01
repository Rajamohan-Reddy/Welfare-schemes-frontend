import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Users,
  FileText,
  TrendingUp,
  LogIn,
} from "lucide-react";
import { getAllSchemesApi } from "../../schemes/api/schemes.api";
import { getUser } from "../../../utils/storage";

function LandingPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const resp = await getAllSchemesApi({ limit: 6 });
      setSchemes(resp.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/citizen/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold text-blue-600">
            🏛️ Welfare Portal
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/citizen/dashboard")}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/citizen/schemes")}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Schemes
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                >
                  <LogIn size={18} /> Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
            <div>
              <h1 className="text-5xl font-bold leading-tight text-slate-900">
                Government Welfare Made{" "}
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Simple
                </span>
              </h1>
              <p className="mt-6 text-xl text-slate-600">
                Access and manage welfare schemes from the Government of Andhra
                Pradesh. Apply, track, and receive benefits with ease.
              </p>
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleGetStarted}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Get Started <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate("/citizen/eligibility")}
                  className="rounded-xl border-2 border-slate-300 px-8 py-4 font-semibold text-slate-900 hover:border-blue-600 hover:text-blue-600 transition"
                >
                  Check Eligibility
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative h-96 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-3xl" />
                <div className="relative flex h-full items-center justify-center">
                  <div className="text-6xl">📱</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <StatCard icon={Users} label="Active Citizens" value="50K+" />
            <StatCard icon={FileText} label="Schemes Available" value="25+" />
            <StatCard
              icon={TrendingUp}
              label="Applications Processed"
              value="100K+"
            />
            <StatCard icon={CheckCircle} label="Success Rate" value="95%" />
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 text-4xl font-bold text-slate-900">
            Featured Schemes
          </h2>
          <p className="mb-12 text-lg text-slate-600">
            Explore popular welfare schemes and apply for benefits you're
            eligible for
          </p>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {schemes.map((scheme) => (
                <div
                  key={scheme._id}
                  onClick={() => navigate(`/citizen/schemes/${scheme._id}`)}
                  className="group cursor-pointer rounded-2xl border border-slate-200 p-6 hover:border-blue-400 hover:shadow-lg transition"
                >
                  <div className="mb-3 inline-block rounded-xl bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
                    {scheme.schemeCode || "Scheme"}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">
                    {scheme.schemeName}
                  </h3>
                  <p className="mb-4 text-slate-600 line-clamp-2">
                    {scheme.description}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition">
                    Learn More <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mb-8 text-xl text-blue-50">
            Join thousands of citizens already benefiting from government
            welfare schemes
          </p>
          <button
            onClick={handleGetStarted}
            className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 transition"
          >
            Apply for Schemes Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center text-slate-600">
          <p>&copy; 2026 Government of Andhra Pradesh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <Icon className="mb-3 h-8 w-8 text-blue-600" />
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-slate-600">{label}</p>
    </div>
  );
}

export default LandingPage;
