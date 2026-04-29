# Changelog

All notable changes to `solana-agent-kit-plugin-uzproof` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Bumped `@uzproof/verify` dependency from `^1.2.0` to `^1.3.0`.**
  The 1.3.0 SDK release (2026-04-29) added `defi_perp_trade` and
  `defi_perp_volume` ActionType variants for Drift v2 perpetuals
  coverage. Existing plugin actions continue to work unchanged;
  agents calling `verifyWalletActivity` with the new perp actions
  now get full SDK type-checking. Verified live with
  `npm view @uzproof/verify version` returning `1.3.0`.

### Documentation

- Synced protocol / signal counts across the package surface to match
  the `uzproof/uzproof` Drift v2 perpetuals integration (2026-04-28):
  - 14 → **15 protocols** (added Drift Vaults to every enumeration)
  - 8 → **14 anti-sybil signals** (correcting prior understatement)
- Touched: `package.json` description, `README.md`, `src/index.ts`,
  `src/actions/verifyAction.ts`, `src/actions/detectAction.ts`,
  `src/tools/detect.ts`. Surface API unchanged.

## [1.1.0] — 2026-04-16

### Added

- **x402 pay-per-verify support.** `verifyWalletActivity()` now accepts an
  optional 5th argument `options?: { xPayment?: string }`. Pass a USDC
  transaction signature to authenticate programmatic verify calls against
  UZPROOF's live x402 endpoint ($0.05 USDC per call on Solana mainnet).
- `vitest` dev dependency plus `test` / `test:watch` / `prepublishOnly`
  scripts. The initial suite pins x402 passthrough so a future refactor
  can't silently drop payment forwarding.
- `x402` in package keywords so npm search surfaces us for agent
  integrators looking for x402-compatible SDKs.

### Changed

- Bumped `@uzproof/verify` peer range from `^1.0.0` to `^1.2.0` — the
  1.2.0 release is what ships `PaymentRequiredError` and the `xPayment`
  option this plugin now forwards.
- `verifyWalletActivity()` signature went from 4 to 5 arguments. The new
  argument is optional, so every existing 4-arg caller keeps working.

### Deprecated

- `agent.config.OTHER_API_KEYS.UZPROOF_API_KEY`. API-key auth is reserved
  for a future Phase 2 release and currently produces 401 on the live API.
  The plugin still forwards the key to the SDK for forward compatibility —
  when Phase 2 lands, nothing in this plugin will need to change. Use
  `options.xPayment` today.

### Fixed

- Nothing functional — 1.0.1 was a build-output fix and verify was
  practically unusable against the live API because API keys weren't
  honored. 1.1.0 restores a working programmatic path via x402.

## [1.0.1] — 2026-04-06

### Fixed

- Rebuilt `dist/` to include the `verificationTemplate` field in the
  `detectContract()` response.

## [1.0.0] — 2026-04-06

### Added

- Initial release. Four tools bound into Solana Agent Kit:
  `verifyWalletActivity`, `detectProtocol`, `getTokenInfo`,
  `checkAttestation`. Each exposed as both a programmatic `method` and a
  natural-language `Action` for LLM routing.
