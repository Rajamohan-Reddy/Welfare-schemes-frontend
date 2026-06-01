import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  User,
  ShieldCheck,
  CalendarDays,
  Home,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { getMyProfileApi, updateMyProfileApi } from "../api/profile.api";
import { setUser } from "../../../utils/storage";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  aadhaarNumber: "",
  dateOfBirth: "",
  gender: "",
  profileImage: "",
  address: {
    houseNo: "",
    street: "",
    village: "",
    mandal: "",
    district: "",
    state: "",
    pincode: "",
  },
};

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getMyProfileApi();
      const user = response.data.data;
      setProfile(user);
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        aadhaarNumber: user.aadhaarNumber || "",
        dateOfBirth: user.dateOfBirth?.split("T")[0] || "",
        gender: user.gender || "",
        profileImage: user.profileImage || "",
        address: {
          houseNo: user.address?.houseNo || "",
          street: user.address?.street || "",
          village: user.address?.village || "",
          mandal: user.address?.mandal || "",
          district: user.address?.district || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
        },
      });
      setImagePreview(user.profileImage || null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load profile information");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      const base64 = await toBase64(file);
      setImagePreview(base64);
      setForm((prev) => ({ ...prev, profileImage: base64 }));
      toast.success("Profile image ready to save");
    } catch (error) {
      console.error(error);
      toast.error("Unable to load profile image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await updateMyProfileApi(form);
      const updatedProfile = response.data.data;
      setProfile(updatedProfile);
      setUser(updatedProfile);
      window.dispatchEvent(new Event("userProfileUpdated"));
      setImagePreview(updatedProfile.profileImage || imagePreview);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile changes");
    } finally {
      setSaving(false);
    }
  };

  const completion = profile?.profileCompletion || 0;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 p-8 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300">
          Global Profile
        </p>
        <h1 className="mt-3 text-4xl font-bold">Account Command Center</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Manage your identity, security, and international-ready account
          settings from one polished dashboard.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Profile snapshot
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest profile status and account completion progress.
              </p>
            </div>
            <div className="space-y-2 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">Completion</span>
                <span className="font-semibold">{completion}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-600 to-blue-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
            <div className="space-y-4 rounded-[28px] bg-slate-50 p-5 text-center">
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl font-semibold">
                    {form.firstName?.charAt(0) || "C"}
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-photo"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
              >
                <UploadCloud size={16} />
                {uploading ? "Uploading..." : "Change photo"}
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Account status</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {profile?.isActive ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="rounded-[28px] bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Member since</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DashboardStat
              label="Email"
              value={form.email || "n/a"}
              icon={Mail}
            />
            <DashboardStat
              label="Phone"
              value={form.phoneNumber || "n/a"}
              icon={Phone}
            />
            <DashboardStat
              label="Role"
              value={profile?.role || "Citizen"}
              icon={ShieldCheck}
            />
            <DashboardStat
              label="Date of Birth"
              value={
                form.dateOfBirth
                  ? new Date(form.dateOfBirth).toLocaleDateString()
                  : "Not provided"
              }
              icon={CalendarDays}
            />
          </div>
        </Card>

        <Card className="rounded-[32px] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Edit profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep your contact information and address details up to date.
              </p>
            </div>
            <Button onClick={handleSave} loading={saving} fullWidth={false}>
              Save profile
            </Button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Input
              label="First name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
            <Input
              label="Last name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
            />
            <Input
              label="Aadhaar number"
              name="aadhaarNumber"
              value={form.aadhaarNumber}
              onChange={handleChange}
            />
            <Input
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Gender
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-[#1E3A8A]"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="lg:col-span-2 rounded-[28px] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">
                Residential address
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Input
                  label="House / flat no."
                  name="houseNo"
                  value={form.address.houseNo}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Street / locality"
                  name="street"
                  value={form.address.street}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Village / mandal"
                  name="village"
                  value={form.address.village}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Mandal"
                  name="mandal"
                  value={form.address.mandal}
                  onChange={handleAddressChange}
                />
                <Input
                  label="District"
                  name="district"
                  value={form.address.district}
                  onChange={handleAddressChange}
                />
                <Input
                  label="State"
                  name="state"
                  value={form.address.state}
                  onChange={handleAddressChange}
                />
                <Input
                  label="PIN code"
                  name="pincode"
                  value={form.address.pincode}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-slate-500" />
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default ProfilePage;
