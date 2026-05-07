import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Medical Locum Jobs Academy (Nigeria) — Compliance & Excellence',
  description: 'The premier e-learning and compliance platform for Nigerian healthcare professionals. Complete MDCN/NMCN mandatory training and track your CME units.',
  keywords: 'MDCN compliance, NMCN training, Nigerian medical academy, CME units Nigeria, doctors locum Nigeria',
  openGraph: {
    title: 'Medical Locum Jobs Academy (Nigeria)',
    description: 'Empowering Nigerian Healthcare Professionals through Digital Excellence',
    url: 'https://academy.medlocumjobs.ng',
    siteName: 'MedLocum Jobs Academy',
    locale: 'en_NG',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${outfit.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
