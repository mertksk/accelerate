# Casper Accelerate

> A Zero-Knowledge Rollup (ZK-Rollup) Layer 2 scaling solution for the Casper Network.

## Overview

Casper Accelerate increases the smart contract throughput of the Casper Network by batching transactions off-chain and proving their validity using **Circom** circuits and **Groth16** proofs. This ensures that while execution scales off-chain, security remains anchored on Layer 1.

## Architecture

1.  **Frontend (Next.js + Tailwind):** User interface for wallet connection and transaction signing.
2.  **Sequencer (Node.js):** Batches transactions, maintains the Merkle State Tree, and orchestrates proof generation.
3.  **ZK Circuits (Circom):** Mathematical constraints enforcing transaction validity.
4.  **L1 Contracts (Rust):** Verifies proofs and stores the state root on the Casper Blockchain.

## Project Structure

```
├── circuits/           # ZK-SNARK circuits (Circom)
├── components/         # React UI Components
├── contracts/          # Casper Smart Contracts (Rust)
├── pages/              # Application Pages
├── services/           # Logic for Sequencer & Wallet
├── scripts/            # Build & Deploy scripts
└── App.tsx             # Main Entry Point
```

## Quick Start

### Prerequisites
*   Node.js v18+
*   Rust (wasm32-unknown-unknown target)
*   Circom 2.0+
*   Casper Wallet Extension

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Compile Circuits & Contracts:
    ```bash
    ./scripts/compile.sh
    ```

3.  Run Development Server (Next.js):
    ```bash
    npm run dev
    ```

4.  Build & Run Production Server:
    ```bash
    npm run build
    npm run start
    ```

5.  Lint:
    ```bash
    npm run lint
    ```

## Deployment

The project includes a `Dockerfile` for easy deployment.

```bash
docker build -t casper-accelerate .
docker run -p 80:80 casper-accelerate
```

## License
MIT
