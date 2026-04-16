import { describe, it, expect, vi, beforeEach } from "vitest";

/* The plugin is a thin passthrough over @uzproof/verify, so the bit that
   can drift on refactor is whether `options.xPayment` reaches the SDK's
   `verify()` call. Every other tool here calls read-only free endpoints,
   so verify() is the only one that carries money — pinning the passthrough
   with a test keeps x402 support from getting silently dropped. */

const verifyMock = vi.fn();
const clientCtor = vi.fn();

vi.mock("@uzproof/verify", () => {
  class UzproofClient {
    constructor(config: unknown) {
      clientCtor(config);
    }
    verify = verifyMock;
  }
  return { UzproofClient };
});

import { verifyWalletActivity } from "./verify";

function fakeAgent(apiKey?: string): any {
  return {
    config: apiKey ? { OTHER_API_KEYS: { UZPROOF_API_KEY: apiKey } } : {},
  };
}

describe("verifyWalletActivity", () => {
  beforeEach(() => {
    verifyMock.mockReset();
    clientCtor.mockReset();
    verifyMock.mockResolvedValue({ verified: true, taskType: "defi_swap", result: {} });
  });

  it("forwards xPayment to the SDK as the options argument", async () => {
    await verifyWalletActivity(
      fakeAgent(),
      "7H4RVLxfe4MYQGV3XxwJo5GrcFdNUBQEziSJYAfwqoiP",
      "defi_swap",
      { program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4" },
      { xPayment: "FAKE_USDC_SIGNATURE_5asqm1x5" },
    );

    expect(verifyMock).toHaveBeenCalledTimes(1);
    const [req, options] = verifyMock.mock.calls[0];
    expect(req.action).toBe("defi_swap");
    expect(req.wallet).toBe("7H4RVLxfe4MYQGV3XxwJo5GrcFdNUBQEziSJYAfwqoiP");
    expect(options).toEqual({ xPayment: "FAKE_USDC_SIGNATURE_5asqm1x5" });
  });

  it("omits the options argument entirely when no xPayment is provided", async () => {
    await verifyWalletActivity(fakeAgent(), "7H4RVL...", "defi_swap", {});

    expect(verifyMock).toHaveBeenCalledTimes(1);
    // Second positional arg should be undefined — lets the SDK use its default.
    expect(verifyMock.mock.calls[0][1]).toBeUndefined();
  });

  it("still accepts the 4-arg signature used by existing Agent Kit callers", async () => {
    // Pre-1.1.0 call shape — no options object. Back-compat guard.
    await verifyWalletActivity(
      fakeAgent(),
      "7H4RVL...",
      "nft_hold",
      { collection_address: "Collection111" },
    );

    expect(verifyMock).toHaveBeenCalledTimes(1);
    expect(verifyMock.mock.calls[0][0].action).toBe("nft_hold");
  });

  it("passes through the legacy apiKey from agent config (Phase 2 forward-compat)", async () => {
    await verifyWalletActivity(
      fakeAgent("phase-2-api-key"),
      "7H4RVL...",
      "defi_swap",
      {},
      { xPayment: "sig" },
    );

    // apiKey is deprecated but the plugin still forwards it so Phase 2 rollout
    // won't require a plugin bump.
    expect(clientCtor).toHaveBeenCalledWith({ apiKey: "phase-2-api-key" });
  });
});
