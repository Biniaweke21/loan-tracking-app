'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { createClient } from '@/lib/supabase/client';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Plus, Send, Eye, AlertCircle, Clock, Banknote, TrendingUp, FileText } from 'lucide-react';

const supabase = createClient();

const weeklyData = [
  { week: 'W1', loans: 0 },
  { week: 'W2', loans: 0 },
  { week: 'W3', loans: 0 },
  { week: 'W4', loans: 0 },
  { week: 'W5', loans: 0 },
];

function daysSince(dateStr: string) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}
function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

function StatCard({ label, value, sub, borderColor, icon: Icon }: {
  label: string; value: string | number; sub?: string; borderColor: string; icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4" style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}>
      <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${borderColor}18` }}>
        <Icon className="h-5 w-5" style={{ color: borderColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-black text-[#1A1A2E] leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOutstanding: 0, activeLoans: 0, overdue: 0, dueSoon: 0 });
  const [overdueLoans, setOverdueLoans] = useState<any[]>([]);
  const [dueSoonLoans, setDueSoonLoans] = useState<any[]>([]);
  const [allLoans, setAllLoans] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: shop } = await supabase
        .from('shops').select('id, shop_name').eq('owner_id', user.id).single();
      if (!shop) { setLoading(false); return; }
      setShopName(shop.shop_name);

      const { data: loans } = await supabase
        .from('loans').select('id, total_amount, amount_paid, due_date, status, buyer_name, buyer_email, shop_id, created_at, loan_items(*)').eq('shop_id', shop.id).neq('status', 'paid');
      if (!loans) { setLoading(false); return; }

      const today = new Date(); today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date(); weekFromNow.setDate(weekFromNow.getDate() + 7);

      const active   = loans.filter((l: any) => l.status === 'active' || l.status === 'pending_confirmation');
      const overdue  = loans.filter((l: any) => new Date(l.due_date) < today && l.status !== 'paid');
      const dueSoon  = loans.filter((l: any) => { const d = new Date(l.due_date); return d >= today && d <= weekFromNow && l.status === 'active'; });
      const outstanding = active.reduce((sum: number, l: any) => sum + (Number(l.total_amount) - Number(l.amount_paid || 0)), 0);

      setStats({ totalOutstanding: outstanding, activeLoans: active.length, overdue: overdue.length, dueSoon: dueSoon.length });
      setOverdueLoans(overdue);
      setDueSoonLoans(dueSoon);
      setAllLoans(loans);
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AppLayout><AppHeader />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
        </main>
      </AppLayout>
    );
  }

  const hasLoans = allLoans.length > 0;

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-6 pb-24 md:pb-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Outstanding" value={`${CURRENCY_SYMBOL} ${stats.totalOutstanding.toLocaleString()}`} sub="across all active loans" borderColor="#E85D04" icon={TrendingUp} />
          <StatCard label="Active Loans" value={stats.activeLoans} sub="currently running" borderColor="#1A1A2E" icon={Banknote} />
          <StatCard label="Overdue" value={stats.overdue} sub="need attention" borderColor="#DC2626" icon={AlertCircle} />
          <StatCard label="Due This Week" value={stats.dueSoon} sub="upcoming payments" borderColor="#E85D04" icon={Clock} />
        </div>

        {/* Empty state */}
        {!hasLoans && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-[#FFF3E0] flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-[#E85D04]" />
            </div>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Welcome to Kirari!</h2>
            <p className="text-sm text-gray-500 max-w-xs mb-6">You have no loans yet. Add your first loan to get started.</p>
            <Link href={ROUTES.NEW_LOAN} className="flex items-center gap-2 bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <Plus className="h-5 w-5" /> Add Your First Loan
            </Link>
          </div>
        )}

        {/* Main grid */}
        {hasLoans && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Overdue loans */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-bold text-[#1A1A2E]">Overdue Loans</h2>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{overdueLoans.length}</span>
                </div>
                {overdueLoans.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">No overdue loans</div>
                ) : (
                  <div className="space-y-3">
                    {overdueLoans.map((loan: any) => (
                      <div key={loan.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeftWidth: 4, borderLeftColor: '#DC2626' }}>
                        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#1A1A2E] truncate">{loan.buyer_name}</p>
                            <p className="text-red-600 font-black text-lg leading-tight">{CURRENCY_SYMBOL} {Number(loan.total_amount).toLocaleString()}</p>
                            <p className="text-red-400 text-xs mt-0.5">{daysSince(loan.due_date)} days overdue</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E85D04] text-[#E85D04] text-xs font-semibold hover:bg-[#FFF3E0] transition-colors">
                              <Send className="h-3 w-3" /> Send Reminder
                            </button>
                            <Link href={`/app/loans/${loan.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 text-xs font-semibold hover:bg-gray-100 transition-colors">
                              <Eye className="h-3 w-3" /> View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Due this week */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-bold text-[#1A1A2E]">Due This Week</h2>
                  <span className="bg-[#FFF3E0] text-[#E85D04] text-xs font-bold px-2 py-0.5 rounded-full">{dueSoonLoans.length}</span>
                </div>
                {dueSoonLoans.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">Nothing due this week</div>
                ) : (
                  <div className="space-y-3">
                    {dueSoonLoans.map((loan: any) => {
                      const days = daysUntil(loan.due_date);
                      return (
                        <div key={loan.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeftWidth: 4, borderLeftColor: '#E85D04' }}>
                          <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-[#1A1A2E] truncate">{loan.buyer_name}</p>
                              <p className="text-[#E85D04] font-black text-lg leading-tight">{CURRENCY_SYMBOL} {Number(loan.total_amount).toLocaleString()}</p>
                              <p className="text-gray-400 text-xs mt-0.5">
                                Due <span className="font-semibold text-[#E85D04]">{days === 0 ? 'today' : `in ${days} day${days !== 1 ? 's' : ''}`}</span>
                                {' — '}{new Date(loan.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E85D04] text-[#E85D04] text-xs font-semibold hover:bg-[#FFF3E0] transition-colors">
                                <Send className="h-3 w-3" /> Send Reminder
                              </button>
                              <Link href={`/app/loans/${loan.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 text-xs font-semibold hover:bg-gray-100 transition-colors">
                                <Eye className="h-3 w-3" /> View
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bar chart */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-[#1A1A2E] mb-4">Loans This Month</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} width={24} />
                    <Tooltip cursor={{ fill: '#FFF3E0' }} contentStyle={{ border: 'none', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 12 }} />
                    <Bar dataKey="loans" fill="#E85D04" radius={[6, 6, 0, 0]} name="Loans" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity feed */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full">
                <h2 className="font-bold text-[#1A1A2E] mb-4">Recent Activity</h2>
                <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
              </div>
            </div>
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
