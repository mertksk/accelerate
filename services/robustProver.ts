// Robust Proof Generation Service
// Uses Child Process with timeout, crash detection, and automatic retry

import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { stateManager } from './stateManager';
import { ProofJobDB, ProofJobStatus, BatchDB } from './db';
import { wsManager } from './wsManager';

// Configuration
const PROOF_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes max
const MAX_RETRIES = 2;
const CIRCUIT_BATCH_SIZE = 10;
const TREE_DEPTH = 16;

// Treasury address for L1 deposits (acts as minter)
const TREASURY_ADDRESS = '0x0000000000000000000000000000000000000001';
const L1_DEPOSIT_MARKER = 'L1_DEPOSIT';

const WASM_PATH = path.join(process.cwd(), 'public/circuits/rollup_merkle.wasm');
const ZKEY_PATH = path.join(process.cwd(), 'public/circuits/rollup_merkle_final.zkey');

export interface TransactionInput {
  from: string;
  to: string;
  amount: number;
}

export interface ProofResult {
  success: boolean;
  proof?: any;
  publicSignals?: string[];
  proofHash?: string;
  error?: string;
  duration?: number;
  retries?: number;
}

class RobustProver {
  private activeProcess: ChildProcess | null = null;
  private activeJobId: string | null = null;
  private timeoutHandle: NodeJS.Timeout | null = null;
  private retryCount: Map<string, number> = new Map();

  /**
   * Generate proof with child process, timeout, and retry
   */
  async generateProof(
    transactions: TransactionInput[],
    proofJobId: string,
    batchId: number
  ): Promise<ProofResult> {
    const retries = this.retryCount.get(proofJobId) || 0;

    try {
      // Check circuit files exist
      if (!fs.existsSync(WASM_PATH)) {
        throw new Error(`WASM not found: ${WASM_PATH}`);
      }
      if (!fs.existsSync(ZKEY_PATH)) {
        throw new Error(`ZKEY not found: ${ZKEY_PATH}`);
      }

      // Update status
      await this.updateProgress(proofJobId, batchId, 5, 'Building circuit input...', ProofJobStatus.BUILDING_WITNESS);

      // Build circuit input
      const { input, newRoot } = await this.buildCircuitInput(transactions, proofJobId, batchId);

      // Update batch with new root
      await BatchDB.updateRoot(batchId, newRoot);

      // Run proof in child process with timeout
      await this.updateProgress(proofJobId, batchId, 35, 'Starting proof generation process...', ProofJobStatus.GENERATING_PROOF);

      const result = await this.runChildProcessWithTimeout(input, proofJobId, batchId);

      if (result.success) {
        const proofHash = this.createProofHash(result.proof);
        await this.updateProgress(proofJobId, batchId, 100, 'Proof generated successfully!', ProofJobStatus.COMPLETED);

        return {
          success: true,
          proof: result.proof,
          publicSignals: result.publicSignals,
          proofHash,
          duration: result.duration,
          retries,
        };
      } else {
        throw new Error(result.error || 'Worker failed');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[RobustProver] Error (attempt ${retries + 1}):`, errorMsg);

      // Retry logic
      if (retries < MAX_RETRIES) {
        this.retryCount.set(proofJobId, retries + 1);
        console.log(`[RobustProver] Retrying... (${retries + 1}/${MAX_RETRIES})`);
        await this.updateProgress(proofJobId, batchId, 0, `Retrying (attempt ${retries + 2})...`, ProofJobStatus.QUEUED);

        // Wait before retry
        await new Promise(r => setTimeout(r, 5000));
        return this.generateProof(transactions, proofJobId, batchId);
      }

      await this.updateProgress(proofJobId, batchId, 0, `Failed: ${errorMsg}`, ProofJobStatus.FAILED);

      return {
        success: false,
        error: errorMsg,
        retries,
      };
    } finally {
      this.cleanup();
    }
  }

  /**
   * Run proof in child process with timeout
   */
  private runChildProcessWithTimeout(
    circuitInput: any,
    proofJobId: string,
    batchId: number
  ): Promise<{ success: boolean; proof?: any; publicSignals?: string[]; error?: string; duration?: number }> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(process.cwd(), 'services/proofChildProcess.cjs');

      if (!fs.existsSync(scriptPath)) {
        reject(new Error(`Child process script not found: ${scriptPath}`));
        return;
      }

      this.activeJobId = proofJobId;

      // Spawn child process with increased memory
      const child = spawn('node', ['--max-old-space-size=8192', scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.activeProcess = child;
      let stdout = '';
      let stderr = '';

      // Set timeout
      this.timeoutHandle = setTimeout(() => {
        console.error(`[RobustProver] Timeout after ${PROOF_TIMEOUT_MS / 1000}s`);
        child.kill('SIGKILL');
        reject(new Error(`Proof generation timed out after ${PROOF_TIMEOUT_MS / 1000} seconds`));
      }, PROOF_TIMEOUT_MS);

      // Send input to child process
      const inputData = JSON.stringify({
        circuitInput,
        wasmPath: WASM_PATH,
        zkeyPath: ZKEY_PATH,
      });
      child.stdin.write(inputData);
      child.stdin.end();

      // Collect stdout (result)
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      // Collect stderr (progress updates)
      child.stderr.on('data', async (data) => {
        stderr += data.toString();

        // Parse progress updates
        try {
          const lines = data.toString().split('\n').filter((l: string) => l.trim());
          for (const line of lines) {
            if (line.startsWith('{')) {
              const msg = JSON.parse(line);
              if (msg.type === 'progress') {
                await this.updateProgress(
                  proofJobId,
                  batchId,
                  msg.percent || 40,
                  `Proof: ${msg.stage}...`,
                  ProofJobStatus.GENERATING_PROOF
                );
              }
            }
          }
        } catch {
          // Ignore parse errors
        }
      });

      // Handle exit
      child.on('close', (code) => {
        this.clearTimeout();

        if (code === 0 && stdout.trim()) {
          try {
            const result = JSON.parse(stdout.trim());
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse result: ${stdout.substring(0, 200)}`));
          }
        } else {
          reject(new Error(`Process exited with code ${code}. stderr: ${stderr.substring(0, 500)}`));
        }
      });

      // Handle errors
      child.on('error', (error) => {
        this.clearTimeout();
        reject(error);
      });
    });
  }

  /**
   * Build circuit input from transactions
   */
  private async buildCircuitInput(
    transactions: TransactionInput[],
    proofJobId: string,
    batchId: number
  ): Promise<{ input: any; newRoot: string }> {
    const oldRoot = (await stateManager.getStateRoot()).toString();
    const paddedTxs = this.padTransactions(transactions);

    const input: any = {
      oldRoot,
      newRoot: '0',
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

    for (let i = 0; i < paddedTxs.length; i++) {
      const tx = paddedTxs[i];
      const amount = BigInt(Math.floor(tx.amount * 1e9));

      // Yield to event loop
      await new Promise(r => setImmediate(r));

      // Progress update
      const percent = 5 + Math.floor((i / paddedTxs.length) * 30);
      await this.updateProgress(
        proofJobId,
        batchId,
        percent,
        `Processing transaction ${i + 1}/${paddedTxs.length}...`,
        ProofJobStatus.BUILDING_WITNESS
      );

      // Handle L1 deposits: use treasury address as sender
      const senderAddress = tx.from === L1_DEPOSIT_MARKER ? TREASURY_ADDRESS : tx.from;

      // Get sender (treasury has large balance for deposits - 1 billion CSPR)
      const senderInitialBalance = tx.from === L1_DEPOSIT_MARKER
        ? BigInt('1000000000000000000') // 1 billion CSPR in motes
        : amount + BigInt(1000);
      const sender = await stateManager.getOrCreateAccount(senderAddress, senderInitialBalance);
      const senderProof = await stateManager.getMerkleProof(senderAddress);

      input.sender_addresses.push(sender.address.toString());
      input.sender_balances.push(sender.balance.toString());
      input.sender_nonces.push(sender.nonce.toString());
      input.sender_proofs.push(senderProof.pathElements.map((e: any) => e.toString()));
      input.sender_paths.push(senderProof.pathIndices.map((i: any) => i.toString()));
      input.tx_nonces.push(sender.nonce.toString());
      input.amounts.push(amount.toString());

      // Update sender balance
      await stateManager.updateAccountBalance(senderAddress, sender.balance - amount, true);

      // Get receiver
      const receiver = await stateManager.getOrCreateAccount(tx.to, BigInt(0));
      const receiverProof = await stateManager.getMerkleProof(tx.to);

      input.receiver_addresses.push(receiver.address.toString());
      input.receiver_balances.push(receiver.balance.toString());
      input.receiver_nonces.push(receiver.nonce.toString());
      input.receiver_proofs.push(receiverProof.pathElements.map((e: any) => e.toString()));
      input.receiver_paths.push(receiverProof.pathIndices.map((i: any) => i.toString()));

      // Update receiver
      const currentReceiver = await stateManager.getAccount(tx.to);
      await stateManager.updateAccountBalance(tx.to, currentReceiver!.balance + amount, false);
    }

    const newRoot = (await stateManager.getStateRoot()).toString();
    input.newRoot = newRoot;

    return { input, newRoot };
  }

  /**
   * Pad transactions to circuit batch size
   */
  private padTransactions(transactions: TransactionInput[]): TransactionInput[] {
    const padded = [...transactions];
    const noopAddr = '0x0000000000000000000000000000000000000000';

    while (padded.length < CIRCUIT_BATCH_SIZE) {
      padded.push({ from: noopAddr, to: noopAddr, amount: 0 });
    }

    return padded.slice(0, CIRCUIT_BATCH_SIZE);
  }

  /**
   * Update progress and broadcast via WebSocket
   */
  private async updateProgress(
    proofJobId: string,
    batchId: number,
    progress: number,
    message: string,
    status: ProofJobStatus
  ): Promise<void> {
    try {
      await ProofJobDB.updateProgress(proofJobId, progress, message, status);
      wsManager.broadcastProofProgress(proofJobId, batchId, status, progress, message);
      console.log(`[RobustProver] ${progress}% - ${message}`);
    } catch (e) {
      // Ignore progress update errors
    }
  }

  /**
   * Create proof hash
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
   * Clear timeout
   */
  private clearTimeout(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.clearTimeout();
    if (this.activeProcess) {
      try {
        this.activeProcess.kill('SIGKILL');
      } catch {
        // Ignore
      }
      this.activeProcess = null;
    }
    this.activeJobId = null;
  }

  /**
   * Force stop current proof
   */
  forceStop(): void {
    console.log('[RobustProver] Force stopping...');
    this.cleanup();
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      isActive: !!this.activeProcess,
      activeJobId: this.activeJobId,
      timeoutMs: PROOF_TIMEOUT_MS,
      maxRetries: MAX_RETRIES,
      batchSize: CIRCUIT_BATCH_SIZE,
      treeDepth: TREE_DEPTH,
    };
  }
}

export const robustProver = new RobustProver();
