'use client';

import { useWalletKit } from '@mysten/wallet-kit';
// import { Transaction } from '@mysten/sui.js/transactions'; // Uncomment when ready to use blockchain transactions
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, XCircle } from 'lucide-react';

// TODO: Replace with your actual game package ID and module
const GAME_PACKAGE_ID = '0xYOUR_PACKAGE_ID';
const GAME_MODULE = 'clicker_game';
const COLLECT_FUNCTION = 'collect_coins';

export function CollectButton() {
  const { signAndExecuteTransaction, isConnected, currentAccount } = useWalletKit();
  const { coins, collectCoins } = useGameStore();
  const [isCollecting, setIsCollecting] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [txDigest, setTxDigest] = useState<string | null>(null);

  const handleCollect = async () => {
    if (!isConnected || !currentAccount || coins === 0) return;

    setIsCollecting(true);
    setTxStatus('idle');
    setTxDigest(null);

    try {
      const coinsToCollect = collectCoins();

      // For demo purposes, simulate collection without blockchain transaction
      // TODO: Replace with actual smart contract call when ready
      // 
      // To enable blockchain transactions, uncomment below and set up your smart contract:
      //
      // const tx = new Transaction();
      // tx.moveCall({
      //   target: `${GAME_PACKAGE_ID}::${GAME_MODULE}::${COLLECT_FUNCTION}`,
      //   arguments: [
      //     tx.pure.u64(coinsToCollect),
      //     tx.pure.address(currentAccount.address),
      //   ],
      // });
      // const result = await signAndExecuteTransaction({
      //   transaction: tx,
      //   options: { showEffects: true, showEvents: true },
      // });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate successful collection
      setTxStatus('success');
      
      // Reset coins after successful collection
      useGameStore.setState({ coins: 0 });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setTxStatus('idle');
        setTxDigest(null);
      }, 5000);
    } catch (error: any) {
      console.error('Failed to collect coins:', error);
      setTxStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setTxStatus('idle');
      }, 5000);
    } finally {
      setIsCollecting(false);
    }
  };

  const getButtonContent = () => {
    if (isCollecting) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Collecting...
        </>
      );
    }
    if (txStatus === 'success') {
      return (
        <>
          <CheckCircle className="w-5 h-5" />
          Collected!
        </>
      );
    }
    if (txStatus === 'error') {
      return (
        <>
          <XCircle className="w-5 h-5" />
          Failed
        </>
      );
    }
    return (
      <>
        <Send className="w-5 h-5" />
        Collect (Send to Wallet)
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <motion.button
        onClick={handleCollect}
        disabled={!isConnected || coins === 0 || isCollecting}
        whileHover={!isCollecting && coins > 0 ? { scale: 1.05 } : {}}
        whileTap={!isCollecting && coins > 0 ? { scale: 0.95 } : {}}
        className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
          !isConnected || coins === 0 || isCollecting
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : txStatus === 'success'
            ? 'bg-green-600 text-white'
            : txStatus === 'error'
            ? 'bg-red-600 text-white'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {getButtonContent()}
      </motion.button>
      {txDigest && (
        <a
          href={`https://suiexplorer.com/txblock/${txDigest}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 text-center"
        >
          View on Explorer
        </a>
      )}
    </div>
  );
}

