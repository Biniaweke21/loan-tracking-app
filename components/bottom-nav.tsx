'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import {
  LayoutDashboard,
  Banknote,
  Users,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.LOANS,     label: 'Loans',     icon: Banknote },
  { href: ROUTES.CUSTOMERS, label: 'Customers', icon: Users },
  { href: ROUTES.REMINDERS, label: 'Reminders', icon: Bell },
  { href: ROUTES.SETTINGS,  label: 'Settings',  icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white shadow-[0_-1px_12px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-2.5 gap-1 text-[10px] font-medium transition-colors',
                isActive ? 'text-[#E85D04]' : 'text-gray-400 hover:text-[#E85D04]'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-[#E85D04]' : 'text-gray-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
