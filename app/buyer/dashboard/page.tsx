'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AlertTriangle, ChevronRight, CheckCircle } from 'lucide-react';

const supabase = createClient();

function dueBadge(loans: any[]) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekFromNow = new Date(); weekFromNow.setDate(weekFromNow.getDate() + 7);
  const hasOverdue  = loans.some((l) => new Date(l.due_date) < today);
  const hasDueSoon  = loans.some((l) => { const d = new Date(l.due_date); return d >= today && d <= weekFromNow; });
  if (hasOverdue)  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600">Overdue</span>;
  if (hasDueSoon)  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#E85D04]">Due soon</span>;
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">All clear</span>;
}

export default function BuyerDashboardPage() {
  const router = useRouter();
  const [loans, setLoans] = useState<any[]>([]);
  const [buyerName, setBuyerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Buyer user:', user?.id, user?.email, userError);
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles').select('full_name').eq('id', user.id).single();
      if (profile) setBuyerName(profile.full_name);

      const { data: loansData, error: loansError } = await supabase
        .from('loans')
        .select('*, loan_items(*), shops(shop_name)')
        .or(`buyer_id.eq.${user.id},buyer_email.eq.${user.email}`)
        .order('due_date', { ascending: true });

      console.log('Loans query result:', loansData, loansError);
      console.log('Query used email:', user.email);

      if (loansData) setLoans(loansData);
      setLoading(false);
    };
    fetchBuyerData();
  }, []);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const urgentLoan = loans.find((loan) => {
    const due = new Date(loan.due_date);
    return due <= today && loan.status !== 'paid';
  });

  const totalOutstanding = loans.reduce((sum, loan) => sum + (Number(loan.total_amount) - Number(loan.amount_paid || 0)), 0);

  const shopMap = new Map<string, any>();
  loans.forEach((loan) => {
    const shopName = loan.shops?.shop_name || 'Unknown Shop';
    if (!shopMap.has(shopName)) {
      shopMap.set(shopName, { shopName, shopId: loan.shop_id, loans: [], totalOwed: 0 });
    }
    const shop = shopMap.get(shopName);
    shop.loans.push(loan);
    shop.totalOwed += Number(loan.total_amount) - Number(loan.amount_paid || 0);
  });
  const shopGroups = Array.from(shopMap.values());

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="h-8 w-8 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

      {/* Urgent alert strip */}
      {urgentLoan && (
        <Link href={`/buyer/shops/${urgentLoan.shop_id}`} className="flex items-center gap-3 bg-[#E85D04] text-white rounded-xl px-4 py-3 w-full">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium leading-snug">
            Payment due today at {urgentLoan.shops?.shop_name} — ETB {Number(urgentLoan.total_amount).toLocaleString()}
          </span>
        </Link>
      )}

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Hello, {buyerName || 'there'} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here is what you currently owe.</p>
      </div>

      {/* Empty state */}
      {loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="font-semibold text-[#1A1A2E]">You have no outstanding loans</p>
          <p className="text-sm text-gray-400 max-w-xs">When a shop records a loan for you it will appear here</p>
        </div>
      ) : (
        <>
          {/* Shop cards */}
          <div className="space-y-3">
            {shopGroups.map((shop) => (
              <Link
                key={shop.shopId}
                href={`/buyer/shops/${shop.shopId}`}
                className="flex items-center gap-4 bg-white rounded-xl shadow-sm border-l-4 border-[#E85D04] px-4 py-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1A1A2E] truncate">{shop.shopName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {shop.loans.length} active {shop.loans.length === 1 ? 'loan' : 'loans'} · ETB {shop.totalOwed.toLocaleString()} total
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {dueBadge(shop.loans)}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>

          {/* Total outstanding */}
          <p className="text-sm text-gray-500 text-center">
            Total outstanding across all shops:{' '}
            <span className="font-bold text-[#1A1A2E]">ETB {totalOutstanding.toLocaleString()}</span>
          </p>
        </>
      )}

    </div>
  );
}
