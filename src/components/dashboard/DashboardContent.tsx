'use client';

import { useDashboard } from '@/hooks/use-dashboard';
import { PlacementReadinessCard } from '@/components/dashboard/PlacementReadinessCard';
import { Badge } from '@/components/ui/badge';

export function DashboardContent() {
  const { data, compliance, loading, error } = useDashboard();

  if (loading) {
    return (
      <div style={{ padding: '32px' }}>
        <div className="skeleton" style={{ height: 200, marginBottom: 32, borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return <div style={{ padding: '32px', color: 'var(--color-danger)' }}>Error loading dashboard: {error}</div>;
  }

  return (
    <div style={{ padding: '32px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          background: 'var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 32px',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
              {data.greeting}, Practitioner
            </h1>
            <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
              Your compliance. Your career. Fully online.
            </p>
            <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: '0.75rem', opacity: 0.75, flexWrap: 'wrap' }}>
              <span>M · Mastery</span>
              <span>E · Empathy</span>
              <span>D · Diligence</span>
              <span>I · Integrity</span>
              <span>C · Confidence</span>
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            minWidth: 200
          }}>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: 4 }}>Placement Status</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              {compliance?.isReady ? 'READY' : 'NOT READY'}
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: 4 }}>
              {compliance?.mandatoryComplete} of mandatory modules complete
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
        <PlacementReadinessCard compliance={compliance} />
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: `var(--color-accent-green)18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            flexShrink: 0
          }}>⏱️</div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>CPD Hours</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-accent-green)', lineHeight: 1.1 }}>
              {data.compliance?.cmeUnits || 0}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>logged this year</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: `var(--color-danger)18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            flexShrink: 0
          }}>🚨</div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Overdue</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)', lineHeight: 1.1 }}>
              {data.dueSoon?.filter((c: any) => c.status === 'overdue').length || 0}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>require attention</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-md)',
            background: `#8B5CF618`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            flexShrink: 0
          }}>✅</div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Completed</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8B5CF6', lineHeight: 1.1 }}>
              {data.recentlyCompleted?.length || 0}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>recently finished</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-text-heading)' }}>
            Due Soon / Overdue
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.dueSoon?.length > 0 ? data.dueSoon.map((course: any) => (
              <div key={course.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{course.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{course.category} · {course.durationMins} mins</p>
                </div>
                <Badge variant={course.status === 'overdue' ? 'overdue' : 'warning'}>
                  {course.status === 'overdue' ? 'OVERDUE' : 'DUE SOON'}
                </Badge>
              </div>
            )) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>
                No courses due soon. Great job!
              </p>
            )}
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-text-heading)' }}>
            Recently Completed
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {data.recentlyCompleted?.length > 0 ? data.recentlyCompleted.map((course: any) => (
              <div key={course.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{course.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{course.category} · {new Date(course.completedAt).toLocaleDateString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1rem' }}>{course.score}%</p>
                  <p style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>SCORE</p>
                </div>
              </div>
            )) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>
                No recently completed courses.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
