import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search — MedLocum Academy',
  description: 'Search courses, resources and content across MedLocum Academy.'
};

export default function SearchPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 800 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 24 }}>Search</h1>
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <input id="global-search-input" type="search" placeholder="Search courses, resources, experts…" className="input-field" style={{ paddingLeft: 44, fontSize: '1rem' }} autoFocus />
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }}>🔍</span>
      </div>
      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', paddingTop: 60 }}>
        <p style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</p>
        <p style={{ fontWeight: 600, color: 'var(--color-text-body)' }}>Start typing to search</p>
        <p style={{ fontSize: '0.875rem', marginTop: 6 }}>Find courses, resources, and experts across MedLocum Academy.</p>
      </div>
    </div>
  );
}
