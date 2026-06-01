import { useMemo } from "react";
import {
  LayoutDashboard,
  Search,
  FileText,
  Bell,
  CheckCircle2,
  User,
  Settings,
  ShieldCheck,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { getUser } from "../../utils/storage";
import Logo from "../../assets/images/ap-logo.png";

function Sidebar({ expanded, setExpanded }) {
  const user = getUser();

  const menuItems = useMemo(() => {
    if (!user) return [];

    if (user.role === "ADMIN") {
      return [
        { label: "Command Center", icon: LayoutDashboard, path: "/admin/dashboard" },
        { label: "Operations", icon: Users, path: "/admin/staff" },
        { label: "Intelligence", icon: FileText, path: "/admin/reports" },
        { label: "Alerts", icon: Bell, path: "/admin/notifications" },
      ];
    }

    if (user.role === "OFFICER") {
      return [
        { label: "Command Center", icon: LayoutDashboard, path: "/officer/dashboard" },
        { label: "Review Command", icon: ShieldCheck, path: "/officer/queue" },
        { label: "Alerts", icon: Bell, path: "/officer/notifications" },
      ];
    }

    return [
      { label: "Command Center", icon: LayoutDashboard, path: "/citizen/dashboard" },
      { label: "Schemes", icon: Search, path: "/citizen/schemes" },
      { label: "Applications", icon: FileText, path: "/citizen/applications" },
      { label: "Alerts", icon: Bell, path: "/citizen/notifications" },
      { label: "Profile", icon: User, path: "/citizen/profile" },
      { label: "Settings", icon: Settings, path: "/citizen/settings" },
      { label: "Eligibility", icon: CheckCircle2, path: "/citizen/eligibility" },
    ];
  }, [user]);

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#0b287d] bg-[#071A52] shadow-2xl transition-all duration-300 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      {/* ── Logo & Premium Header Section ── */}
      <div
        className={`flex flex-col items-center border-b border-[#0b287d]/40 py-6 gap-4 transition-all duration-300 ${
          expanded ? "px-5" : "px-3"
        }`}
      >
        <div className="flex flex-col items-center gap-3 min-w-0">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-2xl ring-4 ring-blue-500/20 transition-all duration-300 ${
              expanded ? "h-16 w-16 hover:scale-105 hover:rotate-2" : "h-12 w-12 shadow-lg"
            }`}
          >
            <img
              src={Logo}
              alt="AP Government Logo"
              className="h-full w-full object-contain"
            />
          </div>
          {expanded && (
            <div className="text-center animate-[fadeIn_0.2s_ease-out] min-w-0">
              <p className="truncate text-xs font-black tracking-widest text-white uppercase leading-tight">
                Government of
              </p>
              <p className="text-xs font-black tracking-wider text-blue-300 uppercase mt-0.5 truncate">
                Andhra Pradesh
              </p>
              <p className="text-[9px] font-bold text-blue-400/80 mt-1 uppercase tracking-widest truncate">
                Welfare Portal
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Collapse Trigger Button (Top of all icons) ── */}
      <div className="flex justify-center py-2.5 border-b border-[#0b287d]/40 bg-blue-950/20">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          title={expanded ? "Minimize Console" : "Maximize Console"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-300 hover:text-white hover:bg-blue-600/30 transition-all active:scale-95 shadow-sm"
        >
          {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* ── Navigation Links (Aligned correctly with best spacing) ── */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3.5 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.label}
            className={({ isActive }) =>
              `group relative flex items-center rounded-xl transition-all duration-200 ${
                expanded ? "px-4 py-3.5 gap-3.5 w-full" : "h-12 w-12 justify-center mx-auto"
              } ${
                isActive
                  ? "bg-gradient-to-r from-blue-600/35 to-blue-500/10 text-white border border-blue-500/20 shadow-lg shadow-blue-950/40"
                  : "text-blue-200/70 hover:text-white hover:bg-white/5 border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="shrink-0"
                />
                {expanded && (
                  <span className="text-xs font-semibold tracking-wide transition-opacity duration-300">
                    {item.label}
                  </span>
                )}

                {/* Left Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                )}

                {/* Collapsed Hover Tooltip */}
                {!expanded && (
                  <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-50 -translate-y-1/2 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-xl shadow-black/40">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
