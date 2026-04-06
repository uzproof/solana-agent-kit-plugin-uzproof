import { UzproofClient, type AttestationStatus } from "@uzproof/verify";
import type { SolanaAgentKit } from "solana-agent-kit";

/**
 * Check if a wallet has an on-chain Proof-of-Use attestation
 * on the Solana Attestation Service (SAS).
 *
 * @param agent - SolanaAgentKit instance
 * @param wallet - Solana wallet address
 * @returns Attestation status with PDA address and explorer link
 */
export async function checkAttestation(
  agent: SolanaAgentKit,
  wallet: string,
): Promise<AttestationStatus> {
  const apiKey = agent.config?.OTHER_API_KEYS?.UZPROOF_API_KEY;
  const client = new UzproofClient({ apiKey });

  return client.getAttestation(wallet);
}
