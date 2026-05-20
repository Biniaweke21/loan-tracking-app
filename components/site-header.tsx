import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from './language-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="container flex h-16 items-center justify-between">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <span className="font-bold text-lg text-primary">Kirari</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href={ROUTES.HOME} className="text-sm hover:text-primary">
            Home
          </Link>
          <Link href={ROUTES.ABOUT} className="text-sm hover:text-primary">
            About
          </Link>
          <Link href={ROUTES.CONTACT} className="text-sm hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Link href={ROUTES.LOGIN}>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href={ROUTES.REGISTER}>
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
