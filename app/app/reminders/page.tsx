'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { dummyReminders, dummyLoans, dummyCustomers } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL } from '@/lib/constants';
import { Send, MessageSquare, MessageCircle, Phone, Mail, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── helpers ─────────────────────────────────────────────── */

function getLoan(loanId: string) {
  return dummyLoans.find((l) => l.id === loanId);
}

function getCustomer(loanId: string) {
  const loan = getLoan(loanId);
  if (!loan) return null;
  return dummyCustomers.find((c) => c.id === loan.customerId);
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  sms:      <MessageSquare className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  call:     <Phone className="h-4 w-4" />,
  email:    <Mail className="h-4 w-4" />,
};

const TYPE_LABEL: Record<string, string> = {
  sms: 'SMS', whatsapp: 'WhatsApp', call: 'Call', email: 'Email',
};

/* ── delivery badge ──────────────────────────────────────── */

function DeliveryBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    sent:    'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30',
    failed:  'bg-red-50 text-red-600 border-red-200',
  };
  const label: Record<string, string> = {
    sent: 'Delivered', pending: 'Pending', failed: 'Failed',
  };
  return (
    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', cfg[status] ?? cfg.pending)}>
      {label[status] ?? status}
    </span>
  );
}

/* ── upcoming card ───────────────────────────────────────── */

function UpcomingCard({ reminder }: { reminder: typeof dummyReminders[0] }) {
  const customer = getCustomer(reminder.loanId);
  const loan = getLoan(reminder.loanId);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3">
        {/* Channel icon */}
        <div className="h-9 w-9 rounded-lg bg-[#FFF3E0] flex items-center justify-center text-[#E85D04] shrink-0 mt-0.5">
          {TYPE_ICON[reminder.type] ?? TYPE_ICON.sms}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-[#1A1A2E] text-sm">{customer?.name ?? 'Unknown'}</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {TYPE_LABEL[reminder.type]}
            </span>
          </div>

          {loan && (
            <p className="text-sm text-[#E85D04] font-bold mt-0.5">
              {CURRENCY_SYMBOL} {loan.remainingAmount.toLocaleString()}
              <span className="text-gray-400 font-normal text-xs ml-1">remaining</span>
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
            {loan && (
              <span>
                Due{' '}
                <span className="font-medium text-gray-600">
                  {loan.dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </span>
            )}
            <span>
              Send at{' '}
              <span className="font-medium text-gray-600">
                {reminder.scheduledDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}{' '}
                {reminder.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </span>
          </div>

          {reminder.message && (
            <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 italic">
              &ldquo;{reminder.message}&rdquo;
            </p>
          )}
        </div>

        {/* Send now */}
        <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E85D04] text-[#E85D04] text-xs font-semibold hover:bg-[#FFF3E0] transition-colors">
          <Send className="h-3 w-3" />
          Send Now
        </button>
      </div>
    </div>
  );
}

/* ── sent card ───────────────────────────────────────────── */

function SentCard({ reminder }: { reminder: typeof dummyReminders[0] }) {
  const customer = getCustomer(reminder.loanId);
  const loan = getLoan(reminder.loanId);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
          {TYPE_ICON[reminder.type] ?? TYPE_ICON.sms}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-[#1A1A2E] text-sm">{customer?.name ?? 'Unknown'}</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {TYPE_LABEL[reminder.type]}
            </span>
          </div>

          {loan && (
            <p className="text-xs text-gray-500 mt-0.5">
              Loan {reminder.loanId} · {CURRENCY_SYMBOL} {loan.remainingAmount.toLocaleString()}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-1">
            {reminder.sentDate
              ? reminder.sentDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : reminder.scheduledDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <DeliveryBadge status={reminder.status} />
      </div>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function RemindersPage() {
  const [tab, setTab] = useState<'upcoming' | 'sent'>('upcoming');
  const [daysBefore, setDaysBefore] = useState(1);

  const upcoming = dummyReminders.filter((r) => r.status === 'pending');
  const sent     = dummyReminders.filter((r) => r.status !== 'pending');

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-5 pb-24 md:pb-8 max-w-2xl">

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Upcoming', value: upcoming.length, color: 'text-[#E85D04]' },
            { label: 'Delivered', value: dummyReminders.filter((r) => r.status === 'sent').length, color: 'text-green-600' },
            { label: 'Failed', value: dummyReminders.filter((r) => r.status === 'failed').length, color: 'text-red-500' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
              <p className={cn('text-2xl font-black', s.color)}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(['upcoming', 'sent'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-5 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize',
                tab === t
                  ? 'border-[#E85D04] text-[#E85D04]'
                  : 'border-transparent text-gray-400 hover:text-[#1A1A2E]'
              )}
            >
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Sent (${sent.length})`}
            </button>
          ))}
        </div>

        {/* List */}
        {tab === 'upcoming' && (
          <div className="space-y-3">
            {upcoming.length > 0
              ? upcoming.map((r) => <UpcomingCard key={r.id} reminder={r} />)
              : <p className="text-center py-12 text-gray-400 text-sm">No upcoming reminders</p>
            }
          </div>
        )}

        {tab === 'sent' && (
          <div className="space-y-3">
            {sent.length > 0
              ? sent.map((r) => <SentCard key={r.id} reminder={r} />)
              : <p className="text-center py-12 text-gray-400 text-sm">No sent reminders</p>
            }
          </div>
        )}

        {/* Settings card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-[#1A1A2E] text-sm mb-1">Reminder Timing</h3>
          <p className="text-xs text-gray-400 mb-4">
            Send reminders this many days before the due date
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDaysBefore(Math.max(1, daysBefore - 1))}
              className="h-9 w-9 rounded-full border-2 border-[#E85D04] text-[#E85D04] flex items-center justify-center hover:bg-[#FFF3E0] transition-colors"
              aria-label="Decrease days"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="text-center min-w-[3rem]">
              <p className="text-2xl font-black text-[#1A1A2E]">{daysBefore}</p>
              <p className="text-xs text-gray-400">day{daysBefore !== 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setDaysBefore(Math.min(14, daysBefore + 1))}
              className="h-9 w-9 rounded-full border-2 border-[#E85D04] text-[#E85D04] flex items-center justify-center hover:bg-[#FFF3E0] transition-colors"
              aria-label="Increase days"
            >
              <Plus className="h-4 w-4" />
            </button>
            <p className="text-sm text-gray-500 ml-2">
              before due date
            </p>
          </div>
        </div>

      </main>
    </AppLayout>
  );
}
