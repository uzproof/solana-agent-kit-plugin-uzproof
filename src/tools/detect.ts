import { UzproofClient, type ContractDetectResult } from "@uzproof/verify";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Auto-detect a Solana program and get supported verification types.
 * Supports 14 protocols: Jupiter, Marinade, Orca, Raydium, Drift,
 * Kamino, MarginFi, Meteora, Jito, Tensor, Magic Eden, Metaplex,
 * Sanctum, SPL Token.
 *
 * @param agent - SolanaAgentKit instance
 * @param programId - Solana program ID to detect
 * @returns Detection result with protocol info and suggested quest template
 */
export async function detectProtocol(
  agent: SolanaAgentKit,
  programId: string,
): Promise<ContractDetectResult> {
  const apiKey = agent.config?.OTHER_API_KEYS?.UZPROOF_API_KEY;
  const client = new UzproofClient({ apiKey });

  return client.detectContract(programId);
}
