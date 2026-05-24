'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { dummyLoans, dummyCustomers, dummyPayments } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import {
  ArrowLeft, Send, Edit, CheckCircle, Circle, DollarSign,
  List, Plus, Mic, X, Trash2, ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── dummy items (same for every loan) ───────────────────── */

const LOAN_ITEMS = [
  { name: 'Flour',       amount: 500,  dateAdded: '10 Jan 2024' },
  { name: 'Cooking oil', amount: 300,  dateAdded: '10 Jan 2024' },
];
const LOAN_ITEMS_TOTAL = LOAN_ITEMS.reduce((s, i) => s + i.amount, 0);

/* ── items table ─────────────────────────────────────────── */

function ItemsTable({ dateAdded }: { dateAdded: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <List className="h-4 w-4 text-[#E85D04]" />
        <h2 className="font-bold text-[#1A1A2E] text-sm">Loan Items</h2>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-5 py-2 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wide">
        <span>Item</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Date Added</span>
      </div>

      {/* Rows */}
      {LOAN_ITEMS.map((item) => (
        <div
          key={item.name}
          className="grid grid-cols-3 px-5 py-3 border-b border-gray-100 last:border-b-0 text-sm"
        >
          <span className="text-[#1A1A2E] font-medium">{item.name}</span>
          <span className="text-right text-gray-600">
            {CURRENCY_SYMBOL} {item.amount.toLocaleString()}
          </span>
          <span className="text-right text-gray-400">{dateAdded}</span>
        </div>
      ))}

      {/* Total row */}
      <div className="grid grid-cols-3 px-5 py-3 border-t-2 border-[#E85D04]/30 bg-[#FFF3E0]">
        <span className="text-sm font-bold text-[#1A1A2E]">Total</span>
        <span className="text-right text-sm font-black text-[#E85D04]">
          {CURRENCY_SYMBOL} {LOAN_ITEMS_TOTAL.toLocaleString()}
        </span>
        <span />
      </div>
    </div>
  );
}

/* ── status config ───────────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:  { label: 'Active',  color: 'text-[#1A1A2E]', bg: 'bg-[#1A1A2E]/5',  border: 'border-[#1A1A2E]/20' },
  overdue: { label: 'Overdue', color: 'text-red-600',    bg: 'bg-red-50',        border: 'border-red-200' },
  paid:    { label: 'Paid',    color: 'text-green-700',  bg: 'bg-green-50',      border: 'border-green-200' },
  pending: { label: 'Pending', color: 'text-[#E85D04]',  bg: 'bg-[#FFF3E0]',    border: 'border-[#E85D04]/30' },
};

/* ── timeline steps ──────────────────────────────────────── */

function TimelineStep({
  label, date, done, last,
}: { label: string; date?: string; done: boolean; last?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center border-2 shrink-0',
          done
            ? 'bg-[#E85D04] border-[#E85D04]'
            : 'bg-white border-gray-200'
        )}>
          {done
            ? <Check className="h-3.5 w-3.5 text-white" />
            : <Circle className="h-3 w-3 text-gray-300" />
          }
        </div>
        {!last && <div className={cn('w-0.5 flex-1 mt-1', done ? 'bg-[#E85D04]/30' : 'bg-gray-100')} />}
      </div>
      <div className="pb-5 min-w-0">
        <p className={cn('text-sm font-semibold', done ? 'text-[#1A1A2E]' : 'text-gray-400')}>{label}</p>
        {date && <p className="text-xs text-gray-400 mt-0.5">{date}</p>}
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ── modal helpers ───────────────────────────────────────── */

let _itemId = 100;
function newModalItem() { return { id: _itemId++, name: '', amount: '' }; }

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

const DATE_CHIPS = [
  { label: '1 Week',   days: 7 },
  { label: '2 Weeks',  days: 14 },
  { label: '1 Month',  days: 30 },
];

/* ── buyer banner (inside modal) ─────────────────────────── */

function BuyerBanner({ name, phone, initials }: { name: string; phone: string; initials: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#E85D04] rounded-xl px-4 py-3">
      <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="font-bold text-white text-sm leading-none">{name}</p>
        <p className="text-white/70 text-xs mt-0.5">{phone}</p>
      </div>
    </div>
  );
}

/* ── modal progress bar ──────────────────────────────────── */

const MODAL_STEPS = ['Items', 'Due Date', 'Review'];

function ModalProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {MODAL_STEPS.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                done   ? 'bg-[#E85D04] border-[#E85D04] text-white' :
                active ? 'bg-white border-[#E85D04] text-[#E85D04]' :
                         'bg-white border-gray-200 text-gray-400'
              )}>
                {done ? <Check className="h-3.5 w-3.5" /> : num}
              </div>
              <span className={cn(
                'text-[10px] font-medium whitespace-nowrap',
                active ? 'text-[#E85D04]' : done ? 'text-[#E85D04]/60' : 'text-gray-400'
              )}>
                {label}
              </span>
            </div>
            {i < MODAL_STEPS.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-1 mb-4', done ? 'bg-[#E85D04]' : 'bg-gray-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── toast ───────────────────────────────────────────────── */

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#E85D04] text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
      <CheckCircle className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}

/* ── add loan modal ──────────────────────────────────────── */

interface ModalItem { id: number; name: string; amount: string; }

function AddLoanModal({
  customer,
  existingBalance,
  onClose,
  onConfirm,
}: {
  customer: { name: string; phone: string; initials: string };
  existingBalance: number;
  onClose: () => void;
  onConfirm: (total: number) => void;
}) {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<ModalItem[]>([newModalItem()]);
  const [dueDate, setDueDate] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');

  const updateItem = (id: number, field: 'name' | 'amount', val: string) =>
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, [field]: val } : it));
  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };
  const addItem = () => setItems((prev) => [...prev, newModalItem()]);

  const total = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const totalRepay = total * 1.1;

  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setTranscription('ዱቄት — 500 ብር');
    } else {
      setRecording(true);
      setTranscription('');
    }
  };

  const addTranscribed = () => {
    const it = newModalItem();
    it.name = 'ዱቄት (flour)';
    it.amount = '500';
    setItems((prev) => [...prev, it]);
    setTranscription('');
  };

  const canNext =
    (step === 1 && total > 0) ||
    (step === 2 && !!dueDate);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Dim */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet / modal */}
      <div className="relative z-10 w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors mr-1">
                <ChevronLeft className="h-4 w-4 text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="font-bold text-[#1A1A2E] text-base">Add New Loan</h2>
              <p className="text-xs text-gray-400">Step {step} of {MODAL_STEPS.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Buyer banner */}
          <BuyerBanner name={customer.name} phone={customer.phone} initials={customer.initials} />

          {/* Progress */}
          <ModalProgress step={step} />

          {/* ── Step 1 — Items ── */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#1A1A2E]">Loan Items</p>

              {items.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 min-w-0"
                  />
                  <div className="relative shrink-0 w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">ETB</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                      className="w-full h-10 pl-9 pr-2 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    aria-label={`Remove item ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={addItem}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Another Item
              </button>

              {/* Running total */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Total</span>
                <span className="text-xl font-black text-[#E85D04]">
                  ETB {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Voice */}
              <div className="flex flex-col items-center pt-2 space-y-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 self-start">Or record by voice</p>
                <div className="relative">
                  {recording && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-[#E85D04]/20 animate-ping" />
                      <div className="absolute -inset-3 rounded-full bg-[#E85D04]/10 animate-pulse" />
                    </>
                  )}
                  <button
                    onClick={toggleRecording}
                    className={cn(
                      'relative h-16 w-16 rounded-full flex items-center justify-center shadow-lg transition-all',
                      recording ? 'bg-[#E85D04] scale-110' : 'bg-[#E85D04] hover:bg-[#C44D03]'
                    )}
                    aria-label={recording ? 'Stop recording' : 'Start recording'}
                  >
                    <Mic className="h-7 w-7 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-400">{recording ? 'Recording… tap to stop' : 'Tap to record'}</p>
                {transcription && (
                  <div className="w-full space-y-2">
                    <p className="text-xs text-gray-400 italic text-center">&ldquo;{transcription}&rdquo;</p>
                    <button
                      onClick={addTranscribed}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors"
                    >
                      <Plus className="h-4 w-4" /> Add to Items
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2 — Due Date ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 [color-scheme:light]"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-2">Quick select</p>
                <div className="flex flex-wrap gap-2">
                  {DATE_CHIPS.map((chip) => {
                    const val = addDays(chip.days);
                    const active = dueDate === val;
                    return (
                      <button
                        key={chip.label}
                        onClick={() => setDueDate(val)}
                        className={cn(
                          'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
                          active ? 'bg-[#E85D04] border-[#E85D04] text-white' : 'border-[#E85D04] text-[#E85D04] hover:bg-[#FFF3E0]'
                        )}
                      >
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {total > 0 && (
                <div className="bg-[#FFF3E0] border border-[#E85D04]/30 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    Total to repay:{' '}
                    <span className="font-black text-[#E85D04]">
                      {CURRENCY_SYMBOL} {totalRepay.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">(incl. 10% interest)</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3 — Review ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="bg-[#1A1A2E] px-4 py-3">
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Loan Summary</p>
                </div>
                <div className="p-4 space-y-3">
                  {/* Buyer */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Buyer</span>
                    <div className="text-right">
                      <span className="font-semibold text-[#1A1A2E]">{customer.name}</span>
                      {existingBalance > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Current balance: {CURRENCY_SYMBOL} {existingBalance.toLocaleString()} outstanding
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-100" />
                  {/* Items */}
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-2">Items</p>
                    <div className="space-y-1.5">
                      {items.filter((it) => it.name || it.amount).map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name || '(unnamed)'}</span>
                          <span className="font-semibold text-[#1A1A2E]">
                            {CURRENCY_SYMBOL} {(parseFloat(item.amount) || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-600">Total</span>
                      <span className="text-lg font-black text-[#E85D04]">
                        {CURRENCY_SYMBOL} {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100" />
                  {/* Due date */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Due Date</span>
                    <span className="font-semibold text-[#1A1A2E]">
                      {dueDate ? new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Repay</span>
                    <span className="font-semibold text-[#1A1A2E]">
                      {CURRENCY_SYMBOL} {totalRepay.toLocaleString(undefined, { maximumFractionDigits: 0 })} (incl. 10%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF3E0] border border-[#E85D04]/30 rounded-xl p-4">
                <p className="text-xs text-[#E85D04] leading-relaxed">
                  The buyer will receive a confirmation request. The loan is only recorded once both parties confirm.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer button */}
        <div className="px-5 pb-6 pt-3 border-t border-gray-100 shrink-0">
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext}
              className="w-full py-3.5 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => onConfirm(total)}
              className="w-full py-3.5 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-bold text-sm transition-colors"
            >
              Add Loan and Notify Buyer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── loan history row ────────────────────────────────────── */

const STATUS_BADGE: Record<string, string> = {
  active:  'bg-[#1A1A2E]/5 text-[#1A1A2E] border-[#1A1A2E]/20',
  overdue: 'bg-red-50 text-red-600 border-red-200',
  paid:    'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30',
};

/* ── page ────────────────────────────────────────────────── */

export default function LoanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loan = dummyLoans.find((l) => l.id === id);
  const customer = loan ? dummyCustomers.find((c) => c.id === loan.customerId) : null;
  const payments = loan ? dummyPayments.filter((p) => p.loanId === loan.id) : [];

  // All loans for this customer (for history section)
  const customerLoans = loan
    ? dummyLoans.filter((l) => l.customerId === loan.customerId)
    : [];

  // Existing outstanding balance (excluding current loan)
  const existingBalance = loan
    ? dummyLoans
        .filter((l) => l.customerId === loan.customerId && l.status !== 'paid')
        .reduce((s, l) => s + l.remainingAmount, 0)
    : 0;

  if (!loan || !customer) {
    return (
      <AppLayout>
        <AppHeader />
        <main className="p-6 text-center py-20">
          <p className="text-gray-400">Loan not found.</p>
          <Link href={ROUTES.LOANS} className="text-[#E85D04] text-sm mt-2 inline-block hover:underline">
            Back to Loans
          </Link>
        </main>
      </AppLayout>
    );
  }

  const cfg = STATUS_CONFIG[loan.status] ?? STATUS_CONFIG.active;
  const pct = Math.min((loan.paidAmount / loan.totalAmount) * 100, 100);
  const initials = customer.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const reliabilityScore = loan.status === 'paid' ? 'Excellent' : loan.status === 'overdue' ? 'At Risk' : 'Good';
  const reliabilityColor = loan.status === 'paid' ? 'text-green-600 bg-green-50 border-green-200'
    : loan.status === 'overdue' ? 'text-red-600 bg-red-50 border-red-200'
    : 'text-[#E85D04] bg-[#FFF3E0] border-[#E85D04]/30';

  const timelineSteps = [
    { label: 'Loan Created',    date: loan.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), done: true },
    { label: 'Buyer Confirmed', date: loan.disburseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), done: true },
    { label: 'Partial Payment', date: payments[0]?.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), done: payments.length > 0 },
    { label: 'Fully Paid',      date: loan.status === 'paid' ? loan.dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined, done: loan.status === 'paid' },
  ];

  const handleConfirm = (total: number) => {
    setModalOpen(false);
    setToast(`New loan added for ${customer.name} — ${CURRENCY_SYMBOL} ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
  };

  return (
    <AppLayout>
      <AppHeader />

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Modal */}
      {modalOpen && (
        <AddLoanModal
          customer={{ name: customer.name, phone: customer.phone, initials }}
          existingBalance={existingBalance}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}

      <main className="p-4 md:p-6 pb-24 md:pb-8 max-w-2xl mx-auto space-y-5">

        {/* Back */}
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.LOANS}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="font-bold text-[#1A1A2E]">Loan {loan.id}</h1>
            <p className="text-xs text-gray-400">
              Created {loan.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <span className={cn('ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border', cfg.bg, cfg.color, cfg.border)}>
            {cfg.label}
          </span>
        </div>

        {/* Buyer info card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#E85D04] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1A1A2E] text-base">{customer.name}</p>
              <p className="text-sm text-gray-400">{customer.phone}</p>
              {customer.businessName && (
                <p className="text-xs text-gray-400 truncate">{customer.businessName}</p>
              )}
            </div>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0', reliabilityColor)}>
              {reliabilityScore}
            </span>
          </div>
          {/* Add New Loan button */}
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add New Loan for This Customer
          </button>
        </div>

        {/* Loan amount card */}
        <div className="bg-[#1A1A2E] rounded-xl p-5 text-white">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Remaining Balance</p>
          <p className="text-4xl font-black text-[#E85D04] leading-none">
            {CURRENCY_SYMBOL} {loan.remainingAmount.toLocaleString()}
          </p>
          <p className="text-white/40 text-sm mt-1">
            of {CURRENCY_SYMBOL} {loan.totalAmount.toLocaleString()} total
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/50 mb-1.5">
              <span>Paid: {CURRENCY_SYMBOL} {loan.paidAmount.toLocaleString()}</span>
              <span>{pct.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#E85D04] rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-white/40 text-xs">Disbursed</p>
              <p className="text-white text-sm font-semibold">
                {loan.disburseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Due Date</p>
              <p className="text-white text-sm font-semibold">
                {loan.dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Loan items breakdown */}
        <ItemsTable
          dateAdded={loan.disburseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        />

        {/* Two-column: timeline + payments */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-[#1A1A2E] text-sm mb-4">Status Timeline</h2>
            <div>
              {timelineSteps.map((s, i) => (
                <TimelineStep key={s.label} label={s.label} date={s.date} done={s.done} last={i === timelineSteps.length - 1} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-[#1A1A2E] text-sm mb-4">Payments</h2>
            {payments.length === 0 ? (
              <p className="text-gray-400 text-sm">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A1A2E]">
                        {CURRENCY_SYMBOL} {p.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {p.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {p.method.replace('_', ' ')}
                      </p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  </div>
                ))}
              </div>
            )}
            {loan.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium mb-1">Notes</p>
                <p className="text-sm text-gray-600">{loan.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm transition-colors">
            <CheckCircle className="h-4 w-4" />
            Mark Payment
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#E85D04] text-[#E85D04] font-semibold text-sm hover:bg-[#FFF3E0] transition-colors">
            <Send className="h-4 w-4" />
            Send Reminder
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>

        {/* Loan history for this customer */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#1A1A2E] text-sm">
              Loan History — {customer.name}
            </h2>
            <span className="text-xs text-gray-400">{customerLoans.length} loan{customerLoans.length !== 1 ? 's' : ''}</span>
          </div>
          {customerLoans.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">No other loans found.</p>
          ) : (
            <div>
              {customerLoans.map((l) => {
                const badgeStyle = STATUS_BADGE[l.status] ?? STATUS_BADGE.active;
                const isCurrentLoan = l.id === id;
                return (
                  <div
                    key={l.id}
                    className={cn(
                      'flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 last:border-b-0',
                      isCurrentLoan ? 'bg-[#FFF3E0]' : 'hover:bg-gray-50'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">
                        {l.disburseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {isCurrentLoan && <span className="ml-2 text-[#E85D04] font-semibold">← current</span>}
                      </p>
                      <p className="font-bold text-[#E85D04] text-sm mt-0.5">
                        {CURRENCY_SYMBOL} {l.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0', badgeStyle)}>
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                    </span>
                    {!isCurrentLoan && (
                      <Link
                        href={`/app/loans/${l.id}`}
                        className="text-xs font-semibold text-[#E85D04] hover:underline shrink-0"
                      >
                        View
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </AppLayout>
  );
}
