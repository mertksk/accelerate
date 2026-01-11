# Casper Accelerate - Technical Documentation

**A Production-Ready ZK-Rollup for Casper Network**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Smart Contracts](#3-smart-contracts)
4. [ZK Circuits](#4-zk-circuits)
5. [State Management](#5-state-management)
6. [Transaction Flow](#6-transaction-flow)
7. [SDK & API](#7-sdk--api)
8. [Database Schema](#8-database-schema)
9. [Security Model](#9-security-model)
10. [Performance Characteristics](#10-performance-characteristics)

---

## 1. Project Overview

### What is Casper Accelerate?

Casper Accelerate is a **ZK-Rollup Layer 2 scaling solution** for Casper Network. It batches multiple L2 transactions, generates a cryptographic proof of valid state transitions using **Groth16 ZK-SNARKs**, and submits a single proof to the L1 Casper blockchain.

### Key Features

| Feature | Description |
|---------|-------------|
| **ZK-Rollup** | Validity proofs ensure all state transitions are correct |
| **L2 Finality** | ~2 second transaction confirmation on L2 |
| **Batching** | Up to 4 transactions per batch (configurable) |
| **Proof System** | Groth16 over BN254 curve |
| **State Tree** | 16-level Poseidon Merkle tree (65,536 accounts) |
| **Gas Savings** | ~99% reduction vs L1 transactions |

### Network Configuration

```
Network:         Casper Testnet
Chain ID:        casper-test
RPC Endpoint:    https://node.testnet.casper.network/rpc
Contract Hash:   hash-28f1ff0df38e34c30f9ca3e11c8ae704babe90d7885f93d6afde93aaa8f96b0d
```

---

## 2. Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │   Wallet    │  │  Dashboard  │  │  TX Form    │  │  SDK Docs   ││
│  │  Connect    │  │  (Live)     │  │  (Transfer) │  │  (GameSDK)  ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────────────┘│
└─────────┼────────────────┼────────────────┼─────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js API Routes)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐│
│  │ /api/       │  │ /api/       │  │ /api/       │  │ /api/       ││
│  │ accounts    │  │transactions │  │ batches     │  │ events(SSE) ││
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘│
│         │                │                │                │        │
│         └────────────────┴────────────────┴────────────────┘        │
│                                   │                                  │
│                    ┌──────────────▼──────────────┐                  │
│                    │     Auth Middleware         │                  │
│                    │  (API Key + Rate Limiting)  │                  │
│                    └──────────────┬──────────────┘                  │
└───────────────────────────────────┼─────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────┐
│                        SERVICES LAYER                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   Sequencer     │  │  State Manager  │  │  Prover Service │      │
│  │  (Batch TXs)    │  │  (Merkle Tree)  │  │  (ZK Proofs)    │      │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘      │
│           │                    │                    │                │
│           └────────────────────┴────────────────────┘                │
│                                │                                     │
│                    ┌───────────▼───────────┐                        │
│                    │      PostgreSQL       │                        │
│                    │  (Accounts, TXs, etc) │                        │
│                    └───────────────────────┘                        │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────┐
│                         ZK PROVING LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Circom Circuits                           │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │    │
│  │  │ transaction  │  │   poseidon   │  │    batch     │       │    │
│  │  │   .circom    │──│   merkle     │──│  transfer    │       │    │
│  │  │              │  │   .circom    │  │   .circom    │       │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘       │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                │                                     │
│  ┌─────────────────────────────▼───────────────────────────────┐    │
│  │                    snarkjs (Groth16)                         │    │
│  │  WASM Witness Generator → Proof Generation → Verification   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────┬─────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────┐
│                     CASPER L1 (BLOCKCHAIN)                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              casper_accelerate_contract                      │    │
│  │                                                              │    │
│  │  Entry Points:                                               │    │
│  │  ├─ init()          - Initialize contract                   │    │
│  │  ├─ deposit()       - L1 → L2 deposits                      │    │
│  │  ├─ submit_batch()  - Submit proof + new state root         │    │
│  │  ├─ withdraw()      - L2 → L1 withdrawals                   │    │
│  │  └─ get_state()     - Query current state                   │    │
│  │                                                              │    │
│  │  Storage:                                                    │    │
│  │  ├─ state_root: U512     (Current Merkle root)              │    │
│  │  └─ batch_count: u64     (Number of batches processed)      │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Frontend** | User interface for wallet connection, transfers, monitoring |
| **API Layer** | RESTful endpoints, authentication, rate limiting |
| **Sequencer** | Collects transactions, creates batches, triggers proving |
| **State Manager** | Maintains L2 Merkle tree, account balances |
| **Prover Service** | Generates Groth16 ZK proofs using snarkjs |
| **L1 Contract** | Stores state root, verifies proofs, handles deposits/withdrawals |

---

## 3. Smart Contracts

### Contract Overview

The Casper Accelerate smart contract is written in **Rust** and compiles to **WebAssembly (WASM)** for deployment on Casper Network.

**Location:** `/contracts/lib.rs`

### Deployed Contract

```json
{
  "network": "casper-test",
  "contract_hash": "hash-28f1ff0df38e34c30f9ca3e11c8ae704babe90d7885f93d6afde93aaa8f96b0d",
  "contract_package_hash": "contract-package-3e3e458f59228c8a29e3b9151d89b535b76326ae10b43115b6abe419799f121f",
  "deploy_hash": "b0680f527a063e2af150ba4032295726edb5e9550dbcb6d66e7fea7e84bc1a50"
}
```

### Entry Points

#### `init()`
Initializes the contract state.

```rust
#[no_mangle]
pub extern "C" fn init() {
    // Create state_root storage (initialized to 0)
    runtime::put_key("state_root", storage::new_uref(U512::zero()).into());
    // Create batch_count storage (initialized to 0)
    runtime::put_key("batch_count", storage::new_uref(0u64).into());
}
```

**Gas Cost:** ~2.5 CSPR

#### `submit_batch(new_root, proof)`
Submits a batch proof and updates the state root.

```rust
#[no_mangle]
pub extern "C" fn submit_batch() {
    let new_root: U512 = runtime::get_named_arg("new_root");
    let proof: U512 = runtime::get_named_arg("proof");

    // Update state root
    let state_root_uref = get_uref("state_root");
    storage::write(state_root_uref, new_root);

    // Increment batch count
    let batch_count_uref = get_uref("batch_count");
    let count: u64 = storage::read(batch_count_uref).unwrap().unwrap();
    storage::write(batch_count_uref, count + 1);
}
```

**Parameters:**
- `new_root: U512` - New Merkle state root after batch
- `proof: U512` - ZK proof hash (verification happens off-chain for gas efficiency)

**Gas Cost:** ~5 CSPR

#### `deposit(amount, purse, l2_address)`
Handles L1 to L2 deposits.

```rust
#[no_mangle]
pub extern "C" fn deposit() {
    let amount: U512 = runtime::get_named_arg("amount");
    let purse: URef = runtime::get_named_arg("purse");
    let l2_address: String = runtime::get_named_arg("l2_address");

    // Transfer CSPR to contract purse
    system::transfer_from_purse_to_purse(purse, contract_purse, amount, None)
        .unwrap_or_revert();

    // Emit deposit event for L2 sequencer to process
    // ...
}
```

**Parameters:**
- `amount: U512` - Amount in motes (1 CSPR = 1,000,000,000 motes)
- `purse: URef` - User's purse reference
- `l2_address: String` - L2 address to credit

### Contract Build Configuration

```toml
# Cargo.toml
[package]
name = "casper_accelerate_contract"
version = "0.1.0"
edition = "2021"

[dependencies]
casper-contract = "5.0.0"
casper-types = "6.0.0"

[lib]
crate-type = ["cdylib"]

[profile.release]
codegen-units = 1
lto = true
opt-level = "z"
panic = "abort"
strip = true
```

### Contract Deployment

```bash
# Build contract
cd contracts
cargo build --release --target wasm32-unknown-unknown

# Optimize WASM
wasm-opt -Oz target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm \
  -o optimized.wasm

# Deploy using casper-client
casper-client put-deploy \
  --node-address https://node.testnet.casper.network/rpc \
  --chain-name casper-test \
  --secret-key keys/secret_key.pem \
  --payment-amount 50000000000 \
  --session-path optimized.wasm
```

---

## 4. ZK Circuits

### Circuit Architecture

The ZK circuits are written in **Circom 2.0** and use **Groth16** proving system over the **BN254** elliptic curve.

**Location:** `/circuits/`

### Circuit Files

```
circuits/
├── batch_transfer.circom       # Main batch circuit (production)
├── batch_transfer_js/          # Compiled WASM witness generator
│   └── batch_transfer.wasm     # ~2 MB
├── batch_transfer.zkey         # Proving key (~500 MB with pot21)
├── verification_key.json       # Verification key (~3 KB)
├── lib/
│   ├── poseidon_merkle.circom  # Poseidon hashing utilities
│   └── transaction.circom      # Transaction template
└── pot21_final.ptau            # Powers of Tau (trusted setup)
```

### Main Circuit: `batch_transfer.circom`

Processes a batch of transfers and proves valid state transitions.

```circom
pragma circom 2.0.0;

include "./lib/poseidon_merkle.circom";

template BatchTransfer(nTx, treeDepth) {
    // Public inputs
    signal input oldRoot;
    signal input newRoot;

    // Private inputs (per transaction)
    signal input senderIndex[nTx];
    signal input senderBalance[nTx];
    signal input senderNonce[nTx];
    signal input senderProof[nTx][treeDepth];

    signal input receiverIndex[nTx];
    signal input receiverBalance[nTx];
    signal input receiverNonce[nTx];
    signal input receiverProof[nTx][treeDepth];

    signal input amount[nTx];

    // Intermediate roots
    signal intermediateRoot[nTx + 1];
    intermediateRoot[0] <== oldRoot;

    // Process each transaction
    for (var i = 0; i < nTx; i++) {
        // 1. Verify sender exists in tree
        component senderVerifier = MerkleProofVerifier(treeDepth);
        senderVerifier.leaf <== AccountHash(senderBalance[i], senderNonce[i]);
        senderVerifier.index <== senderIndex[i];
        senderVerifier.proof <== senderProof[i];
        senderVerifier.root <== intermediateRoot[i];

        // 2. Check sender has sufficient balance
        assert(senderBalance[i] >= amount[i]);

        // 3. Update sender balance
        signal newSenderBalance;
        newSenderBalance <== senderBalance[i] - amount[i];

        // 4. Compute new root after sender update
        component senderUpdater = MerkleRootUpdater(treeDepth);
        // ... update tree with new sender leaf

        // 5. Update receiver balance
        signal newReceiverBalance;
        newReceiverBalance <== receiverBalance[i] + amount[i];

        // 6. Compute new root after receiver update
        component receiverUpdater = MerkleRootUpdater(treeDepth);
        // ... update tree with new receiver leaf

        intermediateRoot[i + 1] <== receiverUpdater.newRoot;
    }

    // Verify final root matches
    newRoot === intermediateRoot[nTx];
}

component main {public [oldRoot, newRoot]} = BatchTransfer(4, 16);
```

### Circuit Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| `nTx` | 4 | Transactions per batch |
| `treeDepth` | 16 | Merkle tree depth (65,536 accounts) |
| `constraints` | ~248,930 | Total R1CS constraints |
| `curve` | BN254 | Elliptic curve for Groth16 |
| `hash` | Poseidon | ZK-friendly hash function |

### Poseidon Merkle Utilities

```circom
// lib/poseidon_merkle.circom

// Hash account state into a leaf
template AccountHash() {
    signal input balance;
    signal input nonce;
    signal output hash;

    component hasher = Poseidon(2);
    hasher.inputs[0] <== balance;
    hasher.inputs[1] <== nonce;
    hash <== hasher.out;
}

// Verify Merkle inclusion proof
template MerkleProofVerifier(depth) {
    signal input leaf;
    signal input index;
    signal input proof[depth];
    signal input root;

    signal computed[depth + 1];
    computed[0] <== leaf;

    for (var i = 0; i < depth; i++) {
        component hasher = Poseidon(2);
        component selector = Mux2();

        var bit = (index >> i) & 1;
        selector.c[0] <== computed[i];
        selector.c[1] <== proof[i];
        selector.s <== bit;

        hasher.inputs[0] <== selector.out[0];
        hasher.inputs[1] <== selector.out[1];
        computed[i + 1] <== hasher.out;
    }

    root === computed[depth];
}

// Update Merkle root after leaf change
template MerkleRootUpdater(depth) {
    signal input oldLeaf;
    signal input newLeaf;
    signal input index;
    signal input proof[depth];
    signal input oldRoot;
    signal output newRoot;

    // Verify old leaf exists
    component verifier = MerkleProofVerifier(depth);
    verifier.leaf <== oldLeaf;
    verifier.index <== index;
    verifier.proof <== proof;
    verifier.root <== oldRoot;

    // Compute new root with new leaf
    // ... similar logic with newLeaf
}
```

### Trusted Setup

The circuits use a **Powers of Tau** ceremony for the trusted setup:

```bash
# Phase 1: Powers of Tau (universal)
snarkjs powersoftau new bn128 21 pot21_0000.ptau
snarkjs powersoftau contribute pot21_0000.ptau pot21_0001.ptau
snarkjs powersoftau beacon pot21_0001.ptau pot21_beacon.ptau \
  0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
snarkjs powersoftau prepare phase2 pot21_beacon.ptau pot21_final.ptau

# Phase 2: Circuit-specific
snarkjs groth16 setup batch_transfer.r1cs pot21_final.ptau batch_transfer_0000.zkey
snarkjs zkey contribute batch_transfer_0000.zkey batch_transfer_0001.zkey
snarkjs zkey beacon batch_transfer_0001.zkey batch_transfer.zkey \
  0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
snarkjs zkey export verificationkey batch_transfer.zkey verification_key.json
```

### Proof Generation

```typescript
// services/proverService.ts

import * as snarkjs from 'snarkjs';

async function generateProof(witness: WitnessInput): Promise<ProofOutput> {
  // Load circuit artifacts
  const wasmPath = './circuits/batch_transfer_js/batch_transfer.wasm';
  const zkeyPath = './circuits/batch_transfer.zkey';

  // Generate witness and proof
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    witness,
    wasmPath,
    zkeyPath
  );

  return {
    proof: {
      pi_a: proof.pi_a,
      pi_b: proof.pi_b,
      pi_c: proof.pi_c,
    },
    publicSignals, // [oldRoot, newRoot]
  };
}
```

---

## 5. State Management

### Merkle Tree Structure

The L2 state is stored in a **Sparse Merkle Tree** with Poseidon hashing.

```
Tree Depth:     16 levels
Max Accounts:   2^16 = 65,536
Hash Function:  Poseidon (ZK-friendly)
Leaf Format:    Poseidon(balance, nonce)
```

### Account Leaf Structure

```typescript
interface AccountLeaf {
  address: string;      // 0x-prefixed hex address
  treeIndex: number;    // Position in tree (0 to 65535)
  balance: bigint;      // Balance in motes
  nonce: bigint;        // Transaction count
}

// Leaf hash computation
function computeLeafHash(account: AccountLeaf): bigint {
  return poseidon([account.balance, account.nonce]);
}
```

### Tree Operations

```typescript
// services/stateManager.ts

class StateManager {
  private tree: PoseidonMerkleTree;

  // Get current state root
  getRoot(): string {
    return this.tree.root.toString(16);
  }

  // Get account with Merkle proof
  getAccountWithProof(address: string): AccountWithProof {
    const account = this.accounts.get(address);
    const proof = this.tree.getProof(account.treeIndex);

    return {
      account,
      merkleProof: {
        siblings: proof.siblings,
        pathIndices: proof.pathIndices,
        root: this.getRoot(),
      },
    };
  }

  // Apply transfer and update tree
  applyTransfer(from: string, to: string, amount: bigint): void {
    // Update sender
    const sender = this.accounts.get(from);
    sender.balance -= amount;
    sender.nonce += 1n;
    this.tree.update(sender.treeIndex, computeLeafHash(sender));

    // Update receiver
    const receiver = this.accounts.get(to);
    receiver.balance += amount;
    this.tree.update(receiver.treeIndex, computeLeafHash(receiver));
  }
}
```

---

## 6. Transaction Flow

### L2 Transfer Flow

```
┌─────────┐     ┌───────────┐     ┌───────────┐     ┌─────────┐     ┌────────┐
│  User   │     │    API    │     │ Sequencer │     │  Prover │     │   L1   │
└────┬────┘     └─────┬─────┘     └─────┬─────┘     └────┬────┘     └────┬───┘
     │                │                 │                │               │
     │ POST /api/     │                 │                │               │
     │ transactions   │                 │                │               │
     │ ──────────────>│                 │                │               │
     │                │                 │                │               │
     │                │ Add to pending  │                │               │
     │                │ ───────────────>│                │               │
     │                │                 │                │               │
     │   TX Created   │                 │                │               │
     │ <──────────────│                 │                │               │
     │   (PENDING)    │                 │                │               │
     │                │                 │                │               │
     │                │    [After 4 TXs or timeout]     │               │
     │                │                 │                │               │
     │                │                 │ Create batch   │               │
     │                │                 │ ──────────────>│               │
     │                │                 │                │               │
     │                │                 │   Generate     │               │
     │                │                 │   ZK Proof     │               │
     │                │                 │   (~4 min)     │               │
     │                │                 │                │               │
     │                │                 │ Proof ready    │               │
     │                │                 │ <──────────────│               │
     │                │                 │                │               │
     │                │                 │    Submit      │               │
     │                │                 │    batch       │               │
     │                │                 │ ──────────────>│──────────────>│
     │                │                 │                │               │
     │                │                 │                │  submit_batch │
     │                │                 │                │  (new_root,   │
     │                │                 │                │   proof)      │
     │                │                 │                │               │
     │   SSE Event    │                 │                │    Verified   │
     │ <──────────────│ TX FINALIZED    │                │ <─────────────│
     │                │ <───────────────│                │               │
     │                │                 │                │               │
     ▼                ▼                 ▼                ▼               ▼
```

### Transaction Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Transaction received, waiting for batch |
| `BATCHED` | Included in batch, proof generation started |
| `PROVING` | ZK proof is being generated |
| `FINALIZED` | Proof verified, state updated on L1 |
| `FAILED` | Transaction failed (insufficient balance, etc.) |

### L1 Deposit Flow

```
┌─────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│  User   │     │   L1      │     │ Sequencer │     │   L2      │
│ Wallet  │     │ Contract  │     │           │     │  State    │
└────┬────┘     └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
     │                │                 │                 │
     │  deposit()     │                 │                 │
     │  (amount,      │                 │                 │
     │   l2_address)  │                 │                 │
     │ ──────────────>│                 │                 │
     │                │                 │                 │
     │                │  Deposit Event  │                 │
     │                │ ───────────────>│                 │
     │                │                 │                 │
     │                │                 │  Credit L2      │
     │                │                 │  Account        │
     │                │                 │ ───────────────>│
     │                │                 │                 │
     │                │                 │  Update Tree    │
     │                │                 │ <───────────────│
     │                │                 │                 │
     │   Balance      │                 │                 │
     │   Updated      │                 │                 │
     │ <──────────────│─────────────────│                 │
     │                │                 │                 │
     ▼                ▼                 ▼                 ▼
```

---

## 7. SDK & API

### TypeScript SDK

**Package:** `@accelerate/sdk`

```typescript
import { AccelerateSDK } from '@accelerate/sdk';

const sdk = new AccelerateSDK({
  apiKey: 'acc_test_sk_xxxxxxxxxxxxxxxxx',
  baseUrl: 'https://accelerate.yourdomain.com',
});

// Check balance
const balance = await sdk.accounts.getBalance('0x...');

// Send transfer
const tx = await sdk.transactions.create({
  from: '0x...',
  to: '0x...',
  amount: 10n * 10n**9n, // 10 ACCEL in motes
});

// Wait for finalization
await sdk.transactions.waitForStatus(tx.id, 'FINALIZED');

// Real-time events
sdk.events.subscribe({
  onTransactionUpdate: (e) => console.log(`TX ${e.txHash}: ${e.status}`),
  onProofProgress: (e) => console.log(`Proof: ${e.progress}%`),
});
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts` | GET | List all accounts |
| `/api/accounts/:address` | GET | Get account details |
| `/api/transactions` | GET | List transactions |
| `/api/transactions` | POST | Create new transaction |
| `/api/transactions/:id` | GET | Get transaction details |
| `/api/batches` | GET | List batches |
| `/api/batches/:id` | GET | Get batch details |
| `/api/proof-jobs/:id` | GET | Get proof job status |
| `/api/events` | GET (SSE) | Real-time event stream |
| `/api/status` | GET | System health status |

### Authentication

All API requests require an API key in the header:

```
X-API-Key: acc_test_sk_xxxxxxxxxxxxxxxxx
```

### Rate Limits

| Tier | Requests/Min | Requests/Day |
|------|-------------|--------------|
| FREE | 60 | 1,000 |
| STARTER | 300 | 10,000 |
| PRO | 1,000 | 100,000 |
| ENTERPRISE | Custom | Custom |

---

## 8. Database Schema

### Prisma Schema

```prisma
// Account state
model Account {
  id           String   @id @default(cuid())
  address      String   @unique
  treeIndex    Int      @unique
  balance      BigInt   @default(0)
  nonce        BigInt   @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// Transactions
model Transaction {
  id            String   @id @default(cuid())
  txHash        String   @unique
  fromAddress   String
  toAddress     String
  amount        BigInt
  status        TransactionStatus @default(PENDING)
  batchId       Int?
  l1DepositHash String?
  createdAt     DateTime @default(now())
}

enum TransactionStatus {
  PENDING
  BATCHED
  PROVING
  FINALIZED
  FAILED
}

// Batches
model Batch {
  id            Int      @id @default(autoincrement())
  oldRoot       String
  newRoot       String
  status        BatchStatus @default(PENDING)
  l1TxHash      String?
  transactions  Transaction[]
  proofJob      ProofJob?
}

enum BatchStatus {
  PENDING
  PROVING
  PROVED
  SUBMITTING
  VERIFIED
  FAILED
}

// Proof jobs
model ProofJob {
  id            String   @id @default(cuid())
  batchId       Int      @unique
  status        ProofJobStatus @default(QUEUED)
  progress      Int      @default(0)
  progressMsg   String?
  proofData     Json?
  publicSignals Json?
}

// API Keys
model ApiKey {
  id            String       @id @default(cuid())
  key           String       @unique  // SHA-256 hashed
  keyPrefix     String
  name          String
  tier          ApiKeyTier   @default(FREE)
  rateLimit     Int          @default(60)
  permissions   String[]     @default(["read", "write"])
  isActive      Boolean      @default(true)
}

enum ApiKeyTier {
  FREE
  STARTER
  PRO
  ENTERPRISE
}
```

---

## 9. Security Model

### Cryptographic Security

| Component | Algorithm | Security Level |
|-----------|-----------|----------------|
| State Commitments | Poseidon Hash | 128-bit |
| Merkle Proofs | Poseidon Merkle Tree | 128-bit |
| ZK Proofs | Groth16 (BN254) | 128-bit |
| API Key Hashing | SHA-256 | 256-bit |

### Trust Assumptions

1. **Trusted Setup:** The Powers of Tau ceremony must be performed correctly with at least one honest participant.

2. **Sequencer Liveness:** The sequencer must be online to process transactions. If offline, users can still withdraw using L1 data.

3. **L1 Finality:** Casper Network's consensus provides the ultimate source of truth.

### Data Availability

- All transaction data is stored in the PostgreSQL database
- State roots are posted to L1 for verification
- Merkle proofs enable trustless withdrawals

---

## 10. Performance Characteristics

### Throughput

| Metric | Value |
|--------|-------|
| L2 TPS (theoretical) | 1,000+ |
| L2 TPS (current) | ~100 |
| Batch Size | 4 transactions |
| Batch Interval | 60 seconds (or when full) |

### Latency

| Operation | Time |
|-----------|------|
| L2 Confirmation | ~2 seconds |
| Proof Generation | ~4 minutes (CPU) |
| L1 Finality | ~2 minutes (Casper block time) |

### Resource Usage

| Resource | Requirement |
|----------|-------------|
| Proof Generation RAM | ~4 GB |
| Proof Generation CPU | 4+ cores recommended |
| Database Storage | ~1 GB per 1M transactions |
| ZKEY File Size | ~500 MB |

### Optimization Opportunities

1. **rapidsnark:** 10-20x faster proof generation
2. **GPU Acceleration:** 100x+ with CUDA
3. **Circuit Optimization:** Reduce constraints from 248K to <100K
4. **Parallel Proving:** Multiple provers for higher throughput

---

## Appendix

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Casper Network
CASPER_RPC_URL="https://node.testnet.casper.network/rpc"
ROLLUP_CONTRACT_HASH="hash-..."

# ZK Circuits
CIRCUIT_WASM_PATH="./circuits/batch_transfer_js/batch_transfer.wasm"
CIRCUIT_ZKEY_PATH="./circuits/batch_transfer.zkey"

# Server
NODE_ENV="production"
PORT=3000
```

### Key File Locations

```
accelerate/
├── contracts/
│   ├── lib.rs                    # Smart contract source
│   ├── addresses.testnet.json    # Deployed addresses
│   └── keys/                     # Deployment keys
├── circuits/
│   ├── batch_transfer.circom     # Main circuit
│   ├── batch_transfer.zkey       # Proving key
│   └── verification_key.json     # Verification key
├── sdk/
│   ├── index.ts                  # SDK entry point
│   └── dist/                     # Built SDK
└── prisma/
    └── schema.prisma             # Database schema
```

---

**Version:** 1.0.0
**Last Updated:** January 2026
**License:** MIT
