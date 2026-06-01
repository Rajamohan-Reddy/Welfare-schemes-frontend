import api from "../../../api/axios";

// Backend may not expose audit logs API yet, so this is a placeholder for future integration
export const getAuditLogsApi = async (params = {}) => {
  try {
    return await api.get("/audit-logs", { params });
  } catch (err) {
    // Fallback if endpoint doesn't exist
    console.warn("Audit logs endpoint not available", err);
    return { data: { data: [] } };
  }
};

export const getApplicationAuditLogsApi = async (applicationId) => {
  try {
    return await api.get(`/applications/${applicationId}/audit-logs`);
  } catch (err) {
    console.warn("Application audit logs endpoint not available", err);
    return { data: { data: [] } };
  }
};
