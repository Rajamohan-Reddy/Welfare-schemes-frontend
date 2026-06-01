import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock3,
  CheckCircle2,
  FileCheck,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import {
  getPendingQueueApi,
  getDocumentVerifiedQueueApi,
  getFieldVerifiedQueueApi,
} from "../../verification/api/verification.api";

const queues = [
  { key: "pending", label: "Pending Verification", icon: Clock3 },
  { key: "documentVerified", label: "Document Verified", icon: FileCheck },
  { key: "fieldVerified", label: "Field Verified", icon: CheckCircle2 },
];

function OfficerQueuePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadQueue();
  }, [activeTab]);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const response =
        activeTab === "pending"
          ? await getPendingQueueApi()
          : activeTab === "documentVerified"
            ? await getDocumentVerifiedQueueApi()
            : await getFieldVerifiedQueueApi();

      const payload = response.data.data;
      const queueData = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.applications)
          ? payload.applications
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

      setApplications(queueData);
    } catch (error) {
      console.error(error);
      toast.error("Unable to retrieve verification queue");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const query = search.toLowerCase();
      return (
        application.applicationNumber?.toLowerCase().includes(query) ||
        application.schemeId?.schemeName?.toLowerCase().includes(query) ||
        application.citizenId?.firstName?.toLowerCase().includes(query) ||
        application.citizenId?.lastName?.toLowerCase().includes(query)
      );
    });
  }, [applications, search]);

  const activeTabLabel = queues.find((item) => item.key === activeTab)?.label;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Officer Workbench
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Verification Queue
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Review pending applications and fast-track document or field
          verification workflows.
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2">
            {queues.map((queue) => (
              <button
                key={queue.key}
                onClick={() => setActiveTab(queue.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === queue.key
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {queue.label}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search application number"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 outline-none"
            />
          </div>
        </div>

        <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Viewing</p>
              <h2 className="text-xl font-semibold text-white">
                {activeTabLabel}
              </h2>
            </div>
            <Button onClick={loadQueue} variant="secondary" fullWidth={false}>
              Refresh queue
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 size={36} className="animate-spin text-blue-600" />
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="text-center text-slate-500">
          <ShieldCheck size={40} className="mx-auto text-slate-300" />
          <p className="mt-4 text-lg font-semibold">
            No applications in this queue
          </p>
          <p className="mt-2 text-sm">
            Use the queue tabs to switch between verification stages and locate
            the next application to review.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((application) => (
            <Card
              key={application._id}
              className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3 text-slate-500">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    <ShieldCheck size={14} />
                    {application.status?.replaceAll("_", " ")}
                  </span>
                  <span className="text-sm">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {application.applicationNumber}
                </h3>
                <p className="text-sm text-slate-600">
                  {application.schemeId?.schemeName}
                </p>
                <p className="text-sm text-slate-500">
                  Applicant: {application.citizenId?.firstName}{" "}
                  {application.citizenId?.lastName}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  {application.status?.replaceAll("_", " ")}
                </div>
                <Button
                  onClick={() => navigate(`/officer/review/${application._id}`)}
                  fullWidth={false}
                >
                  Review application
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default OfficerQueuePage;
