import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Mic, CheckCircle, Bell, Cloud, Users, Smartphone, ArrowRight, Check } from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Voice Recording',
    desc: 'Record loans by speaking in Amharic or English. No typing, no forms — just your voice.',
  },
  {
    icon: CheckCircle,
    title: 'Dual Confirmation',
    desc: 'Both the shop owner and buyer must confirm every loan and every payment. No disputes.',
  },
  {
    icon: Bell,
    title: 'Automatic Reminders',
    desc: 'Both parties receive reminders before every due date. No more forgotten payments.',
  },
  {
    icon: Cloud,
    title: 'Cloud Backup',
    desc: 'Your records survive any phone loss, flood, or fire. Everything is backed up securely.',
  },
  {
    icon: Users,
    title: 'Full Payment History',
    desc: 'Every customer has a complete, searchable loan and payment history at your fingertips.',
  },
  {
    icon: Smartphone,
    title: 'Works on Any Phone',
    desc: 'No special hardware needed. Kirari runs in any browser on any Android or iPhone.',
  },
];

const testimonials = [
  {
    initials: 'TA',
    quote:
      'Before Kirari I had arguments every week about who paid and who didn\'t. Now both sides confirm everything. No more fighting.',
    name: 'Tigist A.',
    location: 'Dire Dawa',
  },
  {
    initials: 'BM',
    quote:
      'I lost my debt book in a flood two years ago. Lost over 3000 birr. With Kirari that can never happen again.',
    name: 'Bekele M.',
    location: 'Addis Ababa',
  },
  {
    initials: 'AG',
    quote:
      'I can\'t read well so typing was hard. The voice recording changed everything for me.',
    name: 'Almaz G.',
    location: 'Dire Dawa',
  },
];

export function SectionWhyKirari() {
  return (
    <section id="why-kirari">
      {/* ── Features grid ── */}
      <div className="bg-white px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-[#E85D04] uppercase mb-3">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Everything your debt book couldn&apos;t do
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-gray-100 hover:border-[#E85D04]/40 hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[#E85D04]"
                >
                  <div className="h-12 w-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center mb-4 group-hover:bg-[#E85D04] transition-colors duration-200">
                    <Icon className="h-6 w-6 text-[#E85D04] group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="bg-[#FFF3E0] px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              What shops are saying
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-11 w-11 rounded-full bg-[#E85D04] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E] text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing ── */}
      <div className="bg-white px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Start free. Always.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="rounded-2xl border-2 border-[#E85D04] p-8 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-[#E85D04] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-1">Free</h3>
              <p className="text-4xl font-black text-[#E85D04] mb-6">
                0 ETB<span className="text-base font-normal text-gray-400">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited loans',
                  'Voice recording',
                  'Dual confirmation',
                  'Automatic reminders',
                  'Cloud backup',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-[#E85D04] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={ROUTES.REGISTER}
                className="block w-full text-center bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-[#1A1A2E] p-8 relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-[#1A1A2E] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-1">Pro</h3>
              <p className="text-4xl font-black text-[#1A1A2E] mb-6">
                50–100 ETB<span className="text-base font-normal text-gray-400">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free',
                  'Analytics dashboard',
                  'Export PDF / CSV',
                  'Multi-staff access',
                  'Priority support',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-[#1A1A2E] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="block w-full text-center bg-gray-100 text-gray-400 font-semibold py-3 rounded-xl text-sm cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="relative bg-[#1A1A2E] px-4 py-28 text-center overflow-hidden">
        {/* Background photo — Ethiopian shop street scene */}
        <Image
          src="/images/shop-community.jpg"
          alt="Ethiopian shop owners and customers on a busy market street"
          fill
          className="object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#1A1A2E]/85" />
        {/* Ambient glow accents on top of overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#E85D04]/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#FB8500]/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop losing money to lost records.
          </h2>
          <p className="text-white/60 text-base mb-10 leading-relaxed">
            Join shops across Ethiopia already using Kirari. Free to start. Takes 2 minutes.
          </p>
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex items-center gap-2 bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold px-10 py-4 rounded-xl text-base transition-colors"
          >
            Create Your Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-white/30 text-xs mt-5">
            No credit card. No commitment. Built in Ethiopia 🇪🇹
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-[#0F0F1A] px-4 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
          <p>&copy; 2025 Kirari. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <Link href={ROUTES.CONTACT} className="hover:text-white/60 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
