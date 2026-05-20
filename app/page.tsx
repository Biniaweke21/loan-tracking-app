import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';

export const metadata = {
  title: 'Kirari - Microfinance Loan Management',
  description: 'Track and manage microfinance loans with ease',
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-4 py-20 md:py-32">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Manage Microfinance Loans with{' '}
              <span className="text-primary">Confidence</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Kirari helps you track, manage, and grow your microfinance business. Monitor loans, track payments, and send reminders—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.REGISTER}>
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.ABOUT}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Kirari?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: 'Track All Loans',
                  description: 'Monitor loan status, payments, and performance in real-time',
                },
                {
                  icon: Users,
                  title: 'Manage Customers',
                  description: 'Keep organized customer profiles with complete loan history',
                },
                {
                  icon: Zap,
                  title: 'Smart Reminders',
                  description: 'Automate payment reminders via SMS, WhatsApp, and email',
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="bg-card p-8 rounded-lg border text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {[
                {
                  name: 'Starter',
                  price: 'Free',
                  features: ['Up to 50 customers', 'Basic reporting', 'Email support'],
                },
                {
                  name: 'Professional',
                  price: '199 ETB',
                  period: '/month',
                  features: [
                    'Unlimited customers',
                    'Advanced analytics',
                    'Priority support',
                    'SMS & WhatsApp reminders',
                  ],
                },
              ].map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-lg border-2 ${
                    idx === 1 ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={idx === 1 ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join hundreds of microfinance businesses using Kirari to manage their loans.
            </p>
            <Link href={ROUTES.REGISTER}>
              <Button size="lg" variant="secondary">
                Start Free Trial Today
              </Button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-bold mb-4">Kirari</h4>
                <p className="text-sm text-muted-foreground">
                  Microfinance loan management platform
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href={ROUTES.HOME} className="hover:text-foreground">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href={ROUTES.ABOUT} className="hover:text-foreground">
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href={ROUTES.CONTACT} className="hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>&copy; 2024 Kirari. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-foreground">
                  Twitter
                </a>
                <a href="#" className="hover:text-foreground">
                  LinkedIn
                </a>
                <a href="#" className="hover:text-foreground">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
