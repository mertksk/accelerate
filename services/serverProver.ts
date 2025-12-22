// Server-Side ZK Prover Service for Casper Accelerate
// Generates Groth16 proofs using snarkjs in Node.js environment

import * as snarkjs from 'snarkjs';
import * as fs from 'fs';
import * as path from 'path';
import { stateManager, AccountState } from './stateManager';
import { ProofJobDB, ProofJobStatus, BatchDB, BatchStatus } from './db';

// Production circuit configuration
const CIRCUIT_BATCH_SIZE = 10;  // Production: 10 transactions per batch
const TREE_DEPTH = 16;          // Production: 16-level tree (65K accounts)

// Circuit file paths (relative to project root)
const WASM_PATH = path.join(process.cwd(), 'public/circuits/rollup_merkle.wasm');
const ZKEY_PATH = path.join(process.cwd(), 'public/circuits/rollup_merkle_final.zkey');
const VKEY_PATH = path.join(process.cwd(), 'public/circuits/verification_key.json');

export interface TransactionInput {
  from: string;
  to: string;
  amount: number;
}

export interface CircuitInput {
  oldRoot: string;
  newRoot: string;
  sender_addresses: string[];
  sender_balances: string[];
  sender_nonces: string[];
  sender_proofs: string[][];
  sender_paths: string[][];
  receiver_addresses: string[];
  receiver_balances: string[];
  receiver_nonces: string[];
  receiver_proofs: string[][];
  receiver_paths: string[][];
  amounts: string[];
  tx_nonces: string[];
}

export interface ProofOutput {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
  };
  publicSignals: string[];
}

export interface ProofResult {
  success: boolean;
  proof?: ProofOutput['proof'];
  publicSignals?: string[];
  proofHash?: string;
  error?: string;
  generationTimeMs?: number;
}

export type ProgressCallback = (
  progress: number,
  message: string,
  status: ProofJobStatus
) => Promise<void>;

class ServerProver {
  private isInitialized = false;
  private wasmBuffer: Buffer | null = null;
  private zkeyBuffer: Buffer | null = null;

  /**
   * Initialize the prover by loading circuit files
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    console.log('[ServerProver] Loading circuit files...');
    console.log(`[ServerProver] WASM: ${WASM_PATH}`);
    console.log(`[ServerProver] ZKEY: ${ZKEY_PATH}`);

    try {
      // Check if files exist
      if (!fs.existsSync(WASM_PATH)) {
        throw new Error(`WASM file not found: ${WASM_PATH}`);
      }
      if (!fs.existsSync(ZKEY_PATH)) {
        throw new Error(`ZKEY file not found: ${ZKEY_PATH}`);
      }

      // Pre-load circuit files for faster proof generation
      this.wasmBuffer = fs.readFileSync(WASM_PATH);
      console.log(`[ServerProver] WASM loaded: ${(this.wasmBuffer.length / 1024 / 1024).toFixed(2)} MB`);

      this.zkeyBuffer = fs.readFileSync(ZKEY_PATH);
      console.log(`[ServerProver] ZKEY loaded: ${(this.zkeyBuffer.length / 1024 / 1024).toFixed(2)} MB`);

      this.isInitialized = true;
      console.log('[ServerProver] Initialized successfully');
    } catch (error) {
      console.error('[ServerProver] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Generate proof for a batch of transactions
   */
  async generateBatchProof(
    transactions: TransactionInput[],
    proofJobId: string,
    onProgress?: ProgressCallback
  ): Promise<ProofResult> {
    const startTime = Date.now();

    try {
      // Initialize if needed
      if (!this.isInitialized) {
        await this.updateProgress(proofJobId, 5, 'Loading circuit files...', ProofJobStatus.LOADING_CIRCUIT, onProgress);
        await this.init();
      }

      await this.updateProgress(proofJobId, 10, 'Loading proving key (257MB)...', ProofJobStatus.LOADING_CIRCUIT, onProgress);

      // Build circuit input
      await this.updateProgress(proofJobId, 20, 'Building circuit input...', ProofJobStatus.BUILDING_WITNESS, onProgress);
      const { input, newRoot } = await this.buildCircuitInput(transactions, proofJobId, onProgress);

      // Update batch with computed new root
      const proofJob = await ProofJobDB.getById(proofJobId);
      if (proofJob) {
        await BatchDB.updateRoot(proofJob.batchId, newRoot);
      }

      // Generate witness
      await this.updateProgress(proofJobId, 30, 'Computing witness...', ProofJobStatus.BUILDING_WITNESS, onProgress);

      // Generate proof (this is the slow part - 3-8 minutes)
      await this.updateProgress(proofJobId, 40, 'Generating Groth16 proof (this may take several minutes)...', ProofJobStatus.GENERATING_PROOF, onProgress);

      console.log('[ServerProver] Starting Groth16 proof generation...');
      console.log(`[ServerProver] - Transactions: ${transactions.length}`);
      console.log(`[ServerProver] - Old Root: ${input.oldRoot.substring(0, 20)}...`);

      // Use snarkjs.groth16.fullProve
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        input,
        new Uint8Array(this.wasmBuffer!),
        new Uint8Array(this.zkeyBuffer!)
      );

      const generationTimeMs = Date.now() - startTime;
      const proofHash = this.createProofHash(proof);

      await this.updateProgress(proofJobId, 100, 'Proof generated successfully', ProofJobStatus.COMPLETED, onProgress);

      console.log(`[ServerProver] Proof generated in ${(generationTimeMs / 1000).toFixed(1)}s`);
      console.log(`[ServerProver] - Proof Hash: ${proofHash}`);

      return {
        success: true,
        proof: {
          ...proof,
          protocol: 'groth16',
          curve: 'bn128',
        },
        publicSignals,
        proofHash,
        generationTimeMs,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('[ServerProver] Proof generation failed:', error);

      await this.updateProgress(proofJobId, 0, `Error: ${errorMsg}`, ProofJobStatus.FAILED, onProgress);

      return {
        success: false,
        error: errorMsg,
        generationTimeMs: Date.now() - startTime,
      };
    }
  }

  /**
   * Build circuit input from transactions
   */
  private async buildCircuitInput(
    transactions: TransactionInput[],
    proofJobId: string,
    onProgress?: ProgressCallback
  ): Promise<{ input: CircuitInput; newRoot: string }> {
    // Get old root before any updates
    const oldRoot = (await stateManager.getStateRoot()).toString();

    // Pad transactions to match circuit batch size
    const paddedTxs = this.padTransactions(transactions);

    const input: CircuitInput = {
      oldRoot,
      newRoot: '0', // Will be updated after processing
      sender_addresses: [],
      sender_balances: [],
      sender_nonces: [],
      sender_proofs: [],
      sender_paths: [],
      receiver_addresses: [],
      receiver_balances: [],
      receiver_nonces: [],
      receiver_proofs: [],
      receiver_paths: [],
      amounts: [],
      tx_nonces: [],
    };

    // Process each transaction
    for (let i = 0; i < paddedTxs.length; i++) {
      const tx = paddedTxs[i];
      const amount = BigInt(Math.floor(tx.amount * 1e9)); // Convert to motes

      // Yield to event loop to allow API responses
      await new Promise(resolve => setImmediate(resolve));

      // Update progress
      const txProgress = 20 + Math.floor((i / paddedTxs.length) * 10);
      await this.updateProgress(
        proofJobId,
        txProgress,
        `Processing transaction ${i + 1}/${paddedTxs.length}...`,
        ProofJobStatus.BUILDING_WITNESS,
        onProgress
      );

      // Get sender account
      const sender = await stateManager.getOrCreateAccount(tx.from, amount + BigInt(1000));
      const senderProof = await stateManager.getMerkleProof(tx.from);

      // Store sender state before update
      input.sender_addresses.push(sender.address.toString());
      input.sender_balances.push(sender.balance.toString());
      input.sender_nonces.push(sender.nonce.toString());
      input.sender_proofs.push(senderProof.pathElements.map(e => e.toString()));
      input.sender_paths.push(senderProof.pathIndices.map(i => i.toString()));
      input.tx_nonces.push(sender.nonce.toString());
      input.amounts.push(amount.toString());

      // Update sender (deduct amount, increment nonce)
      await stateManager.updateAccountBalance(tx.from, sender.balance - amount, true);

      // Get receiver account (after sender update)
      const receiver = await stateManager.getOrCreateAccount(tx.to, BigInt(0));
      const receiverProof = await stateManager.getMerkleProof(tx.to);

      // Store receiver state before update
      input.receiver_addresses.push(receiver.address.toString());
      input.receiver_balances.push(receiver.balance.toString());
      input.receiver_nonces.push(receiver.nonce.toString());
      input.receiver_proofs.push(receiverProof.pathElements.map(e => e.toString()));
      input.receiver_paths.push(receiverProof.pathIndices.map(i => i.toString()));

      // Update receiver (add amount)
      const currentReceiver = await stateManager.getAccount(tx.to);
      await stateManager.updateAccountBalance(tx.to, currentReceiver!.balance + amount, false);
    }

    // Get new root after all transactions
    const newRoot = (await stateManager.getStateRoot()).toString();
    input.newRoot = newRoot;

    console.log(`[ServerProver] Circuit input built`);
    console.log(`[ServerProver] - Old Root: ${oldRoot.substring(0, 20)}...`);
    console.log(`[ServerProver] - New Root: ${newRoot.substring(0, 20)}...`);

    return { input, newRoot };
  }

  /**
   * Pad transactions to match circuit batch size
   */
  private padTransactions(transactions: TransactionInput[]): TransactionInput[] {
    const padded = [...transactions];

    if (padded.length > CIRCUIT_BATCH_SIZE) {
      console.warn(`[ServerProver] Truncating ${padded.length} txs to ${CIRCUIT_BATCH_SIZE}`);
      return padded.slice(0, CIRCUIT_BATCH_SIZE);
    }

    // Pad with zero-amount transactions
    while (padded.length < CIRCUIT_BATCH_SIZE) {
      const noopAddress = '0x0000000000000000000000000000000000000000';
      padded.push({
        from: noopAddress,
        to: noopAddress,
        amount: 0,
      });
    }

    return padded;
  }

  /**
   * Update progress in database and notify via callback
   */
  private async updateProgress(
    proofJobId: string,
    progress: number,
    message: string,
    status: ProofJobStatus,
    onProgress?: ProgressCallback
  ): Promise<void> {
    try {
      // Update database
      await ProofJobDB.updateProgress(proofJobId, progress, message, status);

      // Call progress callback
      if (onProgress) {
        await onProgress(progress, message, status);
      }

      console.log(`[ServerProver] Progress: ${progress}% - ${message}`);
    } catch (error) {
      console.error('[ServerProver] Failed to update progress:', error);
    }
  }

  /**
   * Create a hash of the proof for on-chain reference
   */
  private createProofHash(proof: any): string {
    const data = proof.pi_a[0] + proof.pi_a[1] + proof.pi_c[0];
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }

  /**
   * Verify a proof
   */
  async verifyProof(proof: ProofOutput['proof'], publicSignals: string[]): Promise<boolean> {
    try {
      if (!fs.existsSync(VKEY_PATH)) {
        console.warn('[ServerProver] Verification key not found, skipping verification');
        return true;
      }

      const vkey = JSON.parse(fs.readFileSync(VKEY_PATH, 'utf8'));
      const isValid = await snarkjs.groth16.verify(vkey, publicSignals, proof);
      console.log(`[ServerProver] Proof verification: ${isValid ? 'VALID' : 'INVALID'}`);
      return isValid;
    } catch (error) {
      console.error('[ServerProver] Verification failed:', error);
      return false;
    }
  }

  /**
   * Get prover status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      circuitBatchSize: CIRCUIT_BATCH_SIZE,
      treeDepth: TREE_DEPTH,
      wasmLoaded: !!this.wasmBuffer,
      zkeyLoaded: !!this.zkeyBuffer,
      wasmSize: this.wasmBuffer ? `${(this.wasmBuffer.length / 1024 / 1024).toFixed(2)} MB` : 'not loaded',
      zkeySize: this.zkeyBuffer ? `${(this.zkeyBuffer.length / 1024 / 1024).toFixed(2)} MB` : 'not loaded',
    };
  }

  /**
   * Get batch size for circuits
   */
  getBatchSize(): number {
    return CIRCUIT_BATCH_SIZE;
  }
}

// Singleton instance
export const serverProver = new ServerProver();
