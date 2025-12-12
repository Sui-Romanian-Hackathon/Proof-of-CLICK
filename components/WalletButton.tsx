'use client';

import { useWalletKit } from '@mysten/wallet-kit';
import { Wallet } from 'lucide-react';

export function WalletButton() {
  const { currentWallet, disconnect, isConnected, currentAccount, connect } = useWalletKit();

  if (isConnected && currentAccount) {
    const address = currentAccount.address;
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={() => disconnect()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
        >
          <Wallet className="w-5 h-5" />
          Disconnect Wallet
        </button>
        <div className="text-xs text-gray-400 text-center">
          {shortAddress}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect()}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
    >
      <Wallet className="w-5 h-5" />
      Connect Wallet
    </button>
  );
}

