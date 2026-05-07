import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Assistants — MedLocum Academy',
  description: 'Access your personal coaching companion, change coach, skills tutor, and learning plan generator.'
};

export default function AIAssistantsPage() {
  const assistants = [
    {
      id: 'coaching_companion',
      icon: '🧭',
      title: 'Coaching Companion',
      description: 'Professional development coaching using the GROW model. One question per turn.',
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)'
    },
    {
      id: 'personal_change_coach',
      icon: '🌱',
      title: 'Personal Change Coach',
      description: 'Motivational Interviewing to help you change behaviours and build specific skills.',
      color: '#8B5CF6',
      bg: '#F5F3FF'
    },
    {
      id: 'workplace_skills_tutor',
      icon: '👥',
      title: 'Workplace People Skills',
      description: 'Scenario-based tuition in communication, conflict resolution and person-centred care.',
      color: 'var(--color-accent-green)',
      bg: 'var(--color-success-bg)'
    },
    {
      id: 'learning_plan_generator',
      icon: '📅',
      title: 'Learning Plan Generator',
      description: 'AI-generated personalised learning pathways matched to your goals and the course catalogue.',
      color: '#F59E0B',
      bg: 'var(--color-warning-bg)'
    }
  ];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 8 }}>
          AI Assistants
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: 560 }}>
          Your personal AI coaching and learning team. Each assistant specialises in a different aspect of your professional development.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
        {assistants.map(a => (
          <a
            key={a.id}
            href={`/ai-assistants/${a.id}`}
            id={`assistant-card-${a.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="card" style={{ cursor: 'pointer', border: `1px solid ${a.color}22` }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 'var(--radius-md)',
                background: a.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: 16
              }}>
                {a.icon}
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
                {a.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                {a.description}
              </p>
              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.825rem', background: a.color }}>
                Start Session
              </button>
            </div>
          </a>
        ))}
      </div>

      <div className="card" style={{ background: 'var(--color-info-bg)', border: '1px solid var(--color-primary)33' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>
          M.E.D.I.C Values
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-body)', lineHeight: 1.6 }}>
          All AI assistants are guided by MedLocum Academy's M.E.D.I.C values:
          <strong> Mastery</strong> · <strong>Empathy</strong> · <strong>Diligence</strong> · <strong>Integrity</strong> · <strong>Confidence</strong>
        </p>
      </div>
    </div>
  );
}
