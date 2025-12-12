# Smart Contract Setup Guide

## Overview

This game requires a Sui smart contract to handle coin minting and collection. The current implementation includes placeholder code that needs to be replaced with your actual contract.

## Contract Requirements

You'll need to create a Move smart contract with the following functionality:

### 1. Coin Type Definition

```move
module clicker_game::game_coin {
    use sui::coin::{Self, Coin};
    use sui::deny_list::{Self, DenyList};
    use sui::transfer;
    use sui::sui::SUI;

    // Define your custom coin type
    struct GAME_COIN has drop {}
    
    // Initialize the coin
    fun init(ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency<GAME_COIN>(
            ctx,
            9, // decimals
            b"Game Coin",
            b"GC",
            b"", // description
            option::none(), // icon_url
        );
        transfer::public_freeze_object(coin::create_currency_metadata(ctx));
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }
}
```

### 2. Collect Function

```move
module clicker_game::clicker_game {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use clicker_game::game_coin::{Self, GAME_COIN};

    // Function to mint and transfer coins to player
    public entry fun collect_coins(
        treasury_cap: &mut TreasuryCap<GAME_COIN>,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        let coins = coin::mint_and_transfer(treasury_cap, amount, recipient, ctx);
    }
}
```

## Integration Steps

1. **Deploy Your Contract**
   ```bash
   sui move build
   sui client publish --gas-budget 100000000
   ```

2. **Update Package ID**
   - Copy the published package ID
   - Update `GAME_PACKAGE_ID` in `components/CollectButton.tsx`

3. **Update Collect Function**
   - Modify the `handleCollect` function in `components/CollectButton.tsx`
   - Replace the placeholder transaction with your actual Move call:

```typescript
tx.moveCall({
  target: `${GAME_PACKAGE_ID}::clicker_game::collect_coins`,
  arguments: [
    tx.object(treasuryCapId), // Your treasury cap object ID
    tx.pure.u64(coinsToCollect),
    tx.pure.address(currentAccount.address),
  ],
});
```

## Testing

1. Connect your wallet (testnet)
2. Play the game and earn coins
3. Click "Collect" to mint coins to your wallet
4. Verify the transaction on Sui Explorer

## Network Configuration

Update the network in `lib/sui.ts`:
- `testnet` - For testing
- `mainnet` - For production
- `devnet` - For local development

## Security Considerations

1. **Access Control**: Ensure only authorized addresses can call mint functions
2. **Rate Limiting**: Implement daily limits in your contract
3. **Validation**: Verify game state before minting coins
4. **Treasury Cap**: Store treasury cap securely, never expose private keys

## Alternative: Using SUI for Testing

For testing purposes, the current implementation transfers SUI instead of custom coins. To use this:

1. Comment out the Move call section
2. Use the SUI transfer code (already included)
3. Note: This is only for testing, not production


