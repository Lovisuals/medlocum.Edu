'use client';

import { useState, useEffect } from 'react';
import { useQuiz } from '@/hooks/use-quiz';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import Link from 'next/link';

interface QuizPlayerProps {
  courseId: string;
}

export default function QuizPlayer({ courseId }: QuizPlayerProps) {
  const {
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
  } = useQuiz(courseId);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [attemptStarted, setAttemptStarted] = useState(false);

  const currentQuestion = questions?.[currentIndex];

  const handleStart = async () => {
    const id = await startAttempt();
    if (id) setAttemptStarted(true);
  };

  const handleSelect = (answerId: string) => {
    if (feedback) return;
    setSelectedAnswer(answerId);
  };

  const handleConfirm = () => {
    if (!selectedAnswer || !currentQuestion) return;

    setResponse(currentQuestion.id, selectedAnswer);
    const correct = currentQuestion.answers.find((a: any) => a.isCorrect);
    setFeedback({
      isCorrect: selectedAnswer === correct?.id,
      explanation: currentQuestion.explanation || ''
    });
  };

  const handleNext = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    if (currentIndex < (questions?.length || 0) - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    const res = await submitQuiz();
    if (res) setFinalResult(res);
  };

  if (loading && !attemptStarted) return <div className="p-8 text-center">Loading assessment…</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  if (!attemptStarted) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <h2 className="mb-4 text-xl font-bold">{quiz?.title || 'Course Assessment'}</h2>
        <p className="mb-6 text-sm text-gray-600">
          Pass mark: {quiz?.passMark}% | Maximum attempts: {quiz?.maxAttempts}
        </p>
        <Button onClick={handleStart} className="w-full">Start Assessment</Button>
      </div>
    );
  }

  if (finalResult) {
    const isPassed = finalResult.passed;
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <h2 className="mb-2 text-xl font-bold">Assessment Complete</h2>
        <p className={`mb-6 text-4xl font-extrabold ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
          {finalResult.score}%
        </p>
        <div className={`mb-6 rounded-lg p-4 text-sm ${isPassed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {isPassed 
            ? 'Well done! You have passed this assessment. Your completion has been recorded.' 
            : 'You did not quite reach the pass mark this time. Please review the content and try again.'}
        </div>
        <div className="space-y-3 text-left">
          {finalResult.feedback.map((f: any, i: number) => (
            <div key={i} className={`rounded-md p-3 text-xs ${f.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-semibold">{f.questionBody}</p>
              <p className="mt-1 opacity-80">{f.explanation}</p>
            </div>
          ))}
        </div>
        <Link href="/home" style={{ width: '100%', display: 'block' }}>
          <Button className="mt-8 w-full">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="card mx-auto max-w-lg p-8">
      <div className="mb-6">
        <ProgressBar value={progress} label={`Question ${currentIndex + 1} of ${questions.length}`} />
      </div>
      
      <h3 className="mb-6 text-lg font-semibold leading-snug">{currentQuestion.body}</h3>

      <div className="space-y-3">
        {currentQuestion.answers.map((answer: any) => {
          const isSelected = selectedAnswer === answer.id;
          const isRevealed = feedback !== null;
          const isCorrect = answer.isCorrect;

          let classes = "input-field text-left cursor-pointer transition-all border-1.5 ";
          if (isRevealed) {
            if (isCorrect) classes += "border-green-500 bg-green-50 ";
            else if (isSelected) classes += "border-red-500 bg-red-50 ";
            classes += "cursor-default ";
          } else if (isSelected) {
            classes += "border-primary bg-primary-light ";
          }

          return (
            <button
              key={answer.id}
              onClick={() => handleSelect(answer.id)}
              disabled={isRevealed}
              className={classes}
              style={{ display: 'block', width: '100%' }}
            >
              {answer.body}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`mt-6 rounded-lg p-4 text-sm ${feedback.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-bold">{feedback.isCorrect ? '✓ Correct' : '✗ Incorrect'}</p>
          <p className="mt-1">{feedback.explanation}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        {!feedback ? (
          <Button onClick={handleConfirm} disabled={!selectedAnswer}>Confirm Answer</Button>
        ) : currentIndex < questions.length - 1 ? (
          <Button onClick={handleNext}>Next Question</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit Assessment</Button>
        )}
      </div>
    </div>
  );
}
