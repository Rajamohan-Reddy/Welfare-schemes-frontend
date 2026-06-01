import { Bell, Search, User, Settings, FileText, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getUser, clearAuthStorage } from "../../utils/storage";
import { ROUTES } from "../../constants/routes";
import useNotifications from "../../hooks/useNotifications";

function Header() {
  const [user, setUserState] = useState(getUser());
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const {
    notifications,
    loading,
    unreadCount,
    markRead,
    remove,
    markAllRead,
    clearAll,
    refresh,
  } = useNotifications();

  useEffect(() => {
    const handleProfileUpdate = () => setUserState(getUser());
    window.addEventListener("userProfileUpdated", handleProfileUpdate);

    return () => window.removeEventListener("userProfileUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login");
  };

  const notificationRoute = `/${user?.role?.toLowerCase()}/notifications`;

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    navigate(`${ROUTES.CITIZEN_SCHEMES}?search=${encodeURIComponent(query)}`);
  };

  const handleNotificationClick = (id) => {
    markRead(id).catch((err) => {
      toast.error("Unable to mark notification read");
      console.error(err);
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-900/80 bg-slate-950/95 text-white shadow-2xl backdrop-blur-sm">
      <div className="mx-auto flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300">
            Government of Andhra Pradesh
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold text-white">
              Welfare Command Center
            </h1>
            <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300">
              {user?.role?.replaceAll("_", " ")}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Executive oversight for applications, alerts, and operational
            analytics.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-[420px]"
          >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, applications, alerts"
              className="h-12 w-full rounded-3xl border border-slate-800 bg-slate-900/95 px-12 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"
            />
          </form>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  if (!showNotifications) refresh();
                }}
                className="relative inline-flex h-12 w-12 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 text-slate-100 shadow-sm transition hover:border-slate-700 hover:bg-slate-800"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-[360px] rounded-[28px] border border-slate-800 bg-slate-950 p-5 shadow-2xl">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.25em] text-sky-300">
                        Alert Intelligence
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-white">
                        Critical notifications
                      </h3>
                      <p className="text-sm text-slate-400">
                        Priority alerts, service updates, and operational
                        signals.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                      >
                        Mark all read
                      </button>
                      <button
                        type="button"
                        onClick={clearAll}
                        className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-500"
                      >
                        Clear all
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(notificationRoute)}
                        className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-slate-800"
                      >
                        Open intelligence
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {loading ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="rounded-3xl bg-slate-900 p-6 text-center text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification._id}
                          className="rounded-3xl border border-slate-800 bg-slate-900 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${notification.read ? "bg-slate-800 text-slate-400" : "bg-sky-500 text-white"}`}
                              >
                                {notification.read ? "Read" : "New"}
                              </span>
                              <h4 className="mt-3 truncate text-sm font-semibold text-white">
                                {notification.title}
                              </h4>
                              <p className="mt-2 text-sm leading-6 text-slate-300">
                                {notification.message}
                              </p>
                              <p className="mt-3 text-xs text-slate-500">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {!notification.read && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleNotificationClick(notification._id)
                                  }
                                  className="rounded-full bg-sky-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-sky-400"
                                >
                                  Mark read
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => remove(notification._id)}
                                className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setShowProfile((prev) => !prev)}
                className="flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-white shadow-sm transition hover:bg-slate-800"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-sky-500 to-blue-500 text-lg font-bold">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user?.firstName} avatar`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">
                      {user?.firstName?.charAt(0) || "C"}
                    </span>
                  )}
                </div>
                <div className="hidden min-w-[140px] flex-col text-left sm:flex">
                  <p className="text-sm font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {user?.role?.replaceAll("_", " ")}
                  </p>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-3 w-[280px] rounded-[28px] border border-slate-800 bg-slate-950 p-4 shadow-2xl">
                  <div className="border-b border-slate-800 pb-4">
                    <p className="text-base font-semibold text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {user?.role?.replaceAll("_", " ")}
                    </p>
                  </div>

                  <MenuItem
                    icon={User}
                    label="My Profile"
                    onClick={() => {
                      setShowProfile(false);
                      navigate(`/${user?.role?.toLowerCase()}/profile`);
                    }}
                  />
                  <MenuItem
                    icon={FileText}
                    label="Applications"
                    onClick={() => {
                      setShowProfile(false);
                      navigate(
                        `/${user?.role?.toLowerCase()}/${user?.role === "CITIZEN" ? "applications" : "dashboard"}`,
                      );
                    }}
                  />
                  <MenuItem
                    icon={Settings}
                    label="Settings"
                    onClick={() => {
                      setShowProfile(false);
                      navigate(`/${user?.role?.toLowerCase()}/settings`);
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-rose-600 px-4 py-3 text-white hover:bg-rose-500"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-200 hover:bg-slate-900"
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

export default Header;
