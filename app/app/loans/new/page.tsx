'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import { ArrowLeft, Mic, Check, CheckCircle, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

/* ── types ───────────────────────────────────────────────── */

interface LoanItem { id: number; name: string; amount: string; }

let itemIdCounter = 1;
function newItem(): LoanItem { return { id: itemIdCounter++, name: '', amount: '' }; }

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

const STEPS = ['Buyer', 'Loan Details', 'Due Date', 'Review'];

/* ── progress bar ────────────────────────────────────────── */

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
              )}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-1 mb-4 transition-colors', done ? 'bg-[#E85D04]' : 'bg-gray-200')} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function NewLoanPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'voice'>('manual');

  // Step 1 — buyer
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [existingBuyer, setExistingBuyer] = useState<{ id: string; full_name: string; phone_number: string } | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Step 2 — items
  const [items, setItems] = useState<LoanItem[]>([newItem()]);

  // Step 3 — due date + notes
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const itemsTotal = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);

  /* phone lookup with debounce */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const digits = buyerPhone.replace(/\D/g, '');
    if (digits.length < 9) { setExistingBuyer(null); return; }
    debounceRef.current = setTimeout(async () => {
      setLookingUp(true);
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number')
        .eq('phone_number', buyerPhone.trim())
        .single();
      setExistingBuyer(data ?? null);
      if (data?.full_name) setBuyerName(data.full_name);
      setLookingUp(false);
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerPhone]);

  /* items helpers */
  const updateItem = (id: number, field: 'name' | 'amount', value: string) =>
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, [field]: value } : it));
  const addItem = () => setItems((prev) => [...prev, newItem()]);
  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  /* voice (fake) */
  const toggleRecording = () => {
    if (recording) { setRecording(false); setTranscription('ዱቄት — 500 ብር'); }
    else { setRecording(true); setTranscription(''); }
  };
  const addTranscriptionAsItem = () => {
    const it = newItem(); it.name = 'ዱቄት (flour)'; it.amount = '500';
    setItems((prev) => [...prev, it]);
    setTranscription('');
  };

  /* ── submit ── */
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Not logged in'); setLoading(false); return; }

      const { data: shop } = await supabase
        .from('shops')
        .select('id, shop_name')
        .eq('owner_id', user.id)
        .single();
      if (!shop) { setError('Shop not found'); setLoading(false); return; }

      const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

      const { data: loan, error: loanError } = await supabase
        .from('loans')
        .insert({
          shop_id: shop.id,
          buyer_id: existingBuyer?.id || null,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          total_amount: totalAmount,
          due_date: dueDate,
          status: 'pending_confirmation',
          notes: notes || null,
        })
        .select()
        .single();

      if (loanError) { setError('Failed to save loan: ' + loanError.message); setLoading(false); return; }

      if (loan && loan.id && items.length > 0) {
        const itemsToInsert = items
          .filter((item: any) => item.name || item.item_name || item.description)
          .map((item: any) => ({
            loan_id: loan.id,
            item_name: item.name || item.item_name || item.description || 'Item',
            amount: Number(item.amount) || 0,
          }));
        console.log('Inserting items:', itemsToInsert);
        const { error: itemsError } = await supabase.from('loan_items').insert(itemsToInsert);
        if (itemsError) {
          console.error('Items insert error:', itemsError);
        }
      }

      await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerEmail,
          buyerName,
          shopName: (shop as any).shop_name,
          totalAmount,
          dueDate,
          items,
          confirmationToken: loan.confirmation_token,
          buyerHasAccount: !!existingBuyer,
        }),
      });

      router.push('/app/dashboard?loan=created');
    } catch (err) {
      setError('Unexpected error: ' + String(err));
    }
    setLoading(false);
  };

  /* ── success screen ── */
  if (success) {
    return (
      <AppLayout><AppHeader />
        <main className="flex items-center justify-center min-h-[70vh] p-6">
          <div className="text-center max-w-sm">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Loan Recorded</h2>
            <p className="text-gray-500 text-sm mb-8">The loan has been saved. The buyer will receive a confirmation request.</p>
            <div className="flex flex-col gap-3">
              <Link href={ROUTES.LOANS} className="block w-full py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm text-center transition-colors">
                Back to Loans
              </Link>
              <button
                onClick={() => { setSuccess(false); setStep(1); setBuyerPhone(''); setBuyerEmail(''); setBuyerName(''); setExistingBuyer(null); setItems([newItem()]); setDueDate(''); setNotes(''); }}
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
          <Link href={ROUTES.LOANS} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="font-bold text-[#1A1A2E] text-lg">New Loan</h1>
            <p className="text-xs text-gray-400">Step {step} of {STEPS.length}</p>
          </div>
        </div>

        <ProgressBar step={step} />

        {/* ── Step 1 — Buyer ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">Buyer Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +251911234567"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">Email for confirmation</label>
                <input
                  type="email"
                  placeholder="buyer@email.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 -mt-2">We will send a loan confirmation to this email</p>

            {existingBuyer && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <p className="text-sm text-green-700 font-medium">Existing customer found: {existingBuyer.full_name}</p>
              </div>
            )}
            {lookingUp && <p className="text-xs text-gray-400">Looking up phone number…</p>}

            <div>
              <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">Buyer Name <span className="text-[#E85D04]">*</span></label>
              <input
                type="text"
                placeholder="Full name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow"
              />
            </div>
          </div>
        )}

        {/* ── Step 2 — Loan Items ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setInputMode('manual')}
                className={cn('p-4 rounded-xl border-2 text-left transition-all', inputMode === 'manual' ? 'border-[#E85D04] bg-[#FFF3E0]' : 'border-gray-200 bg-white hover:border-gray-300')}
              >
                <p className="font-semibold text-[#1A1A2E] text-sm">Type Manually</p>
                <p className="text-xs text-gray-400 mt-0.5">Add items one by one</p>
              </button>
              <button
                onClick={() => setInputMode('voice')}
                className={cn('p-4 rounded-xl border-2 text-left transition-all', inputMode === 'voice' ? 'border-[#E85D04] bg-[#FFF3E0]' : 'border-gray-200 bg-white hover:border-gray-300')}
              >
                <p className="font-semibold text-[#1A1A2E] text-sm">Record by Voice</p>
                <p className="text-xs text-gray-400 mt-0.5">Speak in Amharic or English</p>
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#1A1A2E]">Items</p>
              {items.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. flour, coffee, sugar"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="flex-1 h-10 px-3 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow min-w-0"
                  />
                  <div className="relative shrink-0 w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">ETB</span>
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
                    disabled={items.length === 1}
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                    aria-label={`Remove item ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors">
                <Plus className="h-4 w-4" /> Add Another Item
              </button>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-medium">Total</span>
                <span className="text-xl font-black text-[#E85D04]">ETB {itemsTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {inputMode === 'voice' && (
              <div className="flex flex-col items-center py-4 space-y-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 self-start">Or add an item by voice</p>
                <div className="relative">
                  {recording && (<><div className="absolute inset-0 rounded-full bg-[#E85D04]/20 animate-ping" /><div className="absolute -inset-3 rounded-full bg-[#E85D04]/10 animate-pulse" /></>)}
                  <button onClick={toggleRecording} className={cn('relative h-20 w-20 rounded-full flex items-center justify-center transition-all shadow-lg', recording ? 'bg-[#E85D04] scale-110' : 'bg-[#E85D04] hover:bg-[#C44D03]')}>
                    <Mic className="h-8 w-8 text-white" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{recording ? 'Recording… tap to stop' : 'Tap to start recording'}</p>
                {transcription && (
                  <div className="w-full space-y-3">
                    <p className="text-sm text-gray-400 italic text-center">&ldquo;{transcription}&rdquo;</p>
                    <button onClick={addTranscriptionAsItem} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0] transition-colors">
                      <Plus className="h-4 w-4" /> Add to Items
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3 — Due Date ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow [color-scheme:light]"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Quick select</p>
              <div className="flex flex-wrap gap-2">
                {DATE_CHIPS.map((chip) => {
                  const val = addDays(chip.days);
                  const active = dueDate === val;
                  return (
                    <button key={chip.label} onClick={() => setDueDate(val)} className={cn('px-4 py-1.5 rounded-full text-sm font-medium border transition-colors', active ? 'bg-[#E85D04] border-[#E85D04] text-white' : 'border-[#E85D04] text-[#E85D04] hover:bg-[#FFF3E0]')}>
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">Notes (optional)</label>
              <textarea
                placeholder="Any additional notes…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-shadow resize-none"
              />
            </div>
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
                <div className="flex justify-between items-start gap-4 text-sm">
                  <span className="text-gray-400 shrink-0">Buyer</span>
                  <div className="text-right">
                    <span className="font-semibold text-[#1A1A2E]">{buyerName || '—'}</span>
                    {buyerPhone && <p className="text-xs text-gray-400 mt-0.5">{buyerPhone}</p>}
                    {buyerEmail && <p className="text-xs text-gray-400">{buyerEmail}</p>}
                    {existingBuyer && <p className="text-xs text-green-600 mt-0.5">Existing customer</p>}
                  </div>
                </div>
                <div className="border-t border-gray-100" />
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-2">Items</p>
                  <div className="space-y-1.5">
                    {items.filter((it) => it.name || it.amount).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name || '(unnamed)'}</span>
                        <span className="font-semibold text-[#1A1A2E]">{CURRENCY_SYMBOL} {(parseFloat(item.amount) || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-600">Total</span>
                    <span className="text-lg font-black text-[#E85D04]">{CURRENCY_SYMBOL} {itemsTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex justify-between items-start gap-4 text-sm">
                  <span className="text-gray-400 shrink-0">Due Date</span>
                  <span className="font-semibold text-[#1A1A2E] text-right">
                    {dueDate ? new Date(dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </span>
                </div>
                {notes && (
                  <>
                    <div className="border-t border-gray-100" />
                    <div className="flex justify-between items-start gap-4 text-sm">
                      <span className="text-gray-400 shrink-0">Notes</span>
                      <span className="text-[#1A1A2E] text-right text-xs">{notes}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-[#FFF3E0] border border-[#E85D04]/30 rounded-xl p-4">
              <p className="text-xs text-[#E85D04] leading-relaxed">
                The buyer will receive a confirmation request. The loan is only recorded once both parties confirm.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving…' : 'Confirm & Record Loan'}
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
              onClick={() => {
                if (step === 1 && !buyerName.trim()) return;
                if (step === 2 && itemsTotal === 0) return;
                if (step === 3 && !dueDate) return;
                setStep(step + 1);
              }}
              className="flex-1 py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 4 && step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        )}

      </main>
    </AppLayout>
  );
}
