# solana-agent-kit-plugin-uzproof

[Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) plugin for **UZPROOF** — verify real on-chain usage on Solana.

## Install

```bash
npm install solana-agent-kit-plugin-uzproof
```

## Usage

```typescript
import { SolanaAgentKit } from "solana-agent-kit";
import UzproofPlugin from "solana-agent-kit-plugin-uzproof";

const agent = new SolanaAgentKit(wallet, rpcUrl, {
  OTHER_API_KEYS: { UZPROOF_API_KEY: "your-key" }  // optional
}).use(UzproofPlugin);
```

## Actions

AI agents can invoke these actions via natural language:

| Action | Trigger phrases | Description |
|---|---|---|
| `UZPROOF_VERIFY_WALLET_ACTIVITY` | "verify wallet swapped", "check if holds" | Verify on-chain activity across 14 protocols |
| `UZPROOF_DETECT_PROTOCOL` | "what protocol is this", "detect program" | Auto-detect protocol from program ID |
| `UZPROOF_GET_TOKEN_INFO` | "token price", "token info" | Fetch token metadata and live price |
| `UZPROOF_CHECK_ATTESTATION` | "check attestation", "proof of use" | Check SAS on-chain attestation |

## Methods

Programmatic access via `agent.methods`:

```typescript
// Verify a wallet swapped on Jupiter
const result = await agent.methods.verifyWalletActivity(
  agent,
  "7H4RVL...",
  "defi_swap",
  { program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4" }
);

// Detect a protocol
const info = await agent.methods.detectProtocol(
  agent,
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
);

// Get token info
const token = await agent.methods.getTokenInfo(
  agent,
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
);

// Check attestation
const status = await agent.methods.checkAttestation(agent, "7H4RVL...");
```

## Supported Protocols

Jupiter, Marinade, Sanctum, Orca, Raydium, Drift, Kamino, MarginFi, Meteora, Jito, Tensor, Magic Eden, Metaplex, SPL Token.

## Supported Action Types (24)

`defi_swap`, `defi_swap_buy`, `defi_swap_sell`, `defi_swap_volume`, `defi_hold_token`, `defi_hold_stablecoin`, `defi_hold_staked`, `defi_hold_token_duration`, `defi_hold_lp`, `defi_stake_sol`, `defi_add_liquidity`, `defi_bridge`, `defi_lend`, `defi_borrow`, `defi_vote`, `defi_repay`, `defi_claim`, `defi_create_lst`, `nft_hold`, `nft_mint`, `nft_check`, `token_balance`, `tx_verify`, `gaming_play`.

## Links

- [UZPROOF](https://uzproof.com)
- [npm: @uzproof/verify](https://www.npmjs.com/package/@uzproof/verify)
- [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit)
- [UZPROOF Agent Skill](https://github.com/uzproof/uzproof-agent-skill) (for AI coding agents)

## License

MIT
