import { UzproofClient, type ActionType, type VerifyResult } from "@uzproof/verify";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Verify that a wallet performed a specific on-chain action.
 *
 * UZPROOF's `/api/verify` endpoint is gated behind x402 — programmatic
 * callers pay $0.05 USDC per call on Solana mainnet. Pass the USDC
 * transaction signature via `options.xPayment` to authenticate. The SDK
 * throws `PaymentRequiredError` when the server returns 402 without a
 * payment header, so B2B flows typically (1) call once without `xPayment`
 * to learn the payment schema, (2) broadcast a USDC transfer, (3) retry
 * with the resulting tx signature.
 *
 * API keys (`agent.config.OTHER_API_KEYS.UZPROOF_API_KEY`) are reserved
 * for a future Phase 2 release — they're still accepted by the SDK for
 * forward compatibility but produce 401 on the live API today. Use
 * `xPayment` instead. See the skill's references/x402.md for the full
 * flow.
 *
 * @param agent - SolanaAgentKit instance (config carries future API key)
 * @param wallet - Solana wallet address to verify
 * @param action - Action type to verify (e.g. "defi_swap", "nft_hold")
 * @param config - Action-specific configuration
 * @param options - Optional x402 payment signature
 * @returns Verification result with evidence
 */
export async function verifyWalletActivity(
  agent: SolanaAgentKit,
  wallet: string,
  action: string,
  config: Record<string, unknown> = {},
  options?: { xPayment?: string },
): Promise<VerifyResult> {
  /** @deprecated API keys are Phase 2 — not active on the live API. Use `options.xPayment` today. */
  const apiKey = agent.config?.OTHER_API_KEYS?.UZPROOF_API_KEY;
  const client = new UzproofClient({ apiKey });

  return client.verify(
    {
      wallet,
      action: action as ActionType,
      config: config as {
        program_id?: string;
        token_mint?: string;
        min_amount_usd?: number;
        min_amount?: number;
        min_amount_sol?: number;
        collection_address?: string;
        nft_mint?: string;
        min_volume_usd?: number;
      },
    },
    options,
  );
}
