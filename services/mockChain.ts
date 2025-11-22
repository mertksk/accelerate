
import { Transaction, TransactionStatus, BlockBatch } from '../types';
import { MerkleTree } from './merkleTree';

// Mock addresses
export const MOCK_ADDRESS = "01a4567b...8f2e";
export const SEQUENCER_ADDRESS = "01bb998a...seq1";

// Helpers
export const generateHash = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulation Parameters
export const BATCH_INTERVAL_MS = 6000; 
export const PROOF_TIME_MS = 4000;
export const L1_VERIFICATION_TIME_MS = 3000;

class ChainSimulator {
    private subscribers: (() => void)[] = [];
    private transactions: Transaction[] = [];
    private batches: BlockBatch[] = [];
    private isRunning = false;
    
    // Phase 3: Merkle State
    private stateTree: MerkleTree;
    private stateIndex = 0;

    constructor() {
        this.stateTree = new MerkleTree(4); // 16 leaves for demo
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

        await wait(PROOF_TIME_MS);

        // Update Batch with Proof
        this.batches = this.batches.map(b => 
            b.id === batchId ? { ...b, proofHash: `groth16_proof_${generateHash().substring(0, 8)}` } : b
        );
        this.notify();

        // 4. Simulate L1 Verification
        await this.simulateL1Verification(batchId);
    }

    private async simulateL1Verification(batchId: number) {
        await wait(L1_VERIFICATION_TIME_MS);

        // Finalize
        this.transactions = this.transactions.map(tx => 
            tx.batchId === batchId ? { ...tx, status: TransactionStatus.FINALIZED } : tx
        );

        this.batches = this.batches.map(b => 
            b.id === batchId ? { ...b, status: 'Verified' } : b
        );
        this.notify();
    }
}

export const chainSimulator = new ChainSimulator();
