import { useEffect, useState } from "react";
import { ShieldCheck, Bell, Key, Lock, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { changeMyPasswordApi } from "../api/profile.api";

function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const savedNotifications = localStorage.getItem("welfare-notifications-enabled");
    const savedRefresh = localStorage.getItem("welfare-auto-refresh");

    setNotificationsEnabled(
      savedNotifications ? JSON.parse(savedNotifications) : true,
    );
    setAutoRefresh(savedRefresh ? JSON.parse(savedRefresh) : true);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "welfare-notifications-enabled",
      JSON.stringify(notificationsEnabled),
    );
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem("welfare-auto-refresh", JSON.stringify(autoRefresh));
  }, [autoRefresh]);

  const handlePasswordSave = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill all password fields to continue.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      await changeMyPasswordApi({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Unable to update password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Account Settings Header Banner */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#047857] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#FFD95A]">
              <Sparkles size={14} /> SECURITY & CONFIGURATION PANEL
            </span>
            <h1 className="text-4xl font-black tracking-tight leading-tight">Preferences</h1>
            <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
              Configure security layers, audit credentials, and manage notification feeds to tailor your welfare portal environment.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Notification Preferences */}
        <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#071A52]">Notification Preferences</h2>
              <p className="text-xs text-slate-400">Audit system triggers and mail delivery feeds.</p>
            </div>
          </div>

          <div className="space-y-4">
            <SwitchRow
              label="Email alerts"
              description="Get important updates for application progress and verification history."
              value={notificationsEnabled}
              onToggle={() => setNotificationsEnabled((prev) => !prev)}
            />
            <SwitchRow
              label="Live refresh"
              description="Refresh the officer queue and notification feed automatically."
              value={autoRefresh}
              onToggle={() => setAutoRefresh((prev) => !prev)}
            />

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Fast-Sync Protocol</h4>
              <p className="text-xs leading-relaxed text-slate-500">
                When auto-refresh is active, the system queries the secure server registry every 30 seconds to fetch live application logs, queue changes, and urgent announcements.
              </p>
            </div>
          </div>
        </Card>

        {/* Security Password Changes */}
        <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#047857] shadow-inner">
              <Key size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#071A52]">Security settings</h2>
              <p className="text-xs text-slate-400">Update account access passwords regularly.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-2xl"
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-2xl"
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-2xl"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4.5">
            <div className="flex gap-2">
              <ShieldCheck size={18} className="text-[#047857] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-700">Security Recommendation</p>
                <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                  Ensure passwords exceed 8 characters. Mix upper, lowercase, numerals, and special characters. Avoid repeats across portals.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handlePasswordSave}
              loading={savingPassword}
              fullWidth={false}
              className="rounded-full bg-[#071A52] hover:bg-slate-900 text-white px-7 py-3 font-bold text-xs"
            >
              Update Password
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SwitchRow({ label, description, value, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md">
      <div>
        <p className="text-sm font-extrabold text-[#071A52]">{label}</p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xs">{description}</p>
      </div>
      
      <button
        onClick={onToggle}
        className={`focus:outline-none transition-colors duration-200 shrink-0 ${
          value ? "text-emerald-500" : "text-slate-300"
        }`}
      >
        {value ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
      </button>
    </div>
  );
}

export default SettingsPage;
