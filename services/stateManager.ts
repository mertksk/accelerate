// State Manager Service for Casper Accelerate ZK-Rollup
// Manages Merkle tree state with database persistence

import { PoseidonMerkleTree, Account as MerkleAccount, MerkleProof } from './poseidonMerkleTree';
import { prisma, AccountDB, MerkleTreeStateDB } from './db';

// Production circuit parameters
const TREE_DEPTH = 16;  // 16-level tree (65K accounts)

export interface AccountState {
  index: number;
  address: bigint;
  balance: bigint;
  nonce: bigint;
}

class StateManager {
  private tree: PoseidonMerkleTree | null = null;
  private accountCache: Map<string, AccountState> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the state manager
   * Loads existing state from database if available
   */
  async init(): Promise<void> {
    // Prevent multiple initializations
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitialized) return;

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  private async _doInit(): Promise<void> {
    try {
      console.log('[StateManager] Initializing with TREE_DEPTH =', TREE_DEPTH);

      // Initialize Poseidon Merkle Tree
      this.tree = new PoseidonMerkleTree(TREE_DEPTH);
      await this.tree.init();

      // Load existing state from database
      await this.loadStateFromDatabase();

      this.isInitialized = true;
      console.log('[StateManager] Initialized successfully');
    } catch (error) {
      console.error('[StateManager] Initialization failed:', error);
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Load state from database and rebuild Merkle tree
   */
  private async loadStateFromDatabase(): Promise<void> {
    if (!this.tree) return;

    try {
      // Load all accounts from database
      const accounts = await prisma.account.findMany({
        orderBy: { treeIndex: 'asc' },
      });

      console.log(`[StateManager] Loading ${accounts.length} accounts from database`);

      // Insert each account into the Merkle tree
      for (const account of accounts) {
        const state: AccountState = {
          index: account.treeIndex,
          address: this.addressToBigInt(account.address),
          balance: account.balance,
          nonce: account.nonce,
        };

        // Cache the account
        this.accountCache.set(account.address, state);

        // Insert into tree
        this.tree.insert(account.treeIndex, {
          address: state.address,
          balance: state.balance,
          nonce: state.nonce,
        });
      }

      // Update/verify Merkle tree state in database
      const currentRoot = this.tree.getRoot().toString();
      await MerkleTreeStateDB.upsert(currentRoot, accounts.length, TREE_DEPTH);

      console.log(`[StateManager] State loaded. Root: ${currentRoot.substring(0, 20)}...`);
    } catch (error) {
      // Database might not be connected yet - this is okay for initial setup
      console.warn('[StateManager] Could not load state from database:', error);
    }
  }

  /**
   * Get or create an account
   */
  async getOrCreateAccount(address: string, initialBalance: bigint = BigInt(0)): Promise<AccountState> {
    await this.init();

    if (!this.tree) {
      throw new Error('[StateManager] Tree not initialized');
    }

    // Check cache first
    let state = this.accountCache.get(address);
    if (state) {
      return state;
    }

    // Get next tree index
    const nextIndex = await AccountDB.getNextTreeIndex();

    // Create in database
    const account = await AccountDB.getOrCreate(
      address,
      async () => nextIndex,
      initialBalance
    );

    // Build state object
    state = {
      index: account.treeIndex,
      address: this.addressToBigInt(address),
      balance: account.balance,
      nonce: account.nonce,
    };

    // Cache it
    this.accountCache.set(address, state);

    // Insert into tree
    this.tree.insert(state.index, {
      address: state.address,
      balance: state.balance,
      nonce: state.nonce,
    });

    // Update merkle state
    await this.persistRoot();

    console.log(`[StateManager] Created account ${address} at index ${state.index}`);
    return state;
  }

  /**
   * Get account state (returns null if not found)
   */
  async getAccount(address: string): Promise<AccountState | null> {
    await this.init();

    // Check cache
    const cached = this.accountCache.get(address);
    if (cached) {
      return cached;
    }

    // Check database
    const account = await AccountDB.getByAddress(address);
    if (!account) {
      return null;
    }

    // Build and cache state
    const state: AccountState = {
      index: account.treeIndex,
      address: this.addressToBigInt(address),
      balance: account.balance,
      nonce: account.nonce,
    };

    this.accountCache.set(address, state);
    return state;
  }

  /**
   * Update account balance
   */
  async updateAccountBalance(
    address: string,
    newBalance: bigint,
    incrementNonce: boolean = false
  ): Promise<void> {
    await this.init();

    if (!this.tree) {
      throw new Error('[StateManager] Tree not initialized');
    }

    const state = this.accountCache.get(address);
    if (!state) {
      throw new Error(`[StateManager] Account ${address} not found`);
    }

    // Prevent negative balances
    if (newBalance < BigInt(0)) {
      throw new Error(`[StateManager] Cannot set negative balance for ${address}`);
    }

    // Update in-memory state
    state.balance = newBalance;
    if (incrementNonce) {
      state.nonce += BigInt(1);
    }

    // Update Merkle tree
    this.tree.insert(state.index, {
      address: state.address,
      balance: state.balance,
      nonce: state.nonce,
    });

    // Persist to database
    await AccountDB.updateBalance(address, newBalance, incrementNonce);
  }

  /**
   * Get current state root
   */
  async getStateRoot(): Promise<bigint> {
    await this.init();

    if (!this.tree) {
      return BigInt(0);
    }

    return this.tree.getRoot();
  }

  /**
   * Get Merkle proof for an account
   */
  async getMerkleProof(address: string): Promise<MerkleProof> {
    await this.init();

    if (!this.tree) {
      throw new Error('[StateManager] Tree not initialized');
    }

    const state = this.accountCache.get(address);
    if (!state) {
      throw new Error(`[StateManager] Account ${address} not found`);
    }

    return this.tree.getProof(state.index);
  }

  /**
   * Persist current root to database
   */
  async persistRoot(): Promise<void> {
    if (!this.tree) return;

    const root = this.tree.getRoot().toString();
    const leafCount = this.accountCache.size;

    await MerkleTreeStateDB.upsert(root, leafCount, TREE_DEPTH);
  }

  /**
   * Process a transaction (update sender and receiver states)
   * Returns the state roots before and after
   */
  async processTransaction(
    fromAddress: string,
    toAddress: string,
    amount: bigint
  ): Promise<{ oldRoot: string; newRoot: string }> {
    await this.init();

    if (!this.tree) {
      throw new Error('[StateManager] Tree not initialized');
    }

    // Get old root before any changes
    const oldRoot = this.tree.getRoot().toString();

    // Get or create accounts
    const sender = await this.getOrCreateAccount(fromAddress, amount + BigInt(1000));
    const receiver = await this.getOrCreateAccount(toAddress, BigInt(0));

    // Update sender (deduct amount, increment nonce)
    await this.updateAccountBalance(fromAddress, sender.balance - amount, true);

    // Update receiver (add amount)
    const updatedReceiver = this.accountCache.get(toAddress)!;
    await this.updateAccountBalance(toAddress, updatedReceiver.balance + amount, false);

    // Get new root after changes
    const newRoot = this.tree.getRoot().toString();

    // Persist the new root
    await this.persistRoot();

    return { oldRoot, newRoot };
  }

  /**
   * Get account balance
   */
  async getAccountBalance(address: string): Promise<bigint> {
    const state = await this.getAccount(address);
    return state ? state.balance : BigInt(0);
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
   * Get status information
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasTree: !!this.tree,
      treeDepth: TREE_DEPTH,
      accountCount: this.accountCache.size,
    };
  }

  /**
   * Clear cache and reload from database
   * Useful for syncing state after external changes
   */
  async reload(): Promise<void> {
    this.accountCache.clear();
    this.isInitialized = false;
    this.initPromise = null;
    await this.init();
  }
}

// Singleton instance
export const stateManager = new StateManager();
