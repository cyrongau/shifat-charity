import type { Metadata } from 'next';
import ContactSection from '../../../components/public/ContactSection';
import type { Faq } from '../../../types';

export const metadata: Metadata = {
  title: 'Contact Us | SHiFAT',
  description: 'Get in touch with SHiFAT. Reach our team for inquiries, partnerships, donations, or general questions.',
};

export default async function ContactPage() {
  const res = await fetch('http://localhost:5201/api/faqs?limit=50', { cache: 'no-store' });
  const faqs: Faq[] = (await res.json()).data ?? [];
  return <ContactSection faqs={faqs} />;
}
