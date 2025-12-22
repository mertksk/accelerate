// ZK Prover Service for Casper Accelerate
// Generates Groth16 proofs using snarkjs with real Poseidon Merkle proofs

import { Transaction } from '../types';
import { PoseidonMerkleTree, Account, MerkleProof } from './poseidonMerkleTree';

// Circuit configuration - using demo circuit for browser proving
// Demo: 2 transactions, 4-level tree (16 accounts), ~14K constraints
// Full: 10 transactions, 16-level tree (65K accounts), ~249K constraints
const CIRCUIT_BATCH_SIZE = 2;   // RollupBatchDemo(2, 4)
const TREE_DEPTH = 4;           // 4-level Merkle tree (16 accounts)

export interface AccountState {
    index: number;
    address: bigint;
    balance: bigint;
    nonce: bigint;
}

export interface TransactionInput {
    sender: AccountState;
    receiver: AccountState;
    amount: bigint;
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

export interface BatchProofResult {
    success: boolean;
    proof?: ProofOutput['proof'];
    publicSignals?: string[];
    proofHash?: string;
    error?: string;
    generationTimeMs?: number;
}

class ProverService {
    private snarkjs: any = null;
    private tree: PoseidonMerkleTree | null = null;
    private accounts: Map<string, AccountState> = new Map();
    private nextAccountIndex = 0;
    private wasmPath: string = '/circuits/rollup_demo.wasm';
    private zkeyPath: string = '/circuits/rollup_demo_final.zkey';
    private isInitialized = false;

    /**
     * Initialize snarkjs and Poseidon Merkle Tree
     */
    async init(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Initialize Poseidon Merkle Tree
            this.tree = new PoseidonMerkleTree(TREE_DEPTH);
            await this.tree.init();
            console.log('[ProverService] PoseidonMerkleTree initialized');

            // Load snarkjs in browser
            if (typeof window !== 'undefined') {
                if ((window as any).snarkjs) {
                    this.snarkjs = (window as any).snarkjs;
                    console.log('[ProverService] Using global snarkjs');
                } else {
                    const snarkjsModule = await import('snarkjs');
                    this.snarkjs = snarkjsModule;
                    (window as any).snarkjs = snarkjsModule;
                    console.log('[ProverService] snarkjs loaded via dynamic import');
                }
            } else {
                throw new Error('Prover requires browser environment');
            }

            this.isInitialized = true;
        } catch (error) {
            console.error('[ProverService] Initialization failed:', error);
            throw error;
        }
    }

    /**
     * Get or create an account in the state tree
     */
    getOrCreateAccount(address: string, initialBalance: bigint = BigInt(0)): AccountState {
        if (!this.tree) {
            throw new Error('[ProverService] Not initialized');
        }

        let account = this.accounts.get(address);
        if (!account) {
            const addressBigInt = this.addressToBigInt(address);
            account = {
                index: this.nextAccountIndex++,
                address: addressBigInt,
                balance: initialBalance,
                nonce: BigInt(0)
            };
            this.accounts.set(address, account);

            // Insert into Merkle tree
            this.tree.insert(account.index, {
                address: account.address,
                balance: account.balance,
                nonce: account.nonce
            });

            console.log(`[ProverService] Created account ${address} at index ${account.index}`);
        }
        return account;
    }

    /**
     * Update account balance
     */
    updateAccountBalance(address: string, newBalance: bigint, incrementNonce: boolean = false): void {
        if (!this.tree) {
            throw new Error('[ProverService] Not initialized');
        }

        const account = this.accounts.get(address);
        if (!account) {
            throw new Error(`[ProverService] Account ${address} not found`);
        }

        account.balance = newBalance;
        if (incrementNonce) {
            account.nonce += BigInt(1);
        }

        this.tree.insert(account.index, {
            address: account.address,
            balance: account.balance,
            nonce: account.nonce
        });
    }

    /**
     * Get current state root
     * Returns 0 if not initialized yet
     */
    getStateRoot(): bigint {
        if (!this.tree || !this.isInitialized) {
            return BigInt(0);
        }
        return this.tree.getRoot();
    }

    /**
     * Get Merkle proof for an account
     */
    getMerkleProof(address: string): MerkleProof {
        if (!this.tree) {
            throw new Error('[ProverService] Not initialized');
        }

        const account = this.accounts.get(address);
        if (!account) {
            throw new Error(`[ProverService] Account ${address} not found`);
        }

        return this.tree.getProof(account.index);
    }

    /**
     * Generate a proof for a batch of transactions
     */
    async generateBatchProof(
        transactions: Transaction[],
        oldRoot: string,
        newRoot: string
    ): Promise<BatchProofResult> {
        const startTime = Date.now();

        try {
            await this.init();

            if (!this.snarkjs || !this.tree) {
                throw new Error('Prover not properly initialized');
            }

            // Build circuit inputs with real Merkle proofs
            const input = await this.buildCircuitInput(transactions, oldRoot, newRoot);

            console.log('[ProverService] Generating real Groth16 proof...');
            console.log(`[ProverService] - Transactions: ${transactions.length}`);
            console.log(`[ProverService] - Old Root: ${oldRoot.substring(0, 20)}...`);
            console.log(`[ProverService] - New Root: ${newRoot.substring(0, 20)}...`);

            // Fetch circuit artifacts
            const [wasmBuffer, zkeyBuffer] = await Promise.all([
                fetch(this.wasmPath).then(r => r.arrayBuffer()),
                fetch(this.zkeyPath).then(r => r.arrayBuffer())
            ]);

            // Generate proof
            const { proof, publicSignals } = await this.snarkjs.groth16.fullProve(
                input,
                new Uint8Array(wasmBuffer),
                new Uint8Array(zkeyBuffer)
            );

            const generationTimeMs = Date.now() - startTime;
            const proofHash = this.createProofHash(proof);

            console.log(`[ProverService] Proof generated in ${generationTimeMs}ms`);

            return {
                success: true,
                proof: {
                    ...proof,
                    protocol: 'groth16',
                    curve: 'bn128'
                },
                publicSignals,
                proofHash,
                generationTimeMs
            };
        } catch (error) {
            console.error('[ProverService] Proof generation failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                generationTimeMs: Date.now() - startTime
            };
        }
    }

    /**
     * Build circuit input from transactions with real Merkle proofs
     */
    private async buildCircuitInput(
        transactions: Transaction[],
        oldRootStr: string,
        newRootStr: string
    ): Promise<CircuitInput> {
        if (!this.tree) {
            throw new Error('[ProverService] Tree not initialized');
        }

        // Pad transactions to match circuit size
        const paddedTxs = this.padTransactions(transactions);

        const input: CircuitInput = {
            oldRoot: oldRootStr,
            newRoot: newRootStr,
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
            tx_nonces: []
        };

        // Process each transaction
        for (const tx of paddedTxs) {
            const amount = BigInt(Math.floor(tx.amount * 1e9)); // Convert to motes

            // Get sender account (before transaction)
            const sender = this.getOrCreateAccount(tx.from, amount + BigInt(1000));
            const senderProof = this.getMerkleProof(tx.from);

            // Store sender state before update
            input.sender_addresses.push(sender.address.toString());
            input.sender_balances.push(sender.balance.toString());
            input.sender_nonces.push(sender.nonce.toString());
            input.sender_proofs.push(senderProof.pathElements.map(e => e.toString()));
            input.sender_paths.push(senderProof.pathIndices.map(i => i.toString()));
            input.tx_nonces.push(sender.nonce.toString());
            input.amounts.push(amount.toString());

            // Update sender state (deduct amount, increment nonce)
            this.updateAccountBalance(tx.from, sender.balance - amount, true);

            // Get receiver account (after sender update)
            const receiver = this.getOrCreateAccount(tx.to, BigInt(0));
            const receiverProof = this.getMerkleProof(tx.to);

            // Store receiver state before update
            input.receiver_addresses.push(receiver.address.toString());
            input.receiver_balances.push(receiver.balance.toString());
            input.receiver_nonces.push(receiver.nonce.toString());
            input.receiver_proofs.push(receiverProof.pathElements.map(e => e.toString()));
            input.receiver_paths.push(receiverProof.pathIndices.map(i => i.toString()));

            // Update receiver state (add amount)
            this.updateAccountBalance(tx.to, receiver.balance + amount, false);
        }

        return input;
    }

    /**
     * Pad transactions array to match circuit batch size
     */
    private padTransactions(transactions: Transaction[]): Transaction[] {
        const padded = [...transactions];

        if (padded.length > CIRCUIT_BATCH_SIZE) {
            console.warn(`[ProverService] Truncating ${padded.length} txs to ${CIRCUIT_BATCH_SIZE}`);
            return padded.slice(0, CIRCUIT_BATCH_SIZE);
        }

        // Pad with zero-amount transactions (no-ops)
        while (padded.length < CIRCUIT_BATCH_SIZE) {
            // Create a no-op transaction between the same address
            const noopAddress = '0x0000000000000000000000000000000000000000';
            padded.push({
                id: `0x${'0'.repeat(32)}`,
                from: noopAddress,
                to: noopAddress,
                amount: 0,
                timestamp: Date.now(),
                status: 'PADDING' as any
            });
        }

        return padded;
    }

    /**
     * Convert address string to bigint
     */
    private addressToBigInt(address: string): bigint {
        const clean = address.replace(/^0x/, '').replace(/[^0-9a-fA-F]/g, '');
        if (clean.length === 0) return BigInt(0);
        // Take first 32 hex chars (128 bits) to fit in field
        const truncated = clean.substring(0, 32).padEnd(32, '0');
        return BigInt('0x' + truncated);
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
    async verifyProof(
        proof: ProofOutput['proof'],
        publicSignals: string[]
    ): Promise<boolean> {
        await this.init();

        if (!this.snarkjs) {
            throw new Error('[ProverService] snarkjs not available');
        }

        try {
            const vkeyResponse = await fetch('/circuits/verification_key_demo.json');
            const vkey = await vkeyResponse.json();

            const isValid = await this.snarkjs.groth16.verify(vkey, publicSignals, proof);
            console.log(`[ProverService] Proof verification: ${isValid ? 'VALID' : 'INVALID'}`);
            return isValid;
        } catch (error) {
            console.error('[ProverService] Verification failed:', error);
            return false;
        }
    }

    /**
     * Get prover status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasSnarkjs: !!this.snarkjs,
            hasTree: !!this.tree,
            circuitBatchSize: CIRCUIT_BATCH_SIZE,
            treeDepth: TREE_DEPTH,
            accountCount: this.accounts.size,
            mode: 'production'
        };
    }

    /**
     * Get account balance
     */
    getAccountBalance(address: string): bigint {
        const account = this.accounts.get(address);
        return account ? account.balance : BigInt(0);
    }
}

// Singleton instance
export const proverService = new ProverService();
