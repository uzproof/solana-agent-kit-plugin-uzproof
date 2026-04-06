import type { Plugin } from "solana-agent-kit";

// Actions (for AI frameworks: LangChain, Vercel AI, OpenAI)
import verifyWalletActivityAction from "./actions/verifyAction";
import detectProtocolAction from "./actions/detectAction";
import getTokenInfoAction from "./actions/tokenInfoAction";
import checkAttestationAction from "./actions/attestationAction";

// Tools (for programmatic usage via agent.methods.*)
import { verifyWalletActivity } from "./tools/verify";
import { detectProtocol } from "./tools/detect";
import { getTokenInfo } from "./tools/tokenInfo";
import { checkAttestation } from "./tools/attestation";

/**
 * UZPROOF Plugin for Solana Agent Kit
 *
 * Adds on-chain verification capabilities to AI agents:
 * - Verify wallet activity (swaps, staking, holdings, NFTs) across 14 protocols
 * - Auto-detect Solana protocols from program IDs
 * - Fetch token metadata and live prices
 * - Check on-chain SAS attestations
 *
 * @example
 * ```typescript
 * import { SolanaAgentKit } from "solana-agent-kit";
 * import UzproofPlugin from "solana-agent-kit-plugin-uzproof";
 *
 * const agent = new SolanaAgentKit(wallet, rpcUrl, {
 *   OTHER_API_KEYS: { UZPROOF_API_KEY: "your-key" }
 * }).use(UzproofPlugin);
 *
 * // Programmatic usage
 * const result = await agent.methods.verifyWalletActivity(
 *   agent, "7H4RVL...", "defi_swap",
 *   { program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4" }
 * );
 *
 * // AI agents invoke actions automatically via natural language
 * ```
 */
const UzproofPlugin = {
  name: "uzproof",

  methods: {
    verifyWalletActivity,
    detectProtocol,
    getTokenInfo,
    checkAttestation,
  },

  actions: [
    verifyWalletActivityAction,
    detectProtocolAction,
    getTokenInfoAction,
    checkAttestationAction,
  ],

  initialize: function (): void {
    // No initialization needed — UZPROOF is a stateless API
  },
} satisfies Plugin;

export default UzproofPlugin;

// Re-export tools for direct imports
export { verifyWalletActivity, detectProtocol, getTokenInfo, checkAttestation };

// Re-export actions for custom plugin compositions
export {
  verifyWalletActivityAction,
  detectProtocolAction,
  getTokenInfoAction,
  checkAttestationAction,
};
