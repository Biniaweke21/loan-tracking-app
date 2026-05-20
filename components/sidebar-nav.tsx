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

interface SidebarNavProps {
  onItemClick?: () => void;
}

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.LOANS, label: 'Loans', icon: Banknote },
  { href: ROUTES.CUSTOMERS, label: 'Customers', icon: Users },
  { href: ROUTES.REMINDERS, label: 'Reminders', icon: Bell },
  { href: ROUTES.SETTINGS, label: 'Settings', icon: Settings },
];

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
