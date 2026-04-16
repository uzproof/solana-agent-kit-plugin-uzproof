# Changelog

All notable changes to `solana-agent-kit-plugin-uzproof` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
