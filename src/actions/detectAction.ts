import type { Action } from "solana-agent-kit";
import { z } from "zod";
import { detectProtocol } from "../tools/detect";

const detectProtocolAction: Action = {
  name: "UZPROOF_DETECT_PROTOCOL",

  similes: [
    "detect protocol",
    "what protocol is this",
    "identify program",
    "what is this program",
    "detect contract",
    "which dex is this",
    "what program is this",
  ],

  description:
    "Auto-detect a Solana program ID and identify which protocol it belongs to. Returns the protocol name, category, supported verification actions, and a suggested quest template. Supports 14 protocols: Jupiter, Marinade, Orca, Raydium, Drift, Kamino, MarginFi, Meteora, Jito, Tensor, Magic Eden, Metaplex, Sanctum, SPL Token.",

  examples: [
    [
      {
        input: {
          programId: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
        },
        output: {
          status: "success",
          detected: true,
          program: {
            name: "Jupiter Aggregator v6",
            category: "dex",
            supportedActions: ["defi_swap", "defi_swap_buy", "defi_swap_sell", "defi_swap_volume"],
          },
        },
        explanation:
          "Detect that a program ID belongs to Jupiter Aggregator v6.",
      },
    ],
  ],

  schema: z.object({
    programId: z
      .string()
      .min(32)
      .max(44)
      .describe("Solana program ID to detect"),
  }),

  handler: async (agent, input) => {
    try {
      const result = await detectProtocol(agent, input.programId);

      return {
        status: "success",
        detected: result.detected,
        program: result.program,
        questTemplate: result.questTemplate,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: "error",
        message: `Protocol detection failed: ${message}`,
      };
    }
  },
};

export default detectProtocolAction;
