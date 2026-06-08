'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Flame, Menu, X } from 'lucide-react';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#problem', label: 'The Problem' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#why-edaye', label: 'Why Edaye' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-full bg-[#E85D04] flex items-center justify-center">
            <Flame className="h-4 w-4 text-white" />
          </div>
          <span className={`font-bold text-lg transition-colors ${scrolled ? 'text-[#E85D04]' : 'text-white'}`}>
            Edaye
          </span>
        </Link>

        {/* Center anchor links — desktop */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#E85D04] ${
                scrolled ? 'text-[#1A1A2E]' : 'text-white/85'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side — desktop */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {/* Language toggle */}
          <div className={`flex items-center gap-1 text-sm font-medium transition-colors ${scrolled ? 'text-[#1A1A2E]' : 'text-white/85'}`}>
            <button className="hover:text-[#E85D04] transition-colors px-1">EN</button>
            <span className="opacity-30">/</span>
            <button className="hover:text-[#E85D04] transition-colors px-1">አማ</button>
          </div>
          <Link
            href={ROUTES.LOGIN}
            className={`text-sm font-medium transition-colors hover:text-[#E85D04] ${
              scrolled ? 'text-[#1A1A2E]' : 'text-white/85'
            }`}
          >
            Login
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="bg-[#E85D04] hover:bg-[#C44D03] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 rounded-md"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className={`h-5 w-5 ${scrolled ? 'text-[#1A1A2E]' : 'text-white'}`} />
            : <Menu className={`h-5 w-5 ${scrolled ? 'text-[#1A1A2E]' : 'text-white'}`} />
          }
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-5 py-5 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-medium text-[#1A1A2E] hover:text-[#E85D04] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-[#1A1A2E]">
                <button className="hover:text-[#E85D04] transition-colors">EN</button>
                <span className="opacity-30">/</span>
                <button className="hover:text-[#E85D04] transition-colors">አማ</button>
              </div>
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-[#1A1A2E] hover:text-[#E85D04] transition-colors"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-[#E85D04] hover:bg-[#C44D03] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
