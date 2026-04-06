import type { Action } from "solana-agent-kit";
import { z } from "zod";
import { getTokenInfo } from "../tools/tokenInfo";

const getTokenInfoAction: Action = {
  name: "UZPROOF_GET_TOKEN_INFO",

  similes: [
    "token info",
    "token price",
    "get token metadata",
    "token details",
    "what token is this",
    "token supply",
    "token decimals",
  ],

  description:
    "Fetch SPL token metadata and live price by mint address. Returns token name, symbol, decimals, total supply, and current USD price.",

  examples: [
    [
      {
        input: {
          mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
        },
        output: {
          status: "success",
          token: {
            mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
            name: "Jupiter",
            symbol: "JUP",
            decimals: 6,
            supply: 6863982319,
            priceUsd: 0.164,
          },
        },
        explanation:
          "Get metadata and current price for the JUP token.",
      },
    ],
  ],

  schema: z.object({
    mint: z
      .string()
      .min(32)
      .max(44)
      .describe("SPL token mint address"),
  }),

  handler: async (agent, input) => {
    try {
      const token = await getTokenInfo(agent, input.mint);

      return {
        status: "success",
        token,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: "error",
        message: `Token info fetch failed: ${message}`,
      };
    }
  },
};

export default getTokenInfoAction;
