'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { dummyLoans, dummyCustomers } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import { useState, useMemo } from 'react';
import { Search, Plus, MoreVertical, Send, Eye, CheckCircle, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── helpers ─────────────────────────────────────────────── */

function getCustomer(id: string) {
  return dummyCustomers.find((c) => c.id === id);
}

function daysUntil(date: Date) {
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

function isDueSoon(loan: { status: string; dueDate: Date }) {
  const d = daysUntil(loan.dueDate);
  return loan.status === 'active' && d >= 0 && d <= 7;
}

/* ── status config ───────────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; border: string; badge: string; text: string }> = {
  overdue:  { label: 'Overdue',  border: '#DC2626', badge: 'bg-red-50 text-red-600 border-red-200',    text: 'text-red-600' },
  active:   { label: 'Active',   border: '#1A1A2E', badge: 'bg-[#1A1A2E]/5 text-[#1A1A2E] border-[#1A1A2E]/20', text: 'text-[#1A1A2E]' },
  paid:     { label: 'Paid',     border: '#16A34A', badge: 'bg-green-50 text-green-700 border-green-200', text: 'text-green-700' },
  pending:  { label: 'Pending',  border: '#E85D04', badge: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30', text: 'text-[#E85D04]' },
};

const TABS = [
  { key: 'all',     label: 'All' },
  { key: 'active',  label: 'Active' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'due-soon',label: 'Due Soon' },
  { key: 'paid',    label: 'Paid' },
  { key: 'pending', label: 'Pending Confirmation' },
];

/* ── three-dot menu ──────────────────────────────────────── */

function LoanMenu({ loanId }: { loanId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        aria-label="Loan options"
      >
        <MoreVertical className="h-4 w-4 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
            <Link
              href={`/app/loans/${loanId}`}
              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-[#1A1A2E]"
              onClick={() => setOpen(false)}
            >
              <Eye className="h-4 w-4 text-gray-400" /> View
            </Link>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-[#E85D04]">
              <Send className="h-4 w-4" /> Send Reminder
            </button>
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-green-600">
              <CheckCircle className="h-4 w-4" /> Mark Paid
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-500">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── loan card ───────────────────────────────────────────── */

function LoanCard({ loan }: { loan: typeof dummyLoans[0] }) {
  const customer = getCustomer(loan.customerId);
  const dueSoon = isDueSoon(loan);
  const effectiveStatus = dueSoon ? 'pending' : loan.status;
  const cfg = STATUS_CONFIG[effectiveStatus] ?? STATUS_CONFIG.active;
  const days = daysUntil(loan.dueDate);

  return (
    <Link
      href={`/app/loans/${loan.id}`}
      className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      style={{ borderLeftWidth: 4, borderLeftColor: cfg.border } as React.CSSProperties}
    >
      <div className="p-4 flex items-center gap-3">
        {/* Left — buyer info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1A1A2E] truncate">{customer?.name ?? 'Unknown'}</p>
          <p className="text-xs text-gray-400 mt-0.5">{customer?.phone ?? '—'}</p>
        </div>

        {/* Center — amount */}
        <div className="text-center shrink-0 px-3">
          <p className="text-xl font-black text-[#E85D04] leading-none">
            {CURRENCY_SYMBOL} {loan.remainingAmount.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">remaining</p>
        </div>

        {/* Right — due date + status + menu */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', cfg.badge)}>
            {cfg.label}
          </span>
          <p className="text-xs text-gray-400">
            {loan.status === 'paid'
              ? 'Fully paid'
              : days < 0
              ? `${Math.abs(days)}d overdue`
              : days === 0
              ? 'Due today'
              : `Due in ${days}d`}
          </p>
          {/* Stop propagation so the menu doesn't also navigate */}
          <div onClick={(e) => e.preventDefault()}>
            <LoanMenu loanId={loan.id} />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function LoansPage() {
  const [search, setSearch]   = useState('');
  const [tab, setTab]         = useState('all');
  const [sort, setSort]       = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = dummyLoans.filter((loan) => {
      const customer = getCustomer(loan.customerId);
      const q = search.toLowerCase();
      const matchSearch = !q
        || customer?.name.toLowerCase().includes(q)
        || loan.id.toLowerCase().includes(q)
        || customer?.phone?.includes(q);

      const matchTab =
        tab === 'all'      ? true :
        tab === 'due-soon' ? isDueSoon(loan) :
        loan.status === tab;

      return matchSearch && matchTab;
    });

    if (sort === 'amount-high') list = [...list].sort((a, b) => b.remainingAmount - a.remainingAmount);
    if (sort === 'amount-low')  list = [...list].sort((a, b) => a.remainingAmount - b.remainingAmount);
    if (sort === 'due-date')    list = [...list].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return list;
  }, [search, tab, sort]);

  const countFor = (key: string) => {
    if (key === 'all')      return dummyLoans.length;
    if (key === 'due-soon') return dummyLoans.filter(isDueSoon).length;
    return dummyLoans.filter((l) => l.status === key).length;
  };

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-5 pb-24 md:pb-8">

        {/* Search + sort row */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone or loan ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 flex items-center gap-1.5 hover:border-[#E85D04] transition-colors"
            >
              Sort <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-11 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                  {[
                    { key: 'newest',      label: 'Newest first' },
                    { key: 'due-date',    label: 'Due date' },
                    { key: 'amount-high', label: 'Amount: high → low' },
                    { key: 'amount-low',  label: 'Amount: low → high' },
                  ].map((o) => (
                    <button
                      key={o.key}
                      onClick={() => { setSort(o.key); setSortOpen(false); }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors',
                        sort === o.key ? 'text-[#E85D04] font-semibold' : 'text-[#1A1A2E]'
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0 overflow-x-auto scrollbar-hide border-b border-gray-100">
          {TABS.map((t) => {
            const count = countFor(t.key);
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  'shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  active
                    ? 'border-[#E85D04] text-[#E85D04]'
                    : 'border-transparent text-gray-400 hover:text-[#1A1A2E]'
                )}
              >
                {t.label}
                {count > 0 && (
                  <span className={cn(
                    'ml-1.5 text-xs px-1.5 py-0.5 rounded-full',
                    active ? 'bg-[#E85D04] text-white' : 'bg-gray-100 text-gray-500'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Loan cards */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((loan) => <LoanCard key={loan.id} loan={loan} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No loans found</p>
          </div>
        )}
      </main>

      {/* FAB */}
      <Link
        href={ROUTES.NEW_LOAN}
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 flex items-center gap-2 bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold pl-4 pr-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="New Loan"
      >
        <Plus className="h-5 w-5" />
        <span className="text-sm">New Loan</span>
      </Link>
    </AppLayout>
  );
}
