'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Search } from 'lucide-react';

const supabase = createClient();

type FilterChip = 'all' | 'pending' | 'active' | 'overdue' | 'paid';

const chips: { key: FilterChip; label: string }[] = [
  { key: 'all',     label: 'All' },
  { key: 'pending', label: 'Pending Confirmation' },
  { key: 'active',  label: 'Active' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'paid',    label: 'Paid' },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending_confirmation: { label: 'Pending',  cls: 'bg-orange-50 text-[#E85D04]' },
  active:               { label: 'Active',   cls: 'bg-blue-50 text-blue-600' },
  paid:                 { label: 'Paid',     cls: 'bg-green-50 text-green-600' },
  overdue:              { label: 'Overdue',  cls: 'bg-red-50 text-red-600' },
};

function dueDateColor(dueDateStr: string, status: string) {
  if (status === 'paid' || status === 'pending_confirmation') return 'text-gray-400';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(); weekFromNow.setDate(weekFromNow.getDate() + 7);
  const due = new Date(dueDateStr);
  if (due < today)       return 'text-red-500';
  if (due <= weekFromNow) return 'text-[#E85D04]';
  return 'text-gray-400';
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function effectiveStatus(loan: any) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (loan.status !== 'paid' && loan.status !== 'pending_confirmation' && new Date(loan.due_date) < today) return 'overdue';
  return loan.status;
}

export default function BuyerLoansPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterChip>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      const { data: loansData } = await supabase
        .from('loans')
        .select('*, loan_items(*), shops(shop_name)')
        .or(`buyer_id.eq.${user.id},buyer_email.eq.${user.email}`)
        .order('created_at', { ascending: false });
      if (loansData) setLoans(loansData);
      setLoading(false);
    };
    fetchLoans();
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const filteredLoans = loans.filter((loan) => {
    const due = new Date(loan.due_date);
    const matchesSearch = !search || loan.shops?.shop_name?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'all')     return true;
    if (filter === 'pending') return loan.status === 'pending_confirmation';
    if (filter === 'active')  return loan.status === 'active';
    if (filter === 'overdue') return due < today && loan.status !== 'paid';
    if (filter === 'paid')    return loan.status === 'paid';
    return true;
  });

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold text-[#1A1A2E]">My Loans</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by shop name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#E85D04] focus:border-transparent bg-white"
        />
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setFilter(chip.key)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filter === chip.key
                ? 'bg-[#E85D04] border-[#E85D04] text-white'
                : 'bg-white border-[#E85D04] text-[#E85D04]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Loan cards */}
      {filteredLoans.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">
            {loans.length === 0 ? 'No loans yet. Loans from shops will appear here.' : 'No loans match your filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLoans.map((loan) => {
            const items: any[] = loan.loan_items ?? [];
            const status = effectiveStatus(loan);
            const badge = STATUS_MAP[status] ?? STATUS_MAP.active;
            return (
              <div key={loan.id} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-[#1A1A2E] text-sm">{loan.shops?.shop_name || '—'}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                </div>
                <div>
                  {items.map((item: any, i: number) => (
                    <div key={i}>
                      {i > 0 && <div className="border-t border-gray-100 my-1.5" />}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.item_name}</span>
                        <span className="text-gray-600">ETB {Number(item.amount).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="font-bold text-[#E85D04]">ETB {Number(loan.total_amount).toLocaleString()}</span>
                  <span className={`text-xs font-medium ${dueDateColor(loan.due_date, loan.status)}`}>
                    {loan.status === 'paid' ? 'Paid' : `Due ${fmtDate(loan.due_date)}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
