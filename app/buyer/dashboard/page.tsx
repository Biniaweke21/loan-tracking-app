"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";

const urgentAlert = {
  show: true,
  text: "Payment due today at Tigist General Store — ETB 800",
  href: "/buyer/shops/1",
};

const shops = [
  {
    id: 1,
    name: "Tigist General Store",
    loanCount: 3,
    total: 2400,
    dueDays: 1,
  },
  {
    id: 2,
    name: "Kebede Supermarket",
    loanCount: 1,
    total: 600,
    dueDays: 5,
  },
  {
    id: 3,
    name: "Almaz Mini Market",
    loanCount: 2,
    total: 1100,
    dueDays: null,
  },
];

function DueBadge({ dueDays }: { dueDays: number | null }) {
  if (dueDays === null) {
    return (
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
        All clear
      </span>
    );
  }
  if (dueDays < 0) {
    return (
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">
        Overdue
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#E85D04]">
      Due in {dueDays} {dueDays === 1 ? "day" : "days"}
    </span>
  );
}

export default function BuyerDashboardPage() {
  const totalOutstanding = shops.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

      {urgentAlert.show && (
        <Link href={urgentAlert.href} className="flex items-center gap-3 bg-[#E85D04] text-white rounded-xl px-4 py-3 w-full">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium leading-snug">{urgentAlert.text}</span>
        </Link>
      )}

      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Hello, Kebede 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here is what you currently owe.</p>
      </div>

      <div className="space-y-3">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/buyer/shops/${shop.id}`}
            className="flex items-center gap-4 bg-white rounded-xl shadow-sm border-l-4 border-[#E85D04] px-4 py-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1A1A2E] truncate">{shop.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {shop.loanCount} active {shop.loanCount === 1 ? "loan" : "loans"} · ETB {shop.total.toLocaleString()} total
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <DueBadge dueDays={shop.dueDays} />
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 text-center">
        Total outstanding across all shops:{" "}
        <span className="font-bold text-[#1A1A2E]">ETB {totalOutstanding.toLocaleString()}</span>
      </p>

    </div>
  );
}
