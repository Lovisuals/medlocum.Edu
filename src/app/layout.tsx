import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en-NG">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
