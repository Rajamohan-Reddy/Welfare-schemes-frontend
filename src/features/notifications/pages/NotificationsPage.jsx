import { useEffect, useState } from "react";
import { Bell, Check, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllReadApi,
  deleteNotificationApi,
  deleteAllNotificationsApi,
} from "../api/notifications.api";

function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotificationsApi();
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? { ...item, read: true } : item)),
      );
      toast.success("Notification marked as read");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark notification read");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllReadApi();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
      toast.success("All notifications marked read");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationApi(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotificationsApi();
      setNotifications([]);
      toast.success("All notifications deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete all notifications");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-slate-950 p-8 shadow-2xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
              Alert Intelligence
            </p>
            <h1 className="mt-3 text-4xl font-extrabold text-white">
              Notifications
            </h1>
            <p className="mt-2 max-w-2xl text-slate-300">
              A premium alert console for service updates, application status
              changes, and verification notifications.
            </p>
          </div>

          <div className="rounded-[28px] bg-slate-900 p-6 text-slate-100 shadow-inner">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300">
              System pulse
            </p>
            <p className="mt-4 text-3xl font-semibold text-white">
              {notifications.filter((item) => !item.read).length} unread alerts
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Stay on top of important action items and secure service updates.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button
                onClick={loadNotifications}
                variant="secondary"
                fullWidth={false}
              >
                Refresh
              </Button>
              <Button
                onClick={handleMarkAll}
                variant="success"
                fullWidth={false}
              >
                Mark all read
              </Button>
              <Button
                onClick={handleDeleteAll}
                variant="secondary"
                className="bg-rose-600 text-white hover:bg-rose-700"
                fullWidth={false}
              >
                Clear all
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[32px] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Message Center
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Latest service notifications delivered directly to your portal.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
              {notifications.length} total
            </div>
          </div>

          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <Loader2 size={36} className="animate-spin text-blue-600" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="grid place-items-center gap-3 py-20 text-center text-slate-500">
              <Bell size={48} className="text-slate-300" />
              <p className="text-xl font-semibold">No notifications yet</p>
              <p className="max-w-md text-sm">
                Your notification feed will surface verification alerts,
                application updates, and important portal announcements.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-2">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`rounded-[28px] border p-5 shadow-sm transition ${notification.read ? "border-slate-200 bg-white" : "border-sky-200 bg-sky-50"}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${notification.read ? "bg-slate-100 text-slate-600" : "bg-sky-600 text-white"}`}
                        >
                          {notification.read ? "Read" : "New"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm leading-6 text-slate-600">
                        {notification.message}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {!notification.read && (
                        <Button
                          onClick={() => handleMarkRead(notification._id)}
                          variant="success"
                          fullWidth={false}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDelete(notification._id)}
                        variant="secondary"
                        fullWidth={false}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="rounded-[32px] bg-slate-950 p-6 text-white">
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">
                Notification insights
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Engagement summary
              </h2>
            </div>
            <div className="rounded-[28px] bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Unread alerts</p>
              <p className="mt-3 text-4xl font-bold text-white">
                {notifications.filter((item) => !item.read).length}
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-900 p-5">
              <p className="text-sm text-slate-400">Recent event type</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {notifications[0]?.title || "No recent notifications"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default NotificationsPage;
