'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Coins } from 'lucide-react';

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

export function ClickingCoin() {
  const { gameStatus, startGame, coins, tier } = useGameStore();
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);
  const coinColor = tier === 'pro' ? 'text-gold' : 'text-silver';
  const coinBgColor = tier === 'pro' ? 'bg-yellow-600' : 'bg-gray-500';

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameStatus === 'idle') {
      startGame();
      return;
    }

    if (gameStatus !== 'playing') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newEffect: ClickEffect = {
      id: Date.now(),
      x,
      y,
    };

    setClickEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setClickEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id));
    }, 1000);
  };

  return (
    <div
      className="relative w-full h-64 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-32 h-32 rounded-full ${coinBgColor} flex items-center justify-center shadow-2xl`}
      >
        <Coins className={`w-16 h-16 ${coinColor}`} />
      </motion.div>

      {clickEffects.map((effect) => (
        <motion.div
          key={effect.id}
          initial={{ opacity: 1, scale: 0, x: effect.x, y: effect.y }}
          animate={{ opacity: 0, scale: 2, y: effect.y - 50 }}
          className="absolute pointer-events-none"
        >
          <div className={`text-2xl font-bold ${coinColor}`}>+1</div>
        </motion.div>
      ))}
    </div>
  );
}


