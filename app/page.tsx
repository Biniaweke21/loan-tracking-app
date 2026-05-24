import { SiteHeader } from '@/components/site-header';
import { SectionProblem } from '@/components/landing/section-problem';
import { SectionHowItWorks } from '@/components/landing/section-how-it-works';
import { SectionWhyKirari } from '@/components/landing/section-why-kirari';

export const metadata = {
  title: 'Kirari - Stop Losing Money to Lost Records',
  description: 'Replace your debt book with Kirari. Track loans, confirm payments, and send reminders from your phone.',
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <SectionProblem />
        <SectionHowItWorks />
        <SectionWhyKirari />
      </main>
    </>
  );
}
