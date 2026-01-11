/**
 * Casper Accelerate SDK
 * @package @accelerate/sdk
 * @description TypeScript SDK for integrating with Casper Accelerate ZK-Rollup
 */

import { AccelerateClient, SDK_VERSION } from './client';
import { EventManager } from './events';
import type {
  SDKConfig,
  Account,
  Transaction,
  Batch,
  ProofJob,
  SystemStatus,
  MerkleProof,
  WithdrawalResult,
  CreateTransactionParams,
  ListOptions,
  TransactionListOptions,
  BatchListOptions,
  PaginatedResult,
  EventHandlers,
  EventSubscription,
  TransactionStatus,
  RateLimitInfo,
  ProofProgressEvent,
  BatchUpdateEvent,
  TransactionUpdateEvent,
} from './types';
import { TimeoutError } from './errors';

export { SDK_VERSION };

// Re-export types
export * from './types';
export * from './errors';

/**
 * Main SDK class for interacting with Casper Accelerate ZK-Rollup
 *
 * @example
 * ```typescript
 * const sdk = new AccelerateSDK({
 *   apiKey: 'acc_test_sk_xxxxx',
 *   baseUrl: 'https://testnet.accelerate.casper.network'
 * });
 *
 * // Get balance
 * const balance = await sdk.accounts.getBalance('0x...');
 *
 * // Send transfer
 * const tx = await sdk.transactions.create({
 *   from: '0x...',
 *   to: '0x...',
 *   amount: 10 * 1e9
 * });
 *
 * // Subscribe to updates
 * sdk.events.subscribe({
 *   onTransactionUpdate: (e) => console.log(e.status)
 * });
 * ```
 */
export class AccelerateSDK {
  private readonly client: AccelerateClient;
  private readonly eventManager: EventManager;
  private readonly config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
    this.client = new AccelerateClient(config);
    this.eventManager = new EventManager(config);
  }

  /**
   * Get rate limit info from the last request
   */
  getRateLimitInfo(): RateLimitInfo | null {
    return this.client.getRateLimitInfo();
  }

  // ===========================================================================
  // Accounts API
  // ===========================================================================

  readonly accounts = {
    /**
     * Get account by address
     */
    get: async (address: string): Promise<Account> => {
      const response = await this.client.get<{ account: Account }>(
        `/api/accounts/${encodeURIComponent(address)}`
      );
      return response.account;
    },

    /**
     * List all accounts
     */
    list: async (options?: ListOptions): Promise<PaginatedResult<Account>> => {
      const response = await this.client.get<{
        accounts: Account[];
        count: number;
        total: number;
      }>('/api/accounts', {
        limit: options?.limit,
        offset: options?.offset,
      });
      return {
        data: response.accounts,
        count: response.count,
        total: response.total,
      };
    },

    /**
     * Get account balance in motes
     */
    getBalance: async (address: string): Promise<bigint> => {
      const account = await this.accounts.get(address);
      return BigInt(account.balance);
    },

    /**
     * Get Merkle proof for account
     */
    getMerkleProof: async (address: string): Promise<MerkleProof> => {
      const account = await this.accounts.get(address);
      if (!account.merkleProof) {
        throw new Error('Merkle proof not available for this account');
      }
      return account.merkleProof;
    },
  };

  // ===========================================================================
  // Transactions API
  // ===========================================================================

  readonly transactions = {
    /**
     * Create a new transaction
     */
    create: async (params: CreateTransactionParams): Promise<Transaction> => {
      const amount = typeof params.amount === 'bigint'
        ? params.amount.toString()
        : typeof params.amount === 'number'
          ? Math.floor(params.amount).toString()
          : params.amount;

      const response = await this.client.post<{ transaction: Transaction }>(
        '/api/transactions',
        {
          from: params.from,
          to: params.to,
          amount: Number(amount) / 1e9, // API expects ACCEL, not motes
          l1DepositHash: params.l1DepositHash,
        }
      );
      return response.transaction;
    },

    /**
     * Get transaction by ID
     */
    get: async (txId: string): Promise<Transaction> => {
      const response = await this.client.get<{ transaction: Transaction }>(
        `/api/transactions/${encodeURIComponent(txId)}`
      );
      return response.transaction;
    },

    /**
     * Get transaction by hash
     */
    getByHash: async (txHash: string): Promise<Transaction> => {
      const response = await this.client.get<{
        transactions: Transaction[];
      }>('/api/transactions', { hash: txHash });
      if (!response.transactions || response.transactions.length === 0) {
        throw new Error(`Transaction not found: ${txHash}`);
      }
      return response.transactions[0];
    },

    /**
     * List transactions
     */
    list: async (options?: TransactionListOptions): Promise<PaginatedResult<Transaction>> => {
      const response = await this.client.get<{
        transactions: Transaction[];
        count: number;
      }>('/api/transactions', {
        limit: options?.limit,
        offset: options?.offset,
        status: options?.status,
        batchId: options?.batchId,
        from: options?.from,
        to: options?.to,
      });
      return {
        data: response.transactions,
        count: response.count,
      };
    },

    /**
     * Wait for transaction to reach a specific status
     */
    waitForStatus: async (
      txId: string,
      targetStatus: TransactionStatus,
      timeoutMs: number = 300000 // 5 minutes default
    ): Promise<Transaction> => {
      const startTime = Date.now();
      const pollInterval = 2000; // 2 seconds

      while (Date.now() - startTime < timeoutMs) {
        const tx = await this.transactions.get(txId);

        if (tx.status === targetStatus) {
          return tx;
        }

        // If failed, throw immediately
        if (tx.status === 'FAILED') {
          throw new Error(`Transaction failed: ${txId}`);
        }

        // Check if we've passed the target status (status progression)
        const statusOrder = ['PENDING', 'BATCHED', 'PROVING', 'FINALIZED'];
        const currentIndex = statusOrder.indexOf(tx.status);
        const targetIndex = statusOrder.indexOf(targetStatus);

        if (currentIndex > targetIndex) {
          return tx; // Already past target status
        }

        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }

      throw new TimeoutError(
        `Timeout waiting for transaction ${txId} to reach ${targetStatus}`,
        timeoutMs
      );
    },
  };

  // ===========================================================================
  // Batches API
  // ===========================================================================

  readonly batches = {
    /**
     * Get batch by ID
     */
    get: async (batchId: number): Promise<Batch> => {
      const response = await this.client.get<{ batch: Batch }>(
        `/api/batches/${batchId}`
      );
      return response.batch;
    },

    /**
     * List batches
     */
    list: async (options?: BatchListOptions): Promise<PaginatedResult<Batch>> => {
      const response = await this.client.get<{
        batches: Batch[];
        count: number;
      }>('/api/batches', {
        limit: options?.limit,
        offset: options?.offset,
        status: options?.status,
      });
      return {
        data: response.batches,
        count: response.count,
      };
    },

    /**
     * Get the latest batch
     */
    getLatest: async (): Promise<Batch | null> => {
      const result = await this.batches.list({ limit: 1 });
      return result.data[0] || null;
    },
  };

  // ===========================================================================
  // Proofs API
  // ===========================================================================

  readonly proofs = {
    /**
     * Get proof job by ID
     */
    getJob: async (jobId: string): Promise<ProofJob> => {
      const response = await this.client.get<{ proofJob: ProofJob }>(
        `/api/proof-jobs/${encodeURIComponent(jobId)}`
      );
      return response.proofJob;
    },

    /**
     * Get proof job for a batch
     */
    getByBatch: async (batchId: number): Promise<ProofJob | null> => {
      const batch = await this.batches.get(batchId);
      return batch.proofJob || null;
    },
  };

  // ===========================================================================
  // Withdraw API
  // ===========================================================================

  readonly withdraw = {
    /**
     * Create a withdrawal from L2 to L1
     */
    create: async (
      address: string,
      amount: string | number | bigint
    ): Promise<WithdrawalResult> => {
      const amountStr = typeof amount === 'bigint'
        ? amount.toString()
        : typeof amount === 'number'
          ? Math.floor(amount).toString()
          : amount;

      return this.client.post<WithdrawalResult>('/api/withdraw', {
        address,
        amount: amountStr,
      });
    },
  };

  // ===========================================================================
  // Status API
  // ===========================================================================

  readonly status = {
    /**
     * Get system status
     */
    get: async (): Promise<SystemStatus> => {
      const response = await this.client.get<{ status: SystemStatus }>(
        '/api/status'
      );
      return response.status;
    },

    /**
     * Check if system is healthy
     */
    isHealthy: async (): Promise<boolean> => {
      try {
        const status = await this.status.get();
        return (
          status.database.connected &&
          status.sequencer.isInitialized &&
          status.stateManager.isInitialized
        );
      } catch {
        return false;
      }
    },
  };

  // ===========================================================================
  // Events API
  // ===========================================================================

  readonly events = {
    /**
     * Subscribe to real-time events
     */
    subscribe: (handlers: EventHandlers): EventSubscription => {
      return this.eventManager.subscribe(handlers);
    },

    /**
     * Subscribe to proof progress events
     */
    onProofProgress: (
      handler: (event: ProofProgressEvent) => void
    ): EventSubscription => {
      return this.eventManager.onProofProgress(handler);
    },

    /**
     * Subscribe to batch update events
     */
    onBatchUpdate: (
      handler: (event: BatchUpdateEvent) => void
    ): EventSubscription => {
      return this.eventManager.onBatchUpdate(handler);
    },

    /**
     * Subscribe to transaction update events
     */
    onTransactionUpdate: (
      handler: (event: TransactionUpdateEvent) => void
    ): EventSubscription => {
      return this.eventManager.onTransactionUpdate(handler);
    },

    /**
     * Disconnect from event stream
     */
    disconnect: (): void => {
      this.eventManager.disconnect();
    },

    /**
     * Check if connected to event stream
     */
    isConnected: (): boolean => {
      return this.eventManager.isConnected();
    },
  };

  // ===========================================================================
  // RPC API (L1 Casper Network)
  // ===========================================================================

  readonly rpc = {
    /**
     * Call Casper RPC method
     */
    call: async <T = unknown>(method: string, params: unknown[] = []): Promise<T> => {
      const response = await this.client.post<{ result: T }>('/api/rpc', {
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      });
      return response.result;
    },
  };
}

// Default export
export default AccelerateSDK;
