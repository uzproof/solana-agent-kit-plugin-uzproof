# solana-agent-kit-plugin-uzproof

[![npm](https://img.shields.io/npm/v/solana-agent-kit-plugin-uzproof)](https://www.npmjs.com/package/solana-agent-kit-plugin-uzproof)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) plugin for **UZPROOF** — verify real on-chain usage on Solana. Supports x402 pay-per-verify on mainnet.

## Install

```bash
npm install solana-agent-kit-plugin-uzproof
```

## Usage

```typescript
import { SolanaAgentKit } from "solana-agent-kit";
import UzproofPlugin from "solana-agent-kit-plugin-uzproof";

const agent = new SolanaAgentKit(wallet, rpcUrl, {}).use(UzproofPlugin);
```

### Free tools (no payment)

```typescript
// Detect a protocol from a program ID
const info = await agent.methods.detectProtocol(
  agent,
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
);

// Fetch token metadata + live price
const token = await agent.methods.getTokenInfo(
  agent,
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
);

// Read on-chain SAS attestation status
const status = await agent.methods.checkAttestation(agent, "7H4RVL...");
```

### Paid verify (x402)

`verifyWalletActivity()` is gated behind [x402](https://www.x402.org/) — programmatic callers pay **$0.05 USDC per call** on Solana mainnet. Pass the USDC transaction signature via `options.xPayment`:

```typescript
import { PaymentRequiredError } from "@uzproof/verify";

async function verifyJupiterSwap(wallet: string) {
  try {
    // First attempt — will 402 with payment schema
    return await agent.methods.verifyWalletActivity(
      agent,
      wallet,
      "defi_swap",
      { program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", min_amount_usd: 10 },
    );
  } catch (err) {
    if (err instanceof PaymentRequiredError) {
      const scheme = (err.details as any).schemes[0];

      // Sign + broadcast a USDC transfer to scheme.payTo for
      // scheme.maxAmountRequired (use @solana/web3.js + @solana/spl-token).
      const paymentSig = await sendUsdc(scheme.payTo, scheme.maxAmountRequired);

      // Retry with X-Payment signature
      return await agent.methods.verifyWalletActivity(
        agent,
        wallet,
        "defi_swap",
        { program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", min_amount_usd: 10 },
        { xPayment: paymentSig },
      );
    }
    throw err;
  }
}
```

> **API keys** (`OTHER_API_KEYS.UZPROOF_API_KEY`) are reserved for a future Phase 2 release. They're still accepted by the SDK for forward compatibility but produce 401 on the live API today. Use `xPayment`.

## Actions (natural-language)

AI agents can invoke these actions via natural language:

| Action | Trigger phrases | Description |
|---|---|---|
| `UZPROOF_VERIFY_WALLET_ACTIVITY` | "verify wallet swapped", "check if holds" | Verify on-chain activity across 15 protocols (requires agent-side x402 payment) |
| `UZPROOF_DETECT_PROTOCOL` | "what protocol is this", "detect program" | Auto-detect protocol from program ID |
| `UZPROOF_GET_TOKEN_INFO` | "token price", "token info" | Fetch token metadata and live price |
| `UZPROOF_CHECK_ATTESTATION` | "check attestation", "proof of use" | Check SAS on-chain attestation |

The `UZPROOF_VERIFY_WALLET_ACTIVITY` action schema deliberately omits `xPayment` — LLM tool invocations shouldn't auto-spend USDC. If you want an AI agent to pay, wrap the action in your own handler that signs and injects the payment.

## Supported Protocols

Jupiter, Marinade, Sanctum, Orca, Raydium, Drift, Kamino, MarginFi, Meteora, Jito, Tensor, Magic Eden, Metaplex, SPL Token.

## Supported Action Types (24)

`defi_swap`, `defi_swap_buy`, `defi_swap_sell`, `defi_swap_volume`, `defi_hold_token`, `defi_hold_stablecoin`, `defi_hold_staked`, `defi_hold_token_duration`, `defi_hold_lp`, `defi_stake_sol`, `defi_add_liquidity`, `defi_bridge`, `defi_lend`, `defi_borrow`, `defi_vote`, `defi_repay`, `defi_claim`, `defi_create_lst`, `nft_hold`, `nft_mint`, `nft_check`, `token_balance`, `tx_verify`, `gaming_play`.

## Links

- [UZPROOF](https://uzproof.com) — product site
- [x402 pricing](https://uzproof.com/api/x402/pricing) — current paid endpoints
- [npm: @uzproof/verify](https://www.npmjs.com/package/@uzproof/verify) — underlying SDK
- [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) — host framework
- [UZPROOF Agent Skill](https://github.com/uzproof/uzproof-agent-skill) — companion skill for AI coding agents
- [CHANGELOG.md](./CHANGELOG.md)

## License

MIT
