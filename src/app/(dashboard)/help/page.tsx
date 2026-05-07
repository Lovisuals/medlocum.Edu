import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help — MedLocum Academy',
  description: 'Find answers to common questions about using MedLocum Academy.'
};

export default function HelpPage() {
  const faqs = [
    { q: 'How do I find my overdue courses?', a: 'Go to Home, then My Courses, then the Due Soon tab. Overdue items show a red OVERDUE badge.' },
    { q: 'How do I log manual training?', a: 'Go to Learning Log, then click Add new entry. Fill in the title, duration, date, and category.' },
    { q: 'How do I check my placement readiness?', a: 'Go to Home. Your placement readiness status is shown in the top banner. You need all 12 mandatory modules completed with no overdue items.' },
    { q: 'How do I change my password?', a: 'Click your profile icon, then Edit Profile, then Change Password. For name or email changes, email academy@medlocumjobs.com.' },
    { q: 'Who do I contact for technical support?', a: 'Email academy@medlocumjobs.com for both training queries and technical support.' },
    { q: 'How do I find upcoming events?', a: 'Go to Catalogue, then the Events tab, or see the Home dashboard Upcoming Events section.' },
    { q: 'How do I add a learning objective?', a: 'Go to My Objectives, then click the "+ New Objective" button.' },
    { q: 'What is the pass mark for mandatory modules?', a: 'Pass marks vary by module: 75%–90%. You have 3 attempts per module. Details are shown on each course page.' },
    { q: 'How do I track my CPD hours?', a: 'Go to Learning Log. Course completions are logged automatically. Add manual entries for external training.' },
    { q: 'How do I start an AI coaching session?', a: 'Go to AI Assistants and choose the Coaching Companion, Change Coach, Skills Tutor, or Learning Plan Generator.' },
  ];

  return (
    <div style={{ padding: '32px', maxWidth: 800 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 8 }}>Help & FAQ</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 32, fontSize: '0.9rem' }}>
        Find answers to common questions. Still stuck? Email <a href="mailto:academy@medlocumjobs.com">academy@medlocumjobs.com</a>.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((faq, i) => (
          <details key={i} style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}>
            <summary
              id={`faq-${i}`}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--color-text-heading)',
                background: 'var(--color-surface-subtle)',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {faq.q}
              <span style={{ color: 'var(--color-primary)', fontSize: '1.1rem' }}>+</span>
            </summary>
            <div style={{ padding: '14px 20px', fontSize: '0.875rem', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="card" style={{ marginTop: 32, background: 'var(--color-primary)', border: 'none' }}>
        <p style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>Still need help?</p>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: 14 }}>
          Our support team is here for both training queries and technical issues.
        </p>
        <a
          href="mailto:academy@medlocumjobs.com"
          className="btn-secondary"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}
        >
          📧 academy@medlocumjobs.com
        </a>
      </div>
    </div>
  );
}
