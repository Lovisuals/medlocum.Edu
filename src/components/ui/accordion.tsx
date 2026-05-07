'use client';

import { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <div key={item.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <button
            id={`accordion-${item.id}`}
            onClick={() => setOpen(open === item.id ? null : item.id)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              background: 'var(--color-surface-subtle)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              fontFamily: 'var(--font-family)',
              textAlign: 'left'
            }}
          >
            {item.title}
            <span style={{ transition: 'transform 200ms', transform: open === item.id ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
          </button>
          {open === item.id && (
            <div style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--color-text-body)' }}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
