import { UzproofClient, type ActionType, type VerifyResult } from "@uzproof/verify";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Verify that a wallet performed a specific on-chain action.
 *
 * @param agent - SolanaAgentKit instance (used for config)
 * @param wallet - Solana wallet address to verify
 * @param action - Action type to verify (e.g. "defi_swap", "nft_hold")
 * @param config - Action-specific configuration
 * @returns Verification result with evidence
 */
export async function verifyWalletActivity(
  agent: SolanaAgentKit,
  wallet: string,
  action: string,
  config: Record<string, unknown> = {},
): Promise<VerifyResult> {
  const apiKey = agent.config?.OTHER_API_KEYS?.UZPROOF_API_KEY;
  const client = new UzproofClient({ apiKey });

  return client.verify({
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
  });
}
