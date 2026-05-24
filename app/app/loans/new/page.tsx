'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { dummyCustomers, dummyLoans } from '@/lib/dummy-data';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import { ArrowLeft, Mic, Check, CheckCircle, User, Plus, Trash2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── types ───────────────────────────────────────────────── */

interface LoanItem {
  id: number;
  name: string;
  amount: string;
}

interface FormData {
  phone: string;
  customerId: string;
  buyerMode: 'existing' | 'new' | null; // null = not yet chosen
  inputMode: 'manual' | 'voice';
  items: LoanItem[];
  dueDate: string;
}

/* ── helpers ─────────────────────────────────────────────── */

let itemIdCounter = 1;
function newItem(): LoanItem { return { id: itemIdCounter++, name: '', amount: '' }; }

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function customerOutstanding(customerId: string) {
  return dummyLoans
    .filter((l) => l.customerId === customerId && l.status !== 'paid')
    .reduce((s, l) => s + l.remainingAmount, 0);
}

function customerActiveLoans(customerId: string) {
  return dummyLoans.filter((l) => l.customerId === customerId && l.status !== 'paid').length;
}

/* ── step progress bar ───────────────────────────────────── */

const STEPS = ['Buyer', 'Loan Details', 'Due Date', 'Review'];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                done   ? 'bg-[#E85D04] border-[#E85D04] text-white' :
                active ? 'bg-white border-[#E85D04] text-[#E85D04]' :
                         'bg-white border-gray-200 text-gray-400'
              )}>
                {done ? <Check className="h-4 w-4" /> : num}
              </div>
              <span className={cn(
                'text-[10px] font-medium whitespace-nowrap hidden sm:block',
                active ? 'text-[#E85D04]' : done ? 'text-[#E85D04]/70' : 'text-gray-400'
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-1 mb-4 transition-colors',
                done ? 'bg-[#E85D04]' : 'bg-gray-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── buyer banner (steps 2-4) ────────────────────────────── */

function BuyerBanner({ name, onClear }: { name: string; onClear: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-[#FFF3E0] border border-[#E85D04]/25 rounded-xl px-4 py-2.5">
      <div className="h-7 w-7 rounded-full bg-[#E85D04] flex items-center justify-center text-white text-xs font-bold shrink-0">
        {initials(name)}
      </div>
      <p className="text-sm font-semibold text-[#1A1A2E] flex-1 truncate">{name}</p>
      <button
        onClick={onClear}
        className="text-xs text-[#E85D04] font-semibold hover:underline shrink-0"
      >
        Change
      </button>
    </div>
  );
}

/* ── quick date chips ────────────────────────────────────── */

function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

const DATE_CHIPS = [
  { label: '1 Week',   days: 7 },
  { label: '2 Weeks',  days: 14 },
  { label: '1 Month',  days: 30 },
  { label: '3 Months', days: 90 },
];

/* ── page ────────────────────────────────────────────────── */

export default function NewLoanPage() {
  const [step, setStep] = useState(1);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<FormData>({
    phone: '', customerId: '', buyerMode: null,
    inputMode: 'manual',
    items: [newItem()],
    dueDate: '',
  });

  const setField = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  /* items helpers */
  const updateItem = (id: number, field: 'name' | 'amount', value: string) =>
    setField('items', form.items.map((it) => it.id === id ? { ...it, [field]: value } : it));

  const addItem = () => setField('items', [...form.items, newItem()]);

  const removeItem = (id: number) => {
    if (form.items.length === 1) return; // keep at least one
    setField('items', form.items.filter((it) => it.id !== id));
  };

  const itemsTotal = form.items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const totalRepay = itemsTotal * 1.1;

  /* ── phone matching ─────────────────────────────────────
     Normalise both sides to digits only, then check if the
     stored number STARTS WITH what the user has typed so far.
     This fires progressively as digits are entered and gives
     an exact match once the full 10-digit number is typed.
  ── */
  const normalise = (s: string) => s.replace(/\D/g, '');
  const typedDigits = normalise(form.phone);

  const matchedCustomer =
    typedDigits.length >= 4
      ? dummyCustomers.find((c) => normalise(c.phone).startsWith(typedDigits))
      : null;

  const selectedCustomer = form.customerId
    ? dummyCustomers.find((c) => c.id === form.customerId) ?? null
    : null;

  /* fake voice recording */
  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      setTranscription('ዱቄት — 500 ብር');
    } else {
      setRecording(true);
      setTranscription('');
    }
  };

  const addTranscriptionAsItem = () => {
    const newIt = newItem();
    newIt.name = 'ዱቄት (flour)';
    newIt.amount = '500';
    setField('items', [...form.items, newIt]);
    setTranscription('');
  };

  /* Auto-select "Add New Loan" as soon as a match is found */
  useEffect(() => {
    if (matchedCustomer && form.buyerMode === null) {
      setField('buyerMode', 'existing');
      setField('customerId', matchedCustomer.id);
    }
    // If phone changes and no longer matches, clear the selection
    if (!matchedCustomer && form.buyerMode === 'existing') {
      setField('buyerMode', null);
      setField('customerId', '');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedCustomer?.id]);

  const handleSubmit = () => setSuccess(true);

  /* ── success screen ── */
  if (success) {
    return (
      <AppLayout>
        <AppHeader />
        <main className="flex items-center justify-center min-h-[70vh] p-6">
          <div className="text-center max-w-sm">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Loan Recorded</h2>
            <p className="text-gray-500 text-sm mb-8">
              The loan has been saved. The buyer will receive a confirmation request.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={ROUTES.LOANS}
                className="block w-full py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm text-center transition-colors"
              >
                Back to Loans
              </Link>
              <button
                onClick={() => {
                  setSuccess(false); setStep(1);
                  setForm({ phone: '', customerId: '', buyerMode: null, inputMode: 'manual', items: [newItem()], dueDate: '' });
                  setTranscription('');
                }}
                className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Record Another Loan
              </button>
            </div>
          </div>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AppHeader />
      <main className="p-4 md:p-6 pb-24 md:pb-8 max-w-xl mx-auto space-y-6">

        {/* Back + title */}
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.LOANS}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="font-bold text-[#1A1A2E] text-lg">New Loan</h1>
            <p className="text-xs text-gray-400">Step {step} of {STEPS.length}</p>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar step={step} />

        {/* Persistent buyer banner on steps 2-4 */}
        {step > 1 && selectedCustomer && (
          <BuyerBanner
            name={selectedCustomer.name}
            onClear={() => { setField('customerId', ''); setField('buyerMode', null); setStep(1); }}
          />
        )}

        {/* ── Step 1 — Buyer ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">
                Buyer Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 0911234567"
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value;
                  setField('phone', val);
                  // Reset choice whenever phone changes
                  setField('buyerMode', null);
                  setField('customerId', '');
                }}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Enter the buyer&apos;s phone number to find their account
              </p>
            </div>

            {/* Existing customer found */}
            {matchedCustomer && (() => {
              const outstanding = customerOutstanding(matchedCustomer.id);
              const activeCount = customerActiveLoans(matchedCustomer.id);
              return (
                <div className="space-y-3">
                  {/* Customer info card */}
                  <div className="bg-white rounded-xl border-l-4 border-l-[#E85D04] border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-[#E85D04] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {initials(matchedCustomer.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1A1A2E] text-sm">{matchedCustomer.name}</p>
                      <p className="text-xs text-gray-400">{matchedCustomer.phone}</p>
                      <p className="text-xs text-[#E85D04] mt-0.5 font-medium">
                        {activeCount} active loan{activeCount !== 1 ? 's' : ''} — {CURRENCY_SYMBOL} {outstanding.toLocaleString()} total outstanding
                      </p>
                    </div>
                  </div>

                  {/* Two option cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1 — Add to existing */}
                    <div
                      onClick={() => { setField('buyerMode', 'existing'); setField('customerId', matchedCustomer.id); }}
                      className={cn(
                        'p-4 rounded-xl border-2 cursor-pointer transition-all',
                        form.buyerMode === 'existing'
                          ? 'border-[#E85D04] bg-[#FFF3E0]'
                          : 'border-gray-200 bg-white hover:border-[#E85D04]/40'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={cn(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0',
                          form.buyerMode === 'existing' ? 'border-[#E85D04]' : 'border-gray-300'
                        )}>
                          {form.buyerMode === 'existing' && <span className="h-2.5 w-2.5 rounded-full bg-[#E85D04]" />}
                        </div>
                        <Plus className="h-4 w-4 text-[#E85D04]" />
                        <p className="font-semibold text-[#1A1A2E] text-sm">Add New Loan</p>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        Add a new loan to this existing customer
                      </p>
                      <div className={cn(
                        'w-full py-1.5 rounded-lg text-xs font-semibold text-center transition-colors',
                        form.buyerMode === 'existing'
                          ? 'bg-[#E85D04] text-white'
                          : 'border border-[#E85D04] text-[#E85D04]'
                      )}>
                        Select
                      </div>
                    </div>

                    {/* Option 2 — Different person */}
                    <div
                      onClick={() => { setField('buyerMode', 'new'); setField('customerId', ''); }}
                      className={cn(
                        'p-4 rounded-xl border-2 cursor-pointer transition-all',
                        form.buyerMode === 'new'
                          ? 'border-gray-500 bg-gray-50'
                          : 'border-gray-200 bg-white hover:border-gray-400'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={cn(
                          'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0',
                          form.buyerMode === 'new' ? 'border-gray-500' : 'border-gray-300'
                        )}>
                          {form.buyerMode === 'new' && <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />}
                        </div>
                        <UserPlus className="h-4 w-4 text-gray-500" />
                        <p className="font-semibold text-[#1A1A2E] text-sm">Different Person</p>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3">
                        This is a different buyer with the same number
                      </p>
                      <div className={cn(
                        'w-full py-1.5 rounded-lg text-xs font-semibold text-center transition-colors',
                        form.buyerMode === 'new'
                          ? 'bg-gray-600 text-white'
                          : 'border border-gray-300 text-gray-500'
                      )}>
                        Select
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* No match — only show after enough digits typed */}
            {typedDigits.length >= 9 && !matchedCustomer && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400 shrink-0" />
                <p className="text-sm text-gray-500">No account found. The buyer will be invited to join Kirari.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2 — Loan details ── */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Mode toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setField('inputMode', 'manual')}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  form.inputMode === 'manual'
                    ? 'border-[#E85D04] bg-[#FFF3E0]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <p className="font-semibold text-[#1A1A2E] text-sm">Type Manually</p>
                <p className="text-xs text-gray-400 mt-0.5">Add items one by one</p>
              </button>
              <button
                onClick={() => setField('inputMode', 'voice')}
                className={cn(
                  'p-4 rounded-xl border-2 text-left transition-all',
                  form.inputMode === 'voice'
                    ? 'border-[#E85D04] bg-[#FFF3E0]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <p className="font-semibold text-[#1A1A2E] text-sm">Record by Voice</p>
                <p className="text-xs text-gray-400 mt-0.5">Speak in Amharic or English</p>
              </button>
            </div>

            {/* Items list — always visible */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#1A1A2E]">Items</p>
              {form.items.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. flour, coffee, sugar"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow min-w-0"
                  />
                  <div className="relative shrink-0 w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                      ETB
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      value={item.amount}
                      onChange={(e) => updateItem(item.id, 'amount', e.target.value)}
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={form.items.length === 1}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
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
                <Plus className="h-4 w-4" />
                Add Another Item
              </button>

              {/* Running total */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Total</span>
                <span className="text-xl font-black text-[#E85D04]">
                  ETB {itemsTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Voice section */}
            {form.inputMode === 'voice' && (
              <div className="flex flex-col items-center py-4 space-y-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 self-start">Or add an item by voice</p>
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
                      'relative h-20 w-20 rounded-full flex items-center justify-center transition-all shadow-lg',
                      recording ? 'bg-[#E85D04] scale-110' : 'bg-[#E85D04] hover:bg-[#C44D03]'
                    )}
                    aria-label={recording ? 'Stop recording' : 'Start recording'}
                  >
                    <Mic className="h-8 w-8 text-white" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  {recording ? 'Recording… tap to stop' : 'Tap to start recording'}
                </p>
                {transcription && (
                  <div className="w-full space-y-3">
                    <p className="text-sm text-gray-400 italic text-center">
                      &ldquo;{transcription}&rdquo;
                    </p>
                    <button
                      onClick={addTranscriptionAsItem}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add to Items
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3 — Due date ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setField('dueDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow [color-scheme:light]"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Quick select</p>
              <div className="flex flex-wrap gap-2">
                {DATE_CHIPS.map((chip) => {
                  const val = addDays(chip.days);
                  const active = form.dueDate === val;
                  return (
                    <button
                      key={chip.label}
                      onClick={() => setField('dueDate', val)}
                      className={cn(
                        'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors',
                        active
                          ? 'bg-[#E85D04] border-[#E85D04] text-white'
                          : 'border-[#E85D04] text-[#E85D04] hover:bg-[#FFF3E0]'
                      )}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {itemsTotal > 0 && (
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

        {/* ── Step 4 — Review ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-[#1A1A2E] px-5 py-4">
                <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Loan Summary</p>
              </div>
              <div className="p-5 space-y-4">
                {/* Buyer row */}
                <div className="flex justify-between items-start gap-4 text-sm">
                  <span className="text-gray-400 shrink-0">Buyer</span>
                  <div className="text-right">
                    <span className="font-semibold text-[#1A1A2E]">
                      {selectedCustomer?.name ?? form.phone}
                    </span>
                    {selectedCustomer && form.buyerMode === 'existing' && (() => {
                      const outstanding = customerOutstanding(selectedCustomer.id);
                      const activeCount = customerActiveLoans(selectedCustomer.id);
                      return outstanding > 0 ? (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Existing balance: {CURRENCY_SYMBOL} {outstanding.toLocaleString()} across {activeCount} loan{activeCount !== 1 ? 's' : ''}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Items list */}
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-2">Items</p>
                  <div className="space-y-1.5">
                    {form.items.filter((it) => it.name || it.amount).map((item) => (
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
                      {CURRENCY_SYMBOL} {itemsTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100" />

                {/* Due date + repay */}
                {[
                  {
                    label: 'Due Date',
                    value: form.dueDate
                      ? new Date(form.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '—',
                  },
                  {
                    label: 'Total Repay',
                    value: `${CURRENCY_SYMBOL} ${totalRepay.toLocaleString(undefined, { maximumFractionDigits: 0 })} (incl. 10%)`,
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-4 text-sm">
                    <span className="text-gray-400 shrink-0">{label}</span>
                    <span className="font-semibold text-[#1A1A2E] text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FFF3E0] border border-[#E85D04]/30 rounded-xl p-4">
              <p className="text-xs text-[#E85D04] leading-relaxed">
                The buyer will receive a confirmation request. The loan is only recorded once both parties confirm.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-bold text-sm transition-colors"
            >
              Confirm &amp; Record Loan
            </button>
          </div>
        )}

        {/* ── Nav buttons ── */}
        {step < 4 && (
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (typedDigits.length < 9 || (!!matchedCustomer && form.buyerMode === null))) ||
                (step === 2 && itemsTotal === 0) ||
                (step === 3 && !form.dueDate)
              }
              className="flex-1 py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm transition-colors"
            >
              Continue
            </button>
          </div>
        )}

      </main>
    </AppLayout>
  );
}
