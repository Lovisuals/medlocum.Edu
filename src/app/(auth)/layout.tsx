import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — MedLocum Academy',
  description: 'Sign in to MedLocum Academy to access your compliance training and CPD records.'
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  );
}
