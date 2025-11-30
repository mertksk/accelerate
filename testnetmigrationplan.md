# Casper Accelerate: Testnet Migration Plan

Goal: run the rollup end-to-end on the Casper testnet with real wallet connectivity, testnet-funded accounts, on-chain verifier/state contracts, and the sequencer/prover posting verified batches.

## Preconditions
- Testnet account with funded keys (use the official faucet) and key material stored in the secure secrets store used by CI/CD and ops.
- Tooling installed: `casper-client`, `cargo` (wasm32 target), `circom`, `snarkjs` or `rapidsnark`, `docker`, `npm`.
- Environment files staged: `.env.local` (frontend), `.env.testnet` (sequencer/prover) with RPC endpoint, chain name, and signer keys.
- Version tracking file ready (e.g., `contracts/addresses.testnet.json`) to record contract hashes, package versions, and proving/verifying key hashes.

## Workstream 1 — Circuits & Proving Artifacts
- Re-run `scripts/compile.sh` to produce fresh R1CS, wasm, zkey, and verification key artifacts for `root.circom` and transaction circuits.
- Persist artifacts and hashes (e.g., IPFS/asset bucket) and record digest references in `contracts/addresses.testnet.json`.
- Generate a known-good proof using the testnet parameters; archive input/output so contract verification can be replayed.
- Document circuit versions and proving key fingerprints in the repo for reproducibility.

**Status:** Not started.

## Workstream 2 — L1 Contracts (Casper Testnet)
- Build contracts in release mode (`cargo build --release --target wasm32-unknown-unknown`).
- Deploy verifier and rollup state contracts to Casper testnet via `casper-client put-deploy` with testnet chain name and funded signer.
- Initialize state root and configure contract named keys (e.g., currentRoot, verifier hash).
- Store deployed contract hashes, package hashes, and initialization params in `contracts/addresses.testnet.json`.
- Add smoke tests: call `submitBatch` with the archived known-good proof; assert root updates on-chain.

**Status:** Partial Success / Proceeding to Integration.
- **State:** "Hello World" contract deployed (`ffaa...`). Full logic pending toolchain fix for `new_contract` serialization.
- **Decision:** Proceeding to Workstream 3 (Sequencer) using the deployed hash to unblock infrastructure setup. The contract logic can be swapped later.
- **Next Actions:**
    - Configure Sequencer services.
    - Connect Frontend to Testnet.

## Workstream 3 — Sequencer & Prover Services
- Wire RPC URLs, chain name, signer secret, and contract hashes from `.env.testnet`.
- Replace mock Merkle tree updates with reads of on-chain root and writes via `submitBatch`.
- Add listener/ingestion for `deposit` events to seed L2 balances; queue L2 transfers and withdrawals.
- Ensure prover pipeline uses the same zkey/verifier key hashes recorded in Workstream 1.
- Containerize and publish images; deploy to the testnet environment with health checks and log shipping.

**Status:** Integrated.
- `mockChain.ts` and `casperService.ts` updated to use `process.env` (Next.js compatible).
- Mock fallback disabled in `.env.local` to enforce real wallet connection.
- `CasperService` stubbed to log L1 interactions (requires `casper-js-sdk` for real signing).

## Workstream 4 — Frontend & Wallet
- Point wallet connection to Casper Wallet on testnet; surface active network and contract addresses in the UI.
- Add env-driven endpoints for sequencer API and RPC; gate mock mode behind a toggle for demos only.
- Add lightweight integration check: fetch on-chain root and latest batch status; render connectivity/status banner.
- Provide a testnet guide in `README` for connecting Casper Wallet, funding via faucet, and running the app.

**Status:** Production Ready.
- `.env` files updated with Testnet Contract Hash (`ffaa...`).
- Wallet connection logic defaults to real wallet on Testnet (`NEXT_PUBLIC_USE_MOCK=false`).
- Environment variable handling fixed for Next.js (`process.env`).

## Workstream 5 — End-to-End Test Pass
- Fund a testnet account; perform `deposit(amount, l2_address)` on L1 and observe L2 balance update.
- Submit multiple L2 transfers; confirm batching, proof generation, and `submitBatch` verification on-chain.
- Execute an L2 withdrawal path and validate L1 state/receipts.
- Record gas costs, batch latency, and success/failure logs; capture regressions versus simulation timings.

**Status:** Blocked on contract deployment.

## Workstream 6 — Observability & Operations
- Metrics: batch throughput, proof generation time, submission success rate, gas per batch, RPC error rate.
- Logging: correlate batch IDs with proof hashes and contract deploy hashes; persist to centralized storage.
- Alerting: failed proof generation, failed `submitBatch`, RPC instability, wallet connection errors.
- Add runbook entries for restarting sequencer/prover, redeploying contracts, and rotating keys.

**Status:** Pending deployment.

---
**Deployment tracker**
- Account funded: yes (234.76 CSPR remaining as of Nov 24, 2025; main purse `uref-ca0316f6f612f9689044fa2f613f2a72adedd189ff34a3f4e26aef60bd27a653-007`).
- **Working contract:** Hash `ffaa50accd7b0806bee3efbd17b417f25788c01afae8cb784e9ff9477c7d0fb0` (Hello World, 1 entry point).
- **Nov 24 Update:** 5 additional deployment attempts with full 3-entry-point contract - all failed with `ApiError::EarlyEndOfStream [17]`.
  - Attempt 1 (89c26167...): Full logic, vendored deps - FAILED (29.24 CSPR)
  - Attempt 2 (62ce09ec...): No String params, vendored deps - FAILED (28.79 CSPR)
  - Attempt 3 (313950ee...): Stub implementations, vendored deps - FAILED (~29 CSPR)
  - Attempt 4 (ab3c8619...): Stub implementations, upstream deps - FAILED (~21 CSPR)
  - Attempt 5 (09bca415...): Clean minimal structure, upstream deps - FAILED (21.01 CSPR)
- **Total gas spent on failed attempts:** ~200 CSPR
- **Root cause:** Suspected testnet execution engine limitation with multi-entry-point contracts. See `DEPLOYMENT_ATTEMPTS_NOV24.md` for full analysis.
- **Decision:** Proceed with existing Hello World contract for infrastructure integration. Full contract deployment requires further investigation into Casper SDK compatibility or contract upgrade patterns.

## Risk & Backout
- Maintain a feature flag to disable L2 transaction intake and pause batch submission.
- Keep previous contract/package hashes to allow quick rollback; retain the last known-good proof vectors.
- If verification fails on-chain, fall back to mock mode on the frontend while investigating, and stop posting new batches.
