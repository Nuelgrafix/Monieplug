"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetUserByIdQuery } from "@/redux/slices/apiSlice";
import {
  User,
  Mail,
  Phone,
  Wallet,
  Building2,
  CreditCard,
  Shield,
  Copy,
  CheckCheck,
  Pencil,
  X,
  Save,
  ChevronRight,
  LogOut,
  Bell,
  Lock,
  HelpCircle,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  wallet_id: string;
  wallet_account_number: string;
  wallet_name: string;
  wallet_bank_name: string;
  is_active: boolean;
  is_staff: boolean;
}

// Real data comes from useGetUserByIdQuery below (replaces previous mock)

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative inline-flex">
      <div className="w-20 h-20 rounded-2xl bg-[#1E35C8] flex items-center justify-center shadow-lg shadow-[#1E35C8]/30">
        <span className="text-2xl font-bold text-white tracking-wide">{initials}</span>
      </div>
      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full" />
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg text-gray-400 hover:text-[#1E35C8] hover:bg-[#1E35C8]/8 transition-all"
    >
      {copied ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  copyable = false,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  copyable?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-[#1E35C8]/8 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-[#1E35C8]" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">{label}</p>
          <p className={`text-sm text-gray-800 font-medium truncate ${mono ? "font-mono" : ""}`}>{value || "—"}</p>
        </div>
      </div>
      {copyable && value && <CopyButton value={value} />}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

function MenuRow({
  icon: Icon,
  label,
  sublabel,
  danger = false,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 group"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
            danger ? "bg-red-50" : "bg-[#1E35C8]/8"
          }`}
        >
          <Icon size={14} className={danger ? "text-red-500" : "text-[#1E35C8]"} />
        </div>
        <div className="text-left">
          <p className={`text-sm font-medium ${danger ? "text-red-500" : "text-gray-800"}`}>{label}</p>
          {sublabel && <p className="text-[11px] text-gray-400 mt-0.5">{sublabel}</p>}
        </div>
      </div>
      {!danger && <ChevronRight size={14} className="text-gray-300 group-hover:text-[#1E35C8] transition-colors" />}
    </button>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditProfileModal({
  user,
  onClose,
  onSave,
}: {
  user: UserProfile;
  onClose: () => void;
  onSave: (data: Partial<UserProfile>) => void;
}) {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [phone, setPhone] = useState(user.phone);

  const handleSave = () => {
    onSave({ first_name: firstName, last_name: lastName, phone });
    toast.success("Profile updated");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E35C8]/30 focus:border-[#1E35C8] transition-all"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-6 w-full py-3 rounded-xl bg-[#1E35C8] text-white text-sm font-semibold hover:bg-[#1a2eb0] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Save size={14} />
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const authUser: any = useSelector((state: RootState) => state.auth.user);
  const userId = authUser?.id;

  const {
    data: serverProfile,
    isLoading,
    isError,
  } = useGetUserByIdQuery(userId ?? "", {
    skip: !userId,
  });

  // Seed local state from server when available (enables editing on real data)
  useEffect(() => {
    if (serverProfile) {
      setUser(serverProfile as UserProfile);
    } else if (authUser) {
      // Fallback using whatever partial data we have from login
      setUser((prev) => prev ?? (authUser as UserProfile));
    }
  }, [serverProfile, authUser]);

  const handleSave = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : (data as UserProfile)));
    // TODO: wire update mutation when /authent/users/{id}/ PATCH or PUT is available
  };

  if (isLoading || !user) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-sm text-gray-500">Loading profile…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-red-500">Failed to load profile. Please try again.</div>
      </div>
    );
  }

  // user is non-null here thanks to the guards above
  const u = user as UserProfile;
  const fullName = `${u.first_name} ${u.last_name}`;

  return (
    <div className="flex-1 min-h-screen bg-gray-50 overflow-y-auto">
      {/* ── Hero Header ── */}
      <div className="relative bg-[#1E35C8] pt-10 pb-16 px-6 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-4 right-16 w-20 h-20 rounded-full bg-white/5" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={fullName} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{fullName}</h1>
                {u.is_active && (
                  <BadgeCheck size={16} className="text-emerald-400 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-white/60 mt-0.5">{u.email}</p>
              {u.is_staff && (
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-semibold uppercase tracking-wider">
                  Staff
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowEdit(true)}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
          >
            <Pencil size={14} />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 -mt-6 pb-12 space-y-4">

        {/* Wallet Card — elevated above the blue header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1E35C8] flex items-center justify-center">
                <Wallet size={13} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Wallet Details</span>
            </div>
            <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Account Number", value: u.wallet_account_number, mono: true, copy: true },
                { label: "Bank", value: u.wallet_bank_name, mono: false, copy: false },
                { label: "Account Name", value: u.wallet_name, mono: false, copy: false },
                { label: "Wallet ID", value: u.wallet_id, mono: true, copy: true },
              ].map(({ label, value, mono, copy }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-sm text-gray-800 font-semibold truncate ${mono ? "font-mono" : ""}`}>
                    {value || "—"}
                  </p>
                  {copy && value && <CopyButton value={value} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info */}
        <SectionCard title="Personal Information">
          <InfoRow icon={User} label="Full Name" value={fullName} />
          <InfoRow icon={Mail} label="Email Address" value={u.email} copyable />
          <InfoRow icon={Phone} label="Phone Number" value={u.phone} copyable />
          <InfoRow icon={CreditCard} label="User ID" value={u.id} copyable mono />
        </SectionCard>

        {/* Account Status */}
        <SectionCard title="Account Status">
          <div className="flex items-center justify-between py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1E35C8]/8 flex items-center justify-center">
                <Shield size={14} className="text-[#1E35C8]" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Account Status</p>
                <p className="text-sm font-medium text-gray-800">
                  {u.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              u.is_active
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}>
              {u.is_active ? "Verified" : "Unverified"}
            </span>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1E35C8]/8 flex items-center justify-center">
                <Building2 size={14} className="text-[#1E35C8]" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Role</p>
                <p className="text-sm font-medium text-gray-800">
                  {u.is_staff ? "Staff Member" : "Standard User"}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#1E35C8]/10 text-[#1E35C8]">
              {u.is_staff ? "Staff" : "User"}
            </span>
          </div>
        </SectionCard>

        {/* Settings */}
        <SectionCard title="Settings">
          <MenuRow
            icon={Bell}
            label="Notifications"
            sublabel="Manage alerts and push notifications"
            onClick={() => toast("Coming soon")}
          />
          <MenuRow
            icon={Lock}
            label="Change Password"
            sublabel="Update your account password"
            onClick={() => toast("Coming soon")}
          />
          <MenuRow
            icon={Shield}
            label="Security & Privacy"
            sublabel="2FA, login activity"
            onClick={() => toast("Coming soon")}
          />
          <MenuRow
            icon={HelpCircle}
            label="Help & Support"
            sublabel="FAQs, contact us"
            onClick={() => toast("Coming soon")}
          />
        </SectionCard>

        {/* Logout */}
        <SectionCard title="Account">
          <MenuRow
            icon={LogOut}
            label="Log Out"
            danger
            onClick={() => {
              // Call your logout action here
              toast.error("Logged out");
            }}
          />
        </SectionCard>

        <p className="text-center text-[11px] text-gray-300 pb-2">Monieplug v1.0.0</p>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <EditProfileModal
          user={u}
          onClose={() => setShowEdit(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────

const page = () => <ProfilePage />;
export default page;