'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/app-layout';
import { AppHeader } from '@/components/app-header';
import { createClient } from '@/lib/supabase/client';
import { CURRENCY_SYMBOL, ROUTES } from '@/lib/constants';
import {
  ArrowLeft, Send, Edit, CheckCircle, Circle, DollarSign,
  List, Plus, Mic, X, Trash2, ChevronLeft, AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const supabase = createClient();

/* ── status config ───────────────────────────────────────── */

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:               { label: 'Active',   color: 'text-[#1A1A2E]', bg: 'bg-[#1A1A2E]/5', border: 'border-[#1A1A2E]/20' },
  overdue:              { label: 'Overdue',  color: 'text-red-600',   bg: 'bg-red-50',       border: 'border-red-200' },
  paid:                 { label: 'Paid',     color: 'text-green-700', bg: 'bg-green-50',     border: 'border-green-200' },
  pending_confirmation: { label: 'Pending',  color: 'text-[#E85D04]', bg: 'bg-[#FFF3E0]',   border: 'border-[#E85D04]/30' },
};

const STATUS_BADGE: Record<string, string> = {
  active:               'bg-[#1A1A2E]/5 text-[#1A1A2E] border-[#1A1A2E]/20',
  overdue:              'bg-red-50 text-red-600 border-red-200',
  paid:                 'bg-green-50 text-green-700 border-green-200',
  pending_confirmation: 'bg-[#FFF3E0] text-[#E85D04] border-[#E85D04]/30',
};

/* ── helpers ─────────────────────────────────────────────── */

function initials(name: string) {
  return (name || '?').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ── items table ─────────────────────────────────────────── */

function ItemsTable({ loan }: { loan: any }) {
  const items: any[] = loan.loan_items ?? [];
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <List className="h-4 w-4 text-[#E85D04]" />
        <h2 className="font-bold text-[#1A1A2E] text-sm">Loan Items</h2>
      </div>
      {items.length > 0 ? (
        <div>
          {items.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-100 text-sm">
              <span className="text-[#1A1A2E] font-medium">{item.item_name}</span>
              <span className="text-gray-600">{CURRENCY_SYMBOL} {Number(item.amount).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-5 py-3 border-t-2 bg-[#FFF3E0]" style={{ borderTopColor: '#E85D04' }}>
            <span className="text-sm font-bold text-[#1A1A2E]">Total</span>
            <span className="text-sm font-black text-[#E85D04]">{CURRENCY_SYMBOL} {Number(loan.total_amount).toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p className="px-5 py-4 text-sm text-gray-400">No items recorded for this loan.</p>
      )}
    </div>
  );
}

/* ── timeline step ───────────────────────────────────────── */

function TimelineStep({ label, date, done, last }: { label: string; date?: string; done: boolean; last?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn('h-7 w-7 rounded-full flex items-center justify-center border-2 shrink-0', done ? 'bg-[#E85D04] border-[#E85D04]' : 'bg-white border-gray-200')}>
          {done ? <Check className="h-3.5 w-3.5 text-white" /> : <Circle className="h-3 w-3 text-gray-300" />}
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

/* ── toast ───────────────────────────────────────────────── */

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#E85D04] text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl">
      <CheckCircle className="h-4 w-4 shrink-0" />{message}
    </div>
  );
}

/* ── modal helpers ───────────────────────────────────────── */

let _itemId = 100;
function newModalItem() { return { id: _itemId++, name: '', amount: '' }; }
function addDays(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; }
const DATE_CHIPS = [{ label: '1 Week', days: 7 }, { label: '2 Weeks', days: 14 }, { label: '1 Month', days: 30 }];
const MODAL_STEPS = ['Items', 'Due Date', 'Review'];

function ModalProgress({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {MODAL_STEPS.map((label, i) => {
        const num = i + 1; const done = num < step; const active = num === step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={cn('h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all', done ? 'bg-[#E85D04] border-[#E85D04] text-white' : active ? 'bg-white border-[#E85D04] text-[#E85D04]' : 'bg-white border-gray-200 text-gray-400')}>
                {done ? <Check className="h-3.5 w-3.5" /> : num}
              </div>
              <span className={cn('text-[10px] font-medium whitespace-nowrap', active ? 'text-[#E85D04]' : done ? 'text-[#E85D04]/60' : 'text-gray-400')}>{label}</span>
            </div>
            {i < MODAL_STEPS.length - 1 && <div className={cn('flex-1 h-0.5 mx-1 mb-4', done ? 'bg-[#E85D04]' : 'bg-gray-200')} />}
          </div>
        );
      })}
    </div>
  );
}

function AddLoanModal({ buyerName, onClose, onConfirm }: { buyerName: string; onClose: () => void; onConfirm: (total: number) => void }) {
  const [step, setStep] = useState(1);
  const [items, setItems] = useState([newModalItem()]);
  const [dueDate, setDueDate] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const updateItem = (id: number, field: 'name' | 'amount', val: string) => setItems((p) => p.map((it) => it.id === id ? { ...it, [field]: val } : it));
  const removeItem = (id: number) => { if (items.length === 1) return; setItems((p) => p.filter((it) => it.id !== id)); };
  const total = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const canNext = (step === 1 && total > 0) || (step === 2 && !!dueDate);
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 mr-1"><ChevronLeft className="h-4 w-4 text-gray-500" /></button>}
            <div><h2 className="font-bold text-[#1A1A2E] text-base">Add New Loan</h2><p className="text-xs text-gray-400">Step {step} of {MODAL_STEPS.length}</p></div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div className="flex items-center gap-3 bg-[#E85D04] rounded-xl px-4 py-3">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials(buyerName)}</div>
            <p className="font-bold text-white text-sm">{buyerName}</p>
          </div>
          <ModalProgress step={step} />
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#1A1A2E]">Loan Items</p>
              {items.map((item, idx) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <input type="text" placeholder="Item description" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} className="flex-1 h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 min-w-0" />
                  <div className="relative shrink-0 w-28"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">ETB</span><input type="number" placeholder="0" value={item.amount} onChange={(e) => updateItem(item.id, 'amount', e.target.value)} className="w-full h-10 pl-9 pr-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20" /></div>
                  <button onClick={() => removeItem(item.id)} disabled={items.length === 1} className="h-10 w-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 disabled:opacity-30 shrink-0" aria-label={`Remove item ${idx + 1}`}><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => setItems((p) => [...p, newModalItem()])} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0]"><Plus className="h-4 w-4" /> Add Another Item</button>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100"><span className="text-sm text-gray-500 font-medium">Total</span><span className="text-xl font-black text-[#E85D04]">ETB {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div><label className="text-sm font-semibold text-[#1A1A2E] block mb-1.5">Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 [color-scheme:light]" /></div>
              <div className="flex flex-wrap gap-2">{DATE_CHIPS.map((chip) => { const val = addDays(chip.days); return <button key={chip.label} onClick={() => setDueDate(val)} className={cn('px-4 py-1.5 rounded-full text-sm font-medium border transition-colors', dueDate === val ? 'bg-[#E85D04] border-[#E85D04] text-white' : 'border-[#E85D04] text-[#E85D04] hover:bg-[#FFF3E0]')}>{chip.label}</button>; })}</div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-[#FFF3E0] border border-[#E85D04]/30 rounded-xl p-4 text-sm text-[#E85D04]">The buyer will receive a confirmation request.</div>
            </div>
          )}
        </div>
        <div className="px-5 pb-6 pt-3 border-t border-gray-100 shrink-0">
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext} className="w-full py-3.5 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm transition-colors">Continue</button>
          ) : (
            <button onClick={() => onConfirm(total)} className="w-full py-3.5 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-bold text-sm transition-colors">Add Loan and Notify Buyer</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function LoanDetailPage() {
  const params = useParams();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [showAddItemsModal, setShowAddItemsModal] = useState(false);
  const [newItems, setNewItems] = useState([{ name: '', amount: '' }]);
  const [newDueDate, setNewDueDate] = useState('');
  const [addItemsLoading, setAddItemsLoading] = useState(false);
  const [addItemsError, setAddItemsError] = useState('');

  useEffect(() => {
    const fetchLoan = async () => {
      const { data: loanData, error } = await supabase
        .from('loans').select('*, loan_items(*)').eq('id', params.id).single();
      if (error || !loanData) { setNotFound(true); setLoading(false); return; }
      setLoan(loanData);
      const { data: paymentsData } = await supabase
        .from('payments').select('*').eq('loan_id', params.id).order('created_at', { ascending: false });
      if (paymentsData) setPayments(paymentsData);
      setLoading(false);
    };
    fetchLoan();
  }, [params.id]);

  if (loading) {
    return (
      <AppLayout><AppHeader />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
        </main>
      </AppLayout>
    );
  }

  if (notFound) {
    return (
      <AppLayout><AppHeader />
        <main className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 gap-4">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-[#E85D04]" />
          </div>
          <h2 className="text-lg font-bold text-[#1A1A2E]">Loan not found</h2>
          <p className="text-sm text-gray-500 max-w-xs">This loan does not exist or you do not have access to it.</p>
          <Link href={ROUTES.LOANS} className="text-sm font-semibold text-[#E85D04] hover:underline">← Back to Loans</Link>
        </main>
      </AppLayout>
    );
  }

  const handleAddItems = async () => {
    setAddItemsLoading(true);
    setAddItemsError('');
    const validItems = newItems.filter(item => item.name && Number(item.amount) > 0);
    if (validItems.length === 0) {
      setAddItemsError('Please add at least one item');
      setAddItemsLoading(false);
      return;
    }
    if (!newDueDate) {
      setAddItemsError('Please set a due date');
      setAddItemsLoading(false);
      return;
    }
    const newTotal = validItems.reduce((sum, item) => sum + Number(item.amount), 0);
    for (const item of validItems) {
      const { error: itemError } = await supabase.from('loan_items').insert({
        loan_id: loan.id,
        item_name: item.name,
        amount: Number(item.amount),
      });
      if (itemError) {
        setAddItemsError('Failed to add items: ' + itemError.message);
        setAddItemsLoading(false);
        return;
      }
    }
    const updatedTotal = Number(loan.total_amount) + newTotal;
    const { error: updateError } = await supabase.from('loans').update({
      total_amount: updatedTotal,
      due_date: newDueDate,
      status: 'pending_confirmation',
    }).eq('id', loan.id);
    if (updateError) {
      setAddItemsError('Failed to update loan: ' + updateError.message);
      setAddItemsLoading(false);
      return;
    }
    await fetch('/api/send-confirmation-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyerEmail: loan.buyer_email,
        buyerName: loan.buyer_name,
        shopName: loan.shops?.shop_name,
        totalAmount: newTotal,
        dueDate: newDueDate,
        items: validItems,
        confirmationToken: loan.confirmation_token,
        buyerHasAccount: !!loan.buyer_id,
      }),
    });
    const { data: updatedLoan } = await supabase.from('loans').select('*, loan_items(*), shops(shop_name)').eq('id', loan.id).single();
    if (updatedLoan) setLoan(updatedLoan);
    setShowAddItemsModal(false);
    setNewItems([{ name: '', amount: '' }]);
    setNewDueDate('');
    setAddItemsLoading(false);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    setPaymentError('');
    const amount = Number(paymentAmount);
    const remaining = Number(loan.total_amount) - Number(loan.amount_paid || 0);
    if (amount <= 0) {
      setPaymentError('Please enter a valid amount');
      setPaymentLoading(false);
      return;
    }
    if (amount > remaining) {
      setPaymentError(`Amount cannot exceed remaining balance of ETB ${remaining}`);
      setPaymentLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const { error: paymentErr } = await supabase.from('payments').insert({
      loan_id: loan.id,
      amount,
      recorded_by: user?.id,
    });
    if (paymentErr) {
      setPaymentError('Failed to record payment: ' + paymentErr.message);
      setPaymentLoading(false);
      return;
    }
    const newAmountPaid = (Number(loan.amount_paid) || 0) + amount;
    const isFullyPaid = newAmountPaid >= Number(loan.total_amount);
    const newStatus = isFullyPaid ? 'paid' : 'active';
    console.log('Updating loan:', loan.id);
    console.log('New amount paid:', newAmountPaid);
    console.log('New status:', newStatus);
    const { data: updateData, error: updateError } = await supabase
      .from('loans')
      .update({ amount_paid: newAmountPaid, status: newStatus })
      .eq('id', loan.id)
      .select();
    console.log('Update result:', updateData, updateError);
    if (updateError) {
      setPaymentError('Failed to update loan: ' + updateError.message);
      setPaymentLoading(false);
      return;
    }
    const { data: shopData } = await supabase.from('shops').select('shop_name').eq('id', loan.shop_id).single();
    const shopName = shopData?.shop_name || 'The shop';
    await fetch('/api/send-payment-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buyerEmail: loan.buyer_email,
        buyerName: loan.buyer_name,
        shopName,
        paymentAmount: amount,
        remainingBalance: Number(loan.total_amount) - newAmountPaid,
        isFullyPaid,
        totalAmount: loan.total_amount,
      }),
    });
    setShowPaymentModal(false);
    setPaymentLoading(false);
    const { data: updatedLoan } = await supabase.from('loans').select('*, loan_items(*), shops(shop_name)').eq('id', params.id).single();
    if (updatedLoan) setLoan(updatedLoan);
    const { data: updatedPayments } = await supabase.from('payments').select('*').eq('loan_id', params.id).order('created_at', { ascending: false });
    if (updatedPayments) setPayments(updatedPayments);
    setToast(`Payment of ${CURRENCY_SYMBOL} ${amount.toLocaleString()} recorded`);
  };

  const cfg = STATUS_CONFIG[loan.status] ?? STATUS_CONFIG.active;
  const items: any[] = loan.loan_items ?? [];
  const totalAmount = Number(loan.total_amount);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isOverdue = new Date(loan.due_date) < today && loan.status !== 'paid';
  const effectiveCfg = isOverdue ? STATUS_CONFIG.overdue : cfg;

  const timelineSteps = [
    { label: 'Loan Created',    date: fmtDate(loan.created_at), done: true },
    { label: 'Buyer Confirmed', date: loan.status !== 'pending_confirmation' ? fmtDate(loan.created_at) : undefined, done: loan.status !== 'pending_confirmation' },
    { label: 'Fully Paid',      date: loan.status === 'paid' ? fmtDate(loan.due_date) : undefined, done: loan.status === 'paid' },
  ];

  return (
    <AppLayout>
      <AppHeader />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      {modalOpen && <AddLoanModal buyerName={loan.buyer_name} onClose={() => setModalOpen(false)} onConfirm={(total) => { setModalOpen(false); setToast(`New loan added for ${loan.buyer_name} — ${CURRENCY_SYMBOL} ${total.toLocaleString()}`); }} />}

      {/* Payment modal */}
      {showPaymentModal && (() => {
        const remaining = Number(loan.total_amount) - Number(loan.amount_paid || 0);
        return (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowPaymentModal(false)} />
            <div className="relative z-10 w-full md:max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-6 space-y-4">
              <h2 className="font-bold text-[#1A1A2E] text-lg">Record Payment</h2>
              <p className="text-sm text-gray-500">How much did the buyer pay?</p>
              <div>
                <label className="text-sm font-medium text-[#1A1A2E] block mb-1.5">Payment Amount (ETB)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">Remaining balance: {CURRENCY_SYMBOL} {remaining.toLocaleString()}</p>
                  <button onClick={() => setPaymentAmount(String(remaining))} className="text-xs font-semibold text-[#E85D04] hover:underline">Pay in Full</button>
                </div>
              </div>
              {paymentError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{paymentError}</p>}
              <button onClick={handlePayment} disabled={paymentLoading} className="w-full py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-bold text-sm transition-colors disabled:opacity-60">
                {paymentLoading ? 'Recording…' : 'Record Payment'}
              </button>
              <button onClick={() => { setShowPaymentModal(false); setPaymentError(''); }} className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        );
      })()}

      {/* Add Items modal */}
      {showAddItemsModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddItemsModal(false)} />
          <div className="relative z-10 w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-[#1A1A2E] text-base">Add Items for This Customer</h2>
              <button onClick={() => setShowAddItemsModal(false)} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
              <div className="flex items-center gap-3 bg-[#E85D04] rounded-xl px-4 py-3">
                <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">{initials(loan.buyer_name)}</div>
                <div>
                  <p className="font-bold text-white text-sm">{loan.buyer_name}</p>
                  <p className="text-white/70 text-xs">{loan.buyer_email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#1A1A2E]">Loan Items</p>
                {newItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.name}
                      onChange={(e) => setNewItems(prev => prev.map((it, i) => i === idx ? { ...it, name: e.target.value } : it))}
                      className="flex-1 h-10 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 min-w-0"
                    />
                    <div className="relative shrink-0 w-28">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">ETB</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.amount}
                        onChange={(e) => setNewItems(prev => prev.map((it, i) => i === idx ? { ...it, amount: e.target.value } : it))}
                        className="w-full h-10 pl-9 pr-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20"
                      />
                    </div>
                    <button
                      onClick={() => { if (newItems.length === 1) return; setNewItems(prev => prev.filter((_, i) => i !== idx)); }}
                      disabled={newItems.length === 1}
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 disabled:opacity-30 shrink-0"
                      aria-label={`Remove item ${idx + 1}`}
                    ><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <button onClick={() => setNewItems(prev => [...prev, { name: '', amount: '' }])} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#E85D04] text-[#E85D04] text-sm font-semibold hover:bg-[#FFF3E0]">
                  <Plus className="h-4 w-4" /> Add Another Item
                </button>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Total</span>
                  <span className="text-xl font-black text-[#E85D04]">ETB {newItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-[#1A1A2E] block">Due Date for These Items</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 [color-scheme:light]"
                />
                <div className="flex flex-wrap gap-2">
                  {[{ label: '1 Week', days: 7 }, { label: '2 Weeks', days: 14 }, { label: '1 Month', days: 30 }].map((chip) => {
                    const val = (() => { const d = new Date(); d.setDate(d.getDate() + chip.days); return d.toISOString().split('T')[0]; })();
                    return (
                      <button key={chip.label} onClick={() => setNewDueDate(val)} className={cn('px-4 py-1.5 rounded-full text-sm font-medium border transition-colors', newDueDate === val ? 'bg-[#E85D04] border-[#E85D04] text-white' : 'border-[#E85D04] text-[#E85D04] hover:bg-[#FFF3E0]')}>
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              {addItemsError && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{addItemsError}</p>}
            </div>
            <div className="px-5 pb-6 pt-3 border-t border-gray-100 shrink-0 space-y-3">
              <button onClick={handleAddItems} disabled={addItemsLoading} className="w-full py-3.5 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] disabled:opacity-60 text-white font-bold text-sm transition-colors">
                {addItemsLoading ? 'Saving…' : 'Confirm and Notify Buyer'}
              </button>
              <button onClick={() => { setShowAddItemsModal(false); setAddItemsError(''); }} className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="p-4 md:p-6 pb-24 md:pb-8 max-w-2xl mx-auto space-y-5">

        {/* Back */}
        <div className="flex items-center gap-3">
          <Link href={ROUTES.LOANS} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="font-bold text-[#1A1A2E]">Loan #{String(loan.id).slice(0, 8)}</h1>
            <p className="text-xs text-gray-400">Created {fmtDate(loan.created_at)}</p>
          </div>
          <span className={cn('ml-auto text-xs font-semibold px-2.5 py-1 rounded-full border', effectiveCfg.bg, effectiveCfg.color, effectiveCfg.border)}>
            {effectiveCfg.label}
          </span>
        </div>

        {/* Buyer card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#E85D04] flex items-center justify-center text-white font-bold text-lg shrink-0">
              {initials(loan.buyer_name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#1A1A2E] text-base">{loan.buyer_name}</p>
              <p className="text-sm text-gray-400">{loan.buyer_email}</p>
            </div>
          </div>
          <button onClick={() => setShowAddItemsModal(true)} className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm transition-colors">
            <Plus className="h-4 w-4" /> Add New Loan for This Customer
          </button>
        </div>

        {/* Amount card */}
        <div className="bg-[#1A1A2E] rounded-xl p-5 text-white">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/10">
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Total Amount</p>
              <p className="text-3xl font-black text-[#E85D04] leading-none">{CURRENCY_SYMBOL} {totalAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-1">Remaining Balance</p>
              {(() => {
                const remaining = Number(loan.total_amount) - Number(loan.amount_paid || 0);
                if (remaining === 0) return <p className="text-3xl font-black text-green-400 leading-none">Fully Paid</p>;
                const color = remaining < totalAmount ? 'text-[#E85D04]' : 'text-white';
                return <p className={`text-3xl font-black leading-none ${color}`}>{CURRENCY_SYMBOL} {remaining.toLocaleString()}</p>;
              })()}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-white/40 text-xs">Created</p>
              <p className="text-white text-sm font-semibold">{fmtDate(loan.created_at)}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs">Due Date</p>
              <p className={cn('text-sm font-semibold', isOverdue ? 'text-red-400' : 'text-white')}>{fmtDate(loan.due_date)}</p>
            </div>
          </div>
          {loan.notes && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs mb-1">Notes</p>
              <p className="text-white/80 text-sm">{loan.notes}</p>
            </div>
          )}
        </div>

        {/* Items table */}
        <ItemsTable loan={loan} />

        {/* Payment History */}
        {payments.length > 0 && (() => {
          const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
          const remaining = Number(loan.total_amount) - Number(loan.amount_paid || 0);
          return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#E85D04]" />
                <h2 className="font-bold text-[#1A1A2E] text-sm">Payment History</h2>
              </div>
              <div>
                {payments.map((p: any, i: number) => (
                  <div key={p.id} className={cn('flex items-center justify-between px-5 py-3 text-sm', i < payments.length - 1 && 'border-b border-gray-100')}>
                    <span className="text-gray-500">{fmtDate(p.created_at)}</span>
                    <span className="font-bold text-green-600">{CURRENCY_SYMBOL} {Number(p.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t-2 border-gray-100 space-y-1 bg-gray-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total paid</span>
                  <span className="font-bold text-green-600">ETB {totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Remaining</span>
                  {remaining <= 0
                    ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">Fully paid</span>
                    : <span className="font-bold text-orange-500">ETB {remaining.toLocaleString()}</span>
                  }
                </div>
              </div>
            </div>
          );
        })()}

        {/* Mark as Paid button — only for active/pending loans */}
        {(loan.status === 'active' || loan.status === 'pending_confirmation') && (
          <button
            onClick={() => { setPaymentAmount(String(Number(loan.total_amount) - Number(loan.amount_paid || 0))); setShowPaymentModal(true); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm transition-colors"
          >
            <CheckCircle className="h-4 w-4" /> Mark as Paid
          </button>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-[#1A1A2E] text-sm mb-4">Status Timeline</h2>
          {timelineSteps.map((s, i) => (
            <TimelineStep key={s.label} label={s.label} date={s.date} done={s.done} last={i === timelineSteps.length - 1} />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#E85D04] text-[#E85D04] font-semibold text-sm hover:bg-[#FFF3E0] transition-colors">
            <Send className="h-4 w-4" /> Send Reminder
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
            <Edit className="h-4 w-4" /> Edit
          </button>
        </div>

      </main>
    </AppLayout>
  );
}
