'use client';

import { useWalletKit } from '@mysten/wallet-kit';
import { useEffect, useState } from 'react';
import { getSuiClient, formatSuiAmount } from '@/lib/sui';
import { Coins } from 'lucide-react';

export function WalletInfo() {
  const { currentAccount, isConnected } = useWalletKit();
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!isConnected || !currentAccount) {
        setBalance('0');
        return;
      }

      setLoading(true);
      try {
        const client = getSuiClient('testnet');
        const balanceData = await client.getBalance({
          owner: currentAccount.address,
        });
        setBalance(formatSuiAmount(balanceData.totalBalance));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setBalance('0');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [isConnected, currentAccount]);

  if (!isConnected || !currentAccount) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
      <Coins className="w-5 h-5 text-blue-400" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-400">Wallet Balance</span>
        <span className="text-sm font-semibold text-white">
          {loading ? '...' : `${balance} SUI`}
        </span>
      </div>
    </div>
  );
}


