import { verifyCertificate } from '@/lib/services/CertificateService';
import { Badge } from '@/components/ui/badge';

interface VerifyPageProps {
  params: { serial: string };
  searchParams: { sig: string };
}

export default async function VerifyPage({ params, searchParams }: VerifyPageProps) {
  const { serial } = params;
  const { sig } = searchParams;

  const result = await verifyCertificate(serial, sig);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--color-surface-subtle)',
      padding: '24px'
    }}>
      <div className="card" style={{ 
        maxWidth: 500, 
        width: '100%', 
        textAlign: 'center',
        padding: '48px 32px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 24 }}>
          {result.isValid ? '✅' : '❌'}
        </div>
        
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
          {result.isValid ? 'Certificate Verified' : 'Verification Failed'}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 32 }}>
          Medical Locum Jobs Academy — Nigerian Medical Registry
        </p>

        {result.isValid ? (
          <div style={{ textAlign: 'left', background: '#fff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Recipient</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{result.recipientName}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Certificate Type</p>
              <Badge variant="info">{result.certificateType.replace('_', ' ')}</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Issued</p>
                <p style={{ fontSize: '0.9rem' }}>{new Date(result.issuedAt).toLocaleDateString('en-NG')}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Expires</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-danger)' }}>{new Date(result.expiresAt).toLocaleDateString('en-NG')}</p>
              </div>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Serial Number</p>
              <code style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>{result.serialNumber}</code>
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--color-danger-bg)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger)' }}>
            <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', fontWeight: 600 }}>
              {result.invalidReason || 'This certificate is invalid or has been tampered with.'}
            </p>
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            This is an official verification page for the Medical Locum Jobs Academy. 
            For inquiries, contact compliance@medlocumjobs.ng
          </p>
        </div>
      </div>
    </div>
  );
}
