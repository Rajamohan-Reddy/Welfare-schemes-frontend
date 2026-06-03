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

/**
 * Get applications by status for admin approval/action queue
 * @param {string} status - Application status (e.g., 'FIELD_VERIFIED', 'APPROVED')
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
export const getApplicationsByStatusApi = async (status, page = 1, limit = 20) => {
  return await api.get("/admin/applications", {
    params: { status, page, limit },
  });
};
