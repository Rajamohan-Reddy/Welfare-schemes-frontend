import { useMemo, useState } from "react";
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
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { clearAuthStorage, getUser } from "../../utils/storage";
import Logo from "../../assets/images/ap-logo.png";

function Sidebar() {
  const navigate = useNavigate();
  const user = getUser();
  const [expanded, setExpanded] = useState(false);

  const menuItems = useMemo(() => {
    if (!user) return [];

    if (user.role === "ADMIN") {
      return [
        {
          label: "Command Center",
          icon: LayoutDashboard,
          path: "/admin/dashboard",
        },
        { label: "Operations", icon: Users, path: "/admin/staff" },
        { label: "Intelligence", icon: FileText, path: "/admin/reports" },
        { label: "Alerts", icon: Bell, path: "/admin/notifications" },
      ];
    }

    if (user.role === "OFFICER") {
      return [
        {
          label: "Command Center",
          icon: LayoutDashboard,
          path: "/officer/dashboard",
        },
        { label: "Review Command", icon: ShieldCheck, path: "/officer/queue" },
        { label: "Alerts", icon: Bell, path: "/officer/notifications" },
      ];
    }

    return [
      {
        label: "Command Center",
        icon: LayoutDashboard,
        path: "/citizen/dashboard",
      },
      { label: "Schemes", icon: Search, path: "/citizen/schemes" },
      { label: "Applications", icon: FileText, path: "/citizen/applications" },
      { label: "Alerts", icon: Bell, path: "/citizen/notifications" },
      { label: "Profile", icon: User, path: "/citizen/profile" },
      { label: "Settings", icon: Settings, path: "/citizen/settings" },
      {
        label: "Eligibility",
        icon: CheckCircle2,
        path: "/citizen/eligibility",
      },
    ];
  }, [user]);

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/10 bg-[#071A52] transition-all duration-300 ${
        expanded ? "w-[260px] px-4" : "w-[92px] px-3"
      }`}
    >
      <div
        className={`mt-5 flex flex-col gap-4 ${expanded ? "items-start" : "items-center"}`}
      >
        <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-3 shadow-inner">
          <img
            src={Logo}
            alt="AP Government"
            className="h-12 w-12 object-contain"
          />
          {expanded && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                Command Center
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Enterprise intelligence
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          className={`rounded-full border border-white/10 bg-slate-900 text-white transition hover:bg-slate-800 ${
            expanded
              ? "inline-flex h-12 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold"
              : "flex h-12 w-12 items-center justify-center"
          }`}
        >
          {expanded ? <ChevronLeft size={18} /> : <Menu size={18} />}
          {expanded && <span>Collapse</span>}
        </button>
      </div>

      <div className="mt-10 flex flex-1 flex-col gap-2 px-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.label}
            title={expanded ? undefined : item.label}
            className={({ isActive }) =>
              `group relative flex min-h-[56px] items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-all duration-200 ${
                expanded ? "w-full justify-start" : "w-14 justify-center"
              } ${
                isActive
                  ? "bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-white shadow-lg"
                  : "text-blue-200 hover:bg-white/10"
              }`
            }
          >
            <item.icon size={22} />
            {expanded && <span className="truncate">{item.label}</span>}
            {!expanded && (
              <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-2xl bg-slate-950/95 px-3 py-2 text-sm text-white shadow-lg backdrop-blur-md group-hover:block">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto mb-6 px-1">
        <button
          type="button"
          onClick={handleLogout}
          className={`flex min-h-[56px] items-center gap-3 rounded-2xl border border-white/10 bg-slate-900 px-3 text-sm font-semibold text-blue-200 transition duration-200 hover:bg-white/10 ${
            expanded ? "w-full justify-start" : "w-14 justify-center"
          }`}
        >
          <LogOut size={22} />
          {expanded && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
