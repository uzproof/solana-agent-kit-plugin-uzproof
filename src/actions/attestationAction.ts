import type { Action } from "solana-agent-kit";
import { z } from "zod";
import { checkAttestation } from "../tools/attestation";

const checkAttestationAction: Action = {
  name: "UZPROOF_CHECK_ATTESTATION",

  similes: [
    "check attestation",
    "proof of use",
    "has attestation",
    "on-chain proof",
    "sas attestation",
    "verified wallet",
    "proof-of-use status",
  ],

  description:
    "Check if a Solana wallet has an on-chain Proof-of-Use attestation on the Solana Attestation Service (SAS). Returns attestation status, PDA address, and Solana Explorer link.",

  examples: [
    [
      {
        input: {
          wallet: "7H4RVLxfe4MYQGV3XxwJo5GrcFdNUBQEziSJYAfwqoiP",
        },
        output: {
          status: "success",
          hasAttestation: true,
          attestation: "AtTeStAtIoNpDaAdDrEsSuNiQuEpErWaLlEt123456789",
          explorer: "https://explorer.solana.com/address/AtTeStAtIoNpDaAdDrEsSuNiQuEpErWaLlEt123456789",
        },
        explanation:
          "Check if a wallet has a Proof-of-Use attestation on SAS.",
      },
    ],
  ],

  schema: z.object({
    wallet: z
      .string()
      .min(32)
      .max(44)
      .describe("Solana wallet address to check"),
  }),

  handler: async (agent, input) => {
    try {
      const result = await checkAttestation(agent, input.wallet);

      return {
        status: "success",
        hasAttestation: result.hasAttestation,
        attestation: result.attestation,
        explorer: result.explorer,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: "error",
        message: `Attestation check failed: ${message}`,
      };
    }
  },
};

export default checkAttestationAction;
