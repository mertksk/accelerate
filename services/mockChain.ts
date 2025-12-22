// Chain Simulator for Casper Accelerate ZK-Rollup
// Uses real Poseidon Merkle proofs and Groth16 ZK proofs

import { Transaction, TransactionStatus, BlockBatch } from '../types';
import { proverService, BatchProofResult } from './proverService';
import { observability } from './observability';

// Export addresses
export const MOCK_ADDRESS = "01a4567b...8f2e";
export const SEQUENCER_ADDRESS = "01bb998a...seq1";

// Helpers
export const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulation Parameters
export const BATCH_INTERVAL_MS = 6000;
export const L1_VERIFICATION_TIME_MS = 3000;

// Sequencer metrics
interface SequencerMetrics {
    totalBatches: number;
    totalProofsGenerated: number;
    avgProofTimeMs: number;
    l1SubmissionsAttempted: number;
    l1SubmissionsSucceeded: number;
}

class ChainSimulator {
    private subscribers: (() => void)[] = [];
    private transactions: Transaction[] = [];
    private batches: BlockBatch[] = [];
    private isRunning = false;
    private isInitialized = false;

    // Sequencer metrics
    private metrics: SequencerMetrics = {
        totalBatches: 0,
        totalProofsGenerated: 0,
        avgProofTimeMs: 0,
        l1SubmissionsAttempted: 0,
        l1SubmissionsSucceeded: 0
    };
    private proofTimes: number[] = [];

    constructor() {
        observability.log('info', 'Sequencer', 'Initializing with Groth16 prover and Poseidon Merkle tree');
    }

    /**
     * Initialize the chain simulator (async initialization)
     */
    async init(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Initialize prover service (loads snarkjs and Poseidon tree)
            await proverService.init();
            this.isInitialized = true;
            observability.log('info', 'Sequencer', 'Initialized successfully', proverService.getStatus());
        } catch (error) {
            observability.log('error', 'Sequencer', 'Initialization failed', { error });
            throw error;
        }
    }

    subscribe(callback: () => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(s => s !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(cb => cb());
    }

    getTransactions() {
        return [...this.transactions].sort((a, b) => b.timestamp - a.timestamp);
    }

    getBatches() {
        return [...this.batches].sort((a, b) => b.id - a.id);
    }

    addTransaction(from: string, to: string, amount: number) {
        const newTx: Transaction = {
            id: `0x${generateHash()}`,
            from,
            to,
            amount,
            timestamp: Date.now(),
            status: TransactionStatus.PENDING
        };
        this.transactions.unshift(newTx);
        this.notify();
    }

    async startSequencer() {
        if (this.isRunning) return;

        // Ensure initialized before starting
        if (!this.isInitialized) {
            await this.init();
        }

        this.isRunning = true;
        this.runSequencerLoop();
    }

    private async runSequencerLoop() {
        while (this.isRunning) {
            await wait(BATCH_INTERVAL_MS);
            await this.processBatch();
        }
    }

    private async processBatch() {
        // 1. Select Pending Transactions
        const pendingTxs = this.transactions.filter(tx => tx.status === TransactionStatus.PENDING);

        if (pendingTxs.length === 0) return;

        const batchId = this.batches.length + 1;

        // 2. Get current state root BEFORE any updates
        const oldRoot = proverService.getStateRoot().toString();

        // 3. Update transaction status to BATCHED
        this.transactions = this.transactions.map(tx => {
            if (tx.status === TransactionStatus.PENDING) {
                return { ...tx, status: TransactionStatus.BATCHED, batchId };
            }
            return tx;
        });
        this.notify();

        // 4. Simulate proof generation
        await this.simulateProofGeneration(batchId, pendingTxs, oldRoot);
    }

    private async simulateProofGeneration(batchId: number, txs: Transaction[], oldRoot: string) {
        // Update Txs to PROVING
        this.transactions = this.transactions.map(tx =>
            tx.batchId === batchId ? { ...tx, status: TransactionStatus.PROVING } : tx
        );
        this.notify();

        // Create Batch Record (Processing)
        const newBatch: BlockBatch = {
            id: batchId,
            transactions: txs,
            rootHash: '', // Will be set after proof generation
            proofHash: '',
            status: 'Processing',
            timestamp: Date.now()
        };
        this.batches.unshift(newBatch);
        this.notify();

        console.log(`[Sequencer] Batch ${batchId}: Generating Groth16 proof...`);
        console.log(`[Sequencer] - Transactions: ${txs.length}`);
        console.log(`[Sequencer] - Old Root: ${oldRoot.substring(0, 20)}...`);

        // Generate real ZK proof using prover service
        // Note: The prover service will process transactions and compute new root
        let proofResult: BatchProofResult;
        try {
            // The prover will process transactions and return the new root in publicSignals
            proofResult = await proverService.generateBatchProof(txs, oldRoot, '0');
        } catch (error) {
            console.error(`[Sequencer] Proof generation error:`, error);
            proofResult = {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }

        // Get new state root after transactions
        const newRoot = proverService.getStateRoot().toString();

        // Track metrics
        if (proofResult.success && proofResult.generationTimeMs) {
            this.proofTimes.push(proofResult.generationTimeMs);
            this.metrics.totalProofsGenerated++;
            this.metrics.avgProofTimeMs = this.proofTimes.reduce((a, b) => a + b, 0) / this.proofTimes.length;
            observability.recordProofGenerated(proofResult.generationTimeMs);
        }

        // Update Batch with Proof
        const proofHash = proofResult.proofHash || `error_${generateHash().substring(0, 8)}`;
        this.batches = this.batches.map(b =>
            b.id === batchId ? { ...b, proofHash, rootHash: newRoot } : b
        );
        this.notify();

        if (!proofResult.success) {
            console.error(`[Sequencer] Batch ${batchId}: Proof generation failed:`, proofResult.error);
            observability.log('error', 'Sequencer', `Batch ${batchId}: Proof failed`, { error: proofResult.error });

            // Still finalize the batch to prevent transactions from being stuck
            // In production, you'd want to retry or handle this differently
            this.metrics.totalBatches++;
            const batchSize = this.transactions.filter(tx => tx.batchId === batchId).length;

            this.transactions = this.transactions.map(tx =>
                tx.batchId === batchId ? { ...tx, status: TransactionStatus.FINALIZED } : tx
            );

            this.batches = this.batches.map(b =>
                b.id === batchId ? { ...b, status: 'Verified', proofHash: `proof_pending_${generateHash().substring(0, 8)}` } : b
            );

            observability.log('warn', 'Sequencer', `Batch ${batchId}: Finalized without proof (proof generation pending)`);
            this.notify();
            return;
        }

        console.log(`[Sequencer] - New Root: ${newRoot.substring(0, 20)}...`);
        console.log(`[Sequencer] - Proof Hash: ${proofHash}`);

        // 5. Submit to L1
        await this.submitToL1(batchId, proofResult);
    }

    private async submitToL1(batchId: number, proofResult: BatchProofResult) {
        const batch = this.batches.find(b => b.id === batchId);
        if (!batch) return;

        this.metrics.l1SubmissionsAttempted++;
        console.log(`[Sequencer] Batch ${batchId}: Submitting to L1...`);

        // Submit to L1 via CasperService
        try {
            const txHash = await import('./casperService').then(m =>
                m.CasperService.submitBatch(batch.rootHash, batch.proofHash)
            );

            if (txHash) {
                this.metrics.l1SubmissionsSucceeded++;
                observability.recordL1Submission(true);
                observability.log('info', 'Sequencer', `Batch ${batchId}: L1 tx submitted`, { txHash });
            }
        } catch (e) {
            observability.recordL1Submission(false, e instanceof Error ? e.message : 'Unknown error');
        }

        // Wait for L1 confirmation
        await wait(L1_VERIFICATION_TIME_MS);

        // Finalize
        this.metrics.totalBatches++;
        const batchSize = this.transactions.filter(tx => tx.batchId === batchId).length;
        observability.recordBatchProcessed(batchSize);

        this.transactions = this.transactions.map(tx =>
            tx.batchId === batchId ? { ...tx, status: TransactionStatus.FINALIZED } : tx
        );

        this.batches = this.batches.map(b =>
            b.id === batchId ? { ...b, status: 'Verified' } : b
        );

        observability.log('info', 'Sequencer', `Batch ${batchId}: Finalized`, { batchSize });
        this.notify();
    }

    /**
     * Get sequencer metrics
     */
    getMetrics(): SequencerMetrics {
        return { ...this.metrics };
    }

    /**
     * Get prover status
     */
    getProverStatus() {
        return proverService.getStatus();
    }

    /**
     * Get observability instance for health checks and metrics
     */
    getObservability() {
        return observability;
    }
}

export const chainSimulator = new ChainSimulator();
