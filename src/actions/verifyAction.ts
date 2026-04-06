import type { Action } from "solana-agent-kit";
import { z } from "zod";
import { verifyWalletActivity } from "../tools/verify";

const verifyWalletActivityAction: Action = {
  name: "UZPROOF_VERIFY_WALLET_ACTIVITY",

  similes: [
    "verify wallet",
    "check if wallet swapped",
    "check if wallet staked",
    "check if wallet holds",
    "verify on-chain activity",
    "proof of use",
    "did wallet swap",
    "has wallet staked",
    "does wallet hold",
    "check wallet activity",
    "verify defi action",
    "verify nft ownership",
    "airdrop eligibility",
    "check eligibility",
  ],

  description:
    "Verify that a Solana wallet performed a specific on-chain action (swap, stake, hold tokens, mint NFT, add liquidity, lend, borrow, bridge, etc.) across 14 protocols including Jupiter, Marinade, Orca, Raydium, Drift, Kamino, MarginFi, Meteora, Jito, Tensor, Magic Eden, Metaplex, Sanctum, and SPL Token. Returns verification status with evidence (matching transactions, volume, balances).",

  examples: [
    [
      {
        input: {
          wallet: "7H4RVLxfe4MYQGV3XxwJo5GrcFdNUBQEziSJYAfwqoiP",
          action: "defi_swap",
          config: {
            program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
            min_amount_usd: 10,
          },
        },
        output: {
          status: "success",
          verified: true,
          taskType: "defi_swap",
          result: {
            matchingTxCount: 3,
            matchingSignatures: ["5x7Kp..."],
            totalVolumeEstimate: 150.25,
          },
        },
        explanation:
          "Verify that a wallet has swapped at least $10 on Jupiter.",
      },
    ],
    [
      {
        input: {
          wallet: "7H4RVLxfe4MYQGV3XxwJo5GrcFdNUBQEziSJYAfwqoiP",
          action: "defi_hold_token",
          config: {
            token_mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            min_amount: 100,
          },
        },
        output: {
          status: "success",
          verified: true,
          taskType: "defi_hold_token",
          result: {
            balance: 250.5,
          },
        },
        explanation:
          "Check if a wallet holds at least 100 USDC.",
      },
    ],
    [
      {
        input: {
          wallet: "7H4RVLxfe4MYQGV3XxwJo5GrcFdNUBQEziSJYAfwqoiP",
          action: "nft_hold",
          config: {
            collection_address: "COLLECTION_MINT_ADDRESS",
          },
        },
        output: {
          status: "success",
          verified: true,
          taskType: "nft_hold",
          result: {
            nftCount: 2,
          },
        },
        explanation:
          "Verify that a wallet owns NFTs from a specific collection.",
      },
    ],
  ],

  schema: z.object({
    wallet: z
      .string()
      .min(32)
      .max(44)
      .describe("Solana wallet address to verify"),
    action: z
      .enum([
        "defi_swap", "defi_swap_buy", "defi_swap_sell", "defi_swap_volume",
        "defi_hold_token", "defi_hold_stablecoin", "defi_hold_staked",
        "defi_hold_token_duration", "defi_hold_lp",
        "defi_stake_sol", "defi_add_liquidity", "defi_bridge",
        "defi_lend", "defi_borrow", "defi_vote", "defi_repay",
        "defi_claim", "defi_create_lst",
        "nft_hold", "nft_mint", "nft_check",
        "token_balance", "tx_verify", "gaming_play",
      ])
      .describe("Type of on-chain action to verify"),
    config: z
      .object({
        program_id: z.string().optional().describe("Solana program ID"),
        token_mint: z.string().optional().describe("SPL token mint address"),
        min_amount_usd: z.number().optional().describe("Minimum amount in USD"),
        min_amount: z.number().optional().describe("Minimum token amount"),
        min_amount_sol: z.number().optional().describe("Minimum SOL amount"),
        collection_address: z.string().optional().describe("NFT collection address"),
        nft_mint: z.string().optional().describe("Specific NFT mint address"),
        min_volume_usd: z.number().optional().describe("Minimum trading volume in USD"),
      })
      .optional()
      .describe("Action-specific configuration"),
  }),

  handler: async (agent, input) => {
    try {
      const result = await verifyWalletActivity(
        agent,
        input.wallet,
        input.action,
        input.config || {},
      );

      return {
        status: "success",
        verified: result.verified,
        taskType: result.taskType,
        result: result.result,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        status: "error",
        message: `Verification failed: ${message}`,
      };
    }
  },
};

export default verifyWalletActivityAction;
