'use client';

import { useState, useEffect, useCallback } from 'react';

export function useQuiz(courseId: string) {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/v1/courses/${courseId}/quiz`);
        if (!res.ok) throw new Error('Failed to load quiz');
        const data = await res.json();
        setQuiz(data);
        setQuestions(data.questions);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [courseId]);

  const startAttempt = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/courses/${courseId}/quiz/start`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start attempt');
      }
      const data = await res.json();
      setAttemptId(data.attempt_id);
      return data.attempt_id;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [courseId]);

  const setResponse = useCallback((questionId: string, answerId: string) => {
    setResponses(prev => ({ ...prev, [questionId]: answerId }));
  }, []);

  const submitQuiz = useCallback(async () => {
    if (!attemptId) return null;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/quiz-attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses })
      });
      if (!res.ok) throw new Error('Failed to submit quiz');
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [attemptId, responses]);

  return {
    quiz,
    questions,
    currentIndex,
    setCurrentIndex,
    responses,
    setResponse,
    startAttempt,
    submitQuiz,
    loading,
    error,
    attemptId
  };
}
