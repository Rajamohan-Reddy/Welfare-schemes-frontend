import { useEffect, useState } from "react";
import { ShieldCheck, Bell, Key, Lock } from "lucide-react";
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
    const savedNotifications = localStorage.getItem(
      "welfare-notifications-enabled",
    );
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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Account Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Preferences</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Configure your notification behavior and account security for the
          portal.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Notification Preferences
              </h2>
              <p className="text-sm text-slate-500">
                Control what alerts and activity updates land in your inbox.
              </p>
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
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">Quick sync</p>
              <p className="mt-2 text-sm text-slate-500">
                When enabled, your portal fetches the latest application and
                notification status as soon as the page is active.
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Key size={24} className="text-emerald-600" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Security settings
              </h2>
              <p className="text-sm text-slate-500">
                Update your password and keep your citizen account secure.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 rounded-[28px] bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-slate-600" />
              <p className="text-sm font-semibold text-slate-900">
                Security tip
              </p>
            </div>
            <p className="text-sm text-slate-500">
              Use a strong password with letters, numbers and symbols. Avoid
              reusing credentials from other services.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handlePasswordSave}
              loading={savingPassword}
              fullWidth={false}
            >
              Update password
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SwitchRow({ label, description, value, onToggle }) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-slate-900">{label}</p>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <button
          onClick={onToggle}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            value ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
          }`}
        >
          {value ? "On" : "Off"}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
