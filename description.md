# Casper Accelerate - ZK Rollup for Casper Network

## Project Details

### Overview
Casper Accelerate is a Zero-Knowledge Rollup (ZK-Rollup) Layer 2 scaling solution built on top of the Casper Network. It enables high-throughput, low-cost transactions while inheriting the security guarantees of the Casper L1 blockchain through cryptographic proofs.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Wallet UI   │  │ TX Form     │  │ Live Feed & Dashboard   │  │
│  │ (Connect)   │  │ (Deposit/   │  │ (Batches, Proofs, TPS)  │  │
│  │             │  │  Transfer)  │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      SERVICES LAYER                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ casperService   │  │ proverService   │  │ observability   │  │
│  │ (L1 Contract    │  │ (Groth16 ZK     │  │ (Metrics,       │  │
│  │  Interaction)   │  │  Proof Gen)     │  │  Logging)       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ merkleTree      │  │ mockChain       │                       │
│  │ (State Tree     │  │ (Sequencer      │                       │
│  │  Management)    │  │  Simulator)     │                       │
│  └─────────────────┘  └─────────────────┘                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    ZK CIRCUITS (Circom)                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ root.circom - Main batch verification circuit                │ │
│  │ rollup.circom - Individual transaction circuits              │ │
│  │   • DepositCircuit: Verify L1→L2 deposits                    │ │
│  │   • TransferCircuit: Verify L2 transfers with signatures     │ │
│  │   • WithdrawCircuit: Verify L2→L1 withdrawals                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                 CASPER L1 (Testnet)                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Smart Contract: casper_accelerate                            │ │
│  │ • Stores state root (Merkle root of all L2 balances)        │ │
│  │ • Accepts batch submissions with ZK proofs                   │ │
│  │ • Tracks batch count for sequencing                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js, React, TailwindCSS | User interface |
| State Management | Redux Toolkit | Application state |
| Wallet | Casper Wallet SDK | L1 wallet connection |
| ZK Circuits | Circom 2.0 | Zero-knowledge circuit definitions |
| Proof System | Groth16 (snarkjs) | ZK proof generation & verification |
| Smart Contract | Rust + WASM | On-chain state & verification |
| L1 Blockchain | Casper Network (Testnet) | Settlement layer |
| Contract SDK | casper-contract 5.1.1, casper-types 6.0.1 | Casper smart contract development |

### Key Files

```
casper-accelerate/
├── circuits/
│   ├── root.circom          # Main ZK circuit for batch verification
│   ├── rollup.circom        # Transaction-level circuits
│   ├── root_final.zkey      # Proving key (trusted setup output)
│   └── verification_key.json # Verification key for proof checking
├── contracts/
│   ├── lib_full_v6.rs       # Main contract (SDK v5/v6)
│   ├── Cargo.toml           # Rust dependencies
│   ├── addresses.testnet.json # Deployed contract addresses
│   └── keys/                # Deployment keys
├── services/
│   ├── casperService.ts     # L1 blockchain interaction
│   ├── proverService.ts     # ZK proof generation
│   ├── merkleTree.ts        # Merkle tree state management
│   ├── mockChain.ts         # Sequencer simulation
│   └── observability.ts     # Metrics & logging
├── App.tsx                  # Main React application
└── types.ts                 # TypeScript type definitions
```

---

## Contract Details

### Deployed Contract Information

| Property | Value |
|----------|-------|
| **Network** | Casper Testnet (`casper-test`) |
| **Contract Hash** | `contract-a854708de979d52e5df3fdc36d40897991fd785bb406fb78c65f32ce53fc2989` |
| **Package Hash** | `contract-package-15747c4d50d690dcee287b0685690a78bd89d42a02e6de92414e470a1d1eabf3` |
| **Deploy Hash** | `76b8ab7a92acee12e07d3e93ba92fb71f3cfddbeaad33ab8924a1f885c46f1af` |
| **Deployer Account** | `0176104d9132668cc741ac3fdc8eb623804f50779f8b5da2727b3b473c6b224ce1` |
| **SDK Version** | casper-contract 5.1.1, casper-types 6.0.1 |
| **RPC Endpoint** | `https://node.testnet.casper.network/rpc` |

### Entry Points

#### 1. `init()`
**Purpose:** Initialize the contract state after deployment.

**Parameters:** None

**Behavior:**
- Creates `state_root` storage key initialized to `U512::zero()`
- Creates `batch_count` storage key initialized to `0u64`

**Gas Cost:** ~2.5 CSPR

**Status:** ❌ Not yet called - contract needs initialization

---

#### 2. `submit_batch(root: U512, proof: U512)`
**Purpose:** Submit a new batch of L2 transactions with ZK proof.

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `root` | `U512` | New Merkle state root after batch execution |
| `proof` | `U512` | ZK proof hash (truncated for on-chain storage) |

**Behavior:**
1. Accepts new state root from sequencer
2. Stores proof hash (verification is off-chain currently)
3. Updates `state_root` in contract storage
4. Increments `batch_count`

**Gas Cost:** ~5 CSPR

**Status:** ✅ Ready to use

---

### Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `state_root` | `U512` | Current Merkle root of all L2 account balances |
| `batch_count` | `u64` | Total number of batches submitted |
| `casper_accelerate_hash` | `Key` | Contract hash for lookups |
| `casper_accelerate_package` | `Key` | Package hash for upgrades |

### Contract Source (lib_full_v6.rs)

```rust
// Entry point: init()
pub extern "C" fn init() {
    let root_uref = storage::new_uref(U512::zero());
    runtime::put_key(KEY_STATE_ROOT, root_uref.into());
    let count_uref = storage::new_uref(0u64);
    runtime::put_key(KEY_BATCH_COUNT, count_uref.into());
}

// Entry point: submit_batch(root, proof)
pub extern "C" fn submit_batch() {
    let new_root: U512 = runtime::get_named_arg(ARG_ROOT);
    let _proof: U512 = runtime::get_named_arg(ARG_PROOF);

    // Update state root
    let root_key = runtime::get_key(KEY_STATE_ROOT).unwrap_or_revert();
    let root_uref = root_key.into_uref().unwrap_or_revert();
    storage::write(root_uref, new_root);

    // Increment batch counter
    let count_key = runtime::get_key(KEY_BATCH_COUNT).unwrap_or_revert();
    let count_uref = count_key.into_uref().unwrap_or_revert();
    let current: u64 = storage::read(count_uref).unwrap_or_revert().unwrap_or_revert();
    storage::write(count_uref, current + 1);
}
```

---

## What We're Trying to Achieve

### The Problem

**Blockchain Scalability Trilemma:**
- Casper L1 processes ~100 TPS with ~2 second block times
- Each transaction costs gas and requires full network consensus
- High-frequency applications (gaming, micropayments, DeFi) are impractical

**User Experience Issues:**
- Users pay gas for every transaction
- Confirmation times of 2+ seconds feel slow
- Network congestion increases costs unpredictably

### Our Solution: ZK-Rollup

**Casper Accelerate** batches hundreds of L2 transactions into a single L1 transaction, using zero-knowledge proofs to guarantee correctness without revealing transaction details.

```
Traditional L1 (100 transactions):
TX1 → Block → TX2 → Block → TX3 → Block → ... → TX100 → Block
Cost: 100 × gas fee
Time: 100 × block time

With Casper Accelerate (100 transactions):
[TX1, TX2, TX3, ..., TX100] → Generate ZK Proof → 1 L1 Transaction
Cost: 1 × gas fee (amortized across 100 users)
Time: ~6 seconds batching + 1 block confirmation
```

### Key Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| **Scalability** | 100-1000x more transactions per L1 block | Higher throughput |
| **Cost Reduction** | Gas cost shared across batch | ~100x cheaper per TX |
| **Privacy** | ZK proofs hide transaction details | Only state root published |
| **Security** | Inherits Casper L1 security | No trust assumptions |
| **Instant Finality** | L2 transactions confirm immediately | Better UX |

### How It Works

1. **User submits L2 transaction** → Sequencer mempool
2. **Sequencer batches transactions** → Every 6 seconds
3. **Prover generates ZK proof** → Groth16 proving system
4. **Batch submitted to L1** → `submit_batch(newRoot, proof)`
5. **L1 verifies and stores** → New state root committed
6. **Transactions finalized** → L2 balances updated

### Current Architecture (Hackathon Version)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│  Sequencer   │────▶│  L1 Contract │
│  (Browser)   │     │  (Browser)   │     │  (Testnet)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    ▼                    │
       │            ┌──────────────┐             │
       │            │   Prover     │             │
       │            │  (snarkjs)   │             │
       │            └──────────────┘             │
       │                    │                    │
       ▼                    ▼                    ▼
   Wallet TX           ZK Proof            State Root
   Signing            Generation           Storage
```

### Target Architecture (Production)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│  Sequencer   │────▶│  L1 Contract │
│  (Browser)   │     │  (Server)    │     │  (Mainnet)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    ▼                    │
       │            ┌──────────────┐             │
       │            │   Prover     │             │
       │            │ (rapidsnark) │             │
       │            └──────────────┘             │
       │                    │                    │
       ▼                    ▼                    ▼
   Wallet TX           ZK Proof          On-chain Proof
   Signing            Generation          Verification
```

---

## TODO

### Critical (Must Have for Production)

#### 1. Initialize Deployed Contract
**Priority:** 🔴 Critical
**Status:** Not started

```bash
# Call init() entry point to set up storage
casper-client put-deploy \
  --node-address https://node.testnet.casper.network:7777 \
  --chain-name casper-test \
  --secret-key contracts/keys/new_account/secret_key.pem \
  --payment-amount 2500000000 \
  --session-hash hash-a854708de979d52e5df3fdc36d40897991fd785bb406fb78c65f32ce53fc2989 \
  --session-entry-point init
```

---

#### 2. Add `deposit` Entry Point
**Priority:** 🔴 Critical
**Status:** Not implemented

The contract needs a deposit function for users to lock CSPR on L1:

```rust
const EP_DEPOSIT: &str = "deposit";
const ARG_AMOUNT: &str = "amount";
const ARG_L2_ADDRESS: &str = "l2_address";
const KEY_DEPOSITS: &str = "deposits";

#[no_mangle]
pub extern "C" fn deposit() {
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    let l2_address: String = runtime::get_named_arg(ARG_L2_ADDRESS);

    // Transfer CSPR from caller to contract
    // Record deposit for L2 crediting
    // Emit event for sequencer
}
```

**Required changes:**
- Update `lib_full_v6.rs` with deposit logic
- Rebuild WASM with `wasm-opt` lowering
- Redeploy contract
- Update `addresses.testnet.json`
- Update `casperService.ts` with new contract hash

---

#### 3. Add `withdraw` Entry Point
**Priority:** 🔴 Critical
**Status:** Not implemented

Users need to withdraw CSPR from L2 back to L1:

```rust
const EP_WITHDRAW: &str = "withdraw";
const ARG_WITHDRAWAL_PROOF: &str = "withdrawal_proof";

#[no_mangle]
pub extern "C" fn withdraw() {
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    let proof: Vec<u8> = runtime::get_named_arg(ARG_WITHDRAWAL_PROOF);
    let recipient: AccountHash = runtime::get_named_arg("recipient");

    // Verify withdrawal proof (Merkle inclusion)
    // Transfer CSPR from contract to recipient
    // Update withdrawal records
}
```

---

#### 4. On-Chain ZK Proof Verification
**Priority:** 🔴 Critical
**Status:** Not implemented

Currently, the contract trusts the sequencer's proof. For trustless operation:

```rust
// Groth16 verification requires:
// 1. Verification key (embedded in contract)
// 2. Pairing-based cryptography (BN254 curve)
// 3. Public inputs (old_root, new_root, batch_hash)

pub extern "C" fn submit_batch() {
    let new_root: U512 = runtime::get_named_arg(ARG_ROOT);
    let proof: Vec<u8> = runtime::get_named_arg(ARG_PROOF);
    let public_inputs: Vec<U256> = runtime::get_named_arg("public_inputs");

    // Verify Groth16 proof
    let is_valid = groth16_verify(&VERIFICATION_KEY, &proof, &public_inputs);
    if !is_valid {
        runtime::revert(ApiError::User(1)); // Invalid proof
    }

    // Update state only if proof is valid
    // ...
}
```

**Challenges:**
- Casper WASM doesn't have native pairing crypto
- Need to port BN254 curve operations to no_std Rust
- Gas costs for on-chain verification may be high
- Consider zkSync/StarkNet approaches for optimization

---

### High Priority (Important for Demo)

#### 5. End-to-End Test Script
**Priority:** 🟠 High
**Status:** Partially implemented (`scripts/e2e-test.ts`)

Complete test flow:
1. Connect wallet
2. Deposit CSPR to L2
3. Execute L2 transfers
4. Generate batch proof
5. Submit batch to L1
6. Verify state root updated
7. Withdraw back to L1

---

#### 6. Real Merkle Tree Integration
**Priority:** 🟠 High
**Status:** Partially implemented

Connect `merkleTree.ts` to actual L2 account balances:

```typescript
// Current: Demo tree with random leaves
this.stateTree = new MerkleTree(4); // 16 leaves

// Target: Real account balance tree
interface L2Account {
  address: string;
  balance: U512;
  nonce: number;
}
const accountTree = new SparseMerkleTree<L2Account>();
```

---

#### 7. Sequencer Backend Service
**Priority:** 🟠 High
**Status:** Browser-only simulation

Move sequencer from browser to dedicated server:

```
Current: mockChain.ts (browser)
Target:  Dedicated Node.js/Rust service with:
         - Redis mempool
         - PostgreSQL state DB
         - Worker queue for proving
         - WebSocket API for frontend
```

---

### Medium Priority (Nice to Have)

#### 8. Proof Generation Optimization
**Priority:** 🟡 Medium
**Status:** Using snarkjs (slow)

Upgrade from snarkjs to rapidsnark for 10-100x faster proving:

```bash
# Current: ~4-10 seconds per proof (snarkjs)
# Target:  ~100-500ms per proof (rapidsnark)

# Install rapidsnark
git clone https://github.com/iden3/rapidsnark
cd rapidsnark && npm install && npx task buildProver
```

---

#### 9. Data Availability Layer
**Priority:** 🟡 Medium
**Status:** Not implemented

Store full transaction data for reconstruction:

Options:
- Casper L1 (expensive but simple)
- Celestia (dedicated DA layer)
- EigenDA (Ethereum-based)
- Custom solution (IPFS + availability proofs)

---

#### 10. Fraud Proof System (Optional)
**Priority:** 🟡 Medium
**Status:** Not applicable (ZK-Rollup)

ZK-Rollups use validity proofs, not fraud proofs. However, for optimistic mode fallback:

```rust
pub extern "C" fn challenge_batch() {
    // Allow anyone to challenge invalid state transitions
    // Provide fraud proof if sequencer misbehaves
    // Slash sequencer bond if fraud proven
}
```

---

### Low Priority (Future Enhancements)

#### 11. Multi-Token Support
**Priority:** 🟢 Low

Support CEP-18 tokens in addition to CSPR:
- Token deposit/withdrawal circuits
- Token balance tracking in Merkle tree
- Token transfer transactions

---

#### 12. Decentralized Sequencer
**Priority:** 🟢 Low

Remove single sequencer trust assumption:
- Sequencer rotation/election
- Consensus among sequencers
- MEV protection

---

#### 13. Cross-Rollup Communication
**Priority:** 🟢 Low

Enable transfers between different L2s:
- Shared bridge contracts
- Atomic swaps
- Message passing

---

## Current Status Summary

| Component | Status | Completeness |
|-----------|--------|--------------|
| ZK Circuits | ✅ Complete | 100% |
| Trusted Setup | ✅ Complete | 100% |
| Contract Deployment | ✅ Deployed | 100% |
| Contract Initialization | ❌ Pending | 0% |
| Deposit Entry Point | ❌ Missing | 0% |
| Withdraw Entry Point | ❌ Missing | 0% |
| On-Chain Verification | ❌ Missing | 0% |
| Frontend UI | ✅ Complete | 95% |
| Wallet Integration | ✅ Complete | 100% |
| Sequencer (Browser) | ✅ Complete | 100% |
| Prover Service | ✅ Complete | 100% |
| Merkle Tree | ✅ Complete | 90% |
| Observability | ✅ Complete | 100% |
| E2E Tests | 🟡 Partial | 50% |

**Overall Project Status:** ~70% Complete (Hackathon MVP Ready)

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Compile circuits (if needed)
./scripts/compile.sh

# Run frontend
npm run dev

# Build contract
cd contracts && cargo +nightly build --release --target wasm32-unknown-unknown

# Deploy contract (already done)
# See contracts/deploy.sh

# Initialize contract (TODO)
# casper-client put-deploy --session-entry-point init ...
```

---
 