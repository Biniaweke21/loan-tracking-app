'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { createClient } from '@/lib/supabase/client';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import { Search, Plus, MoreVertical, Send, Eye, CheckCircle, Trash2, ChevronDown, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { label: string; border: string; badge: string }> = {
  overdue:              { label: 'Overdue',              border: '#DC2626', badge: 'bg-red-50 text-red-600 border-red-200' },
  active:               { label: 'Active',               border: '#1A1A2E', badge: 'bg-[#1A1A2E]/5 text-[#1A1A2E] border-[#1A1A2E]/20' },
  paid:                 { label: 'Paid',                 border: '#16A34A', badge: 'bg-green-50 text-green-700 border-green-200' },
  pending_confirmation: { label: 'Pending',              border: '#E85D04', badge: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30' },
};

const TABS = [
  { key: 'all',     label: 'All' },
  { key: 'active',  label: 'Active' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'due_soon',label: 'Due Soon' },
  { key: 'paid',    label: 'Paid' },
  { key: 'pending', label: 'Pending Confirmation' },
];

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function LoanMenu({ loanId }: { loanId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors" aria-label="Loan options">
        <MoreVertical className="h-4 w-4 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
            <Link href={`/app/loans/${loanId}`} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 text-[#1A1A2E]" onClick={() => setOpen(false)}>
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

function LoanCard({ loan }: { loan: any }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dueDate = new Date(loan.due_date);
  const isOverdue = dueDate < today && loan.status !== 'paid';
  const effectiveStatus = isOverdue ? 'overdue' : loan.status;
  const cfg = STATUS_CONFIG[effectiveStatus] ?? STATUS_CONFIG.active;
  const days = daysUntil(loan.due_date);

  return (
    <Link href={`/app/loans/${loan.id}`} className="block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow" style={{ borderLeftWidth: 4, borderLeftColor: cfg.border } as React.CSSProperties}>
      <div className="p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1A1A2E] truncate">{loan.buyer_name || '—'}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{loan.buyer_email || '—'}</p>
        </div>
        <div className="text-center shrink-0 px-3">
          <p className="text-xl font-black text-[#E85D04] leading-none">{CURRENCY_SYMBOL} {Number(loan.total_amount).toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">total</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', cfg.badge)}>{cfg.label}</span>
          <p className="text-xs text-gray-400">
            {loan.status === 'paid' ? 'Fully paid' : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `Due in ${days}d`}
          </p>
          <div onClick={(e) => e.preventDefault()}>
            <LoanMenu loanId={loan.id} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LoansPage() {
  const supabase = createClient();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single();
      if (!shop) { setLoading(false); return; }
      const { data: loansData } = await supabase
        .from('loans').select('*, loan_items(*)').eq('shop_id', shop.id).order('created_at', { ascending: false });
      if (loansData) setLoans(loansData);
      setLoading(false);
    };
    fetchLoans();
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(); weekFromNow.setDate(weekFromNow.getDate() + 7);

  const filteredLoans = loans.filter((loan: any) => {
    const due = new Date(loan.due_date);
    const matchesSearch =
      !search ||
      loan.buyer_name?.toLowerCase().includes(search.toLowerCase()) ||
      loan.buyer_email?.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (tab === 'all')      return true;
    if (tab === 'active')   return loan.status === 'active';
    if (tab === 'overdue')  return due < today && loan.status !== 'paid';
    if (tab === 'due_soon') return due >= today && due <= weekFromNow;
    if (tab === 'paid')     return loan.status === 'paid';
    if (tab === 'pending')  return loan.status === 'pending_confirmation';
    return true;
  }).sort((a: any, b: any) => {
    if (sort === 'amount-high') return Number(b.total_amount) - Number(a.total_amount);
    if (sort === 'amount-low')  return Number(a.total_amount) - Number(b.total_amount);
    if (sort === 'due-date')    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    return 0;
  });

  const countFor = (key: string) => {
    if (key === 'all')      return loans.length;
    if (key === 'overdue')  return loans.filter((l: any) => new Date(l.due_date) < today && l.status !== 'paid').length;
    if (key === 'due_soon') return loans.filter((l: any) => { const d = new Date(l.due_date); return d >= today && d <= weekFromNow; }).length;
    if (key === 'pending')  return loans.filter((l: any) => l.status === 'pending_confirmation').length;
    return loans.filter((l: any) => l.status === key).length;
  };

  if (loading) {
    return (
      <AppLayout><AppHeader />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-5 pb-24 md:pb-8">

        {/* Search + sort */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow" />
          </div>
          <div className="relative shrink-0">
            <button onClick={() => setSortOpen(!sortOpen)} className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 flex items-center gap-1.5 hover:border-[#E85D04] transition-colors">
              Sort <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-11 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-44 text-sm">
                  {[{ key: 'newest', label: 'Newest first' }, { key: 'due-date', label: 'Due date' }, { key: 'amount-high', label: 'Amount: high → low' }, { key: 'amount-low', label: 'Amount: low → high' }].map((o) => (
                    <button key={o.key} onClick={() => { setSort(o.key); setSortOpen(false); }} className={cn('w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors', sort === o.key ? 'text-[#E85D04] font-semibold' : 'text-[#1A1A2E]')}>
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
              <button key={t.key} onClick={() => setTab(t.key)} className={cn('shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap', active ? 'border-[#E85D04] text-[#E85D04]' : 'border-transparent text-gray-400 hover:text-[#1A1A2E]')}>
                {t.label}
                {count > 0 && <span className={cn('ml-1.5 text-xs px-1.5 py-0.5 rounded-full', active ? 'bg-[#E85D04] text-white' : 'bg-gray-100 text-gray-500')}>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-[#FFF3E0] flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-[#E85D04]" />
            </div>
            <p className="text-sm text-gray-500 max-w-xs mb-6">No loans yet. Tap the button below to record your first loan.</p>
            <Link href={ROUTES.NEW_LOAN} className="flex items-center gap-2 bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <Plus className="h-5 w-5" /> New Loan
            </Link>
          </div>
        ) : filteredLoans.length > 0 ? (
          <div className="space-y-3">
            {filteredLoans.map((loan: any) => <LoanCard key={loan.id} loan={loan} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No loans found</p>
          </div>
        )}
      </main>

      <Link href={ROUTES.NEW_LOAN} className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 flex items-center gap-2 bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold pl-4 pr-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all" aria-label="New Loan">
        <Plus className="h-5 w-5" />
        <span className="text-sm">New Loan</span>
      </Link>
    </AppLayout>
  );
}
