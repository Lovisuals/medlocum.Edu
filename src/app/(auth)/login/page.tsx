'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Login failed. Please try again.');
      return;
    }

    router.push('/home');
  };

  return (
    <div style={{ width: '100%', maxWidth: 440, padding: '24px 16px' }}>
      <div className="card" style={{ borderRadius: 'var(--radius-lg)', padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            marginBottom: 16,
            fontSize: '1.5rem'
          }}>🏥</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 4 }}>
            MedLocum Academy
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Your compliance. Your career. Fully online.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label htmlFor="email-input" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-body)', marginBottom: 6 }}>
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password-input" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-body)', marginBottom: 6 }}>
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-field"
            />
          </div>

          {error && (
            <div style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: 8, padding: '12px 24px' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 0 16px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>
          <button
            id="sso-login"
            className="btn-secondary"
            style={{ width: '100%' }}
            onClick={() => window.location.href = '/api/v1/auth/sso/office365'}
          >
            Sign in with Office 365
          </button>
        </div>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Need help? <a href="mailto:support@medlocumjobs.ng">support@medlocumjobs.ng</a>
        </p>
      </div>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        Compliant with MDCN · NMCN · NDPA (Nigeria) · FMoH
      </p>
    </div>
  );
}
