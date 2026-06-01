import api from "../../../api/axios";

export const getMyProfileApi = async () => {
  return await api.get("/profile/me");
};

export const updateMyProfileApi = async (payload) => {
  return await api.put("/profile/me", payload);
};

export const updateMyProfileImageApi = async (profileImage) => {
  return await api.patch("/profile/photo", { profileImage });
};

export const changeMyPasswordApi = async (payload) => {
  return await api.patch("/profile/change-password", payload);
};
