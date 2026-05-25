'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const supabase = createClient();

function dueDateColor(dueDateStr: string, status: string) {
  if (status === 'paid') return 'text-gray-400';
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(); weekFromNow.setDate(weekFromNow.getDate() + 7);
  const due = new Date(dueDateStr);
  if (due < today) return 'text-red-500';
  if (due <= weekFromNow) return 'text-[#E85D04]';
  return 'text-gray-400';
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BuyerShopPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loans, setLoans] = useState<any[]>([]);
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPaid, setShowPaid] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchShopLoans = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: loansData } = await supabase
        .from('loans')
        .select('*, loan_items(*), shops(shop_name)')
        .or(`buyer_id.eq.${user.id},buyer_email.eq.${user.email}`)
        .eq('shop_id', id)
        .order('created_at', { ascending: false });

      if (loansData && loansData.length > 0) {
        setShopName(loansData[0].shops?.shop_name || 'Shop');
        setLoans(loansData);
      }
      setLoading(false);
    };
    fetchShopLoans();
  }, [id]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const pendingLoans = loans.filter((l) => l.status === 'pending_confirmation' && !dismissed.has(l.id));
  const activeLoans  = loans.filter((l) => l.status === 'active');
  const paidLoans    = loans.filter((l) => l.status === 'paid');
  const totalOwed    = loans.filter((l) => l.status !== 'paid').reduce((sum, l) => sum + Number(l.total_amount), 0);

  const handleConfirm = async (loan: any) => {
    setConfirming(loan.id);
    const response = await fetch('/api/confirm-loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: loan.confirmation_token }),
    });
    const result = await response.json();
    if (response.ok && !result.error) {
      setLoans((prev) => prev.map((l) => l.id === loan.id ? { ...l, status: 'active' } : l));
    }
    setConfirming(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
      </main>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/buyer/dashboard')} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-[#1A1A2E]" />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg text-[#1A1A2E] pr-9">{shopName || 'Shop'}</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <CheckCircle className="h-12 w-12 text-green-400" />
          <p className="font-semibold text-[#1A1A2E]">No loans from this shop</p>
          <p className="text-sm text-gray-400">Loans recorded by this shop will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/buyer/dashboard')} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-[#1A1A2E]" />
        </button>
        <h1 className="flex-1 text-center font-bold text-lg text-[#1A1A2E] pr-9 truncate">{shopName}</h1>
      </div>

      {/* Summary card */}
      <div className="bg-[#FFF3E0] rounded-2xl px-5 py-5">
        <p className="font-bold text-[#1A1A2E] text-base">{shopName}</p>
        <p className="text-3xl font-bold text-[#E85D04] mt-1">ETB {totalOwed.toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-1">{activeLoans.length} active {activeLoans.length === 1 ? 'loan' : 'loans'}</p>
      </div>

      {/* Pending confirmation */}
      {pendingLoans.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full bg-[#E85D04]" />
            <h2 className="font-semibold text-[#1A1A2E]">Pending Your Confirmation</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E85D04] text-white">{pendingLoans.length}</span>
          </div>
          <div className="space-y-3">
            {pendingLoans.map((loan) => {
              const items: any[] = loan.loan_items ?? [];
              return (
                <div key={loan.id} className="bg-[#FFF3E0] rounded-xl border border-orange-100 px-4 py-4 space-y-3">
                  <p className="text-xs text-gray-500">Recorded on {fmtDate(loan.created_at)}</p>
                  <div className="space-y-1">
                    {items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.item_name}</span>
                        <span className="text-gray-700">ETB {Number(item.amount).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-2 border-t border-orange-200 mt-2">
                      <span>Total</span>
                      <span className="text-[#E85D04]">ETB {Number(loan.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleConfirm(loan)}
                      disabled={confirming === loan.id}
                      className="flex-1 py-2.5 rounded-lg bg-[#E85D04] text-white text-sm font-semibold disabled:opacity-60"
                    >
                      {confirming === loan.id ? 'Confirming…' : 'Confirm Loan'}
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
      {activeLoans.length > 0 && (
        <div>
          <h2 className="font-semibold text-[#1A1A2E] mb-3">Active Loans</h2>
          <div className="space-y-3">
            {activeLoans.map((loan) => {
              const items: any[] = loan.loan_items ?? [];
              return (
                <div key={loan.id} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
                  <div className="space-y-0">
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
                  <div className="border-t border-gray-100 mt-3 pt-3">
                    <p className="text-base font-bold text-[#E85D04]">ETB {Number(loan.total_amount).toLocaleString()}</p>
                    <p className={`text-xs mt-0.5 ${dueDateColor(loan.due_date, loan.status)}`}>Due {fmtDate(loan.due_date)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Paid loans */}
      {paidLoans.length > 0 && (
        <div>
          <button onClick={() => setShowPaid((v) => !v)} className="flex items-center gap-1 text-sm font-medium text-[#E85D04]">
            {showPaid ? 'Hide payment history' : 'Show payment history'}
            {showPaid ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showPaid && (
            <div className="space-y-3 mt-3">
              {paidLoans.map((loan) => {
                const items: any[] = loan.loan_items ?? [];
                return (
                  <div key={loan.id} className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-400">{fmtDate(loan.created_at)}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Paid</span>
                    </div>
                    <div className="space-y-0">
                      {items.map((item: any, i: number) => (
                        <div key={i}>
                          {i > 0 && <div className="border-t border-gray-100 my-1.5" />}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{item.item_name}</span>
                            <span className="text-gray-500">ETB {Number(item.amount).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-3">
                      <p className="text-sm font-bold text-gray-500">ETB {Number(loan.total_amount).toLocaleString()}</p>
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
