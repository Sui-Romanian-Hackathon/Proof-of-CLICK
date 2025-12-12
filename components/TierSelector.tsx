'use client';

import { useGameStore } from '@/store/gameStore';
import { Crown, User } from 'lucide-react';

export function TierSelector() {
  const { tier, setTier, gameStatus } = useGameStore();

  if (gameStatus !== 'idle') return null;

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => setTier('free')}
        className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
          tier === 'free'
            ? 'bg-gray-700 text-white border-2 border-gray-500'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <User className="w-5 h-5" />
        Free
      </button>
      <button
        onClick={() => setTier('pro')}
        className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
          tier === 'pro'
            ? 'bg-yellow-600 text-white border-2 border-yellow-400'
            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
        }`}
      >
        <Crown className="w-5 h-5" />
        Pro
      </button>
    </div>
  );
}


