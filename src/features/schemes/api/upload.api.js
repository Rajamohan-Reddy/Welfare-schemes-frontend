import api from "../../../api/axios";

export const uploadFileApi = async (file, documentType) => {
  const formData = new FormData();

  formData.append("file", file);

  formData.append("uploadType", "application-document");

  const response = await api.post("/uploads/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    documentType,
    fileUrl: response.data.data.path,
  };
};
