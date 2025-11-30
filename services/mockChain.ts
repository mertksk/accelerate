
import { Transaction, TransactionStatus, BlockBatch } from '../types';
import { MerkleTree } from './merkleTree';
import { proverService, BatchProofResult } from './proverService';
import { observability } from './observability';

// Mock addresses
export const MOCK_ADDRESS = "01a4567b...8f2e";
export const SEQUENCER_ADDRESS = "01bb998a...seq1";

// Helpers
export const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulation Parameters
export const BATCH_INTERVAL_MS = 6000;
export const PROOF_TIME_MS = 4000;  // Fallback if real proof generation fails
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

    // Phase 3: Merkle State
    private stateTree: MerkleTree;
    private stateIndex = 0;

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
        this.stateTree = new MerkleTree(4); // 16 leaves for demo
        observability.log('info', 'Sequencer', 'Initialized with Groth16 prover');
        observability.log('info', 'Sequencer', 'Prover status', proverService.getStatus());
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

    startSequencer() {
        if (this.isRunning) return;
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
        
        if (pendingTxs.length === 0) return; // Nothing to batch

        const batchId = this.batches.length + 1;
        const oldRoot = this.stateTree.getRoot();

        // 2. Update Status to BATCHED and Update Merkle Tree (Phase 3)
        this.transactions = this.transactions.map(tx => {
            if (tx.status === TransactionStatus.PENDING) {
                // Simulate updating state leaf for this tx
                this.stateTree.insert(this.stateIndex % 16, tx.id); 
                this.stateIndex++;
                return { ...tx, status: TransactionStatus.BATCHED, batchId };
            }
            return tx;
        });
        
        const newRoot = this.stateTree.getRoot();
        this.notify();

        // 3. Simulate Proof Generation (Off-chain computation)
        await this.simulateProofGeneration(batchId, pendingTxs, oldRoot, newRoot);
    }

    private async simulateProofGeneration(batchId: number, txs: Transaction[], oldRoot: string, newRoot: string) {
        // Update Txs to PROVING
        this.transactions = this.transactions.map(tx =>
            tx.batchId === batchId ? { ...tx, status: TransactionStatus.PROVING } : tx
        );
        this.notify();

        // Create Batch Record (Processing)
        const newBatch: BlockBatch = {
            id: batchId,
            transactions: txs,
            rootHash: newRoot, // Phase 3: Real Merkle Root
            proofHash: '',
            status: 'Processing',
            timestamp: Date.now()
        };
        this.batches.unshift(newBatch);
        this.notify();

        console.log(`[Sequencer] Batch ${batchId}: Generating Groth16 proof...`);
        console.log(`[Sequencer] - Transactions: ${txs.length}`);
        console.log(`[Sequencer] - Old Root: ${oldRoot.substring(0, 16)}...`);
        console.log(`[Sequencer] - New Root: ${newRoot.substring(0, 16)}...`);

        // Generate real ZK proof using prover service
        let proofResult: BatchProofResult;
        try {
            proofResult = await proverService.generateBatchProof(txs, oldRoot, newRoot);
        } catch (error) {
            console.error(`[Sequencer] Proof generation error:`, error);
            // Fallback to simulated delay
            await wait(PROOF_TIME_MS);
            proofResult = {
                success: true,
                proofHash: `groth16_fallback_${generateHash().substring(0, 8)}`,
                generationTimeMs: PROOF_TIME_MS
            };
        }

        // Track metrics
        if (proofResult.success && proofResult.generationTimeMs) {
            this.proofTimes.push(proofResult.generationTimeMs);
            this.metrics.totalProofsGenerated++;
            this.metrics.avgProofTimeMs = this.proofTimes.reduce((a, b) => a + b, 0) / this.proofTimes.length;
            observability.recordProofGenerated(proofResult.generationTimeMs);
        }

        // Update Batch with Proof
        const proofHash = proofResult.proofHash || `groth16_${generateHash().substring(0, 8)}`;
        this.batches = this.batches.map(b =>
            b.id === batchId ? { ...b, proofHash } : b
        );
        this.notify();

        // 4. Submit to L1
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

        // Wait for L1 confirmation (simulated or real)
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
