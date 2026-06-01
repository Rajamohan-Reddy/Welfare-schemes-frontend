import api from "../../../api/axios";

export const getAdminsApi = async () => {
  return await api.get("/auth/admins");
};

export const getOfficersApi = async () => {
  return await api.get("/auth/officers");
};

export const createAdminApi = async (payload) => {
  return await api.post("/auth/create-admin", payload);
};

export const createOfficerApi = async (payload) => {
  return await api.post("/auth/create-officer", payload);
};

export const updateUserStatusApi = async (id, isActive) => {
  return await api.patch(`/auth/${id}/status`, { isActive });
};

export const getAllUsersApi = async (params = {}) => {
  return await api.get("/users", { params });
};
