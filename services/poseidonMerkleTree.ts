// Poseidon Merkle Tree implementation for ZK Rollup
// Uses the same hash function as the circom circuit for compatibility

import { buildPoseidon } from 'circomlibjs';

export interface Account {
    address: bigint;
    balance: bigint;
    nonce: bigint;
}

export interface MerkleProof {
    pathElements: bigint[];
    pathIndices: number[];
    leaf: bigint;
    root: bigint;
}

export class PoseidonMerkleTree {
    private poseidon: any = null;
    private F: any = null;
    private levels: number;
    private leaves: bigint[];
    private zeroValue: bigint;
    private zeros: bigint[] = [];
    private initialized = false;

    constructor(levels: number = 16) {
        this.levels = levels;
        this.zeroValue = BigInt(0);
        this.leaves = [];
    }

    /**
     * Initialize the Poseidon hash function and zero values
     * Must be called before any other operations
     */
    async init(): Promise<void> {
        if (this.initialized) return;

        // Build Poseidon hash function from circomlibjs
        this.poseidon = await buildPoseidon();
        this.F = this.poseidon.F;

        // Precompute zero hashes for each level of the tree
        // zeros[0] = hash of empty leaf
        // zeros[i] = hash(zeros[i-1], zeros[i-1])
        this.zeros = new Array(this.levels + 1);
        this.zeros[0] = this.zeroValue;
        for (let i = 1; i <= this.levels; i++) {
            this.zeros[i] = this.hashTwo(this.zeros[i - 1], this.zeros[i - 1]);
        }

        // Initialize all leaves with zero value
        const numLeaves = Math.pow(2, this.levels);
        this.leaves = new Array(numLeaves).fill(this.zeroValue);

        this.initialized = true;
        console.log(`[PoseidonMerkleTree] Initialized with ${this.levels} levels (${numLeaves} leaves)`);
    }

    /**
     * Hash two values together using Poseidon
     */
    hashTwo(left: bigint, right: bigint): bigint {
        if (!this.poseidon) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }
        const hash = this.poseidon([left, right]);
        return this.F.toObject(hash);
    }

    /**
     * Hash an account state: H(address, balance, nonce)
     */
    hashAccount(account: Account): bigint {
        if (!this.poseidon) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }
        const hash = this.poseidon([account.address, account.balance, account.nonce]);
        return this.F.toObject(hash);
    }

    /**
     * Insert an account at the given index
     */
    insert(index: number, account: Account): void {
        if (!this.initialized) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }
        if (index < 0 || index >= this.leaves.length) {
            throw new Error(`[PoseidonMerkleTree] Index ${index} out of bounds [0, ${this.leaves.length})`);
        }
        const leafHash = this.hashAccount(account);
        this.leaves[index] = leafHash;
    }

    /**
     * Update a leaf directly with a hash value
     */
    updateLeaf(index: number, leaf: bigint): void {
        if (!this.initialized) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }
        if (index < 0 || index >= this.leaves.length) {
            throw new Error(`[PoseidonMerkleTree] Index ${index} out of bounds`);
        }
        this.leaves[index] = leaf;
    }

    /**
     * Get the current root of the tree
     */
    getRoot(): bigint {
        if (!this.initialized) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }

        let currentLevel = [...this.leaves];

        for (let level = 0; level < this.levels; level++) {
            const nextLevel: bigint[] = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = i + 1 < currentLevel.length
                    ? currentLevel[i + 1]
                    : this.zeros[level];
                nextLevel.push(this.hashTwo(left, right));
            }
            currentLevel = nextLevel;
        }

        return currentLevel[0];
    }

    /**
     * Get a Merkle proof for the leaf at the given index
     */
    getProof(index: number): MerkleProof {
        if (!this.initialized) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }
        if (index < 0 || index >= this.leaves.length) {
            throw new Error(`[PoseidonMerkleTree] Index ${index} out of bounds`);
        }

        const pathElements: bigint[] = [];
        const pathIndices: number[] = [];
        let currentIndex = index;
        let currentLevel = [...this.leaves];

        for (let level = 0; level < this.levels; level++) {
            // Get sibling index
            const siblingIndex = currentIndex % 2 === 0
                ? currentIndex + 1
                : currentIndex - 1;

            // Get sibling value (use zero if out of bounds)
            const sibling = siblingIndex < currentLevel.length
                ? currentLevel[siblingIndex]
                : this.zeros[level];

            pathElements.push(sibling);
            // pathIndices[i] = 0 means current is on left, 1 means current is on right
            pathIndices.push(currentIndex % 2);

            // Compute next level
            const nextLevel: bigint[] = [];
            for (let i = 0; i < currentLevel.length; i += 2) {
                const left = currentLevel[i];
                const right = i + 1 < currentLevel.length
                    ? currentLevel[i + 1]
                    : this.zeros[level];
                nextLevel.push(this.hashTwo(left, right));
            }

            currentLevel = nextLevel;
            currentIndex = Math.floor(currentIndex / 2);
        }

        return {
            pathElements,
            pathIndices,
            leaf: this.leaves[index],
            root: this.getRoot()
        };
    }

    /**
     * Verify a Merkle proof
     */
    verifyProof(proof: MerkleProof): boolean {
        if (!this.initialized) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }

        let currentHash = proof.leaf;

        for (let i = 0; i < proof.pathElements.length; i++) {
            const sibling = proof.pathElements[i];
            if (proof.pathIndices[i] === 0) {
                // Current is on left, sibling on right
                currentHash = this.hashTwo(currentHash, sibling);
            } else {
                // Current is on right, sibling on left
                currentHash = this.hashTwo(sibling, currentHash);
            }
        }

        return currentHash === proof.root;
    }

    /**
     * Get the leaf value at the given index
     */
    getLeaf(index: number): bigint {
        if (!this.initialized) {
            throw new Error('[PoseidonMerkleTree] Not initialized. Call init() first.');
        }
        return this.leaves[index];
    }

    /**
     * Get the number of levels in the tree
     */
    getLevels(): number {
        return this.levels;
    }

    /**
     * Get the total number of leaves
     */
    getLeafCount(): number {
        return this.leaves.length;
    }

    /**
     * Check if the tree is initialized
     */
    isInitialized(): boolean {
        return this.initialized;
    }
}

// Export a singleton factory for convenience
let _treeInstance: PoseidonMerkleTree | null = null;

export async function getPoseidonMerkleTree(levels: number = 16): Promise<PoseidonMerkleTree> {
    if (!_treeInstance) {
        _treeInstance = new PoseidonMerkleTree(levels);
        await _treeInstance.init();
    }
    return _treeInstance;
}
