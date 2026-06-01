import api from "../../../api/axios";

export const getOfficerDashboardApi = async () => {
  return await api.get("/dashboard/officer");
};

export const getAdminDashboardApi = async () => {
  return await api.get("/dashboard/admin");
};

export const getCitizenDashboardApi = async () => {
  return await api.get("/dashboard/citizen");
};

export const getApplicationStatusChartApi = async () => {
  return await api.get("/dashboard/application-status-chart");
};

export const getMonthlyApplicationsChartApi = async () => {
  return await api.get("/dashboard/monthly-applications-chart");
};

export const getSchemeWiseApplicationsApi = async () => {
  return await api.get("/dashboard/scheme-wise-applications");
};
