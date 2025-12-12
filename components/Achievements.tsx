'use client';

import { useGameStore } from '@/store/gameStore';
import { Trophy } from 'lucide-react';

export function Achievements() {
  const { achievements, consecutiveCorrect } = useGameStore();

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Achievements
      </h3>
      <div className="space-y-2">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg ${
              achievement.unlocked
                ? 'bg-green-900 border border-green-600'
                : 'bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-white">{achievement.name}</div>
                <div className="text-sm text-gray-400">
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && (
                <span className="text-green-400 text-sm">✓ Unlocked</span>
              )}
            </div>
          </div>
        ))}
        <div className="text-sm text-gray-400 mt-2">
          Current streak: {consecutiveCorrect} consecutive correct
        </div>
      </div>
    </div>
  );
}


