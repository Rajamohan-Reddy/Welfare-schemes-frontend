import { baseApi, API_BASE_URL } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: ({ file, documentType }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", "application-document");

        return {
          url: "/uploads/single",
          method: "POST",
          body: formData,
          formData: true,
        };
      },
      transformResponse: (response, _meta, arg) => ({
        documentType: arg.documentType,
        fileUrl: response?.data?.path ?? response?.path,
      }),
    }),
    downloadApplicationsReport: builder.query({
      query: (params) => ({
        url: "/reports/applications",
        params,
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
        cache: "no-cache",
      }),
      providesTags: ["Reports"],
    }),
  }),
});

export { API_BASE_URL };

export const { useUploadFileMutation, useLazyDownloadApplicationsReportQuery } =
  uploadApi;
