import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SiteHeader } from '@/components/site-header';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Contact Kirari - Get in Touch',
  description: 'Have questions? Get in touch with the Kirari team',
};

export default function Contact() {
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

            <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground mb-12">
              Have questions or feedback? We&apos;d love to hear from you.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your@email.com" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help?" className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Tell us more..." className="mt-2 min-h-32" />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email</h4>
                        <p className="text-muted-foreground">hello@kirari.io</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Phone</h4>
                        <p className="text-muted-foreground">+251 911 223 344</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Location</h4>
                        <p className="text-muted-foreground">Addis Ababa, Ethiopia</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                  <a
                    href="https://wa.me/251911223344"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button variant="outline" className="w-full mb-2">
                      Chat on WhatsApp
                    </Button>
                  </a>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      Twitter
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      LinkedIn
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      Facebook
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Response Time</h4>
                  <p className="text-sm text-muted-foreground">
                    We typically respond to inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
