import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Trash2,
  Loader2,
  ShieldAlert,
  Info,
  FileCheck2,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import Card from "../../../components/ui/Card";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from "../../../store/services/notifications.api";

function NotificationsPage() {
  const { data: notifications = [], isLoading: loading, refetch } =
    useGetNotificationsQuery();
  const [markNotificationRead] = useMarkNotificationReadMutation();
  const [markAllNotificationsRead] = useMarkAllNotificationsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
  const [filter, setFilter] = useState("all");

  const loadNotifications = () => {
    refetch();
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id).unwrap();
      toast.success("Notification marked as read");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark notification read");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead().unwrap();
      toast.success("All notifications marked read");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success("Notification deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications().unwrap();
      toast.success("All notifications cleared");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete all notifications");
    }
  };

  const resolveNotificationMeta = (item) => {
    const title = item.title.toLowerCase();
    if (title.includes("approve") || title.includes("success") || title.includes("verify")) {
      return {
        icon: FileCheck2,
        colorClass: "bg-emerald-50 border-emerald-100 text-emerald-700",
        badge: "Operations",
      };
    }
    if (title.includes("alert") || title.includes("reject") || title.includes("critical") || title.includes("warn")) {
      return {
        icon: ShieldAlert,
        colorClass: "bg-red-50 border-red-100 text-red-700",
        badge: "Critical",
      };
    }
    return {
      icon: Info,
      colorClass: "bg-blue-50 border-blue-100 text-blue-700",
      badge: "Information",
    };
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.isRead;
    if (filter === "read") return item.isRead;
    return true;
  });

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#4338CA] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-indigo-300">
              <Bell size={14} /> SYSTEM PULSE & SIGNALS
            </span>
            <h1 className="text-4xl font-black tracking-tight leading-tight">Alert Intelligence</h1>
            <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
              Monitor priority system events, operational actions, and secure service milestones from a unified administrative and citizen log registry.
            </p>
          </div>

          <div className="w-full lg:w-80 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-inner flex justify-between items-center gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Priority Signals</p>
              <p className="mt-2 text-2xl font-black text-white">{unreadCount} Unread</p>
              <p className="text-[11px] text-slate-400 mt-1">Awaiting review</p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={handleMarkAll}
                className="rounded-full bg-white text-[#0F172A] hover:bg-indigo-50 px-4.5 py-2 text-xs font-bold tracking-wide transition"
              >
                Mark all read
              </button>
              <button
                onClick={handleDeleteAll}
                className="rounded-full bg-red-600 hover:bg-red-700 text-white px-4.5 py-2 text-xs font-bold tracking-wide transition"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600">Event Stream</span>
              <h2 className="mt-1 text-2xl font-black text-[#071A52] tracking-tight">Active Logs</h2>
            </div>

            <div className="flex bg-slate-50 border border-slate-100 rounded-full p-1 font-semibold text-xs text-slate-500">
              {["all", "unread", "read"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`rounded-full px-4.5 py-1.5 uppercase tracking-wide transition-all ${
                    filter === tab ? "bg-white text-[#071A52] shadow-sm font-bold" : "hover:text-[#071A52]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex h-72 items-center justify-center">
              <Loader2 size={36} className="animate-spin text-indigo-600" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500 space-y-4">
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                <Bell size={28} />
              </div>
              <div>
                <p className="text-lg font-bold text-[#071A52]">Event Stream Clear</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">No notifications found matches your filters. Everything is up-to-date and operating normally.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {filteredNotifications.map((item, idx) => {
                  const meta = resolveNotificationMeta(item);
                  const IconComponent = meta.icon;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className={`group rounded-3xl border p-5 shadow-sm hover:shadow transition-all ${
                        item.isRead ? "border-slate-100 bg-white" : "border-indigo-100 bg-indigo-50/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                        <div className="flex gap-4">
                          <div className={`h-11 w-11 rounded-2xl border flex items-center justify-center shrink-0 ${meta.colorClass}`}>
                            <IconComponent size={20} />
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                item.isRead ? "bg-slate-100 text-slate-500" : "bg-indigo-600 text-white"
                              }`}>
                                {item.isRead ? "Archive" : "New"}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <h3 className="text-base font-extrabold text-[#071A52]">{item.title}</h3>
                            <p className="text-xs leading-relaxed text-slate-500">{item.message}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                          {!item.isRead && (
                            <button
                              onClick={() => handleMarkRead(item._id)}
                              className="h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-3 text-xs font-bold shadow-md transition"
                            >
                              Acknowledge
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <div className="w-full rounded-[28px] border border-slate-700 bg-[#0F172A] text-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)] relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0,transparent_100%)] pointer-events-none" />

            <div className="border-b border-white/5 pb-4 mb-5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">Metrics Hub</span>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight">Signal Analysis</h3>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Alerts Load</p>
                <p className="mt-2 text-3xl font-black text-[#FFD95A]">{unreadCount} Alerts</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latest Registered Log</p>
                <p className="mt-2 text-sm font-bold truncate">{notifications[0]?.title || "No recent activity logged"}</p>
              </div>

              <button
                onClick={loadNotifications}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 p-4 text-xs font-bold text-white transition mt-4"
              >
                <RefreshCw size={14} /> Refresh Channels
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
