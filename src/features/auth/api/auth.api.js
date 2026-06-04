import api from "../../../api/axios";

export const loginApi = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response;
};

export const registerApi = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response;
};

export const meApi = async () => {
  const response = await api.get("/auth/me");
  return response;
};
