// Sequencer Service for Casper Accelerate ZK-Rollup
// Coordinates batch processing, proof generation, and L1 submission

import {
  prisma,
  TransactionDB,
  BatchDB,
  ProofJobDB,
  TransactionStatus,
  BatchStatus,
  ProofJobStatus,
} from './db';
import { stateManager } from './stateManager';
import { robustProver, TransactionInput } from './robustProver';
import { wsManager, createProgressCallback } from './wsManager';
import { CasperService } from './casperService';
import { observability } from './observability';

// Configuration
const BATCH_SIZE = 10;          // Match circuit batch size
const BATCH_INTERVAL_MS = 30000; // Check for pending txs every 30s
const L1_CONFIRMATION_TIME_MS = 5000;

// Sequencer metrics
interface SequencerMetrics {
  totalBatches: number;
  totalProofsGenerated: number;
  avgProofTimeMs: number;
  l1SubmissionsAttempted: number;
  l1SubmissionsSucceeded: number;
  lastBatchTime?: Date;
}

class Sequencer {
  private isRunning = false;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private batchInterval: NodeJS.Timeout | null = null;
  private proofQueue: string[] = []; // Queue of proof job IDs
  private isProcessingProof = false;

  private metrics: SequencerMetrics = {
    totalBatches: 0,
    totalProofsGenerated: 0,
    avgProofTimeMs: 0,
    l1SubmissionsAttempted: 0,
    l1SubmissionsSucceeded: 0,
  };
  private proofTimes: number[] = [];

  /**
   * Initialize the sequencer
   */
  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    if (this.isInitialized) return;

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit(): Promise<void> {
    try {
      console.log('[Sequencer] Initializing...');

      // Initialize state manager
      await stateManager.init();

      // Resume any in-progress proof jobs
      await this.resumeProofJobs();

      this.isInitialized = true;
      console.log('[Sequencer] Initialized successfully');

      observability.log('info', 'Sequencer', 'Initialized', {
        batchSize: BATCH_SIZE,
        batchIntervalMs: BATCH_INTERVAL_MS,
      });
    } catch (error) {
      console.error('[Sequencer] Initialization failed:', error);
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Resume any proof jobs that were in progress when server restarted
   */
  private async resumeProofJobs(): Promise<void> {
    try {
      const activeJobs = await ProofJobDB.getActive();
      if (activeJobs.length > 0) {
        console.log(`[Sequencer] Resuming ${activeJobs.length} active proof jobs`);
        for (const job of activeJobs) {
          this.proofQueue.push(job.id);
        }
        // Start processing
        this.processProofQueue();
      }
    } catch (error) {
      console.warn('[Sequencer] Could not resume proof jobs:', error);
    }
  }

  /**
   * Start the sequencer
   */
  async start(): Promise<void> {
    if (this.isRunning) return;

    await this.init();

    this.isRunning = true;
    console.log('[Sequencer] Started');

    // Start batch interval
    this.batchInterval = setInterval(() => {
      this.checkAndProcessBatch();
    }, BATCH_INTERVAL_MS);

    // Do an immediate check
    this.checkAndProcessBatch();
  }

  /**
   * Stop the sequencer
   */
  stop(): void {
    this.isRunning = false;
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    console.log('[Sequencer] Stopped');
  }

  /**
   * Submit a new transaction
   */
  async submitTransaction(
    fromAddress: string,
    toAddress: string,
    amount: bigint,
    l1DepositHash?: string
  ): Promise<string> {
    await this.init();

    // Generate transaction hash
    const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2, 10)}`;

    // Handle L1 deposits differently (support both L1_BRIDGE and legacy L1_DEPOSIT)
    const isL1Deposit = (fromAddress === 'L1_BRIDGE' || fromAddress === 'L1_DEPOSIT') && l1DepositHash;

    if (isL1Deposit) {
      // For L1 deposits: credit the recipient with the deposited amount
      console.log(`[Sequencer] Processing L1 deposit: ${amount} motes to ${toAddress}`);

      // Ensure system account exists (for foreign key constraint)
      await stateManager.getOrCreateAccount(fromAddress, BigInt(0));

      // Get or create recipient account
      const recipient = await stateManager.getOrCreateAccount(toAddress, BigInt(0));

      // Credit the deposit amount to recipient
      const newBalance = recipient.balance + amount;
      await stateManager.updateAccountBalance(toAddress, newBalance, false);

      console.log(`[Sequencer] L1 deposit credited: ${toAddress} new balance = ${newBalance}`);
    } else {
      // For regular L2 transfers: check sender balance first
      const sender = await stateManager.getAccount(fromAddress);
      if (!sender) {
        throw new Error(`Sender account ${fromAddress} does not exist`);
      }
      if (sender.balance < amount) {
        throw new Error(`Insufficient balance: have ${sender.balance}, need ${amount}`);
      }
      // Ensure receiver account exists
      await stateManager.getOrCreateAccount(toAddress, BigInt(0));
    }

    // Create transaction in database
    const tx = await TransactionDB.create({
      txHash,
      fromAddress,
      toAddress,
      amount,
      l1DepositHash,
    });

    console.log(`[Sequencer] Transaction submitted: ${txHash}${isL1Deposit ? ' (L1 Deposit)' : ''}`);
    observability.log('info', 'Sequencer', 'Transaction submitted', { txHash, isL1Deposit });

    // Broadcast update
    wsManager.broadcastTransactionUpdate(tx.id, TransactionStatus.PENDING);

    return tx.id;
  }

  /**
   * Check for pending transactions and create batch if enough
   */
  private async checkAndProcessBatch(): Promise<void> {
    if (!this.isRunning) return;

    try {
      // Get pending transactions
      const pendingTxs = await TransactionDB.getPending(BATCH_SIZE);

      if (pendingTxs.length === 0) {
        return; // No pending transactions
      }

      console.log(`[Sequencer] Found ${pendingTxs.length} pending transactions`);

      // Create batch
      await this.createBatch(pendingTxs);
    } catch (error) {
      console.error('[Sequencer] Error checking for pending transactions:', error);
      observability.log('error', 'Sequencer', 'Error checking pending txs', { error });
    }
  }

  /**
   * Create a new batch from pending transactions
   */
  private async createBatch(
    transactions: Awaited<ReturnType<typeof TransactionDB.getPending>>
  ): Promise<void> {
    // Safety check: don't create empty batches
    if (transactions.length === 0) {
      console.log('[Sequencer] No transactions to batch, skipping');
      return;
    }

    const oldRoot = (await stateManager.getStateRoot()).toString();

    // Create batch record
    const batch = await BatchDB.create(oldRoot, '0'); // newRoot will be set after proof

    console.log(`[Sequencer] Creating batch ${batch.id} with ${transactions.length} transactions`);

    // Update transactions to BATCHED status
    const txIds = transactions.map(tx => tx.id);
    await TransactionDB.updateBatch(txIds, batch.id, TransactionStatus.BATCHED);

    // Broadcast transaction updates
    for (const tx of transactions) {
      wsManager.broadcastTransactionUpdate(tx.id, TransactionStatus.BATCHED, batch.id);
    }

    // Broadcast batch update
    wsManager.broadcastBatchUpdate(batch.id, BatchStatus.PENDING);

    // Create proof job
    const proofJob = await ProofJobDB.create(batch.id);

    // Queue proof job
    this.proofQueue.push(proofJob.id);
    console.log(`[Sequencer] Proof job ${proofJob.id} queued for batch ${batch.id}`);

    // Start processing if not already
    this.processProofQueue();
  }

  /**
   * Process the proof queue
   */
  private async processProofQueue(): Promise<void> {
    if (this.isProcessingProof) return;
    if (this.proofQueue.length === 0) return;

    this.isProcessingProof = true;

    while (this.proofQueue.length > 0 && this.isRunning) {
      const jobId = this.proofQueue.shift()!;
      await this.generateProof(jobId);
    }

    this.isProcessingProof = false;
  }

  /**
   * Generate proof for a batch
   */
  private async generateProof(proofJobId: string): Promise<void> {
    const proofJob = await ProofJobDB.getById(proofJobId);
    if (!proofJob) {
      console.error(`[Sequencer] Proof job ${proofJobId} not found`);
      return;
    }

    const batch = proofJob.batch;
    console.log(`[Sequencer] Starting proof generation for batch ${batch.id}`);

    // Update status to PROVING
    await BatchDB.updateStatus(batch.id, BatchStatus.PROVING);
    await ProofJobDB.updateStatus(proofJobId, ProofJobStatus.LOADING_CIRCUIT, {
      startedAt: new Date(),
    });

    // Update transactions to PROVING
    const batchTxs = await TransactionDB.list({ batchId: batch.id });
    for (const tx of batchTxs) {
      await TransactionDB.updateStatus(tx.id, TransactionStatus.PROVING);
      wsManager.broadcastTransactionUpdate(tx.id, TransactionStatus.PROVING, batch.id);
    }

    // Broadcast batch update
    wsManager.broadcastBatchUpdate(batch.id, BatchStatus.PROVING);

    // Prepare transaction inputs
    const txInputs: TransactionInput[] = batchTxs.map(tx => ({
      from: tx.fromAddress,
      to: tx.toAddress,
      amount: Number(tx.amount) / 1e9, // Convert back from motes
    }));

    // Generate proof using robust prover (worker thread + timeout + retry)
    const startTime = Date.now();
    const result = await robustProver.generateProof(txInputs, proofJobId, batch.id);
    const proofTimeMs = Date.now() - startTime;

    if (result.success) {
      // Update metrics
      this.proofTimes.push(proofTimeMs);
      this.metrics.totalProofsGenerated++;
      this.metrics.avgProofTimeMs = this.proofTimes.reduce((a, b) => a + b, 0) / this.proofTimes.length;
      observability.recordProofGenerated(proofTimeMs);

      // Update proof job
      await ProofJobDB.updateStatus(proofJobId, ProofJobStatus.COMPLETED, {
        progress: 100,
        progressMsg: 'Proof generated successfully',
        proofData: result.proof,
        publicSignals: result.publicSignals,
        proofHash: result.proofHash,
        completedAt: new Date(),
      });

      // Update batch
      await BatchDB.updateStatus(batch.id, BatchStatus.PROVED);
      wsManager.broadcastBatchUpdate(batch.id, BatchStatus.PROVED, result.proofHash);

      console.log(`[Sequencer] Proof generated for batch ${batch.id} in ${(proofTimeMs / 1000).toFixed(1)}s`);

      // Submit to L1
      await this.submitToL1(batch.id, result.proofHash!);
    } else {
      // Proof failed
      console.error(`[Sequencer] Proof generation failed for batch ${batch.id}:`, result.error);

      await ProofJobDB.updateStatus(proofJobId, ProofJobStatus.FAILED, {
        errorMessage: result.error,
        completedAt: new Date(),
      });

      await BatchDB.updateStatus(batch.id, BatchStatus.FAILED);
      wsManager.broadcastBatchUpdate(batch.id, BatchStatus.FAILED);

      // Mark transactions as failed
      for (const tx of batchTxs) {
        await TransactionDB.updateStatus(tx.id, TransactionStatus.FAILED);
        wsManager.broadcastTransactionUpdate(tx.id, TransactionStatus.FAILED, batch.id);
      }

      observability.log('error', 'Sequencer', `Batch ${batch.id} proof failed`, { error: result.error });
    }
  }

  /**
   * Submit batch to L1
   */
  private async submitToL1(batchId: number, proofHash: string): Promise<void> {
    const batch = await BatchDB.getById(batchId);
    if (!batch) return;

    console.log(`[Sequencer] Submitting batch ${batchId} to L1...`);

    await BatchDB.updateStatus(batchId, BatchStatus.SUBMITTING);
    wsManager.broadcastBatchUpdate(batchId, BatchStatus.SUBMITTING, proofHash);

    this.metrics.l1SubmissionsAttempted++;

    try {
      // Submit to L1 via CasperService
      const txHash = await CasperService.submitBatch(batch.newRoot, proofHash);

      if (txHash) {
        this.metrics.l1SubmissionsSucceeded++;
        observability.recordL1Submission(true);

        // Update batch with L1 tx hash
        await BatchDB.updateStatus(batchId, BatchStatus.VERIFIED, txHash);
        wsManager.broadcastBatchUpdate(batchId, BatchStatus.VERIFIED, proofHash, txHash);

        console.log(`[Sequencer] Batch ${batchId} submitted to L1: ${txHash}`);
      } else {
        // L1 submission returned null (might be simulated mode)
        await BatchDB.updateStatus(batchId, BatchStatus.VERIFIED);
        wsManager.broadcastBatchUpdate(batchId, BatchStatus.VERIFIED, proofHash);
      }
    } catch (error) {
      console.error(`[Sequencer] L1 submission failed for batch ${batchId}:`, error);
      observability.recordL1Submission(false, error instanceof Error ? error.message : 'Unknown error');

      // Still mark as verified locally
      await BatchDB.updateStatus(batchId, BatchStatus.VERIFIED);
      wsManager.broadcastBatchUpdate(batchId, BatchStatus.VERIFIED, proofHash);
    }

    // Update metrics
    this.metrics.totalBatches++;
    this.metrics.lastBatchTime = new Date();

    // Finalize transactions
    const batchTxs = await TransactionDB.list({ batchId });
    for (const tx of batchTxs) {
      await TransactionDB.updateStatus(tx.id, TransactionStatus.FINALIZED);
      wsManager.broadcastTransactionUpdate(tx.id, TransactionStatus.FINALIZED, batchId);
    }

    observability.recordBatchProcessed(batchTxs.length);
    console.log(`[Sequencer] Batch ${batchId} finalized with ${batchTxs.length} transactions`);
  }

  /**
   * Force create a batch from pending transactions
   */
  async forceBatch(): Promise<number | null> {
    await this.init();

    const pendingTxs = await TransactionDB.getPending(BATCH_SIZE);
    if (pendingTxs.length === 0) {
      return null;
    }

    await this.createBatch(pendingTxs);

    // Return the batch ID
    const latestBatch = await BatchDB.getLatest();
    return latestBatch?.id ?? null;
  }

  /**
   * Get sequencer metrics
   */
  getMetrics(): SequencerMetrics {
    return { ...this.metrics };
  }

  /**
   * Get sequencer status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      isInitialized: this.isInitialized,
      proofQueueLength: this.proofQueue.length,
      isProcessingProof: this.isProcessingProof,
      batchSize: BATCH_SIZE,
      batchIntervalMs: BATCH_INTERVAL_MS,
      metrics: this.metrics,
    };
  }

  /**
   * Resume processing queued proof jobs (call after server restart)
   */
  async resumeProofs(): Promise<number> {
    // Ensure sequencer is running
    await this.start();

    // Get all queued proof jobs from database
    const queuedJobs = await ProofJobDB.getActive();
    let added = 0;

    for (const job of queuedJobs) {
      if (!this.proofQueue.includes(job.id)) {
        this.proofQueue.push(job.id);
        added++;
      }
    }

    console.log(`[Sequencer] Resumed ${added} proof jobs, queue length: ${this.proofQueue.length}`);

    // Always try to start processing if queue has items
    if (this.proofQueue.length > 0 && !this.isProcessingProof) {
      console.log('[Sequencer] Starting proof queue processing...');
      this.processProofQueue();
    }

    return this.proofQueue.length;
  }
}

// Singleton instance
export const sequencer = new Sequencer();
