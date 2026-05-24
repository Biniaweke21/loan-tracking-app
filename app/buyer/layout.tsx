"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, FileText, User, Flame } from "lucide-react";

const navItems = [
  { label: "Home", href: "/buyer/dashboard", icon: House },
  { label: "My Loans", href: "/buyer/loans", icon: FileText },
  { label: "Profile", href: "/buyer/profile", icon: User },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">

      {/* Desktop top navbar */}
      <header className="hidden md:flex items-center justify-between px-8 h-16 bg-white border-b border-gray-100 sticky top-0 z-20">
        <Link href="/buyer/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#E85D04] flex items-center justify-center">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-[#E85D04] text-lg">Kirari</span>
        </Link>

        <nav className="flex items-center gap-8">
          {navItems.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                  active
                    ? "border-[#E85D04] text-[#E85D04]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Buyer</span>
          <div className="h-8 w-8 rounded-full bg-[#E85D04] flex items-center justify-center text-white text-xs font-bold">
            B
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.08)] flex items-center justify-around h-16">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 flex-1 py-2"
            >
              <Icon
                className="h-6 w-6"
                style={{ color: active ? "#E85D04" : "#9CA3AF" }}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "#E85D04" : "#9CA3AF" }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
