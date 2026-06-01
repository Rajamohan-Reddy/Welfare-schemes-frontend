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
