import { Download, FileText, Users } from "lucide-react";
import { useMemo } from "react";
import toast from "react-hot-toast";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

const reportOptions = [
  {
    key: "staff-directory",
    title: "Operational Staff Roster",
    description:
      "Download active administrator and officer staffing data for governance, audit, and workforce planning.",
    headers: ["Name", "Email", "Role", "Status"],
    rows: [
      ["Aarti Sharma", "aarti.sharma@example.com", "ADMIN", "Active"],
      ["Ramesh Kumar", "ramesh.kumar@example.com", "OFFICER", "Active"],
      ["Sonal Gupta", "sonal.gupta@example.com", "OFFICER", "Inactive"],
    ],
  },
  {
    key: "application-summary",
    title: "Verification Operations Summary",
    description:
      "Export verification workload across states for executive review and operational dashboards.",
    headers: ["Status", "Applications"],
    rows: [
      ["Pending Verification", "72"],
      ["Document Verified", "48"],
      ["Field Verified", "19"],
    ],
  },
];

function AdminReportsPage() {
  const reportCards = useMemo(() => reportOptions, []);

  const downloadReport = (report) => {
    const csvContent = [
      report.headers.join(","),
      ...report.rows.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${report.key}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${report.title} downloaded`);
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-slate-950 p-8 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-300">
              Enterprise Reporting
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-white">
              Enterprise Intelligence Reports
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Export executive-grade report packages for audit, compliance, and
              operations. This page is designed for report exports only; the
              application form workflows remain in the scheme and case
              management sections.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 px-5 py-4 text-sm font-semibold text-slate-100 shadow-inner">
            <span className="block text-slate-300">Ready to export</span>
            <span className="mt-1 text-2xl font-bold text-white">
              2 reports available
            </span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {reportCards.map((report) => (
          <Card key={report.key} className="space-y-5 rounded-[32px] p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-3xl bg-slate-100 p-3 text-slate-700">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {report.title}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {report.description}
                </p>
              </div>
            </div>

            <div className="grid gap-2 rounded-[24px] bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between font-semibold text-slate-800">
                <span>Columns</span>
                <span>{report.headers.length}</span>
              </div>
              <div className="grid gap-1">
                {report.headers.map((header) => (
                  <span
                    key={header}
                    className="rounded-2xl bg-white px-3 py-2 shadow-sm"
                  >
                    {header}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-slate-700">
                <Users size={16} /> {report.rows.length} rows
              </div>
              <Button onClick={() => downloadReport(report)} fullWidth={false}>
                <Download size={16} /> Download CSV
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminReportsPage;
