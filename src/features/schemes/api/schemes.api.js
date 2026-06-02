import api from "../../../api/axios";

export const getAllSchemesApi = async () => {
  return await api.get("/schemes");
};

export const getSchemeByIdApi = async (id) => {
  return await api.get(`/schemes/${id}`);
};

export const getAllCategoriesApi = async () => {
  return await api.get("/scheme-categories");
};

export const createSchemeApi = async (payload) => {
  return await api.post("/schemes", payload);
};

export const updateSchemeApi = async (id, payload) => {
  return await api.put(`/schemes/${id}`, payload);
};

export const deleteSchemeApi = async (id) => {
  return await api.delete(`/schemes/${id}`);
};

export const createSchemeCategoryApi = async (payload) => {
  return await api.post("/scheme-categories", payload);
};

export const updateSchemeCategoryApi = async (id, payload) => {
  return await api.put(`/scheme-categories/${id}`, payload);
};

export const deleteSchemeCategoryApi = async (id) => {
  return await api.delete(`/scheme-categories/${id}`);
};
