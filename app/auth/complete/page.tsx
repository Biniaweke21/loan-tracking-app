'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Flame } from 'lucide-react';

export default function AuthCompletePage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      const raw = localStorage.getItem('kirari_pending_profile');
      const pending = raw ? JSON.parse(raw) : {};

      if (user && pending.role) {
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: pending.full_name,
          phone_number: pending.phone_number,
          role: pending.role,
          city: pending.city,
        });

        if (pending.role === 'shop_owner' && pending.shop_name) {
          await supabase.from('shops').insert({
            owner_id: user.id,
            shop_name: pending.shop_name,
            city: pending.city,
          });
        }

        localStorage.removeItem('kirari_pending_profile');

        if (pending.role === 'shop_owner') {
          router.push('/app/dashboard');
        } else if (pending.role === 'buyer') {
          router.push('/buyer/dashboard');
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    };

    run();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="h-12 w-12 rounded-full bg-[#E85D04] flex items-center justify-center">
        <Flame className="h-6 w-6 text-white" />
      </div>
      <p className="text-gray-500 text-sm">Setting up your account...</p>
      <div className="h-6 w-6 rounded-full border-2 border-[#E85D04] border-t-transparent animate-spin" />
    </main>
  );
}
