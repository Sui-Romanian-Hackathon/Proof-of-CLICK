'use client';

import { CoinDisplay } from '@/components/CoinDisplay';
import { TimerDisplay } from '@/components/TimerDisplay';
import { ClickingCoin } from '@/components/ClickingCoin';
import { QuestionCard } from '@/components/QuestionCard';
import { WalletButton } from '@/components/WalletButton';
import { CollectButton } from '@/components/CollectButton';
import { WalletInfo } from '@/components/WalletInfo';
import { TierSelector } from '@/components/TierSelector';
import { AdBanner } from '@/components/AdBanner';
import { Achievements } from '@/components/Achievements';
import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export default function Home() {
  const { gameStatus, resetDaily } = useGameStore();

  useEffect(() => {
    // Check for daily reset
    resetDaily();
  }, [resetDaily]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Sui Clicker Game
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <CoinDisplay />
              <TimerDisplay />
            </div>

            <TierSelector />

            {gameStatus === 'idle' && (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Click the coin to start!
                </h2>
                <ClickingCoin />
              </div>
            )}

            {gameStatus === 'playing' && (
              <div className="space-y-6">
                <ClickingCoin />
                <QuestionCard />
              </div>
            )}

            {(gameStatus === 'timeout' || gameStatus === 'finished') && (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {gameStatus === 'timeout'
                    ? 'Time is up!'
                    : 'Game Finished!'}
                </h2>
                <p className="text-gray-400 mb-4">
                  You can collect your coins or play again tomorrow!
                </p>
                <ClickingCoin />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WalletButton />
              <CollectButton />
            </div>
            <div className="flex justify-center mt-2">
              <WalletInfo />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Achievements />
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">
                How to Play
              </h3>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Click the coin to start</li>
                <li>• Answer questions quickly to gain time</li>
                <li>• Earn coins based on your speed</li>
                <li>• Get achievements for streaks</li>
                <li>• Collect coins to your wallet</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />
    </main>
  );
}

