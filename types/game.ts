export type Tier = 'free' | 'pro';

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  timeAllocated: number; // in seconds
}

export interface GameState {
  tier: Tier;
  totalTimeAllocated: number; // in seconds
  timeRemaining: number; // in seconds
  currentQuestionIndex: number;
  coins: number;
  consecutiveCorrect: number;
  questionsAnswered: number;
  gameStatus: 'idle' | 'playing' | 'timeout' | 'finished';
  startTime: number | null;
  questionStartTime: number | null;
  retriesRemaining: number;
  dailyResetTime: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export const ACHIEVEMENTS = {
  TEN_CONSECUTIVE: {
    id: 'ten_consecutive',
    name: 'Perfect Streak',
    description: 'Answer 10 questions correctly in a row',
  },
} as const;


