import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export const metadata = {
  title: 'Login - Kirari',
  description: 'Sign in to your Kirari account',
};

export default function Login() {
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
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to your Kirari account
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="your@email.com" className="mt-1.5" />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="Enter your password" className="mt-1.5" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button className="w-full">Sign In</Button>
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
              Sign in with Google
            </Button>
            <Button variant="outline" className="w-full">
              Sign in with Apple
            </Button>
          </div>

          <div className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href={ROUTES.REGISTER} className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Secure login protected by industry-standard encryption
        </p>
      </div>
    </main>
  );
}
