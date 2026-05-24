'use client';

import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Bell } from 'lucide-react';

/* Derive a human-readable page title from the current pathname */
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
  return map[pathname] ?? 'Kirari';
}

export function AppHeader() {
  const title = usePageTitle();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">

        {/* Page title */}
        <h1 className="text-lg font-bold text-[#1A1A2E]">{title}</h1>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Notification bell with orange badge */}
          <button
            aria-label="Notifications"
            className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-500" />
            {/* Badge dot */}
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E85D04] ring-2 ring-white" />
          </button>

          {/* Owner avatar */}
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
