'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { dummyCustomers, dummyLoans } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import { Search, Plus, Phone, Banknote, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── dummy items per loan (same set for all) ─────────────── */

const LOAN_ITEMS = [
  { name: 'Flour',       amount: 500 },
  { name: 'Cooking oil', amount: 300 },
];
const LOAN_ITEMS_TOTAL = LOAN_ITEMS.reduce((s, i) => s + i.amount, 0);

/* ── status config ───────────────────────────────────────── */

const STATUS_STYLE: Record<string, string> = {
  active:  'bg-[#1A1A2E]/5 text-[#1A1A2E] border-[#1A1A2E]/20',
  overdue: 'bg-red-50 text-red-600 border-red-200',
  paid:    'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30',
};

/* ── reliability badge ───────────────────────────────────── */

function reliabilityFor(customerId: string) {
  const loans = dummyLoans.filter((l) => l.customerId === customerId);
  const overdue = loans.filter((l) => l.status === 'overdue').length;
  if (overdue === 0) return { label: 'Reliable Payer', style: 'bg-green-50 text-green-700 border-green-200' };
  if (overdue === 1) return { label: 'Sometimes Late', style: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30' };
  return { label: 'Often Late', style: 'bg-red-50 text-red-600 border-red-200' };
}

function totalOwed(customerId: string) {
  return dummyLoans
    .filter((l) => l.customerId === customerId && l.status !== 'paid')
    .reduce((s, l) => s + l.remainingAmount, 0);
}

/* ── inline items table ──────────────────────────────────── */

function InlineItemsTable() {
  return (
    <div className="mt-2 rounded-lg border border-gray-100 overflow-hidden">
      {/* Column headers */}
      <div className="grid grid-cols-2 px-4 py-1.5 bg-gray-50 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
        <span>Item</span>
        <span className="text-right">Amount</span>
      </div>
      {/* Rows */}
      {LOAN_ITEMS.map((item) => (
        <div key={item.name} className="grid grid-cols-2 px-4 py-2 border-b border-gray-100 last:border-b-0 text-xs">
          <span className="text-gray-700 font-medium">{item.name}</span>
          <span className="text-right text-gray-500">
            {CURRENCY_SYMBOL} {item.amount.toLocaleString()}
          </span>
        </div>
      ))}
      {/* Total */}
      <div className="grid grid-cols-2 px-4 py-2 border-t-2 border-[#E85D04]/30 bg-[#FFF3E0]">
        <span className="text-xs font-bold text-[#1A1A2E]">Total</span>
        <span className="text-right text-xs font-black text-[#E85D04]">
          {CURRENCY_SYMBOL} {LOAN_ITEMS_TOTAL.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

/* ── loan history row ────────────────────────────────────── */

function LoanHistoryRow({ loan }: { loan: typeof dummyLoans[0] }) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = STATUS_STYLE[loan.status] ?? STATUS_STYLE.active;
  const statusLabel = loan.status.charAt(0).toUpperCase() + loan.status.slice(1);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Row header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Date */}
        <span className="text-xs text-gray-400 shrink-0 w-20">
          {loan.disburseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        {/* Amount */}
        <span className="font-bold text-[#E85D04] text-sm flex-1">
          {CURRENCY_SYMBOL} {loan.totalAmount.toLocaleString()}
        </span>
        {/* Status badge */}
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0', statusStyle)}>
          {statusLabel}
        </span>
        {/* Expand arrow */}
        <ChevronDown
          className={cn('h-4 w-4 text-gray-400 shrink-0 transition-transform', expanded && 'rotate-180')}
        />
      </button>

      {/* Expanded items */}
      {expanded && (
        <div className="px-4 pb-3">
          <InlineItemsTable />
        </div>
      )}
    </div>
  );
}

/* ── customer card ───────────────────────────────────────── */

function CustomerCard({ customer }: { customer: typeof dummyCustomers[0] }) {
  const [open, setOpen] = useState(false);
  const reliability = reliabilityFor(customer.id);
  const owed = totalOwed(customer.id);
  const customerLoans = dummyLoans.filter((l) => l.customerId === customer.id);

  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-100 shadow-sm transition-shadow',
      open ? 'shadow-md' : 'hover:shadow-md'
    )}>
      {/* Summary row — click to expand */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
        className="flex items-center gap-4 p-4 cursor-pointer select-none"
      >
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-[#E85D04] flex items-center justify-center text-white font-bold text-sm shrink-0">
          {customer.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)}
        </div>

        {/* Name + phone + badge */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1A1A2E] truncate">{customer.name}</p>
          {customer.phone && (
            <div className="flex items-center gap-1 mt-0.5">
              <Phone className="h-3 w-3 text-gray-400" />
              <p className="text-xs text-gray-400">{customer.phone}</p>
            </div>
          )}
          <span className={cn('inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border', reliability.style)}>
            {reliability.label}
          </span>
        </div>

        {/* Right — owed + active + chevron */}
        <div className="text-right shrink-0 flex flex-col items-end gap-1">
          <p className="font-black text-[#1A1A2E] text-base leading-none">
            {CURRENCY_SYMBOL} {owed.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400">total owed</p>
          <div className="flex items-center gap-1">
            <Banknote className="h-3 w-3 text-[#E85D04]" />
            <span className="text-xs font-semibold text-[#E85D04]">{customer.activeLoans} active</span>
          </div>
        </div>

        <ChevronDown
          className={cn('h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ml-1', open && 'rotate-180')}
        />
      </div>

      {/* Expanded loan history */}
      {open && (
        <div className="border-t border-gray-100">
          {/* Section title */}
          <div className="px-4 py-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Loan History</h3>
            <span className="text-xs text-gray-400">{customerLoans.length} loan{customerLoans.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Loan rows */}
          {customerLoans.length > 0 ? (
            <div>
              {customerLoans.map((loan) => (
                <LoanHistoryRow key={loan.id} loan={loan} />
              ))}
            </div>
          ) : (
            <p className="px-4 pb-4 text-sm text-gray-400">No loans recorded yet.</p>
          )}

          {/* View full history link */}
          <div className="px-4 py-3 border-t border-gray-100">
            <Link
              href={`${ROUTES.LOANS}?customer=${customer.id}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#E85D04] hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Full History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    dummyCustomers.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-5 pb-24 md:pb-8">

        {/* Search + add */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow"
            />
          </div>
          <button className="h-10 px-4 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0">
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {/* Summary strip */}
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[#E85D04] font-semibold">
            {dummyCustomers.reduce((s, c) => s + c.activeLoans, 0)} active loans
          </span>
        </div>

        {/* Cards */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((c) => <CustomerCard key={c.id} customer={c} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No customers found</p>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
