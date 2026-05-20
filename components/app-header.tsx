'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AvatarInitials } from './avatar-initials';
import { LanguageToggle } from './language-toggle';
import {
  LayoutDashboard,
  Banknote,
  Users,
  Bell,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 md:hidden">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <span className="font-bold text-primary">Kirari</span>
        </Link>

        <div className="flex items-center gap-4 ml-auto">
          <LanguageToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <AvatarInitials name="John Doe" className="h-5 w-5 text-xs" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={ROUTES.SETTINGS}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
