'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function QuestionCard() {
  const {
    questions,
    currentQuestionIndex,
    gameStatus,
    answerQuestion,
    nextQuestion,
    retryQuestion,
    retriesRemaining,
  } = useGameStore();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (gameStatus !== 'playing' || currentQuestionIndex >= questions.length) {
    return null;
  }

  const question = questions[currentQuestionIndex];
  const timeAllocated = question.timeAllocated;

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const correct = answerQuestion(answerIndex);
    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      nextQuestion();
    }, 2000);
  };

  const handleRetry = () => {
    if (retryQuestion()) {
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-400">
            {timeAllocated}s allocated
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-6">{question.text}</h2>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            const showCorrect = showResult && isCorrectAnswer;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  showCorrect
                    ? 'bg-green-600 text-white'
                    : showWrong
                    ? 'bg-red-600 text-white'
                    : isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
        {showResult && !isCorrect && retriesRemaining > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            Retry ({retriesRemaining} remaining)
          </motion.button>
        )}
      </div>
    </div>
  );
}


