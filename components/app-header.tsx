'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Bell, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function usePageTitle(): string {
  const pathname = usePathname();
  const map: Record<string, string> = {
    [ROUTES.DASHBOARD]: 'Dashboard',
    [ROUTES.LOANS]:     'Loans',
    [ROUTES.NEW_LOAN]:  'New Loan',
    [ROUTES.CUSTOMERS]: 'Customers',
    [ROUTES.REMINDERS]: 'Reminders',
    [ROUTES.SETTINGS]:  'Settings',
  };
  return map[pathname] ?? 'Edaye';
}

const BORDER: Record<string, string> = {
  red:    'border-red-500',
  orange: 'border-[#E85D04]',
  gray:   'border-gray-400',
};

export function AppHeader() {
  const title = usePageTitle();
  const router = useRouter();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: shop } = await supabase.from('shops').select('id').eq('owner_id', user.id).single();
      if (!shop) return;
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date(); weekFromNow.setDate(weekFromNow.getDate() + 7);
      const { data: loans } = await supabase
        .from('loans').select('id, buyer_name, total_amount, amount_paid, due_date, status')
        .eq('shop_id', shop.id).neq('status', 'paid');
      if (!loans) return;
      const notifs: any[] = [];
      loans.forEach((loan: any) => {
        const due = new Date(loan.due_date);
        const remaining = Number(loan.total_amount) - Number(loan.amount_paid || 0);
        if (due < today) {
          notifs.push({ id: loan.id, type: 'overdue', message: `${loan.buyer_name} is overdue — ETB ${remaining.toLocaleString()}`, color: 'red' });
        } else if (due <= weekFromNow) {
          notifs.push({ id: loan.id, type: 'due_soon', message: `${loan.buyer_name} due soon — ETB ${remaining.toLocaleString()}`, color: 'orange' });
        } else if (loan.status === 'pending_confirmation') {
          notifs.push({ id: loan.id, type: 'pending', message: `${loan.buyer_name} has not confirmed their loan yet`, color: 'gray' });
        }
      });
      setNotifications(notifs);
    };
    fetchNotifications();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        <h1 className="text-lg font-bold text-[#1A1A2E]">{title}</h1>

        <div className="flex items-center gap-3">

          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifications((v) => !v)}
              className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-500" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white flex items-center justify-center text-white text-[9px] font-bold">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-11 z-20 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-[#1A1A2E] text-sm">Notifications</p>
                    <button onClick={() => setShowNotifications(false)} className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No notifications</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => { router.push(`/app/loans/${n.id}`); setShowNotifications(false); }}
                          className={`w-full text-left px-4 py-3 border-l-4 ${BORDER[n.color]} hover:bg-gray-50 transition-colors border-b border-b-gray-100 last:border-b-0`}
                        >
                          <p className="text-sm text-[#1A1A2E]">{n.message}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            aria-label="Account menu"
            className="h-9 w-9 rounded-full bg-[#E85D04] flex items-center justify-center text-white text-sm font-bold hover:bg-[#C44D03] transition-colors"
          >
            JD
          </button>

        </div>
      </div>
    </header>
  );
}
