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

interface BottomNavProps {
  onItemClick?: () => void;
}

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.LOANS, label: 'Loans', icon: Banknote },
  { href: ROUTES.CUSTOMERS, label: 'Customers', icon: Users },
  { href: ROUTES.REMINDERS, label: 'Reminders', icon: Bell },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-card md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full py-3 text-xs gap-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
