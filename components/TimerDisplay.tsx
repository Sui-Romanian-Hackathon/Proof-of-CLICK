'use client';

import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';
import { Clock } from 'lucide-react';

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function TimerDisplay() {
  const { timeRemaining, gameStatus, tickTimer } = useGameStore();

  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        tickTimer();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStatus, tickTimer]);

  const getStatusText = () => {
    switch (gameStatus) {
      case 'idle':
        return 'Start Clicking';
      case 'playing':
        return 'Click Click';
      case 'timeout':
        return 'Clicking is over';
      case 'finished':
        return 'Game Finished';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
        <Clock className="w-5 h-5 text-blue-400" />
        <span className="text-xl font-bold text-white">
          {formatTime(timeRemaining)}
        </span>
      </div>
      <div className="text-sm text-gray-400">{getStatusText()}</div>
    </div>
  );
}


