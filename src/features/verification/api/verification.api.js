import api from "../../../api/axios";

export const getPendingQueueApi = async () => {
  return await api.get("/verifications/pending");
};

export const getDocumentVerifiedQueueApi = async () => {
  return await api.get("/verifications/document-verified");
};

export const getFieldVerifiedQueueApi = async () => {
  return await api.get("/verifications/field-verified");
};

export const documentVerifyApi = async (applicationId, payload) => {
  return await api.patch(
    `/verifications/${applicationId}/document-verify`,
    payload,
  );
};

export const fieldVerifyApi = async (applicationId, payload) => {
  return await api.patch(
    `/verifications/${applicationId}/field-verify`,
    payload,
  );
};

export const approveApi = async (applicationId, payload) => {
  return await api.patch(`/verifications/${applicationId}/approve`, payload);
};

export const rejectApi = async (applicationId, payload) => {
  return await api.patch(`/verifications/${applicationId}/reject`, payload);
};
