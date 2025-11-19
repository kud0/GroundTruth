export const BETTING_POOL_IDL = {
  "address": "52a6eQd5ocZUnjudnFHuaqVSNHGQ9jzvFKiDgD9qvu2e",
  "metadata": {
    "name": "betting_pool",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claim_payout",
      "discriminator": [127, 240, 132, 62, 227, 198, 146, 133],
      "accounts": [
        { "name": "pool", "writable": true },
        { "name": "bet", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "bettor_usdc", "writable": true },
        { "name": "bettor", "signer": true },
        { "name": "token_program" }
      ],
      "args": []
    },
    {
      "name": "initialize_pool",
      "discriminator": [95, 180, 10, 172, 84, 174, 232, 40],
      "accounts": [
        { "name": "pool", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "usdc_mint" },
        { "name": "authority", "writable": true, "signer": true },
        { "name": "system_program" },
        { "name": "token_program" },
        { "name": "rent" }
      ],
      "args": [{ "name": "market_pubkey", "type": "pubkey" }]
    },
    {
      "name": "place_bet",
      "discriminator": [222, 62, 67, 220, 63, 166, 126, 33],
      "accounts": [
        { "name": "pool", "writable": true },
        { "name": "bet", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "bettor_usdc", "writable": true },
        { "name": "bettor", "writable": true, "signer": true },
        { "name": "system_program" },
        { "name": "token_program" }
      ],
      "args": [
        { "name": "amount", "type": "u64" },
        { "name": "prediction", "type": "bool" }
      ]
    },
    {
      "name": "refund",
      "discriminator": [2, 96, 183, 251, 63, 208, 46, 46],
      "accounts": [
        { "name": "pool", "writable": true },
        { "name": "bet", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "bettor_usdc", "writable": true },
        { "name": "bettor", "signer": true },
        { "name": "token_program" }
      ],
      "args": []
    }
  ],
  "accounts": [
    { "name": "Bet", "discriminator": [147, 23, 35, 59, 15, 75, 155, 32] },
    { "name": "BettingPool", "discriminator": [59, 136, 47, 53, 37, 99, 87, 104] }
  ],
  "errors": [
    { "code": 6000, "name": "InvalidAmount", "msg": "Bet amount must be greater than 0" },
    { "code": 6001, "name": "CannotChangePrediction", "msg": "Cannot change prediction on existing bet" },
    { "code": 6002, "name": "AlreadyClaimed", "msg": "Payout already claimed" },
    { "code": 6003, "name": "UnauthorizedClaimer", "msg": "Not authorized to claim this bet" }
  ],
  "types": [
    {
      "name": "Bet",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "bettor", "type": "pubkey" },
          { "name": "pool", "type": "pubkey" },
          { "name": "prediction", "type": "bool" },
          { "name": "amount", "type": "u64" },
          { "name": "claimed", "type": "bool" },
          { "name": "bump", "type": "u8" }
        ]
      }
    },
    {
      "name": "BettingPool",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "market", "type": "pubkey" },
          { "name": "usdc_mint", "type": "pubkey" },
          { "name": "total_yes_amount", "type": "u64" },
          { "name": "total_no_amount", "type": "u64" },
          { "name": "bump", "type": "u8" },
          { "name": "vault_bump", "type": "u8" }
        ]
      }
    }
  ]
} as const;
