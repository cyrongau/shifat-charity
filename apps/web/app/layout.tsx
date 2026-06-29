import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SHiFAT - Somali Health Initiative For All Trust',
  description: 'Empowering vulnerable communities across the Horn of Africa through maternal care, clean water, emergency relief, and healthcare education.',
  keywords: 'SHiFAT, charity, Somalia, healthcare, maternal health, clean water, donation',
  openGraph: {
    title: 'SHiFAT - Somali Health Initiative For All Trust',
    description: 'Empowering vulnerable communities through maternal care, clean water, and emergency relief.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
