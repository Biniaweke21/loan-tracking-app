'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Flame, Eye, EyeOff } from 'lucide-react';

const CITIES = [
  'Addis Ababa',
  'Dire Dawa',
  'Mekelle',
  'Gondar',
  'Hawassa',
  'Bahir Dar',
  'Adama',
  'Other',
];

export default function RegisterBuyer() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.city) e.city = 'Please select a city';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    router.push(ROUTES.BUYER_DASHBOARD);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAFAFA]">
      <div className="w-full max-w-md">

        {/* Back + Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={ROUTES.REGISTER}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A1A2E] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#E85D04] flex items-center justify-center">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[#E85D04]">Kirari</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Create Your Buyer Account</h1>
            <p className="text-sm text-gray-500 mt-1">Track loans and confirm payments from shops</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Full Name <span className="text-[#1A1A2E]">*</span>
              </label>
              <Input
                placeholder="Your full name"
                className="mt-1.5 focus-visible:ring-[#1A1A2E]/20 focus-visible:border-[#1A1A2E]"
                value={form.fullName}
                onChange={(e) => set('fullName', e.target.value)}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Phone Number <span className="text-[#1A1A2E]">*</span>
              </label>
              <Input
                placeholder="+251911223344"
                className="mt-1.5 focus-visible:ring-[#1A1A2E]/20 focus-visible:border-[#1A1A2E]"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Shops will use this number to add you to their loan records
              </p>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                City <span className="text-[#1A1A2E]">*</span>
              </label>
              <select
                className="mt-1.5 w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-[3px] focus:ring-[#1A1A2E]/20 focus:border-[#1A1A2E] transition-shadow"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
              >
                <option value="">Select your city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Password <span className="text-[#1A1A2E]">*</span>
              </label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className="pr-10 focus-visible:ring-[#1A1A2E]/20 focus-visible:border-[#1A1A2E]"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Confirm Password <span className="text-[#1A1A2E]">*</span>
              </label>
              <div className="relative mt-1.5">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className="pr-10 focus-visible:ring-[#1A1A2E]/20 focus-visible:border-[#1A1A2E]"
                  value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#1A1A2E] hover:bg-[#2D2D44] text-white font-semibold text-sm transition-colors mt-2"
            >
              Create Buyer Account
            </button>

          </form>

          {/* Phone note */}
          <div className="rounded-lg bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 px-4 py-3">
            <p className="text-xs text-[#1A1A2E]/70 leading-relaxed">
              Your phone number is your identity in Kirari. Make sure it is the number you use daily.
            </p>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="text-[#E85D04] font-medium hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}
