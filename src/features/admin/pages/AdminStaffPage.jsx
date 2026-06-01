import { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  PlusCircle,
  RefreshCcw,
  UserCheck,
  UserX,
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

function AdminStaffPage() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [activeTab, setActiveTab] = useState("admins");
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "ADMIN",
  });

  useEffect(() => {
    loadStaff();
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

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phoneNumber ||
      !form.password
    ) {
      toast.error("Please complete all required fields");
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
        toast.success("New administrator created");
      } else {
        await createOfficerApi(payload);
        toast.success("New officer created");
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

  const activeUsers = useMemo(
    () => (activeTab === "admins" ? admins : officers),
    [activeTab, admins, officers],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Staff Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage administrative and verification staff accounts, activation
            state, and new hires.
          </p>
        </div>

        <Button onClick={loadStaff} variant="secondary" fullWidth={false}>
          <RefreshCcw size={16} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Current Staff
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review active administrators and officers assigned to
                verification workflows.
              </p>
            </div>
            <div className="flex gap-2 rounded-3xl bg-slate-100 p-2">
              <button
                onClick={() => setActiveTab("admins")}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "admins" ? "bg-white shadow" : "text-slate-600"
                }`}
              >
                Administrators
              </button>
              <button
                onClick={() => setActiveTab("officers")}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "officers"
                    ? "bg-white shadow"
                    : "text-slate-600"
                }`}
              >
                Officers
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-48 items-center justify-center text-slate-500">
              Loading staff records...
            </div>
          ) : activeUsers.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 p-8 text-center text-slate-500">
              <Users size={32} className="mx-auto" />
              <p className="mt-4 text-lg font-semibold">
                No staff accounts found
              </p>
              <p className="mt-2 text-sm">
                Use the panel on the right to add a new member.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeUsers.map((item) => (
                <div
                  key={item._id}
                  className="rounded-3xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {item.firstName} {item.lastName}
                          </h3>
                          <p className="text-sm text-slate-500">{item.email}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-500">
                        <span>{item.role}</span>
                        <span>Phone: {item.phoneNumber}</span>
                        <span>{item.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`rounded-2xl px-4 py-2 text-sm font-semibold text-white ${item.isActive ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                      >
                        {item.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Invite Staff
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">
              Create New Admin or Officer
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add approved staff accounts for system administration and
              verification operations.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-600">
              Open the premium staff creation modal and invite your next
              administrator or verification officer.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button
                onClick={() => {
                  setForm((prev) => ({ ...prev, role: "ADMIN" }));
                  setModalOpen(true);
                }}
                fullWidth={false}
              >
                Create Administrator
              </Button>
              <Button
                onClick={() => {
                  setForm((prev) => ({ ...prev, role: "OFFICER" }));
                  setModalOpen(true);
                }}
                variant="secondary"
                fullWidth={false}
              >
                Create Officer
              </Button>
            </div>
          </div>

          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
              <div className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-2xl">
                <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                      Invite a trusted colleague
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                      Create Staff Account
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Mobile Number"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />

                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-700">
                      Account Type
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[
                        { label: "Administrator", value: "ADMIN" },
                        { label: "Officer", value: "OFFICER" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, role: option.value }))
                          }
                          className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                            form.role === option.value
                              ? "bg-[#1E3A8A] text-white"
                              : "bg-white text-slate-700 shadow-sm"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                      fullWidth={false}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={submitting}
                      fullWidth={false}
                    >
                      <span className="flex items-center gap-2">
                        <PlusCircle size={18} /> Invite Staff
                      </span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminStaffPage;
