'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Flame, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

export default function RegisterShop() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    email: '',
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
    if (!form.shopName.trim()) e.shopName = 'Shop name is required';
    if (!form.ownerName.trim()) e.ownerName = 'Owner name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.city) e.city = 'Please select a city';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.terms = 'You must agree to the terms';
    return e;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fullName = form.ownerName;
      const phoneNumber = form.phone.replace(/\s+/g, '');
      const shopName = form.shopName;
      const city = form.city;
      const email = form.email;
      const password = form.password;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log('SignUp result:', data, error);
      if (error) {
        if (data?.user?.identities?.length === 0) {
          setError('An account with this email already exists.');
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }
      if (data?.user?.identities?.length === 0) {
        setError('An account with this email already exists.');
        setLoading(false);
        return;
      }
      if (!data.user) {
        setError('Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      localStorage.setItem('kirari_pending_profile', JSON.stringify({
        full_name: fullName,
        phone_number: phoneNumber,
        role: 'shop_owner',
        city: city,
        shop_name: shopName,
        user_id: data.user.id,
      }));

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        phone_number: phoneNumber,
        role: 'shop_owner',
        city: city,
      });
      if (profileError) {
        console.log('Profile insert failed, will retry on login:', profileError.message);
      }

      const { error: shopError } = await supabase.from('shops').insert({
        owner_id: data.user.id,
        shop_name: shopName,
        city: city,
      });
      if (shopError) {
        console.log('Shop insert failed, will retry on login:', shopError.message);
      }

      router.push('/login?registered=true');
      setLoading(false);
    } catch (err) {
      console.log('Caught error:', err);
      setError('Unexpected error: ' + String(err));
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FAFAFA]">
      <div className="w-full max-w-md">

        {/* Back + Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={ROUTES.REGISTER}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E85D04] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#E85D04] flex items-center justify-center">
              <Flame className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-[#E85D04]">Edaye</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">

          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Create Your Shop Account</h1>
            <p className="text-sm text-gray-500 mt-1">Set up your shop and start tracking loans</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            {/* Shop Name */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Shop Name <span className="text-[#E85D04]">*</span>
              </label>
              <Input
                placeholder="e.g. Tigist General Store"
                className="mt-1.5 focus-visible:ring-[#E85D04]/40 focus-visible:border-[#E85D04]"
                value={form.shopName}
                onChange={(e) => set('shopName', e.target.value)}
              />
              {errors.shopName && <p className="text-xs text-red-500 mt-1">{errors.shopName}</p>}
            </div>

            {/* Owner Full Name */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Owner Full Name <span className="text-[#E85D04]">*</span>
              </label>
              <Input
                placeholder="Your full name"
                className="mt-1.5 focus-visible:ring-[#E85D04]/40 focus-visible:border-[#E85D04]"
                value={form.ownerName}
                onChange={(e) => set('ownerName', e.target.value)}
              />
              {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Email Address <span className="text-[#E85D04]">*</span>
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="mt-1.5 focus-visible:ring-[#E85D04]/40 focus-visible:border-[#E85D04]"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Phone Number <span className="text-[#E85D04]">*</span>
              </label>
              <Input
                placeholder="+251911223344"
                className="mt-1.5 focus-visible:ring-[#E85D04]/40 focus-visible:border-[#E85D04]"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">This is how buyers will find your shop</p>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">
                Region / City <span className="text-[#E85D04]">*</span>
              </label>
              <select
                className="mt-1.5 w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-[#1A1A2E] focus:outline-none focus:ring-[3px] focus:ring-[#E85D04]/40 focus:border-[#E85D04] transition-shadow"
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
                Password <span className="text-[#E85D04]">*</span>
              </label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className="pr-10 focus-visible:ring-[#E85D04]/40 focus-visible:border-[#E85D04]"
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
                Confirm Password <span className="text-[#E85D04]">*</span>
              </label>
              <div className="relative mt-1.5">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className="pr-10 focus-visible:ring-[#E85D04]/40 focus-visible:border-[#E85D04]"
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

            {/* Language preference */}
            <div>
              <label className="text-sm font-medium text-[#1A1A2E]">Language Preference</label>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    language === 'en'
                      ? 'bg-[#E85D04] text-white border-[#E85D04]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#E85D04]/50'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('am')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    language === 'am'
                      ? 'bg-[#E85D04] text-white border-[#E85D04]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#E85D04]/50'
                  }`}
                >
                  አማርኛ
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-1">
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(v) => {
                    setAgreed(!!v);
                    setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  className="mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-[#E85D04] hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#E85D04] hover:underline">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              onClick={() => handleSubmit()}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm transition-colors mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create Shop Account'}
            </button>

            {successMsg && (
              <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
                {successMsg}
              </p>
            )}

          </form>

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
