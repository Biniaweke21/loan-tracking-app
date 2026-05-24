'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { Edit2, Download, Trash2, Lock, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── section wrapper ─────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-[#1A1A2E]">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ── row with edit button ────────────────────────────────── */

function InfoRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-[#1A1A2E] mt-0.5">{value}</p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E85D04] text-[#E85D04] text-xs font-semibold hover:bg-[#FFF3E0] transition-colors"
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </button>
      )}
    </div>
  );
}

/* ── orange toggle ───────────────────────────────────────── */

function OrangeToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors duration-200 shrink-0',
        checked ? 'bg-[#E85D04]' : 'bg-gray-200'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-5' : 'translate-x-0'
      )} />
    </button>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    dueDateReminders:    true,
    overdueAlerts:       true,
    paymentConfirmations: true,
  });
  const [language, setLanguage] = useState<'en' | 'am'>('en');

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((p) => ({ ...p, [key]: !p[key] }));

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 space-y-5 pb-24 md:pb-8 max-w-xl">

        {/* ── Shop Information ── */}
        <Section title="Shop Information">
          <InfoRow label="Shop Name"   value="Tigist General Store" onEdit={() => {}} />
          <div className="border-t border-gray-100" />
          <InfoRow label="Owner Name"  value="John Doe"             onEdit={() => {}} />
        </Section>

        {/* ── Account ── */}
        <Section title="Account">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">Phone Number</p>
              <p className="text-sm font-semibold text-[#1A1A2E] mt-0.5">+251 911 223 344</p>
            </div>
            <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E85D04] text-[#E85D04] text-xs font-semibold hover:bg-[#FFF3E0] transition-colors">
              <Phone className="h-3 w-3" />
              Change
            </button>
          </div>
          <div className="border-t border-gray-100" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Password</p>
              <p className="text-sm font-semibold text-[#1A1A2E] mt-0.5">••••••••</p>
            </div>
            <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#1A1A2E] text-[#1A1A2E] text-xs font-semibold hover:bg-[#1A1A2E] hover:text-white transition-colors">
              <Lock className="h-3 w-3" />
              Change Password
            </button>
          </div>
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications">
          {([
            { key: 'dueDateReminders',    label: 'Due Date Reminders',    desc: 'Get notified before a loan is due' },
            { key: 'overdueAlerts',       label: 'Overdue Alerts',        desc: 'Get alerted when a loan becomes overdue' },
            { key: 'paymentConfirmations',label: 'Payment Confirmations', desc: 'Notify when a buyer confirms payment' },
          ] as const).map((item, i, arr) => (
            <div key={item.key}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <OrangeToggle
                  checked={notifications[item.key]}
                  onChange={() => toggleNotif(item.key)}
                />
              </div>
              {i < arr.length - 1 && <div className="border-t border-gray-100 mt-4" />}
            </div>
          ))}
        </Section>

        {/* ── Language ── */}
        <Section title="Language">
          <div className="flex gap-3">
            {([
              { value: 'en', label: 'English' },
              { value: 'am', label: 'አማርኛ' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLanguage(opt.value)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all flex-1 justify-center',
                  language === opt.value
                    ? 'border-[#E85D04] bg-[#FFF3E0] text-[#E85D04]'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                )}
              >
                {/* Radio dot */}
                <span className={cn(
                  'h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0',
                  language === opt.value ? 'border-[#E85D04]' : 'border-gray-300'
                )}>
                  {language === opt.value && (
                    <span className="h-2 w-2 rounded-full bg-[#E85D04]" />
                  )}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </Section>

        {/* ── Data ── */}
        <Section title="Data">
          <p className="text-xs text-gray-400">Export your loan records</p>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </Section>

        {/* ── Danger Zone ── */}
        <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-red-200">
            <h2 className="font-bold text-red-600">Danger Zone</h2>
          </div>
          <div className="p-5">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
            <p className="text-xs text-red-400 mt-3 text-center leading-relaxed">
              This action is permanent and cannot be undone. All your loans, customers, and records will be deleted forever.
            </p>
          </div>
        </div>

      </main>
    </AppLayout>
  );
}
