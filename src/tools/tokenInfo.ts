import { UzproofClient, type TokenInfo } from "@uzproof/verify";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Fetch SPL token metadata and live price by mint address.
 *
 * @param agent - SolanaAgentKit instance
 * @param mint - SPL token mint address
 * @returns Token info with name, symbol, decimals, supply, price
 */
export async function getTokenInfo(
  agent: SolanaAgentKit,
  mint: string,
): Promise<TokenInfo> {
  const apiKey = agent.config?.OTHER_API_KEYS?.UZPROOF_API_KEY;
  const client = new UzproofClient({ apiKey });

  return client.getTokenInfo(mint);
}
