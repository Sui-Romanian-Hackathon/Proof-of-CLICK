'use client';

import { useGameStore } from '@/store/gameStore';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function AdBanner() {
  const { tier, gameStatus } = useGameStore();
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Show ad after each quiz completion (when game finishes)
    if (tier === 'free' && gameStatus === 'finished') {
      setShowAd(true);
    }
  }, [gameStatus, tier]);

  if (tier === 'pro' || !showAd) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={() => setShowAd(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Advertisement</h3>
          <div className="bg-gray-700 h-64 rounded-lg flex items-center justify-center mb-4">
            <p className="text-gray-400">Ad Content Here</p>
          </div>
          <p className="text-sm text-gray-400">
            Upgrade to Pro to remove ads!
          </p>
        </div>
      </div>
    </div>
  );
}


