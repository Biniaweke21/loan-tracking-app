"use client";

import { useState } from "react";
import { Pencil, LogOut, Lock } from "lucide-react";

const buyer = {
  fullName: "Kebede Alemu",
  phone: "+251 91 234 5678",
  city: "Addis Ababa",
  initials: "KA",
};

function InfoRow({
  label,
  value,
  editable = false,
}: {
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-[#1A1A2E]">{value}</p>
      </div>
      {editable && (
        <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Pencil className="h-4 w-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}

export default function BuyerProfilePage() {
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <div className="max-w-[420px] mx-auto px-4 py-8 space-y-8">

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-20 w-20 rounded-full bg-[#E85D04] flex items-center justify-center text-white text-2xl font-bold">
          {buyer.initials}
        </div>
        <p className="text-lg font-bold text-[#1A1A2E]">{buyer.fullName}</p>
        <p className="text-sm text-gray-500">{buyer.phone}</p>
      </div>

      {/* Account section */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4 divide-y divide-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2">
          Account
        </p>
        <InfoRow label="Full Name" value={buyer.fullName} editable />
        <InfoRow label="Phone Number" value={buyer.phone} editable />
        <InfoRow label="City" value={buyer.city} />
      </div>

      {/* Security section */}
      <div className="bg-white rounded-2xl border border-gray-100 px-4 divide-y divide-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-4 pb-2">
          Security
        </p>
        <div className="py-3">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-orange-50 transition-colors">
            <Lock className="h-4 w-4" />
            Change Password
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={() => setLoggingOut(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        {loggingOut ? "Logging out…" : "Log Out"}
      </button>

    </div>
  );
}
