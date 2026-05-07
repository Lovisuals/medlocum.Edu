'use client';

import { useState, useCallback } from 'react';

export function useAISession(sessionId: string) {
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (content: string): Promise<string> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/ai/sessions/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      return data.reply || '';
    } catch {
      return 'I apologise — I encountered an issue. Please try again.';
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return { sendMessage, loading };
}
