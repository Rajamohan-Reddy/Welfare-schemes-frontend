export const APPLICATION_WORKFLOW_STATUSES = [
  "SUBMITTED",
  "DOCUMENT_VERIFIED",
  "FIELD_VERIFIED",
  "APPROVED",
  "PAID",
];

export const STATUS_PROGRESS = {
  SUBMITTED: 20,
  DOCUMENT_VERIFIED: 40,
  FIELD_VERIFIED: 60,
  APPROVED: 80,
  PAID: 100,
  REJECTED: 100,
};

export const STATUS_LABELS = {
  SUBMITTED: "Application Submitted",
  DOCUMENT_VERIFIED: "Documents Verified",
  FIELD_VERIFIED: "Field Verification",
  APPROVED: "Approval Complete",
  PAID: "Payment Completed",
  REJECTED: "Application Rejected",
};

const STATUS_ALIASES = {
  UNDER_VERIFICATION: "DOCUMENT_VERIFIED",
  VERIFIED: "FIELD_VERIFIED",
  PAYMENT_PENDING: "APPROVED",
  BENEFIT_DISBURSED: "PAID",
};

export const normalizeApplicationStatus = (status) => {
  if (!status) return status;
  return STATUS_ALIASES[status] || status;
};

export const getApplicationProgress = (status) => {
  const normalized = normalizeApplicationStatus(status);
  return STATUS_PROGRESS[normalized] ?? 0;
};

export const getCompletedStepIndex = (status) => {
  const normalized = normalizeApplicationStatus(status);
  if (normalized === "REJECTED") return -1;
  return APPLICATION_WORKFLOW_STATUSES.indexOf(normalized);
};

export const isStepCompleted = (stepStatus, currentStatus) => {
  const normalized = normalizeApplicationStatus(currentStatus);
  if (normalized === "REJECTED") return false;

  const stepIndex = APPLICATION_WORKFLOW_STATUSES.indexOf(stepStatus);
  const currentIndex = APPLICATION_WORKFLOW_STATUSES.indexOf(normalized);

  return stepIndex >= 0 && currentIndex >= 0 && stepIndex <= currentIndex;
};

export const isCurrentStep = (stepStatus, currentStatus) => {
  const normalized = normalizeApplicationStatus(currentStatus);
  if (normalized === "PAID" || normalized === "REJECTED") return false;
  return normalized === stepStatus;
};

export const getTimelineSteps = (status) => {
  const normalized = normalizeApplicationStatus(status);
  if (normalized === "REJECTED") {
    return ["SUBMITTED", "DOCUMENT_VERIFIED", "FIELD_VERIFIED", "REJECTED"];
  }
  return APPLICATION_WORKFLOW_STATUSES;
};

export const getStageLabel = (status) => {
  const normalized = normalizeApplicationStatus(status);
  return (
    STATUS_LABELS[normalized] ||
    (normalized ? normalized.replaceAll("_", " ") : "Unknown")
  );
};

export const getPaymentDateLabel = (application) => {
  const date =
    application?.paymentDate || application?.paidAt || application?.processedAt;

  if (date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return "Completed Successfully";
};
