export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizAttemptData {
  userId: string;
  quizId: string;
  score: number;
  attemptNumber: number;
  questionsWrong: string[];
  passMark: number;
  maxAttempts: number;
}

export interface AdaptiveDecision {
  nextDifficulty: Difficulty;
  canProgress: boolean;
  remedialTopics: string[];
  unlockAdvanced: boolean;
  notifyManager: boolean;
  blockUntil: Date | null;
  message: string;
}

export function evaluateAdaptive(
  score: number,
  attemptNumber: number,
  passMark: number,
  maxAttempts: number,
  questionsWrong: string[] = []
): AdaptiveDecision {
  if (score >= 90) {
    return {
      nextDifficulty: 'hard',
      canProgress: true,
      remedialTopics: [],
      unlockAdvanced: true,
      notifyManager: false,
      blockUntil: null,
      message: `Excellent work. ${score}%. You have unlocked advanced content.`
    };
  }

  if (score >= passMark) {
    return {
      nextDifficulty: 'medium',
      canProgress: true,
      remedialTopics: questionsWrong,
      unlockAdvanced: false,
      notifyManager: false,
      blockUntil: null,
      message: `Well done. You passed with ${score}%. Review missed topics when you can.`
    };
  }

  if (attemptNumber < maxAttempts) {
    const cooldown = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const remaining = maxAttempts - attemptNumber;
    return {
      nextDifficulty: 'easy',
      canProgress: false,
      remedialTopics: questionsWrong,
      unlockAdvanced: false,
      notifyManager: false,
      blockUntil: cooldown,
      message: `You scored ${score}%, just below the ${passMark}% pass mark. ${remaining} attempt(s) remaining. Review the course content and try again after 24 hours.`
    };
  }

  return {
    nextDifficulty: 'easy',
    canProgress: false,
    remedialTopics: questionsWrong,
    unlockAdvanced: false,
    notifyManager: true,
    blockUntil: null,
    message: `You have reached the maximum attempts for this assessment. Your line manager has been notified. Please email ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'academy@medical.org.ng'} for support.`
  };
}

export function getDifficultyProfile(scoresByCategory: Record<string, number[]>): Record<string, Difficulty> {
  const profile: Record<string, Difficulty> = {};
  for (const [cat, scores] of Object.entries(scoresByCategory)) {
    if (!scores.length) { profile[cat] = 'medium'; continue; }
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    profile[cat] = avg >= 85 ? 'hard' : avg >= 70 ? 'medium' : 'easy';
  }
  return profile;
}

export async function notifyManager(userId: string, courseId: string): Promise<void> {
  console.log(`[NOTIFY] Manager notified: user=${userId} course=${courseId}`);
}
