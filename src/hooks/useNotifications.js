import { useEffect, useRef, useState } from "react";
import {
  getNotificationsApi,
  markNotificationReadApi,
  deleteNotificationApi,
  markAllReadApi,
  deleteAllNotificationsApi,
} from "../features/notifications/api/notifications.api";
import { toast } from "react-hot-toast";

export default function useNotifications(pollInterval = 30000) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const idsRef = useRef(new Set());
  const timerRef = useRef(null);
  const initialLoadRef = useRef(true);
  const pageVisibleRef = useRef(true);

  const fetchNotifications = async () => {
    if (!pageVisibleRef.current) return;

    try {
      setLoading(true);
      const resp = await getNotificationsApi();
      const items = resp.data.data || [];

      const newItems = items.filter((it) => !idsRef.current.has(it._id));
      if (!initialLoadRef.current && newItems.length > 0) {
        newItems.forEach((it) => toast.success(it.title || "New notification"));
      }

      setNotifications(items);
      idsRef.current = new Set(items.map((i) => i._id));
      initialLoadRef.current = false;
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      toast.error("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      pageVisibleRef.current = document.visibilityState === "visible";
      if (pageVisibleRef.current) {
        fetchNotifications();
      }
    };

    pageVisibleRef.current = document.visibilityState === "visible";
    if (pageVisibleRef.current) {
      fetchNotifications();
    }

    timerRef.current = setInterval(fetchNotifications, pollInterval);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pollInterval]);

  const markRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark notification read");
    }
  };

  const remove = async (id) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const markAllRead = async () => {
    try {
      await markAllReadApi();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const clearAll = async () => {
    try {
      await deleteAllNotificationsApi();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear notifications");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    loading,
    unreadCount,
    markRead,
    remove,
    markAllRead,
    clearAll,
    refresh: fetchNotifications,
  };
}
