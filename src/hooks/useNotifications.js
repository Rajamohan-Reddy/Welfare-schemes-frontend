import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteAllNotificationsMutation,
} from "../store/services/notifications.api";
import { useAuth } from "./useAuth";

export default function useNotifications(pollInterval = 60000) {
  const { isAuthenticated, initialized } = useAuth();
  const skip = !initialized || !isAuthenticated;
  const initialLoadRef = useRef(true);
  const idsRef = useRef(new Set());

  const { data: notifications = [], isLoading, isFetching, refetch } =
    useGetNotificationsQuery(undefined, {
      skip,
      pollingInterval: pollInterval,
    });

  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  useEffect(() => {
    if (skip || !notifications.length) {
      if (skip) initialLoadRef.current = true;
      return;
    }

    const newItems = notifications.filter((item) => !idsRef.current.has(item._id));
    if (!initialLoadRef.current && newItems.length > 0) {
      newItems.forEach((item) => toast.success(item.title || "New notification"));
    }

    idsRef.current = new Set(notifications.map((item) => item._id));
    initialLoadRef.current = false;
  }, [notifications, skip]);

  const markRead = async (id) => {
    await markNotificationRead(id).unwrap();
  };

  const remove = async (id) => {
    await deleteNotification(id).unwrap();
  };

  const markAllRead = async () => {
    await markAllNotificationsRead().unwrap();
    toast.success("All notifications marked as read");
  };

  const clearAll = async () => {
    await deleteAllNotifications().unwrap();
    toast.success("All notifications cleared");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading: isLoading || isFetching,
    unreadCount,
    markRead,
    remove,
    markAllRead,
    clearAll,
    refresh: refetch,
  };
}
