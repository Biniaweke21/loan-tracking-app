"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

type LoanItem = { name: string; amount: number };

type PendingLoan = {
  id: string;
  dateRecorded: string;
  items: LoanItem[];
};

type ActiveLoan = {
  id: string;
  date: string;
  status: "overdue" | "due-soon" | "clear";
  dueDate: string;
  items: LoanItem[];
};

type PaidLoan = {
  id: string;
  date: string;
  paidDate: string;
  items: LoanItem[];
};

type ShopData = {
  name: string;
  totalOwed: number;
  activeCount: number;
  pending: PendingLoan[];
  active: ActiveLoan[];
  paid: PaidLoan[];
};

const shopData: Record<string, ShopData> = {
  "1": {
    name: "Tigist General Store",
    totalOwed: 2400,
    activeCount: 3,
    pending: [
      {
        id: "p1",
        dateRecorded: "May 24, 2026",
        items: [
          { name: "Sugar 2kg", amount: 120 },
          { name: "Cooking Oil 1L", amount: 180 },
          { name: "Flour 5kg", amount: 300 },
        ],
      },
    ],
    active: [
      {
        id: "a1",
        date: "May 10, 2026",
        status: "overdue",
        dueDate: "May 20, 2026",
        items: [
          { name: "Rice 10kg", amount: 650 },
          { name: "Lentils 2kg", amount: 150 },
        ],
      },
      {
        id: "a2",
        date: "May 18, 2026",
        status: "due-soon",
        dueDate: "May 25, 2026",
        items: [
          { name: "Tomato paste x4", amount: 200 },
          { name: "Salt 1kg", amount: 50 },
          { name: "Soap x3", amount: 150 },
        ],
      },
      {
        id: "a3",
        date: "May 22, 2026",
        status: "clear",
        dueDate: "Jun 22, 2026",
        items: [
          { name: "Teff 5kg", amount: 600 },
        ],
      },
    ],
    paid: [
      {
        id: "pd1",
        date: "Apr 5, 2026",
        paidDate: "Apr 30, 2026",
        items: [
          { name: "Berbere 500g", amount: 180 },
          { name: "Niter kibbeh 1kg", amount: 320 },
        ],
      },
    ],
  },
  "2": {
    name: "Kebede Supermarket",
    totalOwed: 600,
    activeCount: 1,
    pending: [],
    active: [
      {
        id: "a1",
        date: "May 19, 2026",
        status: "due-soon",
        dueDate: "May 29, 2026",
        items: [
          { name: "Pasta x6", amount: 240 },
          { name: "Canned tomatoes x4", amount: 360 },
        ],
      },
    ],
    paid: [
      {
        id: "pd1",
        date: "Mar 12, 2026",
        paidDate: "Mar 28, 2026",
        items: [
          { name: "Cooking Oil 2L", amount: 340 },
          { name: "Sugar 1kg", amount: 60 },
        ],
      },
      {
        id: "pd2",
        date: "Apr 20, 2026",
        paidDate: "May 5, 2026",
        items: [
          { name: "Rice 5kg", amount: 325 },
        ],
      },
    ],
  },
  "3": {
    name: "Almaz Mini Market",
    totalOwed: 1100,
    activeCount: 2,
    pending: [],
    active: [
      {
        id: "a1",
        date: "May 1, 2026",
        status: "clear",
        dueDate: "Jun 1, 2026",
        items: [
          { name: "Injera x20", amount: 400 },
          { name: "Shiro 500g", amount: 200 },
        ],
      },
      {
        id: "a2",
        date: "May 15, 2026",
        status: "clear",
        dueDate: "Jun 15, 2026",
        items: [
          { name: "Eggs x30", amount: 300 },
          { name: "Butter 250g", amount: 200 },
        ],
      },
    ],
    paid: [],
  },
};

function itemTotal(items: LoanItem[]) {
  return items.reduce((s, i) => s + i.amount, 0);
}

function StatusBadge({ status }: { status: ActiveLoan["status"] }) {
  if (status === "overdue")
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Overdue</span>;
  if (status === "due-soon")
    return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-[#E85D04]">Due soon</span>;
  return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Clear</span>;
}

function dueDateColor(status: ActiveLoan["status"]) {
  if (status === "overdue") return "text-red-500";
  if (status === "due-soon") return "text-[#E85D04]";
  return "text-gray-400";
}

export default function BuyerShopPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [showPaid, setShowPaid] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const shop = shopData[id];

  if (!shop) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center text-gray-400">
        Shop not found.
      </div>
    );
  }

  const visiblePending = shop.pending.filter((l) => !dismissed.has(l.id));

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/buyer/dashboard")}
          className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[#1A1A2E]" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-[#1A1A2E] pr-9 truncate">
          {shop.name}
        </h1>
      </div>

      {/* Summary card */}
      <div className="bg-[#FFF3E0] rounded-2xl px-5 py-5">
        <p className="font-bold text-[#1A1A2E] text-base">{shop.name}</p>
        <p className="text-3xl font-bold text-[#E85D04] mt-1">
          ETB {shop.totalOwed.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {shop.activeCount} active {shop.activeCount === 1 ? "loan" : "loans"}
        </p>
      </div>

      {/* Pending confirmation */}
      {visiblePending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-[#E85D04]" />
            <h2 className="font-semibold text-[#1A1A2E]">Pending Your Confirmation</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E85D04] text-white">
              {visiblePending.length}
            </span>
          </div>
          <div className="space-y-3">
            {visiblePending.map((loan) => {
              const total = itemTotal(loan.items);
              return (
                <div key={loan.id} className="bg-[#FFF3E0] rounded-xl border border-orange-100 px-4 py-4 space-y-3">
                  <p className="text-xs text-gray-500">Recorded on {loan.dateRecorded}</p>
                  <div className="space-y-1">
                    {loan.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-700">ETB {item.amount}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-orange-200 mt-2">
                      <span>Total</span>
                      <span className="text-[#E85D04]">ETB {total}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setDismissed((prev) => new Set(prev).add(loan.id))}
                      className="flex-1 py-2.5 rounded-lg bg-[#E85D04] text-white text-sm font-semibold"
                    >
                      Confirm Loan
                    </button>
                    <button
                      onClick={() => setDismissed((prev) => new Set(prev).add(loan.id))}
                      className="flex-1 py-2.5 rounded-lg border border-red-500 text-red-500 text-sm font-semibold"
                    >
                      Dispute
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active loans */}
      <div>
        <h2 className="font-semibold text-[#1A1A2E] mb-3">Active Loans</h2>
        <div className="space-y-3">
          {shop.active.map((loan) => {
            const total = itemTotal(loan.items);
            return (
              <div key={loan.id} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">{loan.date}</span>
                  <StatusBadge status={loan.status} />
                </div>
                <div className="space-y-0">
                  {loan.items.map((item, i) => (
                    <div key={i}>
                      {i > 0 && <div className="border-t border-gray-100 my-1.5" />}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="text-gray-600">ETB {item.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3">
                  <p className="text-base font-bold text-[#E85D04]">ETB {total.toLocaleString()}</p>
                  <p className={`text-xs mt-0.5 ${dueDateColor(loan.status)}`}>
                    Due {loan.dueDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paid loans */}
      {shop.paid.length > 0 && (
        <div>
          <button
            onClick={() => setShowPaid((v) => !v)}
            className="flex items-center gap-1 text-sm font-medium text-[#E85D04]"
          >
            {showPaid ? "Hide payment history" : "Show payment history"}
            {showPaid ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showPaid && (
            <div className="space-y-3 mt-3">
              {shop.paid.map((loan) => {
                const total = itemTotal(loan.items);
                return (
                  <div key={loan.id} className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-400">{loan.date}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                        Paid
                      </span>
                    </div>
                    <div className="space-y-0">
                      {loan.items.map((item, i) => (
                        <div key={i}>
                          {i > 0 && <div className="border-t border-gray-100 my-1.5" />}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{item.name}</span>
                            <span className="text-gray-500">ETB {item.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-3">
                      <p className="text-sm font-bold text-gray-500">ETB {total.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Paid on {loan.paidDate}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
