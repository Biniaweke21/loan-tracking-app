import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { BookOpen, Users, Calendar, ArrowRight } from 'lucide-react';

export function SectionProblem() {
  return (
    <section id="problem">
      {/* ── Hero ── */}
      <div className="relative min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4 py-32 overflow-hidden">
        {/* Background photo — Ethiopian shop interior */}
        <Image
          src="/images/shop-hero.jpg"
          alt="Interior of a typical Ethiopian small shop with goods on shelves"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#1A1A2E]/80" />
        {/* Ambient orange glow on top of overlay */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-[#E85D04]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[200px] bg-[#FB8500]/15 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl text-center">
          {/* Amharic headline */}
          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-noto-sans-ethiopic, 'Noto Sans Ethiopic', sans-serif)" }}
          >
            የዱቤ መዝገብ ጠፋ?
          </h1>

          {/* English subtitle */}
          <p className="text-2xl md:text-3xl font-semibold text-white/80 mb-5">
            Your debt book just cost you money.
          </p>

          <p className="text-base md:text-lg text-white/55 mb-10 max-w-xl mx-auto leading-relaxed">
            Thousands of Ethiopian shops lose money every year to lost records, forgotten loans,
            and payment disputes. There is a better way.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href={ROUTES.REGISTER}
              className="bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              Start Free Today
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#how-it-works"
              className="border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors inline-flex items-center justify-center"
            >
              Watch How It Works
            </a>
          </div>

          <p className="text-white/35 text-sm">Trusted by early shops in Dire Dawa 🇪🇹</p>
        </div>
      </div>

      {/* ── Problem cards ── */}
      <div className="bg-white px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-[#E85D04] uppercase mb-3">
              Sound Familiar?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Every shop owner knows this pain
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 — Lost book */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Debt book photo */}
              <div className="relative h-44 bg-[#FFF3E0]">
                <Image
                  src="/images/debt-book.jpg"
                  alt="A worn handwritten Ethiopian debt book with faded ink entries"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="p-8">
                <div className="h-14 w-14 rounded-2xl bg-[#FFF3E0] flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-[#E85D04]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                  The book gets lost. The money disappears.
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Rain, fire, a misplaced notebook — and suddenly weeks of loan records are gone.
                  You remember some names. You forget others. Money you were owed is gone forever.
                </p>
              </div>
            </div>

            {/* Card 2 — The argument */}
            <div className="rounded-2xl border border-gray-100 p-8 bg-[#FFF3E0] hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-[#E85D04]/15 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-[#E85D04]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                He says he paid. You say he didn&apos;t.
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No receipt. No confirmation. Just two people with different memories and a broken
                trust. These arguments damage relationships that took years to build.
              </p>
            </div>

            {/* Card 3 — Forgotten due date */}
            <div className="rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow">
              <div className="h-14 w-14 rounded-2xl bg-[#FFF3E0] flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-[#E85D04]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">
                The due date passed. You forgot to follow up.
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                You have 15 active loans in your head. You cannot remember them all. Days turn to
                weeks. The buyer assumes you forgot. The debt quietly disappears.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Transition ── */}
      <div className="bg-[#1A1A2E] px-4 py-20 text-center">
        <p className="text-2xl md:text-3xl font-bold text-white max-w-xl mx-auto leading-snug">
          What if your phone{' '}
          <span className="text-[#E85D04] underline decoration-[#E85D04]/40 underline-offset-4">
            remembered everything
          </span>{' '}
          for you?
        </p>
        <div className="mt-8 flex justify-center">
          <a href="#how-it-works" aria-label="Scroll to How It Works">
            <div className="h-10 w-10 rounded-full border-2 border-white/20 flex items-center justify-center animate-bounce">
              <ArrowRight className="h-4 w-4 text-white/60 rotate-90" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
