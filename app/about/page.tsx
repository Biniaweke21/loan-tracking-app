import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'About Kirari - Microfinance Management',
  description: 'Learn about Kirari and our mission to empower microfinance businesses',
};

export default function About() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">
        <section className="px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 text-primary mb-8 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl font-bold mb-8">About Kirari</h1>

            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kirari is dedicated to empowering microfinance businesses across Africa. We believe that access to modern loan management tools should be simple, affordable, and effective for everyone—from small entrepreneurs to established microfinance institutions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are a team of fintech professionals and software engineers passionate about financial inclusion. We've worked with microfinance institutions across Ethiopia and beyond, understanding the unique challenges of managing loans in growing markets.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Simplicity',
                      desc: 'We make complex loan management simple and intuitive for everyone.',
                    },
                    {
                      title: 'Accessibility',
                      desc: 'Affordable pricing and multilingual support for all businesses.',
                    },
                    {
                      title: 'Reliability',
                      desc: 'Your data is secure, backed up, and always available when you need it.',
                    },
                    {
                      title: 'Impact',
                      desc: 'We measure success by the growth and success of our customers.',
                    },
                  ].map((value, idx) => (
                    <div key={idx}>
                      <h3 className="font-semibold mb-1">{value.title}</h3>
                      <p className="text-muted-foreground">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Kirari was born from a simple observation: microfinance businesses were using spreadsheets and notebooks to manage thousands of loans. We saw an opportunity to revolutionize how these vital institutions operate by bringing modern technology to loan management.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, Kirari is trusted by businesses across Ethiopia and the region to manage millions of birr in loans, track thousands of customers, and send reminders to borrowers—all through one elegant platform.
                </p>
              </section>

              <div className="bg-primary/10 p-8 rounded-lg mt-12">
                <h3 className="text-xl font-semibold mb-4">Join Us</h3>
                <p className="text-muted-foreground mb-6">
                  Ready to transform your microfinance business? Start using Kirari today.
                </p>
                <Link href={ROUTES.REGISTER}>
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
