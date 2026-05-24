import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Store, ShoppingBag, Flame } from 'lucide-react';

export const metadata = {
  title: 'Register - Kirari',
  description: 'Create your Kirari account',
};

export default function Register() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAFAFA]">
      <div className="w-full max-w-xl">

        {/* Logo */}
        <div className="mb-10 text-center">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-[#E85D04] flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#E85D04]">Kirari</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[#1A1A2E]">Welcome to Kirari</h1>
          <p className="mt-2 text-sm text-gray-500">Are you a shop owner or a buyer?</p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Shop Owner */}
          <Link
            href={ROUTES.REGISTER_SHOP}
            className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl border-2 border-[#E85D04]/30 hover:border-[#E85D04] hover:shadow-lg transition-all duration-200"
          >
            <div className="h-16 w-16 rounded-2xl bg-[#FFF3E0] flex items-center justify-center mb-4 group-hover:bg-[#E85D04] transition-colors duration-200">
              <Store className="h-8 w-8 text-[#E85D04] group-hover:text-white transition-colors duration-200" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-1">I own a shop</h2>
            <p className="text-xs text-gray-400 mb-1 font-medium">የሱቅ ባለቤት ነኝ</p>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Track loans I give to my customers and send reminders
            </p>
            <div className="mt-6 w-full py-2.5 rounded-lg bg-[#E85D04] text-white text-sm font-semibold group-hover:bg-[#C44D03] transition-colors duration-200">
              Register as Shop Owner
            </div>
          </Link>

          {/* Buyer */}
          <Link
            href={ROUTES.REGISTER_BUYER}
            className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl border-2 border-[#1A1A2E]/20 hover:border-[#1A1A2E] hover:shadow-lg transition-all duration-200"
          >
            <div className="h-16 w-16 rounded-2xl bg-[#1A1A2E]/5 flex items-center justify-center mb-4 group-hover:bg-[#1A1A2E] transition-colors duration-200">
              <ShoppingBag className="h-8 w-8 text-[#1A1A2E] group-hover:text-white transition-colors duration-200" />
            </div>
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-1">I am a buyer</h2>
            <p className="text-xs text-gray-400 mb-1 font-medium">ገዢ ነኝ</p>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Confirm loans from shops and track what I owe
            </p>
            <div className="mt-6 w-full py-2.5 rounded-lg bg-[#1A1A2E] text-white text-sm font-semibold group-hover:bg-[#2D2D44] transition-colors duration-200">
              Register as Buyer
            </div>
          </Link>

        </div>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href={ROUTES.LOGIN} className="text-[#E85D04] font-medium hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </main>
  );
}
