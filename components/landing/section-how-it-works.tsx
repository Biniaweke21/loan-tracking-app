import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Mic, CheckCircle, Bell, Smartphone, Check, X, ArrowRight } from 'lucide-react';

function WaveBar() {
  return (
    <div className="flex items-center gap-0.5 h-8">
      {[3, 5, 7, 9, 11, 9, 7, 5, 3].map((h, i) => (
        <div
          key={i}
          className="wave-bar w-1 rounded-full bg-[#E85D04]"
          style={{ height: `${h * 2}px`, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}

const steps = [
  {
    num: '01',
    icon: Smartphone,
    title: 'Open Edaye',
    desc: 'The shop owner opens the app and selects the buyer by phone number. If it\'s a new customer they register in seconds.',
    extra: null,
  },
  {
    num: '02',
    icon: Mic,
    title: 'Record the Loan by Voice',
    desc: 'Tap the microphone and speak naturally in Amharic or English. Say the amount, the items, and the due date. Edaye extracts the details automatically.',
    extra: 'wave',
  },
  {
    num: '03',
    icon: CheckCircle,
    title: 'Buyer Confirms',
    desc: 'The buyer receives a notification with full loan details. They confirm with one tap. The loan is now on record — confirmed by both parties. No disputes possible.',
    extra: 'checks',
  },
  {
    num: '04',
    icon: Bell,
    title: 'Both Get Reminded',
    desc: 'On the due date, both the shop owner and buyer receive an automatic reminder. The payment is made. The loan is closed. Both parties confirm closure.',
    extra: null,
  },
];

export function SectionHowItWorks() {
  return (
    <section id="how-it-works">
      {/* ── Solution intro ── */}
      <div className="bg-[#FFF3E0] px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <p className="text-xs font-bold tracking-widest text-[#E85D04] uppercase mb-3">
                The Solution
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] leading-tight mb-6">
                Edaye replaces your debt book with something that never gets lost, never forgets,
                and never lies.
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  'Record loans by voice — no typing needed',
                  'Both buyer and shop owner confirm every transaction',
                  'Automatic reminders before every due date',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#E85D04] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-[#1A1A2E] text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={ROUTES.REGISTER}
                className="inline-flex items-center gap-2 bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                See It In Action
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right — phone mockup */}
            <div className="flex justify-center">
              <div className="relative w-56 h-[440px]">
                {/* Phone frame */}
                <div className="absolute inset-0 rounded-[2.5rem] border-[6px] border-[#1A1A2E] bg-[#1A1A2E] shadow-2xl overflow-hidden">
                  {/* Screen */}
                  <div className="absolute inset-[2px] rounded-[2rem] bg-white overflow-hidden">
                    {/* Status bar */}
                    <div className="h-6 bg-[#1A1A2E] flex items-center justify-center">
                      <div className="w-16 h-3 rounded-full bg-[#1A1A2E]" />
                    </div>
                    {/* Mock dashboard */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-5 w-5 rounded-full bg-[#E85D04]" />
                        <span className="text-xs font-bold text-[#E85D04]">Edaye</span>
                      </div>
                      <div className="bg-[#1A1A2E] rounded-xl p-3">
                        <p className="text-white text-xs font-semibold">Active Loans</p>
                        <p className="text-[#E85D04] text-2xl font-bold">12</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-[#FFF3E0] rounded-lg p-2">
                          <p className="text-gray-500 text-[9px]">Collected</p>
                          <p className="text-[#E85D04] text-sm font-bold">Br 4.2K</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-gray-500 text-[9px]">Pending</p>
                          <p className="text-[#1A1A2E] text-sm font-bold">Br 1.8K</p>
                        </div>
                      </div>
                      {[
                        { name: 'Tigist A.', amount: 'Br 500', status: 'Due today' },
                        { name: 'Bekele M.', amount: 'Br 300', status: 'Confirmed' },
                        { name: 'Almaz G.', amount: 'Br 750', status: '3 days left' },
                      ].map((loan) => (
                        <div key={loan.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1.5">
                          <div>
                            <p className="text-[10px] font-semibold text-[#1A1A2E]">{loan.name}</p>
                            <p className="text-[9px] text-gray-400">{loan.status}</p>
                          </div>
                          <p className="text-[10px] font-bold text-[#E85D04]">{loan.amount}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Steps ── */}
      <div className="bg-white px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest text-[#E85D04] uppercase mb-3">
              The Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Three steps. Zero paperwork.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col">
                  <div className="text-5xl font-black text-[#E85D04]/15 mb-2 leading-none">
                    {step.num}
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-[#E85D04]" />
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{step.desc}</p>
                  {step.extra === 'wave' && (
                    <div className="mt-4">
                      <WaveBar />
                    </div>
                  )}
                  {step.extra === 'checks' && (
                    <div className="mt-4 flex gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-full bg-[#E85D04] flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs text-gray-500">Shop</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-6 w-6 rounded-full bg-[#E85D04] flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-xs text-gray-500">Buyer</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Trust feature ── */}
      <div className="bg-[#1A1A2E] px-4 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#E85D04]/20 flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            The feature that ends arguments forever
          </h2>
          <p className="text-white/60 text-base max-w-2xl mx-auto mb-14 leading-relaxed">
            In Edaye, no loan exists until both the shop owner AND the buyer confirm it. No loan
            is marked paid until both parties agree. This is not just a record keeper — it is a
            trust system.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Without Kirari */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="h-3.5 w-3.5 text-red-400" />
                </span>
                Without Edaye
              </h3>
              <ul className="space-y-4">
                {[
                  'No proof of loan',
                  'No confirmation from buyer',
                  'Arguments over amounts',
                  'Lost records, lost money',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/60 text-sm">
                    <X className="h-4 w-4 text-red-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* With Kirari */}
            <div className="bg-[#E85D04]/10 border border-[#E85D04]/30 rounded-2xl p-8">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-[#E85D04]/30 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-[#E85D04]" />
                </span>
                With Edaye
              </h3>
              <ul className="space-y-4">
                {[
                  'Both parties confirm the loan',
                  'Both parties confirm payment',
                  'Automatic reminders sent',
                  'Cloud backup — forever safe',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                    <Check className="h-4 w-4 text-[#E85D04] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors"
            >
              Start Building Trust With Your Customers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
