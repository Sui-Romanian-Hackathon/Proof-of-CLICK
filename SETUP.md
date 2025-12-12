# Setup Instructions

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Sui Wallet Integration

### Current Implementation

The game includes full Sui wallet integration:

1. **Wallet Connection**: Users can connect their Sui wallet using the "Connect Wallet" button
2. **Balance Display**: Shows the connected wallet's SUI balance
3. **Coin Collection**: Collects earned coins to the wallet via blockchain transaction

### Wallet Setup

1. Install a Sui wallet extension (e.g., Sui Wallet, Ethos Wallet)
2. Create or import a wallet
3. Connect to Sui testnet (for testing)
4. Click "Connect Wallet" in the game

### Blockchain Transaction

The `CollectButton` component handles blockchain transactions:

- **Current Implementation**: Transfers SUI as a placeholder (for testing)
- **Production**: Needs to be updated with your custom coin smart contract

See `SMART_CONTRACT_SETUP.md` for details on integrating your smart contract.

## Features Implemented

✅ **Kahoot Style Timing**
- Question 1: 1 minute allocated
- Question 2: 2 minutes allocated
- And so on...
- Speed bonus: Faster answers = more time gained

✅ **Achievements**
- 10 consecutive correct answers = 50 coin bonus

✅ **UI Components**
- Clicking effects with animations
- Timer display with status labels
- Coin counter (Silver for Free, Gold for Pro)
- Wallet connection button
- Collect button with transaction status

✅ **Free Tier**
- Ads after each quiz
- 1 question retry
- Silver coin design
- 10 minutes allocated time

✅ **Pro Tier**
- No ads
- 5 question retries
- Gold coin design
- 15 minutes allocated time

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with wallet provider
│   ├── page.tsx            # Main game page
│   └── globals.css         # Global styles
├── components/
│   ├── WalletProvider.tsx  # Sui wallet provider wrapper
│   ├── WalletButton.tsx    # Connect/disconnect wallet
│   ├── WalletInfo.tsx      # Display wallet balance
│   ├── CollectButton.tsx   # Collect coins via blockchain
│   ├── CoinDisplay.tsx     # Coin counter display
│   ├── TimerDisplay.tsx   # Timer with status
│   ├── ClickingCoin.tsx    # Main clickable coin
│   ├── QuestionCard.tsx   # Question display and answers
│   ├── TierSelector.tsx   # Free/Pro tier selection
│   ├── AdBanner.tsx       # Ad display (free tier)
│   └── Achievements.tsx   # Achievements display
├── store/
│   └── gameStore.ts       # Game state management (Zustand)
├── lib/
│   └── sui.ts             # Sui client utilities
└── types/
    └── game.ts            # TypeScript types
```

## Next Steps

1. **Install Dependencies**: Run `npm install`
2. **Test Wallet Connection**: Connect your Sui wallet
3. **Deploy Smart Contract**: See `SMART_CONTRACT_SETUP.md`
4. **Update Package ID**: Replace placeholder in `CollectButton.tsx`
5. **Customize Questions**: Update questions in `store/gameStore.ts`

## Troubleshooting

### Wallet Not Connecting
- Ensure you have a Sui wallet extension installed
- Check that the wallet is unlocked
- Try refreshing the page

### Transaction Fails
- Ensure you have enough SUI for gas fees
- Check network (testnet/mainnet) matches your wallet
- Verify smart contract is deployed (if using custom coins)

### TypeScript Errors
- Run `npm install` to install dependencies
- Ensure Node.js version is 18+ 


