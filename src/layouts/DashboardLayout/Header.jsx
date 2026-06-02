import { Bell, Search, User, Settings, FileText, LogOut, Check, Trash2, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getUser, clearAuthStorage } from "../../utils/storage";
import useNotifications from "../../hooks/useNotifications";

function Header() {
  const [user, setUserState] = useState(getUser());
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  // ── Dark / Light theme toggle ─────────────────────
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Initialise from localStorage on mount
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

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
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login");
  };

  const notificationRoute = `/${user?.role?.toLowerCase()}/notifications`;

  // ── Smart search — works for every role ──────────
  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    const role = user?.role?.toLowerCase();
    if (role === "admin") {
      navigate(`/admin/reports?search=${encodeURIComponent(query)}`);
    } else if (role === "officer") {
      navigate(`/officer/queue?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/citizen/schemes?search=${encodeURIComponent(query)}`);
    }
  };

  const handleNotificationClick = (id) => {
    markRead(id).catch((err) => {
      toast.error("Unable to mark notification read");
      console.error(err);
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#0b287d] bg-[#071A52] backdrop-blur-xl text-white shadow-md">
      <div className="w-full flex items-center justify-between gap-6 px-6 py-4.5 lg:py-5">
        {/* Left — Greeting (Increased sizes) */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300/80 leading-none">
            Government of Andhra Pradesh
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-xl font-black text-white tracking-tight truncate leading-none">
              {user?.firstName ? `${user.firstName}'s dashboard` : "Citizen console"}
            </h1>
            <span className="hidden sm:inline-flex rounded-full bg-blue-500/20 border border-blue-400/30 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-blue-200 shrink-0 shadow-sm shadow-blue-900/30">
              {user?.role?.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        {/* Right — Search + Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-300/70" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="h-9.5 w-44 lg:w-60 rounded-full border border-blue-800/60 bg-blue-950/50 pl-8 pr-3 text-xs font-semibold text-white outline-none transition focus:border-blue-400 focus:w-72 placeholder:text-blue-400/50"
            />
          </form>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="h-9.5 w-9.5 flex items-center justify-center rounded-full border border-blue-800/60 bg-blue-950/40 text-blue-200 hover:bg-blue-800/60 transition active:scale-95 shadow-sm"
            title={isDark ? "Switch to Light" : "Switch to Dark"}
          >
            {isDark ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} />}
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => { setShowNotifications((p) => !p); if (!showNotifications) refresh(); }}
              className={`relative h-9.5 w-9.5 flex items-center justify-center rounded-full border transition active:scale-95 shadow-sm ${showNotifications
                  ? "border-blue-400 bg-blue-500/25 text-white"
                  : "border-blue-800/60 bg-blue-950/40 text-blue-200 hover:bg-blue-800/60"
                }`}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[8px] font-extrabold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* macOS Apple-Style Notification Dropdown (White Background & Dark Fonts) */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-3 w-80 z-50 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-200">
                {/* Header */}
                <div className="flex items-center justify-between bg-slate-50 px-4 py-3.5 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-black text-slate-800 tracking-wide">Notifications</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-0.5">{unreadCount} unread</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={markAllRead} title="Mark all read"
                      className="rounded-full p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 transition">
                      <Check size={12} />
                    </button>
                    <button type="button" onClick={clearAll} title="Clear all"
                      className="rounded-full p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-100 border-t-blue-600" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-12 text-center text-[11px] font-bold text-slate-400">
                      All caught up! No notifications.
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div key={n._id}
                        className={`flex gap-3 items-start px-4 py-3.5 hover:bg-slate-50 transition ${!n.read ? "bg-blue-50/50" : ""
                          }`}
                      >
                        <span className={`mt-2 h-1.5 w-1.5 rounded-full shrink-0 ${n.read ? "bg-slate-250" : "bg-blue-600 shadow-[0_0_8px_#3b82f6]"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-slate-800 truncate">{n.title}</p>
                          <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          {!n.read && (
                            <button type="button" onClick={() => handleNotificationClick(n._id)} title="Mark read"
                              className="rounded-full p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                              <Check size={11} />
                            </button>
                          )}
                          <button type="button" onClick={() => remove(n._id)} title="Delete"
                            className="rounded-full p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <button
                  onClick={() => { setShowNotifications(false); navigate(notificationRoute); }}
                  className="w-full py-3 text-center text-[10px] font-extrabold uppercase tracking-widest text-blue-600 hover:bg-slate-50 border-t border-slate-100 transition"
                >
                  View All Alerts
                </button>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfile((p) => !p)}
              className="flex items-center gap-2.5 rounded-full border border-blue-800/60 bg-blue-950/40 pl-1.5 pr-3.5 py-1.5 hover:bg-blue-800/60 transition shadow-sm"
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold overflow-hidden shadow-sm ring-2 ring-white/10 shrink-0">
                {user?.profileImage
                  ? <img src={user.profileImage} alt="avatar" className="h-full w-full object-cover" />
                  : <span>{user?.firstName?.charAt(0) || "U"}</span>
                }
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-black text-white leading-tight">{user?.firstName}</p>
                <p className="text-[9px] text-blue-300 font-bold uppercase tracking-wider mt-0.5">{user?.role?.replaceAll("_", " ")}</p>
              </div>
            </button>

            {/* macOS Apple-Style Profile Dropdown (White Background & Dark Fonts) */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-3 w-60 z-50 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-200">
                {/* Profile Header */}
                <div className="bg-slate-50 px-4 py-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black overflow-hidden ring-2 ring-blue-500/20 shadow-sm">
                      {user?.profileImage
                        ? <img src={user.profileImage} alt="avatar" className="h-full w-full object-cover" />
                        : <span>{user?.firstName?.charAt(0) || "U"}</span>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{user?.role?.replaceAll("_", " ")}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2 space-y-1 bg-white">
                  <MenuItem icon={User} label="My Profile"
                    onClick={() => { setShowProfile(false); navigate(`/${user?.role?.toLowerCase()}/profile`); }} />
                  <MenuItem icon={FileText} label="Dashboard"
                    onClick={() => { setShowProfile(false); navigate(`/${user?.role?.toLowerCase()}/dashboard`); }} />
                  <MenuItem icon={Settings} label="Settings"
                    onClick={() => { setShowProfile(false); navigate(`/${user?.role?.toLowerCase()}/settings`); }} />
                </div>

                <div className="px-2 pb-2 bg-white">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl bg-rose-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition shadow-sm"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </div>
              </div>
            )}
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
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
    >
      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50">
        <Icon size={13} className="text-slate-500" />
      </div>
      {label}
    </button>
  );
}

export default Header;
