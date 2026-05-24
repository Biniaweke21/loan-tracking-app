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
  LogOut,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.LOANS,     label: 'Loans',     icon: Banknote },
  { href: ROUTES.CUSTOMERS, label: 'Customers', icon: Users },
  { href: ROUTES.REMINDERS, label: 'Reminders', icon: Bell },
  { href: ROUTES.SETTINGS,  label: 'Settings',  icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen bg-[#1A1A2E] sticky top-0">
      {/* Orange top accent bar */}
      <div className="h-1 w-full bg-[#E85D04] shrink-0" />

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#2D2D44]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#E85D04] flex items-center justify-center shrink-0">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Kirari</p>
            <p
              className="text-white/40 text-xs leading-none mt-0.5"
              style={{ fontFamily: "var(--font-noto-sans-ethiopic, 'Noto Sans Ethiopic', sans-serif)" }}
            >
              ቅራሪ
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#E85D04] text-white'
                  : 'text-white/50 hover:bg-[#2D2D44] hover:text-white'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-white' : 'text-white/50')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — shop info + logout */}
      <div className="px-4 py-4 border-t border-[#2D2D44]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-[#E85D04] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">Tigist General Store</p>
            <p className="text-white/40 text-xs truncate">John Doe</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:bg-[#2D2D44] hover:text-white text-xs font-medium transition-colors">
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  );
}
