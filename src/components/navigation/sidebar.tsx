'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Home', href: '/home', icon: '🏠' },
  { label: 'Placement Readiness', href: '/placement/readiness', icon: '✅' },
  { label: 'Catalogue', href: '/catalogue', icon: '📚' },
  { label: 'Learning Log', href: '/learning-log', icon: '📋' },
  { label: 'My Objectives', href: '/objectives', icon: '🎯' },
  { label: 'Resources', href: '/resources', icon: '📁' },
  { label: 'Learning Plans', href: '/learning-plans', icon: '📅' },
  { label: 'News', href: '/news', icon: '📰' },
  { label: "Who's Who", href: '/whos-who', icon: '👥' },
  { label: 'Search', href: '/search', icon: '🔍' },
  { label: 'Help', href: '/help', icon: '❓' },
  { label: 'AI Assistants', href: '/ai-assistants', icon: '✨' },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        id="mobile-menu-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.1rem'
        }}
        className="md-hidden"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.5)' }}
        />
      )}

      <nav
        id="main-sidebar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 45,
          height: '100vh',
          width: 260,
          background: 'var(--color-surface-subtle)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : undefined,
          transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          background: 'var(--color-primary)',
          gap: 10
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}>🏥</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>MedLocum</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.7rem' }}>Academy</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {menuItems.map(item => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    id={`nav-${item.href.replace('/', '')}`}
                    onClick={() => setMobileOpen(false)}
                    className={`sidebar-item${isActive ? ' active' : ''}`}
                    style={isActive ? { borderLeft: '3px solid var(--color-primary)' } : {}}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ padding: '12px 12px 24px' }}>
          <Link
            href="/logout"
            className="sidebar-item"
            id="nav-logout"
          >
            <span>⏻</span>
            Log Off
          </Link>
        </div>
      </nav>
    </>
  );
}
