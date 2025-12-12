# Quick Start Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
```

## Step 3: Open in Browser

Open your browser and go to:
**http://localhost:3000**

## What You'll See

1. **Game Interface**
   - Coin counter (top left)
   - Timer display (top right)
   - Clickable coin in the center
   - Tier selector (Free/Pro)

2. **How to Play**
   - Click the coin to start the game
   - Answer questions quickly to earn coins
   - Watch your timer count down
   - See your achievements unlock

3. **Wallet Features**
   - Click "Connect Wallet" to connect your Sui wallet
   - See your wallet balance
   - Collect earned coins to your wallet

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.)

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed

### Wallet Not Connecting
- Make sure you have a Sui wallet extension installed (Sui Wallet, Ethos, etc.)
- Check that the wallet is unlocked
- Try refreshing the page

## Testing Without Wallet

You can still play the game and earn coins without connecting a wallet. The "Collect" button will only work when a wallet is connected.


