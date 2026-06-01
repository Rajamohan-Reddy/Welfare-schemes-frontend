import api from "../../../api/axios";

export const getNotificationsApi = async () => {
  return await api.get("/notifications/my-notifications");
};

export const getUnreadCountApi = async () => {
  return await api.get("/notifications/unread-count");
};

export const markNotificationReadApi = async (id) => {
  return await api.patch(`/notifications/${id}/read`);
};

export const markAllReadApi = async () => {
  return await api.patch("/notifications/mark-all-read");
};

export const deleteNotificationApi = async (id) => {
  return await api.delete(`/notifications/${id}`);
};

export const deleteAllNotificationsApi = async () => {
  return await api.delete("/notifications");
};
