import { useEffect, useMemo, useState } from "react";
import {
  Search, Sparkles, Loader2, Layers, Building2, TrendingUp,
  CheckCircle, Filter, Globe, ArrowRight, ChevronDown,
} from "lucide-react";
import SchemeCard from "../components/SchemeCard";
import { getAllCategoriesApi, getAllSchemesApi } from "../api/schemes.api";

// Category icon/gradient map
const categoryGradients = {
  EDUCATION:    "from-indigo-600 to-violet-600",
  AGRICULTURE:  "from-emerald-600 to-teal-600",
  HEALTH:       "from-rose-600 to-pink-600",
  HOUSING:      "from-orange-500 to-amber-600",
  PENSION:      "from-cyan-600 to-sky-600",
  WOMEN_WELFARE:"from-pink-500 to-fuchsia-600",
  EMPLOYMENT:   "from-blue-600 to-indigo-600",
  DISABILITY:   "from-purple-600 to-violet-700",
  STUDENT:      "from-violet-500 to-purple-600",
};

function BrowseSchemesPage() {
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState("newest"); // newest | amount | name

  const loadData = async () => {
    try {
      setLoading(true);
      const [schemesRes, categoriesRes] = await Promise.all([
        getAllSchemesApi(),
        getAllCategoriesApi(),
      ]);
      setSchemes(schemesRes?.data?.data || []);
      setCategories(categoriesRes?.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Sync search param from URL (header search)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("search");
    if (q) setSearch(q);
  }, []);

  const filteredSchemes = useMemo(() => {
    let list = schemes.filter((scheme) => {
      const query = search.toLowerCase();
      const matchesSearch =
        scheme.schemeName?.toLowerCase().includes(query) ||
        scheme.description?.toLowerCase().includes(query) ||
        scheme.department?.toLowerCase().includes(query) ||
        scheme.benefitType?.toLowerCase().includes(query) ||
        scheme.categoryId?.categoryName?.toLowerCase().includes(query);
      const matchesCategory =
        !selectedCategory || scheme.categoryId?._id === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "amount") list = [...list].sort((a, b) => (b.benefitAmount || 0) - (a.benefitAmount || 0));
    if (sortBy === "name") list = [...list].sort((a, b) => (a.schemeName || "").localeCompare(b.schemeName || ""));

    return list;
  }, [schemes, search, selectedCategory, sortBy]);

  const activeSchemes = schemes.filter((s) => s.isActive).length;
  const departments = new Set(schemes.map((s) => s.department)).size;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Hero Banner ────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#040e2e] via-[#071A52] to-[#0f3285] text-white shadow-2xl">
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-20 h-60 w-60 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold tracking-widest text-[#FFD95A]">
                <Globe size={13} /> AP CITIZEN WELFARE REGISTRY
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD95A] to-[#FFA347]">Welfare</span> Schemes
              </h1>
              <p className="text-sm leading-relaxed text-blue-200/80 max-w-md">
                Explore Andhra Pradesh government welfare programs. Apply with one click and track your benefit journey in real-time.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-blue-200">
                <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-emerald-400" /> {activeSchemes} Active Schemes</span>
                <span className="flex items-center gap-1.5"><Building2 size={13} className="text-amber-400" /> {departments} Departments</span>
                <span className="flex items-center gap-1.5"><Layers size={13} className="text-blue-400" /> {categories.length} Categories</span>
              </div>
            </div>

            {/* Live search in hero */}
            <div className="w-full lg:w-[420px]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300/70" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search schemes, departments, categories…"
                  className="w-full h-14 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md pl-12 pr-4 text-sm font-semibold text-white outline-none focus:border-blue-400 focus:bg-white/15 placeholder:text-blue-300/60 transition"
                />
              </div>
              <p className="mt-2 text-[10px] text-blue-400/80 font-semibold text-right">
                {filteredSchemes.length} result{filteredSchemes.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat Cards ─────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Schemes" value={schemes.length} icon={Layers} color="from-blue-500 to-indigo-600" />
        <StatCard label="Active Programs" value={activeSchemes} icon={CheckCircle} color="from-emerald-500 to-teal-600" />
        <StatCard label="Departments" value={departments} icon={Building2} color="from-amber-500 to-orange-600" />
        <StatCard label="Categories" value={categories.length} icon={TrendingUp} color="from-purple-500 to-fuchsia-600" />
      </div>

      {/* ── Filter Bar ─────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <FilterPill label="All" active={!selectedCategory} onClick={() => setSelectedCategory(null)} />
          {categories.map((cat) => (
            <FilterPill
              key={cat._id}
              label={cat.categoryName}
              active={cat._id === selectedCategory}
              onClick={() => setSelectedCategory(cat._id === selectedCategory ? null : cat._id)}
            />
          ))}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter size={14} className="text-slate-400" />
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-bold text-slate-700 outline-none cursor-pointer appearance-none"
            >
              <option value="newest">Latest First</option>
              <option value="amount">Highest Benefit</option>
              <option value="name">A–Z Name</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Schemes Grid ───────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">State Initiatives</span>
            <h2 className="text-xl font-black text-[#071A52] tracking-tight mt-0.5">
              {selectedCategory ? categories.find((c) => c._id === selectedCategory)?.categoryName : "All Welfare Programs"}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400">{filteredSchemes.length} programs</span>
        </div>

        {loading ? (
          <div className="flex h-60 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
              </div>
              <p className="text-xs font-semibold text-slate-400">Loading Welfare Registry…</p>
            </div>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-16 text-center shadow-sm space-y-3">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Search size={28} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-[#071A52]">No Programs Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Adjust your search query or category filters to discover more welfare programs.
            </p>
            <button
              onClick={() => { setSearch(""); setSelectedCategory(null); }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#071A52] px-5 py-2 text-xs font-bold text-white hover:bg-blue-900 transition"
            >
              Clear Filters <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition flex items-center gap-4">
      <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md shrink-0`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-2xl font-black text-[#071A52] tracking-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide transition-all ${
        active
          ? "bg-[#071A52] text-white shadow-md"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

export default BrowseSchemesPage;
