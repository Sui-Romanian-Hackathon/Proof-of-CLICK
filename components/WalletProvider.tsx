'use client';

import { WalletKitProvider } from '@mysten/wallet-kit';
import { ReactNode } from 'react';

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WalletKitProvider
      features={['standard:connect', 'standard:events']}
      autoConnect={false}
    >
      {children}
    </WalletKitProvider>
  );
}

