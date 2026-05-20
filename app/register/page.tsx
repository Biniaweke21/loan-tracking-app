import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export const metadata = {
  title: 'Register - Kirari',
  description: 'Create your Kirari account',
};

export default function Register() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="text-2xl font-bold text-primary">Kirari</span>
          </Link>
        </div>

        <div className="card p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start managing loans with Kirari
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Business Name</label>
              <Input placeholder="Your business name" className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="Your full name" className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="your@email.com" className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input placeholder="+251911223344" className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="At least 8 characters" className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" placeholder="Re-enter password" className="mt-1.5" />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button className="w-full">Create Account</Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              Sign up with Google
            </Button>
            <Button variant="outline" className="w-full">
              Sign up with Apple
            </Button>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href={ROUTES.LOGIN} className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  );
}
