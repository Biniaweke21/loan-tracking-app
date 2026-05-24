"use client";

import { useState } from "react";
import { Search } from "lucide-react";

type LoanStatus = "pending" | "active" | "overdue" | "paid";

type Loan = {
  id: string;
  shopName: string;
  status: LoanStatus;
  dueDate: string;
  dueDays: number | null;
  items: { name: string; amount: number }[];
};

const allLoans: Loan[] = [
  {
    id: "1-p1",
    shopName: "Tigist General Store",
    status: "pending",
    dueDate: "—",
    dueDays: null,
    items: [
      { name: "Sugar 2kg", amount: 120 },
      { name: "Cooking Oil 1L", amount: 180 },
      { name: "Flour 5kg", amount: 300 },
    ],
  },
  {
    id: "1-a1",
    shopName: "Tigist General Store",
    status: "overdue",
    dueDate: "May 20, 2026",
    dueDays: -4,
    items: [
      { name: "Rice 10kg", amount: 650 },
      { name: "Lentils 2kg", amount: 150 },
    ],
  },
  {
    id: "1-a2",
    shopName: "Tigist General Store",
    status: "active",
    dueDate: "May 25, 2026",
    dueDays: 1,
    items: [
      { name: "Tomato paste x4", amount: 200 },
      { name: "Salt 1kg", amount: 50 },
      { name: "Soap x3", amount: 150 },
    ],
  },
  {
    id: "1-a3",
    shopName: "Tigist General Store",
    status: "active",
    dueDate: "Jun 22, 2026",
    dueDays: 29,
    items: [{ name: "Teff 5kg", amount: 600 }],
  },
  {
    id: "1-pd1",
    shopName: "Tigist General Store",
    status: "paid",
    dueDate: "Paid Apr 30, 2026",
    dueDays: null,
    items: [
      { name: "Berbere 500g", amount: 180 },
      { name: "Niter kibbeh 1kg", amount: 320 },
    ],
  },
  {
    id: "2-a1",
    shopName: "Kebede Supermarket",
    status: "active",
    dueDate: "May 29, 2026",
    dueDays: 5,
    items: [
      { name: "Pasta x6", amount: 240 },
      { name: "Canned tomatoes x4", amount: 360 },
    ],
  },
  {
    id: "2-pd1",
    shopName: "Kebede Supermarket",
    status: "paid",
    dueDate: "Paid Mar 28, 2026",
    dueDays: null,
    items: [
      { name: "Cooking Oil 2L", amount: 340 },
      { name: "Sugar 1kg", amount: 60 },
    ],
  },
  {
    id: "2-pd2",
    shopName: "Kebede Supermarket",
    status: "paid",
    dueDate: "Paid May 5, 2026",
    dueDays: null,
    items: [{ name: "Rice 5kg", amount: 325 }],
  },
  {
    id: "3-a1",
    shopName: "Almaz Mini Market",
    status: "active",
    dueDate: "Jun 1, 2026",
    dueDays: 8,
    items: [
      { name: "Injera x20", amount: 400 },
      { name: "Shiro 500g", amount: 200 },
    ],
  },
  {
    id: "3-a2",
    shopName: "Almaz Mini Market",
    status: "active",
    dueDate: "Jun 15, 2026",
    dueDays: 22,
    items: [
      { name: "Eggs x30", amount: 300 },
      { name: "Butter 250g", amount: 200 },
    ],
  },
];

const statusOrder: Record<LoanStatus, number> = {
  overdue: 0,
  pending: 1,
  active: 2,
  paid: 3,
};

function sortLoans(loans: Loan[]) {
  return [...loans].sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status];
    if (orderDiff !== 0) return orderDiff;
    if (a.dueDays !== null && b.dueDays !== null) return a.dueDays - b.dueDays;
    return 0;
  });
}

type FilterChip = "All" | "Pending Confirmation" | "Active" | "Overdue" | "Paid";
const chips: FilterChip[] = ["All", "Pending Confirmation", "Active", "Overdue", "Paid"];

function chipToStatus(chip: FilterChip): LoanStatus | null {
  if (chip === "Pending Confirmation") return "pending";
  if (chip === "Active") return "active";
  if (chip === "Overdue") return "overdue";
  if (chip === "Paid") return "paid";
  return null;
}

function StatusBadge({ status }: { status: LoanStatus }) {
  const map: Record<LoanStatus, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-orange-50 text-[#E85D04]" },
    active: { label: "Active", cls: "bg-blue-50 text-blue-600" },
    overdue: { label: "Overdue", cls: "bg-red-50 text-red-600" },
    paid: { label: "Paid", cls: "bg-green-50 text-green-600" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  );
}

function dueDateColor(loan: Loan) {
  if (loan.status === "paid") return "text-gray-400";
  if (loan.status === "pending") return "text-gray-400";
  if (loan.dueDays !== null && loan.dueDays < 0) return "text-red-500";
  if (loan.dueDays !== null && loan.dueDays <= 7) return "text-[#E85D04]";
  return "text-gray-400";
}

export default function BuyerLoansPage() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState<FilterChip>("All");

  const filtered = sortLoans(
    allLoans.filter((loan) => {
      const matchesChip =
        activeChip === "All" || loan.status === chipToStatus(activeChip);
      const matchesSearch =
        search.trim() === "" ||
        loan.shopName.toLowerCase().includes(search.toLowerCase()) ||
        loan.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
      return matchesChip && matchesSearch;
    })
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-[#1A1A2E]">My Loans</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search shop or item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E85D04] focus:border-transparent bg-white"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              activeChip === chip
                ? "bg-[#E85D04] border-[#E85D04] text-white"
                : "bg-white border-[#E85D04] text-[#E85D04]"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Loan cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-10">No loans found.</p>
        )}
        {filtered.map((loan) => {
          const total = loan.items.reduce((s, i) => s + i.amount, 0);
          return (
            <div key={loan.id} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-[#1A1A2E] text-sm">{loan.shopName}</span>
                <StatusBadge status={loan.status} />
              </div>
              <div>
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
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="font-bold text-[#E85D04]">ETB {total.toLocaleString()}</span>
                <span className={`text-xs font-medium ${dueDateColor(loan)}`}>{loan.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
