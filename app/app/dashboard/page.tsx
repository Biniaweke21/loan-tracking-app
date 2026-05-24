'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { dummyLoans, dummyCustomers } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Plus, Send, Eye, AlertCircle, Clock, Banknote, TrendingUp } from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────── */

function getCustomerName(id: string) {
  return dummyCustomers.find((c) => c.id === id)?.name ?? 'Unknown';
}

function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / 86_400_000);
}

function daysUntil(date: Date) {
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

/* ── static data ─────────────────────────────────────────── */

const weeklyData = [
  { week: 'W1', loans: 4 },
  { week: 'W2', loans: 7 },
  { week: 'W3', loans: 5 },
  { week: 'W4', loans: 9 },
  { week: 'W5', loans: 6 },
];

const activityFeed = [
  { id: 1, type: 'loan',     action: 'New loan recorded for', buyer: 'ብርሃነ ታደሰ',  time: '2 min ago' },
  { id: 2, type: 'payment',  action: 'Payment confirmed by',  buyer: 'ታሪክ ዩሱፍ',   time: '1 hr ago' },
  { id: 3, type: 'reminder', action: 'Reminder sent to',      buyer: 'ሙሙ ሙሊታ',    time: '3 hr ago' },
  { id: 4, type: 'loan',     action: 'New loan recorded for', buyer: 'ሌት ሳዩ',      time: 'Yesterday' },
  { id: 5, type: 'payment',  action: 'Payment confirmed by',  buyer: 'ብርሃነ ታደሰ',  time: 'Yesterday' },
];

const dotColor: Record<string, string> = {
  loan:     'bg-[#E85D04]',
  payment:  'bg-[#16A34A]',
  reminder: 'bg-blue-500',
};

/* ── sub-components ──────────────────────────────────────── */

function StatCard({
  label, value, sub, borderColor, icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  borderColor: string;
  icon: React.ElementType;
}) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4"
      style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}
    >
      <div
        className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${borderColor}18` }}
      >
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

/* ── page ────────────────────────────────────────────────── */

export default function Dashboard() {
  const overdueLoans = dummyLoans.filter((l) => l.status === 'overdue');
  const activeLoans  = dummyLoans.filter((l) => l.status === 'active');

  const dueThisWeek = dummyLoans.filter((l) => {
    const d = daysUntil(l.dueDate);
    return (l.status === 'active') && d >= 0 && d <= 7;
  });

  const totalOutstanding = dummyLoans
    .filter((l) => l.status !== 'paid')
    .reduce((s, l) => s + l.remainingAmount, 0);

  return (
    <AppLayout>
      <AppHeader />

      <main className="p-4 md:p-6 space-y-6 pb-24 md:pb-8">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Outstanding"
            value={`${CURRENCY_SYMBOL} ${totalOutstanding.toLocaleString()}`}
            sub="across all active loans"
            borderColor="#E85D04"
            icon={TrendingUp}
          />
          <StatCard
            label="Active Loans"
            value={activeLoans.length}
            sub="currently running"
            borderColor="#1A1A2E"
            icon={Banknote}
          />
          <StatCard
            label="Overdue"
            value={overdueLoans.length}
            sub="need attention"
            borderColor="#DC2626"
            icon={AlertCircle}
          />
          <StatCard
            label="Due This Week"
            value={dueThisWeek.length}
            sub="upcoming payments"
            borderColor="#E85D04"
            icon={Clock}
          />
        </div>

        {/* ── Main grid: left column + right activity feed ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overdue loans */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="font-bold text-[#1A1A2E]">Overdue Loans</h2>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {overdueLoans.length}
                </span>
              </div>

              {overdueLoans.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
                  No overdue loans
                </div>
              ) : (
                <div className="space-y-3">
                  {overdueLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                      style={{ borderLeftWidth: 4, borderLeftColor: '#DC2626' }}
                    >
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1A1A2E] truncate">
                            {getCustomerName(loan.customerId)}
                          </p>
                          <p className="text-red-600 font-black text-lg leading-tight">
                            {CURRENCY_SYMBOL} {loan.remainingAmount.toLocaleString()}
                          </p>
                          <p className="text-red-400 text-xs mt-0.5">
                            {daysSince(loan.dueDate)} days overdue
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E85D04] text-[#E85D04] text-xs font-semibold hover:bg-[#FFF3E0] transition-colors">
                            <Send className="h-3 w-3" />
                            Send Reminder
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 text-xs font-semibold hover:bg-gray-100 transition-colors">
                            <Eye className="h-3 w-3" />
                            View
                          </button>
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
                <span className="bg-[#FFF3E0] text-[#E85D04] text-xs font-bold px-2 py-0.5 rounded-full">
                  {dueThisWeek.length}
                </span>
              </div>

              {dueThisWeek.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
                  Nothing due this week
                </div>
              ) : (
                <div className="space-y-3">
                  {dueThisWeek.map((loan) => {
                    const days = daysUntil(loan.dueDate);
                    return (
                      <div
                        key={loan.id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                        style={{ borderLeftWidth: 4, borderLeftColor: '#E85D04' }}
                      >
                        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#1A1A2E] truncate">
                              {getCustomerName(loan.customerId)}
                            </p>
                            <p className="text-[#E85D04] font-black text-lg leading-tight">
                              {CURRENCY_SYMBOL} {loan.remainingAmount.toLocaleString()}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5">
                              Due{' '}
                              <span className="font-semibold text-[#E85D04]">
                                {days === 0 ? 'today' : `in ${days} day${days !== 1 ? 's' : ''}`}
                              </span>
                              {' — '}
                              {loan.dueDate.toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E85D04] text-[#E85D04] text-xs font-semibold hover:bg-[#FFF3E0] transition-colors">
                              <Send className="h-3 w-3" />
                              Send Reminder
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 text-xs font-semibold hover:bg-gray-100 transition-colors">
                              <Eye className="h-3 w-3" />
                              View
                            </button>
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
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    width={24}
                  />
                  <Tooltip
                    cursor={{ fill: '#FFF3E0' }}
                    contentStyle={{
                      border: 'none',
                      borderRadius: 8,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="loans" fill="#E85D04" radius={[6, 6, 0, 0]} name="Loans" />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Right column — activity feed */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full">
              <h2 className="font-bold text-[#1A1A2E] mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {/* Colored dot */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor[item.type]}`} />
                      <div className="w-px flex-1 bg-gray-100" />
                    </div>
                    <div className="pb-4 min-w-0">
                      <p className="text-sm text-gray-500 leading-snug">
                        {item.action}{' '}
                        <span className="font-semibold text-[#1A1A2E]">{item.buyer}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Floating action button ── */}
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
