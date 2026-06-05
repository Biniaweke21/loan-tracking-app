'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { createClient } from '@/lib/supabase/client';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import { Search, Plus, Phone, Banknote, ChevronDown, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STYLE: Record<string, string> = {
  active:               'bg-[#1A1A2E]/5 text-[#1A1A2E] border-[#1A1A2E]/20',
  overdue:              'bg-red-50 text-red-600 border-red-200',
  paid:                 'bg-green-50 text-green-700 border-green-200',
  pending_confirmation: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30',
};

function initials(name: string) {
  return (name || '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.active;
  const label = status === 'pending_confirmation' ? 'Pending' : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', style)}>{label}</span>;
}

function CustomerCard({ customer }: { customer: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('bg-white rounded-xl border border-gray-100 shadow-sm transition-shadow', open ? 'shadow-md' : 'hover:shadow-md')}>
      <div role="button" tabIndex={0} onClick={() => setOpen(!open)} onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
        className="flex items-center gap-4 p-4 cursor-pointer select-none">
        <div className="h-12 w-12 rounded-full bg-[#E85D04] flex items-center justify-center text-white font-bold text-sm shrink-0">
          {initials(customer.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1A1A2E] truncate">{customer.name}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{customer.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <Banknote className="h-3 w-3 text-[#E85D04]" />
            <span className="text-xs font-semibold text-[#E85D04]">{customer.activeLoans} active loan{customer.activeLoans !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end gap-1">
          <p className="font-black text-[#1A1A2E] text-base leading-none">{CURRENCY_SYMBOL} {customer.totalOwed.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">remaining balance</p>
        </div>
        <ChevronDown className={cn('h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ml-1', open && 'rotate-180')} />
      </div>

      {open && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-3 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Loan History</h3>
            <span className="text-xs text-gray-400">{customer.loans.length} loan{customer.loans.length !== 1 ? 's' : ''}</span>
          </div>
          {customer.loans.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-gray-400">No loans recorded yet.</p>
          ) : (
            <div>
              {customer.loans.map((loan: any) => (
                <div key={loan.id} className="border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(loan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="font-bold text-[#E85D04] text-sm flex-1">{CURRENCY_SYMBOL} {Number(loan.total_amount).toLocaleString()}</span>
                  <StatusBadge status={loan.status} />
                  <Link href={`/app/loans/${loan.id}`} className="text-xs text-gray-400 hover:text-[#E85D04] transition-colors shrink-0">View</Link>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-3 border-t border-gray-100">
            <Link href={`${ROUTES.LOANS}?customer=${customer.email}`} className="text-sm font-semibold text-[#E85D04] hover:underline">
              View Full History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  const supabase = createClient();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single();
      if (!shop) { setLoading(false); return; }

      const { data: loans } = await supabase
        .from('loans').select('*, loan_items(*)').eq('shop_id', shop.id);
      if (!loans) { setLoading(false); return; }

      const customerMap = new Map<string, any>();
      loans.forEach((loan: any) => {
        const key = loan.buyer_email;
        if (!customerMap.has(key)) {
          customerMap.set(key, { name: loan.buyer_name, email: loan.buyer_email, buyer_id: loan.buyer_id, loans: [], totalOwed: 0, activeLoans: 0 });
        }
        const customer = customerMap.get(key);
        customer.loans.push(loan);
        if (loan.status !== 'paid') {
          customer.totalOwed += Number(loan.total_amount) - Number(loan.amount_paid || 0);
          customer.activeLoans += 1;
        }
      });

      setCustomers(Array.from(customerMap.values()));
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* Search + add */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow" />
          </div>
          <Link href={ROUTES.NEW_LOAN} className="h-10 px-4 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0">
            <Plus className="h-4 w-4" /> Add
          </Link>
        </div>

        {/* Summary strip */}
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">{filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''}</span>
          <span className="text-gray-300">·</span>
          <span className="text-[#E85D04] font-semibold">
            {filteredCustomers.reduce((s, c) => s + c.activeLoans, 0)} active loans
          </span>
        </div>

        {/* Cards */}
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-[#FFF3E0] flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-[#E85D04]" />
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              No customers yet. Customers appear here once you record your first loan.
            </p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No customers found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCustomers.map((c) => <CustomerCard key={c.email} customer={c} />)}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
