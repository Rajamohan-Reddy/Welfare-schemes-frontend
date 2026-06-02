import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  Plus,
  RefreshCcw,
  UserCheck,
  UserX,
  Sparkles,
  Lock,
  Mail,
  Phone,
  User,
  X,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import {
  createAdminApi,
  createOfficerApi,
  getAdminsApi,
  getOfficersApi,
  updateUserStatusApi,
} from "../api/admin.api";
import {
  getAllCategoriesApi,
  getAllSchemesApi,
  createSchemeApi,
  updateSchemeApi,
  deleteSchemeApi,
  createSchemeCategoryApi,
  updateSchemeCategoryApi,
  deleteSchemeCategoryApi,
} from "../../schemes/api/schemes.api";

function AdminStaffPage() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [activeTab, setActiveTab] = useState("admins");
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "ADMIN",
  });
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [schemeModalOpen, setSchemeModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [schemeForm, setSchemeForm] = useState({
    schemeCode: "",
    schemeName: "",
    description: "",
    categoryId: "",
    department: "",
    benefitType: "",
    startDate: "",
    endDate: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    categoryCode: "",
    categoryName: "",
  });
  const [schemeErrors, setSchemeErrors] = useState({});
  const [categoryErrors, setCategoryErrors] = useState({});
  const [savingScheme, setSavingScheme] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    loadStaff();
    loadSchemeData();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const [adminsResponse, officersResponse] = await Promise.all([
        getAdminsApi(),
        getOfficersApi(),
      ]);
      setAdmins(adminsResponse.data.data || []);
      setOfficers(officersResponse.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load staff records");
    } finally {
      setLoading(false);
    }
  };

  const loadSchemeData = async () => {
    try {
      const [categoriesResponse, schemesResponse] = await Promise.all([
        getAllCategoriesApi(),
        getAllSchemesApi(),
      ]);
      setCategories(categoriesResponse.data.data || []);
      setSchemes(schemesResponse.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load scheme management data");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await updateUserStatusApi(user._id, !user.isActive);
      toast.success(`Account ${user.isActive ? "deactivated" : "activated"}`);
      await loadStaff();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update account status");
    }
  };

  const closeSchemeModal = () => {
    setSchemeModalOpen(false);
    setSelectedScheme(null);
    setSchemeForm({
      schemeCode: "",
      schemeName: "",
      description: "",
      categoryId: "",
      department: "",
      benefitType: "",
      startDate: "",
      endDate: "",
    });
    setSchemeErrors({});
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setSelectedCategory(null);
    setCategoryForm({
      categoryCode: "",
      categoryName: "",
    });
    setCategoryErrors({});
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrors({});
  };

  const validateSchemeForm = () => {
    const nextErrors = {};
    if (!schemeForm.schemeCode.trim()) nextErrors.schemeCode = "Scheme code is required.";
    if (!schemeForm.schemeName.trim()) nextErrors.schemeName = "Scheme name is required.";
    if (!schemeForm.categoryId.trim()) nextErrors.categoryId = "Please select a category.";
    if (!schemeForm.department.trim()) nextErrors.department = "Department is required.";
    if (!schemeForm.benefitType.trim()) nextErrors.benefitType = "Benefit type is required.";
    setSchemeErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateCategoryForm = () => {
    const nextErrors = {};
    if (!categoryForm.categoryCode.trim()) nextErrors.categoryCode = "Category code is required.";
    if (!categoryForm.categoryName.trim()) nextErrors.categoryName = "Category name is required.";
    setCategoryErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleOpenCreateScheme = () => {
    setSelectedScheme(null);
    setSchemeModalOpen(true);
    setSchemeForm({
      schemeCode: "",
      schemeName: "",
      description: "",
      categoryId: "",
      department: "",
      benefitType: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleEditScheme = (scheme) => {
    setSelectedScheme(scheme);
    const categoryId = scheme.categoryId?._id || scheme.categoryId || "";
    setSchemeForm({
      schemeCode: scheme.schemeCode || "",
      schemeName: scheme.schemeName || "",
      description: scheme.description || "",
      categoryId,
      department: scheme.department || "",
      benefitType: scheme.benefitType || "",
      startDate: scheme.startDate ? scheme.startDate.slice(0, 10) : "",
      endDate: scheme.endDate ? scheme.endDate.slice(0, 10) : "",
    });
    setSchemeModalOpen(true);
  };

  const handleDeleteScheme = async (scheme) => {
    if (!window.confirm(`Delete scheme ${scheme.schemeName}? This cannot be undone.`)) return;
    try {
      await deleteSchemeApi(scheme._id);
      toast.success("Scheme removed successfully");
      await loadSchemeData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove scheme");
    }
  };

  const handleSubmitScheme = async (event) => {
    event.preventDefault();
    if (!validateSchemeForm()) {
      toast.error("Please complete all required scheme fields.");
      return;
    }

    try {
      setSavingScheme(true);
      const payload = {
        schemeCode: schemeForm.schemeCode,
        schemeName: schemeForm.schemeName,
        description: schemeForm.description,
        categoryId: schemeForm.categoryId,
        department: schemeForm.department,
        benefitType: schemeForm.benefitType,
        startDate: schemeForm.startDate,
        endDate: schemeForm.endDate,
      };

      if (selectedScheme) {
        await updateSchemeApi(selectedScheme._id, payload);
        toast.success("Scheme updated successfully");
      } else {
        await createSchemeApi(payload);
        toast.success("Scheme created successfully");
      }
      await loadSchemeData();
      closeSchemeModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save scheme");
    } finally {
      setSavingScheme(false);
    }
  };

  const handleOpenCreateCategory = () => {
    setSelectedCategory(null);
    setCategoryModalOpen(true);
    setCategoryForm({
      categoryCode: "",
      categoryName: "",
    });
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      categoryCode: category.categoryCode || "",
      categoryName: category.categoryName || "",
    });
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Delete category ${category.categoryName}? This cannot be undone.`)) return;
    try {
      await deleteSchemeCategoryApi(category._id);
      toast.success("Category removed successfully");
      await loadSchemeData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove category");
    }
  };

  const handleSubmitCategory = async (event) => {
    event.preventDefault();
    if (!validateCategoryForm()) {
      toast.error("Please complete all required category fields.");
      return;
    }

    try {
      setSavingCategory(true);
      const payload = {
        categoryCode: categoryForm.categoryCode,
        categoryName: categoryForm.categoryName,
      };

      if (selectedCategory) {
        await updateSchemeCategoryApi(selectedCategory._id, payload);
        toast.success("Category updated successfully");
      } else {
        await createSchemeCategoryApi(payload);
        toast.success("Category created successfully");
      }
      await loadSchemeData();
      closeCategoryModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save category");
    } finally {
      setSavingCategory(false);
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email.";
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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      toast.error("Please complete all required fields correctly.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      };

      if (form.role === "ADMIN") {
        await createAdminApi(payload);
        toast.success("New administrator created successfully!");
      } else {
        await createOfficerApi(payload);
        toast.success("New verification officer created successfully!");
      }

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: form.role,
      });
      loadStaff();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Unable to create staff account",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const activeUsers = useMemo(() => {
    const rawList = activeTab === "admins" ? admins : officers;
    if (!searchQuery.trim()) return rawList;
    
    const query = searchQuery.toLowerCase();
    return rawList.filter(
      (item) =>
        item.firstName?.toLowerCase().includes(query) ||
        item.lastName?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query)
    );
  }, [activeTab, admins, officers, searchQuery]);

  const categoryLookup = useMemo(
    () => categories.reduce((map, category) => {
      map[category._id] = category.categoryName;
      return map;
    }, {}),
    [categories],
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#4338CA] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-indigo-300">
              <Sparkles size={14} /> ADMINISTRATIVE COMMAND GATE
            </span>
            <h1 className="text-4xl font-black tracking-tight leading-tight">Operations Roster</h1>
            <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
              Audit active system credentials, verify staff logins, and invite new administrative and verification officials.
            </p>
          </div>
        </div>
      </section>

      {/* Main Staff Registry Board */}
      <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-black text-[#071A52]">Staff Roster</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage active administrator and officer access credentials.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5">
            {/* Small premium, cute invite buttons next to header */}
            <button
              onClick={() => {
                setForm((prev) => ({ ...prev, role: "ADMIN" }));
                setModalOpen(true);
              }}
              className="rounded-full bg-blue-50 hover:bg-blue-100/85 text-blue-700 px-4 py-2 text-[10px] font-black uppercase tracking-wider border border-blue-200/50 shadow-sm transition inline-flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Plus size={12} /> Invite Admin
            </button>
            <button
              onClick={() => {
                setForm((prev) => ({ ...prev, role: "OFFICER" }));
                setModalOpen(true);
              }}
              className="rounded-full bg-indigo-50 hover:bg-indigo-100/85 text-indigo-700 px-4 py-2 text-[10px] font-black uppercase tracking-wider border border-indigo-200/50 shadow-sm transition inline-flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Plus size={12} /> Invite Officer
            </button>

            <button
              onClick={loadStaff}
              title="Refresh Roster"
              className="h-8.5 w-8.5 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 active:scale-95 transition"
            >
              <RefreshCcw size={12} />
            </button>
          </div>
        </div>

        {/* Tab Controls and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-slate-50 border border-slate-100 rounded-full p-1 font-semibold text-xs text-slate-500">
            {["admins", "officers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-5 py-1.5 uppercase tracking-wide transition-all ${
                  activeTab === tab ? "bg-[#071A52] text-white shadow-sm font-bold" : "hover:text-[#071A52]"
                }`}
              >
                {tab === "admins" ? "Administrators" : "Verification Officers"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email..."
              className="h-9.5 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Roster list */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 text-xs font-semibold">
            <RefreshCcw size={16} className="animate-spin text-blue-600 mr-2" />
            Querying Staff Records...
          </div>
        ) : activeUsers.length === 0 ? (
          <div className="rounded-[28px] bg-slate-50 border border-slate-100 p-16 text-center text-slate-500 space-y-3">
            <Users size={36} className="mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-[#071A52]">No Staff Found</h3>
            <p className="text-xs text-slate-400">Invite new team members or adjust your filter query.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {activeUsers.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-slate-200/80 p-5 bg-white shadow-sm flex flex-col justify-between hover:shadow transition"
              >
                <div className="flex gap-4 items-start">
                  <div className="h-11 w-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shadow-inner shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-[#071A52] truncate">
                      {item.firstName} {item.lastName}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500 truncate">{item.email}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      {item.role} • {item.phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                    item.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}>
                    {item.isActive ? "Active Account" : "Suspended"}
                  </span>
                  
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase border tracking-wider transition ${
                      item.isActive
                        ? "bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                        : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700"
                    }`}
                  >
                    {item.isActive ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/2 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-black text-[#071A52]">Scheme Operations</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Maintain scheme categories and schemes from a single admin control panel.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreateCategory}
              className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-[10px] font-black uppercase tracking-wider border border-slate-200 shadow-sm transition inline-flex items-center gap-1 active:scale-95"
            >
              <Plus size={12} /> Add Category
            </button>
            <button
              type="button"
              onClick={handleOpenCreateScheme}
              className="rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 text-[10px] font-black uppercase tracking-wider border border-blue-200 shadow-sm transition inline-flex items-center gap-1 active:scale-95"
            >
              <Plus size={12} /> Add Scheme
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-[#071A52]">Categories</h3>
                <p className="text-[11px] text-slate-400">Manage classification groups used by schemes.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {categories.length} categories
              </span>
            </div>

            <div className="space-y-3">
              {categories.length === 0 ? (
                <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 text-slate-500 text-xs">
                  No categories found. Add a category to keep schemes organized.
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category._id} className="rounded-3xl border border-slate-200/80 p-4 bg-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#071A52]">{category.categoryName}</p>
                      <p className="text-[11px] text-slate-500 uppercase tracking-[0.18em] mt-1">{category.categoryCode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="rounded-full bg-white border border-slate-200 text-slate-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wide hover:bg-slate-100 transition"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category)}
                        className="rounded-full bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-[10px] font-bold uppercase tracking-wide hover:bg-red-100 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-[#071A52]">Schemes</h3>
                <p className="text-[11px] text-slate-400">Edit scheme definitions, benefit type, and enforcement dates.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {schemes.length} schemes
              </span>
            </div>

            <div className="space-y-3">
              {schemes.length === 0 ? (
                <div className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 text-slate-500 text-xs">
                  No schemes configured. Add a scheme to enable benefit delivery.
                </div>
              ) : (
                schemes.map((scheme) => (
                  <div key={scheme._id} className="rounded-3xl border border-slate-200/80 p-4 bg-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#071A52]">{scheme.schemeName}</p>
                      <p className="text-[11px] text-slate-500 uppercase tracking-[0.18em] mt-1">
                        {scheme.schemeCode} • {scheme.benefitType || "Benefit type missing"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-2">Category: {scheme.categoryId?.categoryName || categoryLookup[scheme.categoryId] || "Unassigned"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditScheme(scheme)}
                        className="rounded-full bg-white border border-slate-200 text-slate-600 px-3 py-2 text-[10px] font-bold uppercase tracking-wide hover:bg-slate-100 transition"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteScheme(scheme)}
                        className="rounded-full bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-[10px] font-bold uppercase tracking-wide hover:bg-red-100 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Macbook style modal overlays */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-[30px] bg-white shadow-2xl border border-slate-200/60 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Roster System Registry</span>
                <h2 className="mt-1 text-base font-black text-[#071A52]">
                  Create {form.role === "ADMIN" ? "Administrator" : "Verification Officer"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">First Name</label>
                  <div className={`relative flex items-center bg-slate-50 border rounded-2xl px-3 py-2 ${
                    errors.firstName ? "border-rose-500" : "border-slate-200"
                  }`}>
                    <User size={14} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Colleague's first name"
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.firstName && <p className="text-[10px] text-red-500 font-semibold">{errors.firstName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Name</label>
                  <div className={`relative flex items-center bg-slate-50 border rounded-2xl px-3 py-2 ${
                    errors.lastName ? "border-rose-500" : "border-slate-200"
                  }`}>
                    <User size={14} className="text-slate-400 mr-2 shrink-0" />
                    <input
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Colleague's last name"
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  {errors.lastName && <p className="text-[10px] text-red-500 font-semibold">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className={`relative flex items-center bg-slate-50 border rounded-2xl px-3 py-2 ${
                  errors.email ? "border-rose-500" : "border-slate-200"
                }`}>
                  <Mail size={14} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Enter professional email"
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 font-semibold">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mobile Number</label>
                <div className={`relative flex items-center bg-slate-50 border rounded-2xl px-3 py-2 ${
                  errors.phoneNumber ? "border-rose-500" : "border-slate-200"
                }`}>
                  <Phone size={14} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    placeholder="Enter mobile number"
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.phoneNumber && <p className="text-[10px] text-red-500 font-semibold">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</label>
                <div className={`relative flex items-center bg-slate-50 border rounded-2xl px-3 py-2 ${
                  errors.password ? "border-rose-500" : "border-slate-200"
                }`}>
                  <Lock size={14} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Assign a secure password"
                    className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
                {errors.password && <p className="text-[10px] text-red-500 font-semibold">{errors.password}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 text-xs font-bold transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#071A52] hover:bg-blue-900 text-white px-5 py-2 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-950/10 cursor-pointer"
                >
                  {submitting ? "Inviting..." : (
                    <>
                      <Plus size={13} /> Invite Staff member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {schemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-2xl border border-slate-200/60 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Scheme Management</span>
                <h2 className="mt-1 text-base font-black text-[#071A52]">
                  {selectedScheme ? "Update Scheme" : "Create Scheme"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeSchemeModal}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitScheme} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheme Code</label>
                  <input
                    value={schemeForm.schemeCode}
                    onChange={(e) => setSchemeForm({ ...schemeForm, schemeCode: e.target.value })}
                    placeholder="EX: AP-HEALTH"
                    className={`w-full rounded-2xl border px-4 py-2 text-xs font-semibold text-slate-800 outline-none ${schemeErrors.schemeCode ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
                  />
                  {schemeErrors.schemeCode && <p className="text-[10px] text-red-500 font-semibold">{schemeErrors.schemeCode}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheme Name</label>
                  <input
                    value={schemeForm.schemeName}
                    onChange={(e) => setSchemeForm({ ...schemeForm, schemeName: e.target.value })}
                    placeholder="Enter scheme title"
                    className={`w-full rounded-2xl border px-4 py-2 text-xs font-semibold text-slate-800 outline-none ${schemeErrors.schemeName ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
                  />
                  {schemeErrors.schemeName && <p className="text-[10px] text-red-500 font-semibold">{schemeErrors.schemeName}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                  <select
                    value={schemeForm.categoryId}
                    onChange={(e) => setSchemeForm({ ...schemeForm, categoryId: e.target.value })}
                    className={`w-full rounded-2xl border px-4 py-2 text-xs font-semibold text-slate-800 outline-none ${schemeErrors.categoryId ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                  {schemeErrors.categoryId && <p className="text-[10px] text-red-500 font-semibold">{schemeErrors.categoryId}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</label>
                  <input
                    value={schemeForm.department}
                    onChange={(e) => setSchemeForm({ ...schemeForm, department: e.target.value })}
                    placeholder="Enter department name"
                    className={`w-full rounded-2xl border px-4 py-2 text-xs font-semibold text-slate-800 outline-none ${schemeErrors.department ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
                  />
                  {schemeErrors.department && <p className="text-[10px] text-red-500 font-semibold">{schemeErrors.department}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Benefit Type</label>
                  <input
                    value={schemeForm.benefitType}
                    onChange={(e) => setSchemeForm({ ...schemeForm, benefitType: e.target.value })}
                    placeholder="Cash transfer, scholarship..."
                    className={`w-full rounded-2xl border px-4 py-2 text-xs font-semibold text-slate-800 outline-none ${schemeErrors.benefitType ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
                  />
                  {schemeErrors.benefitType && <p className="text-[10px] text-red-500 font-semibold">{schemeErrors.benefitType}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Date</label>
                    <input
                      type="date"
                      value={schemeForm.startDate}
                      onChange={(e) => setSchemeForm({ ...schemeForm, startDate: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Date</label>
                    <input
                      type="date"
                      value={schemeForm.endDate}
                      onChange={(e) => setSchemeForm({ ...schemeForm, endDate: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
                <textarea
                  rows={3}
                  value={schemeForm.description}
                  onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                  placeholder="Optional summary for internal review"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-800 outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeSchemeModal}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 text-xs font-bold transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingScheme}
                  className="rounded-full bg-[#071A52] hover:bg-blue-900 text-white px-5 py-2 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-950/10 cursor-pointer"
                >
                  {savingScheme ? "Saving..." : selectedScheme ? "Update Scheme" : "Save Scheme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg overflow-hidden rounded-[30px] bg-white shadow-2xl border border-slate-200/60 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Category Management</span>
                <h2 className="mt-1 text-base font-black text-[#071A52]">
                  {selectedCategory ? "Update Category" : "Create Category"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCategoryModal}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-4 p-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Code</label>
                <input
                  value={categoryForm.categoryCode}
                  onChange={(e) => setCategoryForm({ ...categoryForm, categoryCode: e.target.value })}
                  placeholder="EX: SOCIAL-WELFARE"
                  className={`w-full rounded-2xl border px-4 py-2 text-xs font-semibold text-slate-800 outline-none ${categoryErrors.categoryCode ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
                />
                {categoryErrors.categoryCode && <p className="text-[10px] text-red-500 font-semibold">{categoryErrors.categoryCode}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Name</label>
                <input
                  value={categoryForm.categoryName}
                  onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                  placeholder="Enter category label"
                  className={`w-full rounded-2xl border px-4 py-2 text-xs font-semibold text-slate-800 outline-none ${categoryErrors.categoryName ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-slate-50"}`}
                />
                {categoryErrors.categoryName && <p className="text-[10px] text-red-500 font-semibold">{categoryErrors.categoryName}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeCategoryModal}
                  className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2 text-xs font-bold transition active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="rounded-full bg-[#071A52] hover:bg-blue-900 text-white px-5 py-2 text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-950/10 cursor-pointer"
                >
                  {savingCategory ? "Saving..." : selectedCategory ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStaffPage;
