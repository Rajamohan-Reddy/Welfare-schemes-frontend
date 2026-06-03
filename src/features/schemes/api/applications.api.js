import api from "../../../api/axios";

export const applySchemeApi = async (payload) => {
  return await api.post("/applications", payload);
};

export const getMyApplicationsApi = async () => {
  return await api.get("/applications/my-applications");
};

export const getApplicationByIdApi = async (id) => {
  return await api.get(`/applications/${id}`);
};

export const getApplicationTimelineApi = async (applicationId) => {
  return await api.get(`/application-tracking/${applicationId}/timeline`);
};
