import { SiteHeader } from '@/components/site-header';
import { SectionProblem } from '@/components/landing/section-problem';
import { SectionHowItWorks } from '@/components/landing/section-how-it-works';
import { SectionWhyEdaye } from '@/components/landing/section-why-kirari';

export const metadata = {
  title: 'Edaye - Stop Losing Money to Lost Records',
  description: 'Replace your debt book with Edaye. Track loans, confirm payments, and send reminders from your phone.',
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <SectionProblem />
        <SectionHowItWorks />
        <SectionWhyEdaye />
      </main>
    </>
  );
}
