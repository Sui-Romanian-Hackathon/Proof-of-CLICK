import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

// Initialize Sui client
export const getSuiClient = (network: 'mainnet' | 'testnet' | 'devnet' = 'testnet') => {
  return new SuiClient({
    url: getFullnodeUrl(network),
  });
};

// Helper function to format SUI amounts
export const formatSuiAmount = (amount: bigint | string): string => {
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
  return (Number(amountBigInt) / 1e9).toFixed(4);
};

// Helper function to parse SUI amounts
export const parseSuiAmount = (amount: string): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * 1e9));
};


