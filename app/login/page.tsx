'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered') === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login credentials') ||
        error.message.includes('invalid_credentials')) {
        setError('No account found with this email or password is incorrect.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }
    if (user) {
      let { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!profile) {
        const pending = localStorage.getItem('kirari_pending_profile');
        if (pending) {
          const pendingData = JSON.parse(pending);
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: pendingData.full_name,
            phone_number: pendingData.phone_number,
            role: pendingData.role,
            city: pendingData.city,
          });
          if (pendingData.role === 'shop_owner') {
            await supabase.from('shops').insert({
              owner_id: user.id,
              shop_name: pendingData.shop_name,
              city: pendingData.city,
            });
          }
          localStorage.removeItem('kirari_pending_profile');
          profile = { role: pendingData.role };
        }
        if (!profile && !localStorage.getItem('kirari_pending_profile')) {
          await supabase.auth.signOut()
          setError('No account found. Please register first.')
          setLoading(false)
          return
        }
      }
      if (profile?.role === 'shop_owner') {
        router.push('/app/dashboard');
      } else if (profile?.role === 'buyer') {
        router.push('/buyer/dashboard');
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="text-2xl font-bold text-primary">Edaye</span>
          </Link>
        </div>

        <div className="card p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your Edaye account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {registered && (
              <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                Account created successfully. Please log in.
              </p>
            )}
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="your@email.com"
                className="mt-1.5"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                className="mt-1.5"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#E85D04] hover:bg-[#C44D03] text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Secure login protected by industry-standard encryption
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
