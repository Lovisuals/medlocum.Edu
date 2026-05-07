'use client';

import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface PlacementReadinessCardProps {
  compliance: {
    isReady: boolean;
    blockers: string[];
    mandatoryComplete: number;
    roleModulesComplete: number;
    assessedAt: string;
  };
}

export function PlacementReadinessCard({ compliance }: PlacementReadinessCardProps) {
  const router = useRouter();
  const { isReady, blockers, mandatoryComplete, roleModulesComplete } = compliance;

  return (
    <div 
      className="card" 
      style={{ 
        background: isReady ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
        borderColor: isReady ? 'var(--color-success)' : 'var(--color-warning)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-heading)' }}>
            Placement Readiness
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            MDCN/NMCN Compliance Status
          </p>
        </div>
        <Badge variant={isReady ? 'success' : 'warning'}>
          {isReady ? 'READY' : 'NOT READY'}
        </Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: '#fff', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Mandatory Modules</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{mandatoryComplete}</p>
        </div>
        <div style={{ background: '#fff', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Ethics Pass</p>
          <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{roleModulesComplete > 0 ? 'YES' : 'NO'}</p>
        </div>
      </div>

      {!isReady && blockers.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8 }}>
            Required Actions:
          </p>
          <ul style={{ paddingLeft: 16, margin: 0 }}>
            {blockers.map((blocker, idx) => (
              <li key={idx} style={{ fontSize: '0.7rem', color: 'var(--color-text-body)', marginBottom: 4 }}>
                {blocker}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button 
        className="btn-primary" 
        style={{ width: '100%', marginTop: 'auto' }}
        onClick={() => router.push('/placement/readiness')}
      >
        {isReady ? 'Download Certificate' : 'Complete Compliance'}
      </button>
    </div>
  );
}
