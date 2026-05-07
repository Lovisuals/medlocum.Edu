'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function PlacementReadinessPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issuing, setIssuing] = useState(false);
  const router = useRouter();

  const fetchReadiness = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/placement/readiness');
      if (!res.ok) throw new Error('Failed to fetch readiness status');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setIssuing(true);
    try {
      const res = await fetch('/api/v1/placement/certificate');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to issue certificate');
      }
      const cert = await res.json();
      
      // In a real app, we would trigger a PDF download.
      // For this implementation, we'll show the verification URL.
      window.open(cert.verificationUrl, '_blank');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIssuing(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  if (loading) return <div style={{ padding: 48 }}>Loading compliance profile...</div>;
  if (error) return <div style={{ padding: 48, color: 'var(--color-danger)' }}>Error: {error}</div>;

  const { isReady, blockers, complianceSnapshot } = data;

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-heading)' }}>
              Placement Readiness
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Nigerian Medical Ecosystem Compliance Registry (MDCN/NMCN)
            </p>
          </div>
          <Badge variant={isReady ? 'success' : 'warning'} className="text-lg px-6 py-2">
            {isReady ? 'READY FOR PLACEMENT' : 'ACTION REQUIRED'}
          </Badge>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section className="card">
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20 }}>Compliance Checklist</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <CheckItem 
                  label="MDCN/NMCN License Verification" 
                  status={complianceSnapshot.license.status === 'verified' ? 'success' : 'pending'}
                  sub={complianceSnapshot.license.body + ' ' + (complianceSnapshot.license.status === 'verified' ? 'Verified' : 'Pending Verification')}
                />
                <CheckItem 
                  label="CME Unit Threshold" 
                  status={complianceSnapshot.cme.isSufficient ? 'success' : 'warning'}
                  sub={`${complianceSnapshot.cme.earned} of ${complianceSnapshot.cme.required} units earned this year`}
                />
                <CheckItem 
                  label="Ethics & Jurisprudence Module" 
                  status={complianceSnapshot.modules.ethicsComplete ? 'success' : 'warning'}
                  sub={complianceSnapshot.modules.ethicsComplete ? 'Module Passed' : 'Incomplete'}
                />
                <CheckItem 
                  label="Mandatory Training Courses" 
                  status={complianceSnapshot.modules.mandatoryCoursesComplete ? 'success' : 'warning'}
                  sub={complianceSnapshot.modules.mandatoryCoursesComplete ? 'All completed' : 'Incomplete'}
                />
              </div>
            </section>

            {blockers.length > 0 && (
              <section className="card" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-bg)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-danger)', marginBottom: 12 }}>
                  Outstanding Blockers
                </h2>
                <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {blockers.map((b: string, i: number) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: 'var(--color-text-body)' }}>{b}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ textAlign: 'center', background: 'var(--color-surface-subtle)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📜</div>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Readiness Certificate</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
                Once all compliance criteria are met, you can issue your verifiable placement certificate.
              </p>
              <button 
                className="btn-primary" 
                style={{ width: '100%' }} 
                disabled={!isReady || issuing}
                onClick={handleDownload}
              >
                {issuing ? 'Issuing...' : isReady ? 'Issue Certificate' : 'Compliance Locked'}
              </button>
            </div>

            <div className="card" style={{ background: 'var(--color-info-bg)', borderColor: 'var(--color-info)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-info)', marginBottom: 8 }}>
                Regulatory Support
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-body)' }}>
                Issues with your license verification? Contact our MDCN/NMCN coordination desk at compliance@medlocumjobs.ng
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ label, status, sub }: { label: string, status: 'success' | 'warning' | 'pending', sub: string }) {
  const icon = status === 'success' ? '✅' : status === 'warning' ? '⚠️' : '⏳';
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ fontSize: '1.2rem' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{label}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{sub}</p>
      </div>
      <Badge variant={status === 'success' ? 'success' : 'warning'}>
        {status.toUpperCase()}
      </Badge>
    </div>
  );
}
