import { useEffect, useRef, useState } from "react";
import {
  getNotificationsApi,
  markNotificationReadApi,
  deleteNotificationApi,
  markAllReadApi,
  deleteAllNotificationsApi,
} from "../features/notifications/api/notifications.api";
import { toast } from "react-hot-toast";

export default function useNotifications(pollInterval = 60000) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const idsRef = useRef(new Set());
  const timerRef = useRef(null);
  const initialLoadRef = useRef(true);
  const pageVisibleRef = useRef(true);
  const rateLimitBackoffRef = useRef(0); // Track backoff for rate limiting
  const lastFetchTimeRef = useRef(0); // Track last successful fetch
  const rateLimitErrorShownRef = useRef(false); // Only show rate limit error once

  const fetchNotifications = async () => {
    if (!pageVisibleRef.current) return;

    // Don't fetch if currently in rate limit backoff
    if (rateLimitBackoffRef.current > Date.now()) {
      return;
    }

    // Don't fetch more than once per 5 seconds (client-side throttle)
    if (Date.now() - lastFetchTimeRef.current < 5000) {
      return;
    }

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
      lastFetchTimeRef.current = Date.now();
      rateLimitBackoffRef.current = 0; // Reset backoff on success
      rateLimitErrorShownRef.current = false; // Reset error flag
    } catch (err) {
      // Handle rate limiting (429)
      if (err.response?.status === 429) {
        const backoffMs = Math.min(
          Math.pow(2, rateLimitBackoffRef.current / 30000) * 30000,
          300000,
        ); // Max 5 min
        rateLimitBackoffRef.current = Date.now() + backoffMs;

        if (!rateLimitErrorShownRef.current) {
          console.warn(
            `Rate limited. Backing off for ${Math.round(backoffMs / 1000)}s`,
          );
          rateLimitErrorShownRef.current = true;
          // Only show toast once, not on every failed attempt
        }
      } else {
        console.error("Failed to fetch notifications", err);
        if (!err.response?.status === 429) {
          toast.error("Unable to load notifications");
        }
      }
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
