import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Course Catalogue — MedLocum Academy',
  description: 'Browse all mandatory compliance, clinical and CPD courses available on MedLocum Academy.'
};

export default function CataloguePage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 8 }}>
          Course Catalogue
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Browse mandatory compliance, role-specific clinical, and CPD elective modules.
        </p>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          id="catalogue-search"
          type="search"
          placeholder="Search courses…"
          className="input-field"
          style={{ maxWidth: 320 }}
        />
        <div className="tab-container">
          {['All', 'Mandatory', 'Clinical', 'CPD Electives'].map(label => (
            <button key={label} className={`tab-item${label === 'All' ? ' active' : ''}`}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20
        }}>
          <span style={{ fontSize: '1.1rem' }}>🚨</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-danger)' }}>Mandatory Compliance Required</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 2 }}>Complete all 12 mandatory modules before your first placement.</p>
          </div>
        </div>

        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-text-heading)' }}>
          Mandatory Compliance Modules
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { title: 'Health & Safety in Nigerian Clinics', duration: 45, pass: 80 },
            { title: 'Fire Safety & Emergency Response', duration: 30, pass: 80 },
            { title: 'Infection Prevention & Control (Level 1)', duration: 60, pass: 85 },
            { title: 'Manual Handling — Principles', duration: 45, pass: 80 },
            { title: 'Safeguarding Vulnerable Adults', duration: 90, pass: 85 },
            { title: 'Safeguarding Children in Nigeria', duration: 90, pass: 85 },
            { title: 'Equality, Diversity & Inclusion', duration: 45, pass: 80 },
            { title: 'Data Protection & NDPA for Healthcare', duration: 60, pass: 80 },
            { title: 'Mental Health Awareness', duration: 60, pass: 75 },
            { title: 'Ethics & Jurisprudence in Nigerian Practice', duration: 60, pass: 85 },
            { title: 'Medical Law & Consent in Nigeria', duration: 60, pass: 85 },
            { title: 'Duty of Candour & Medical Whistleblowing', duration: 45, pass: 80 },
          ].map((course, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', padding: 20 }}>
              <div style={{
                height: 6,
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent-green))',
                borderRadius: 'var(--radius-full)',
                marginBottom: 14
              }} />
              <span className="badge badge-overdue" style={{ marginBottom: 8 }}>Mandatory</span>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8, lineHeight: 1.4 }}>
                {course.title}
              </h3>
              <div style={{ display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span>⏱ {course.duration} min</span>
                <span>🎯 {course.pass}% pass</span>
              </div>
              <button className="btn-primary" style={{ marginTop: 14, width: '100%', padding: '8px', fontSize: '0.825rem' }}>
                Start Course
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
