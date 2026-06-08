'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Flame, CheckCircle } from 'lucide-react';

type LoanItem = { id: string; item_name: string; amount: number };
type Loan = {
  id: string;
  status: string;
  buyer_name: string;
  buyer_email: string;
  total_amount: number;
  due_date: string;
  confirmation_token: string;
  loan_items: LoanItem[];
  shops?: { shop_name: string };
};

export default function ConfirmLoanPage() {
  const { token } = useParams<{ token: string }>();
  const supabase = createClient();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoan = async () => {
      const { data } = await supabase
        .from('loans')
        .select('*, loan_items(*), shops(shop_name)')
        .eq('confirmation_token', token)
        .single();
      if (!data) { setNotFound(true); }
      else { setLoan(data as Loan); }
      setFetching(false);
    };
    fetchLoan();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleConfirm = async () => {
    setConfirming(true);
    const response = await fetch('/api/confirm-loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const result = await response.json();
    console.log('Confirmation result:', result);
    if (!response.ok || result.error) {
      setError('Something went wrong. Please try again.');
      setConfirming(false);
      return;
    }
    const { data: loanData } = await supabase.from('loans').select('buyer_email, buyer_id').eq('confirmation_token', token).single()
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user?.id || '').single()
    const buyerHasAccount = !!profile || !!loanData?.buyer_id
    setIsLoggedIn(buyerHasAccount)
    setConfirmed(true);
    setConfirming(false);
  };

  /* ── loading ── */
  if (fetching) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="h-10 w-10 rounded-full bg-[#E85D04] flex items-center justify-center">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <div className="h-6 w-6 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
      </main>
    );
  }

  /* ── not found ── */
  if (notFound) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center gap-4">
        <div className="h-10 w-10 rounded-full bg-[#E85D04] flex items-center justify-center">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <p className="text-gray-500 text-sm max-w-xs">
          This confirmation link is invalid or has already been used.
        </p>
      </main>
    );
  }

  /* ── already confirmed ── */
  if (loan?.status === 'active' && !confirmed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-lg font-bold text-[#1A1A2E]">This loan has already been confirmed. Thank you.</h2>
      </main>
    );
  }

  /* ── success after confirming ── */
  if (confirmed) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center gap-4">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A2E]">Loan Confirmed!</h2>
        {isLoggedIn ? (
          <>
            <p className="text-sm text-gray-500 max-w-xs">Your loan has been confirmed successfully.</p>
            <button
              onClick={() => window.location.href = '/buyer/dashboard'}
              className="mt-2 bg-[#E85D04] hover:bg-[#C44D03] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Go to My Dashboard
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 max-w-xs">Your loan has been confirmed. Create a free account to track all your loans in one place.</p>
            <button
              onClick={() => window.location.href = '/register/buyer'}
              className="mt-2 bg-[#E85D04] hover:bg-[#C44D03] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Create Free Account
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-600 text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Continue without account
            </button>
          </>
        )}
      </main>
    );
  }

  const shopName = (loan as any)?.shops?.shop_name ?? 'The shop';

  /* ── pending confirmation ── */
  return (
    <main className="min-h-screen bg-[#FAFAFA] px-4 py-10">
      <div className="max-w-md mx-auto space-y-6">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[#E85D04] flex items-center justify-center">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-[#E85D04] text-xl">Edaye</span>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Loan Confirmation</h1>
          <p className="text-sm text-gray-500 mt-1">Please review the loan details below and confirm</p>
        </div>

        {/* Loan card */}
        <div className="bg-white rounded-2xl border-l-4 border-l-[#E85D04] border border-gray-100 shadow-sm px-5 py-5 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shop</span>
            <span className="font-semibold text-[#1A1A2E]">{shopName}</span>
          </div>
          <div className="border-t border-gray-100" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Buyer</span>
            <span className="font-semibold text-[#1A1A2E]">{loan?.buyer_name}</span>
          </div>
          <div className="border-t border-gray-100" />

          {/* Items */}
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Items</p>
            <div className="space-y-0">
              {loan?.loan_items.map((item, i) => (
                <div key={item.id}>
                  {i > 0 && <div className="border-t border-gray-100 my-1.5" />}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.item_name}</span>
                    <span className="text-gray-600">ETB {Number(item.amount).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-600">Total</span>
              <span className="text-lg font-black text-[#E85D04]">ETB {Number(loan?.total_amount).toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-gray-100" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Due Date</span>
            <span className="font-semibold text-[#1A1A2E]">
              {loan?.due_date ? new Date(loan.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center">{error}</p>
        )}

        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="w-full py-4 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-bold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {confirming ? 'Confirming…' : 'Confirm This Loan'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          By confirming you agree that you have received these items from the shop.
        </p>

      </div>
    </main>
  );
}
