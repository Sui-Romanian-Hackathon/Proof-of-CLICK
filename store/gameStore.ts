import { create } from 'zustand';
import { GameState, Question, Tier, Achievement } from '@/types/game';

interface GameStore extends GameState {
  questions: Question[];
  achievements: Achievement[];
  setTier: (tier: Tier) => void;
  startGame: () => void;
  answerQuestion: (answerIndex: number) => boolean;
  nextQuestion: () => void;
  retryQuestion: () => void;
  tickTimer: () => void;
  collectCoins: () => void;
  checkAchievements: () => void;
  resetDaily: () => void;
  setQuestions: (questions: Question[]) => void;
}

const getDailyResetTime = () => {
  const now = Date.now();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime();
};

const getInitialState = (tier: Tier = 'free'): Partial<GameState> => ({
  tier,
  totalTimeAllocated: tier === 'free' ? 600 : 900, // 10 or 15 minutes
  timeRemaining: tier === 'free' ? 600 : 900,
  currentQuestionIndex: 0,
  coins: 0,
  consecutiveCorrect: 0,
  questionsAnswered: 0,
  gameStatus: 'idle',
  startTime: null,
  questionStartTime: null,
  retriesRemaining: tier === 'free' ? 1 : 5,
  dailyResetTime: getDailyResetTime(),
});

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    timeAllocated: 60,
  },
  {
    id: 2,
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    timeAllocated: 120,
  },
  {
    id: 3,
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
    timeAllocated: 180,
  },
  {
    id: 4,
    text: 'Who wrote Romeo and Juliet?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswer: 1,
    timeAllocated: 240,
  },
  {
    id: 5,
    text: 'What is the largest ocean?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 3,
    timeAllocated: 300,
  },
];

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState('free'),
  questions: sampleQuestions,
  achievements: [
    {
      id: 'ten_consecutive',
      name: 'Perfect Streak',
      description: 'Answer 10 questions correctly in a row',
      unlocked: false,
    },
  ],

  setTier: (tier) => {
    const state = getInitialState(tier);
    set({ ...state, tier });
  },

  setQuestions: (questions) => set({ questions }),

  startGame: () => {
    const state = get();
    if (state.gameStatus === 'idle' || state.gameStatus === 'finished') {
      const now = Date.now();
      set({
        gameStatus: 'playing',
        startTime: now,
        questionStartTime: now,
        currentQuestionIndex: 0,
        timeRemaining: state.totalTimeAllocated,
      });
    }
  },

  answerQuestion: (answerIndex: number) => {
    const state = get();
    if (state.gameStatus !== 'playing') return false;

    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return false;

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const now = Date.now();
    const timeSpent = state.questionStartTime
      ? Math.floor((now - state.questionStartTime) / 1000)
      : currentQuestion.timeAllocated;

    if (isCorrect) {
      // Calculate time gained based on speed
      const timeGained = Math.max(0, currentQuestion.timeAllocated - timeSpent);
      const coinsEarned = Math.floor(timeGained / 10) + 1; // 1 coin per 10 seconds saved + base

      set({
        coins: state.coins + coinsEarned,
        consecutiveCorrect: state.consecutiveCorrect + 1,
        questionsAnswered: state.questionsAnswered + 1,
        timeRemaining: Math.min(
          state.totalTimeAllocated,
          state.timeRemaining + timeGained
        ),
      });

      get().checkAchievements();
      return true;
    } else {
      set({
        consecutiveCorrect: 0,
        questionsAnswered: state.questionsAnswered + 1,
      });
      return false;
    }
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex >= state.questions.length || state.timeRemaining <= 0) {
      set({ gameStatus: 'finished' });
      return;
    }

    set({
      currentQuestionIndex: nextIndex,
      questionStartTime: Date.now(),
    });
  },

  retryQuestion: () => {
    const state = get();
    if (state.retriesRemaining > 0 && state.gameStatus === 'playing') {
      set({
        retriesRemaining: state.retriesRemaining - 1,
        questionStartTime: Date.now(),
      });
      return true;
    }
    return false;
  },

  tickTimer: () => {
    const state = get();
    if (state.gameStatus === 'playing' && state.timeRemaining > 0) {
      const newTimeRemaining = state.timeRemaining - 1;
      if (newTimeRemaining <= 0) {
        set({ gameStatus: 'timeout', timeRemaining: 0 });
      } else {
        set({ timeRemaining: newTimeRemaining });
      }
    }
  },

  collectCoins: () => {
    const state = get();
    // This will be called when user clicks "Collect" button
    // The actual blockchain transaction will be handled separately
    return state.coins;
  },

  checkAchievements: () => {
    const state = get();
    const achievements = [...state.achievements];

    // Check for 10 consecutive correct answers
    if (state.consecutiveCorrect >= 10) {
      const achievement = achievements.find((a) => a.id === 'ten_consecutive');
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = Date.now();
        // Bonus coins for achievement
        set({
          achievements,
          coins: state.coins + 50,
        });
      }
    }

    set({ achievements });
  },

  resetDaily: () => {
    const state = get();
    const now = Date.now();
    if (now >= state.dailyResetTime) {
      const newState = getInitialState(state.tier);
      set({
        ...newState,
        tier: state.tier,
        dailyResetTime: getDailyResetTime(),
      });
    }
  },
}));


