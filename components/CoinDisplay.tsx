'use client';

import { useGameStore } from '@/store/gameStore';
import { Coins } from 'lucide-react';

export function CoinDisplay() {
  const { coins, tier } = useGameStore();
  const coinColor = tier === 'pro' ? 'text-gold' : 'text-silver';

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
      <Coins className={`w-6 h-6 ${coinColor}`} />
      <span className="text-xl font-bold text-white">{coins}</span>
      <span className="text-sm text-gray-400">coins</span>
    </div>
  );
}


