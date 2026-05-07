'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAISession } from '@/hooks/use-ai-session';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatWindowProps {
  sessionId: string;
  assistantType: string;
}

const MODE_LABELS: Record<string, string> = {
  coaching_companion: 'Coaching Companion',
  personal_change_coach: 'Personal Change Coach',
  workplace_skills_tutor: 'Workplace People Skills Tutor',
  quiz_facilitator: 'Quiz Facilitator',
  learning_plan_generator: 'Learning Plan Generator',
  information_assistant: 'Information Assistant',
  dashboard_assistant: 'Dashboard Assistant'
};

export default function ChatWindow({ sessionId, assistantType }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const { sendMessage } = useAISession(sessionId);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const reply = await sendMessage(input.trim());

    const aiMsg: Message = { role: 'assistant', content: reply, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 600,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      background: '#fff',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '12px 16px',
        background: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
          {MODE_LABELS[assistantType] || assistantType}
        </p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-text-body)' }}>How can I help you today?</p>
              <p style={{ marginTop: 4, fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Type a message to begin the session.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: '0.875rem',
              background: msg.role === 'user' ? 'var(--color-primary)' : '#F3F4F6',
              color: msg.role === 'user' ? '#fff' : 'var(--color-text-body)'
            }}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              <p style={{ marginTop: 4, fontSize: '0.7rem', opacity: 0.6, textAlign: 'right' }}>
                {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#F3F4F6', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Typing…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', padding: 12, display: 'flex', gap: 8 }}>
        <input
          id="ai-chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message…"
          disabled={loading}
          className="input-field"
          style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
        />
        <button
          id="ai-chat-send"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="btn-primary"
          style={{ padding: '10px 20px' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
