import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  User,
  ShieldCheck,
  CalendarDays,
  UploadCloud,
  MapPin,
  Camera,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { getMyProfileApi, updateMyProfileApi, updateMyProfileImageApi } from "../api/profile.api";
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
  const [imageUpdated, setImageUpdated] = useState(false);
  const [errors, setErrors] = useState({});

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
    setErrors((prev) => ({ ...prev, [name]: undefined }));
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
    if (name === "pincode") {
      setErrors((prev) => ({ ...prev, pincode: undefined }));
    }
  };

  const validateProfileForm = () => {
    const nextErrors = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.phoneNumber.trim()) {
      nextErrors.phoneNumber = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(form.phoneNumber.trim())) {
      nextErrors.phoneNumber = "Enter a 10-digit mobile number.";
    }
    if (!form.aadhaarNumber.trim()) {
      nextErrors.aadhaarNumber = "Aadhaar number is required.";
    } else if (!/^\d{12}$/.test(form.aadhaarNumber.trim())) {
      nextErrors.aadhaarNumber = "Enter a 12-digit Aadhaar number.";
    }
    if (!form.gender) {
      nextErrors.gender = "Please select your gender.";
    } else if (!["MALE", "FEMALE", "OTHER"].includes(form.gender)) {
      nextErrors.gender = "Please select a valid gender option.";
    }
    if (form.address.pincode && !/^\d{6}$/.test(form.address.pincode.trim())) {
      nextErrors.pincode = "Enter a valid 6-digit PIN code.";
    }
    return nextErrors;
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
      setImageUpdated(true);
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
    const nextErrors = validateProfileForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted profile errors.");
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        aadhaarNumber: form.aadhaarNumber,
        dateOfBirth: form.dateOfBirth || null,
        gender: form.gender || null,
        address: form.address,
      };

      let updatedProfile = null;
      if (imageUpdated && form.profileImage) {
        const imageResponse = await updateMyProfileImageApi(form.profileImage);
        updatedProfile = imageResponse.data.data;
      }

      const response = await updateMyProfileApi(payload);
      updatedProfile = response.data.data;

      setProfile(updatedProfile);
      setUser(updatedProfile);
      window.dispatchEvent(new Event("userProfileUpdated"));
      setImagePreview(updatedProfile.profileImage || imagePreview);
      setImageUpdated(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || "Failed to save profile changes";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const completion = profile?.profileCompletion || 0;

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="text-sm font-semibold text-slate-500">Querying Profile Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1">
      {/* Profile Control Banner */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1D4ED8] p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06)_0,transparent_100%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-widest text-[#FFD95A]">
              <Sparkles size={14} /> CITIZEN REGISTRY GATEWAY
            </span>
            <h1 className="text-4xl font-black tracking-tight leading-tight">Identity Profile</h1>
            <p className="text-sm text-slate-200 leading-relaxed max-w-xl">
              Verify and manage your state citizen parameters. Ensure contact metrics and bank disbursement credentials match official registries.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Left Column - Snapshot Cards */}
        <div className="space-y-8">
          <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-lg font-black text-[#071A52]">Account Snapshot</h2>
                <p className="text-xs text-slate-400 mt-0.5">Overall file registry completeness.</p>
              </div>

              {/* Progress Ring / Meter */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-700 min-w-[140px]">
                <div className="flex justify-between items-center mb-2">
                  <span>Completed</span>
                  <span className="text-[#071A52] font-black">{completion}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${completion}%` }} />
                </div>
              </div>
            </div>

            {/* Profile image container overhaul */}
            <div className="flex flex-col sm:flex-row gap-6 items-center bg-slate-50 border border-slate-100 rounded-3xl p-6">
              <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shrink-0 group">
                {imagePreview ? (
                  <img src={imagePreview} alt="User Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold">
                    {form.firstName?.charAt(0) || "C"}
                  </div>
                )}
                <label
                  htmlFor="profile-photo"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera size={20} className="text-white" />
                </label>
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div className="text-center sm:text-left space-y-2 min-w-0">
                <h3 className="text-lg font-black text-[#071A52] truncate">
                  {form.firstName} {form.lastName}
                </h3>
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  {profile?.role?.replaceAll("_", " ") || "CITIZEN"}
                </p>
                <label
                  htmlFor="profile-photo"
                  className="inline-flex items-center gap-1.5 cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-100 transition"
                >
                  <UploadCloud size={14} />
                  {uploading ? "Processing..." : "Upload Profile Image"}
                </label>
              </div>
            </div>

            {/* Account Parameters Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <LookupParam icon={Mail} label="Registered Email" val={form.email || "n/a"} />
              <LookupParam icon={Phone} label="Contact Mobile" val={form.phoneNumber || "n/a"} />
              <LookupParam icon={ShieldCheck} label="Account Clearance" val={profile?.isActive ? "VERIFIED ACTIVE" : "INACTIVE"} />
              <LookupParam icon={CalendarDays} label="Date of Birth" val={form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString() : "n/a"} />
            </div>
          </Card>
        </div>

        {/* Right Column - Forms Edit Cards */}
        <Card className="rounded-[36px] border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-900/5 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg font-black text-[#071A52]">Registry parameters</h2>
              <p className="text-xs text-slate-400 mt-0.5">Keep contact and address parameters current.</p>
            </div>
            <Button
              onClick={handleSave}
              loading={saving}
              fullWidth={false}
              className="rounded-full bg-[#071A52] hover:bg-slate-900 text-white px-7 py-3 font-bold text-xs"
            >
              Commit File Changes
            </Button>
          </div>

          <div className="space-y-6">
            {/* Grouped Personal Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} className="rounded-2xl" />
              <Input label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} className="rounded-2xl" />
              <Input label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} className="rounded-2xl" />
              <Input label="Contact Mobile" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} error={errors.phoneNumber} className="rounded-2xl" />
              <Input label="Aadhaar vault ID" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} error={errors.aadhaarNumber} className="rounded-2xl" />
              <Input label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="rounded-2xl" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Gender Parameter</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none transition focus:border-blue-600 focus:bg-white text-sm font-semibold text-slate-800"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
            </div>

            {/* Address Parameters Group */}
            <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#071A52]">
                <MapPin size={16} />
                <span>Residential Address Parameters</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="House / flat no." name="houseNo" value={form.address.houseNo} onChange={handleAddressChange} className="rounded-2xl bg-white" />
                <Input label="Street / locality" name="street" value={form.address.street} onChange={handleAddressChange} className="rounded-2xl bg-white" />
                <Input label="Village" name="village" value={form.address.village} onChange={handleAddressChange} className="rounded-2xl bg-white" />
                <Input label="Mandal / Area" name="mandal" value={form.address.mandal} onChange={handleAddressChange} className="rounded-2xl bg-white" />
                <Input label="District" name="district" value={form.address.district} onChange={handleAddressChange} className="rounded-2xl bg-white" />
                <Input label="State" name="state" value={form.address.state} onChange={handleAddressChange} className="rounded-2xl bg-white" />
                <Input label="PIN code" name="pincode" value={form.address.pincode} onChange={handleAddressChange} error={errors.pincode} className="rounded-2xl bg-white" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function LookupParam({ icon: Icon, label, val }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
      <Icon size={16} className="text-slate-500 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{val}</p>
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
