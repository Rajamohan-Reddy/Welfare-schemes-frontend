import { useEffect, useMemo, useState } from "react";

import { Search, Sparkles, Loader2 } from "lucide-react";

import SchemeCard from "../components/SchemeCard";

import { getAllCategoriesApi, getAllSchemesApi } from "../api/schemes.api";

function BrowseSchemesPage() {
  const [loading, setLoading] = useState(true);
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      const [schemesResponse, categoriesResponse] = await Promise.all([
        getAllSchemesApi(),
        getAllCategoriesApi(),
      ]);

      setSchemes(schemesResponse?.data?.data || []);
      setCategories(categoriesResponse?.data?.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadData();
    };

    initialize();
  }, []);

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
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
  }, [schemes, search, selectedCategory]);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-10 text-white shadow-xl">
        <div className="absolute right-8 top-8 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-8 bottom-8 h-52 w-52 rounded-full bg-sky-500/15 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.28em] text-sky-200">
            <Sparkles size={14} />
            Andhra Pradesh Welfare Services
          </div>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-white">
            Discover premium welfare schemes
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300">
            Browse official government benefits with curated filters, secure
            application paths, and real-time scheme insights.
          </p>
        </div>
      </section>

      <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-6 shadow-xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Search schemes
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Filter by category, department, and expected benefit type.
            </p>
          </div>
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search schemes, departments, pensions, scholarships..."
              className="h-14 w-full rounded-full border border-slate-700 bg-slate-900/90 px-14 text-white outline-none transition focus:border-sky-400"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          title="Total Schemes"
          value={schemes.length}
          accent="from-indigo-500 to-cyan-500"
        />
        <StatusCard
          title="Categories"
          value={categories.length}
          accent="from-emerald-500 to-teal-500"
        />
        <StatusCard
          title="Departments"
          value={new Set(schemes.map((s) => s.department)).size}
          accent="from-sky-500 to-blue-500"
        />
        <StatusCard
          title="Active"
          value={schemes.filter((s) => s.isActive).length}
          accent="from-slate-500 to-slate-700"
        />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">
              Available schemes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Showing the best welfare programs with a polished citizen
              experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category._id}
                onClick={() =>
                  setSelectedCategory(
                    category._id === selectedCategory ? null : category._id,
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category._id === selectedCategory ? "bg-slate-900 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-slate-500">
              <Loader2 size={36} className="animate-spin text-blue-600" />
              <p>Loading schemes...</p>
            </div>
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="rounded-[28px] bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold">No schemes found</h3>
            <p className="mt-2 text-slate-500">
              Try another search term or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme._id} scheme={scheme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ title, value, accent }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
        {title}
      </p>
      <div
        className={`mt-4 inline-flex rounded-full bg-gradient-to-r ${accent} px-4 py-2 text-xl font-semibold text-white shadow-lg`}
      >
        {value}
      </div>
    </div>
  );
}

export default BrowseSchemesPage;
