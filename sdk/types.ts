/**
 * Casper Accelerate SDK - Type Definitions
 * @package @accelerate/sdk
 */

// ============================================================================
// Enums
// ============================================================================

export enum TransactionStatus {
  PENDING = 'PENDING',
  BATCHED = 'BATCHED',
  PROVING = 'PROVING',
  FINALIZED = 'FINALIZED',
  FAILED = 'FAILED'
}

export enum BatchStatus {
  PENDING = 'PENDING',
  PROVING = 'PROVING',
  PROVED = 'PROVED',
  SUBMITTING = 'SUBMITTING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED'
}

export enum ProofJobStatus {
  QUEUED = 'QUEUED',
  LOADING_CIRCUIT = 'LOADING_CIRCUIT',
  BUILDING_WITNESS = 'BUILDING_WITNESS',
  GENERATING_PROOF = 'GENERATING_PROOF',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ApiKeyTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

// ============================================================================
// SDK Configuration
// ============================================================================

export interface SDKConfig {
  /** API key for authentication (required) */
  apiKey: string;

  /** Base URL of the Accelerate API (default: https://accelerate.casper.network) */
  baseUrl?: string;

  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;

  /** Number of retry attempts for failed requests (default: 3) */
  retries?: number;

  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number;

  /** Auto-reconnect SSE on disconnect (default: true) */
  autoReconnect?: boolean;

  /** SSE reconnect delay in milliseconds (default: 3000) */
  reconnectDelay?: number;
}

// ============================================================================
// Core Data Types
// ============================================================================

export interface Account {
  id: string;
  address: string;
  treeIndex: number;
  balance: string;
  nonce: string;
  createdAt: string;
  updatedAt: string;
  merkleProof?: MerkleProof;
}

export interface MerkleProof {
  pathElements: string[];
  pathIndices: number[];
  leaf: string;
  root: string;
}

export interface Transaction {
  id: string;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  status: TransactionStatus;
  batchId?: number | null;
  l1DepositHash?: string | null;
  createdAt: string;
  updatedAt: string;
  batch?: Batch | null;
}

export interface Batch {
  id: number;
  oldRoot: string;
  newRoot: string;
  status: BatchStatus;
  l1TxHash?: string | null;
  transactions: Transaction[];
  proofJob?: ProofJob | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProofJob {
  id: string;
  batchId: number;
  status: ProofJobStatus;
  progress: number;
  progressMsg?: string | null;
  proofData?: ProofData | null;
  publicSignals?: string[] | null;
  proofHash?: string | null;
  errorMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProofData {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  protocol: string;
  curve: string;
}

export interface SystemStatus {
  database: {
    connected: boolean;
  };
  sequencer: {
    isRunning: boolean;
    isInitialized: boolean;
    proofQueueLength: number;
    isProcessingProof: boolean;
    batchSize: number;
    batchIntervalMs: number;
    metrics: {
      totalBatches: number;
      totalProofsGenerated: number;
      avgProofTimeMs: number;
      l1SubmissionsAttempted: number;
      l1SubmissionsSucceeded: number;
      lastBatchTime?: string;
    };
  };
  stateManager: {
    isInitialized: boolean;
    hasTree: boolean;
    treeDepth: number;
    accountCount: number;
  };
  prover: {
    isInitialized: boolean;
    circuitBatchSize: number;
    treeDepth: number;
    wasmLoaded: boolean;
    zkeyLoaded: boolean;
  };
  websocket: {
    subscriberCount: number;
    lastMessageCount: number;
  };
  stats: {
    pendingTxCount: number;
    totalTxCount: number;
    batchCount: number;
    accountCount: number;
  };
  stateRoot: string;
  timestamp: string;
}

// ============================================================================
// Request Types
// ============================================================================

export interface CreateTransactionParams {
  /** Sender address */
  from: string;
  /** Recipient address */
  to: string;
  /** Amount in motes (1 ACCEL = 1e9 motes) */
  amount: string | number | bigint;
  /** L1 deposit hash (for L1→L2 deposits) */
  l1DepositHash?: string;
}

export interface ListOptions {
  /** Maximum number of results (default: 50, max: 100) */
  limit?: number;
  /** Number of results to skip (default: 0) */
  offset?: number;
}

export interface TransactionListOptions extends ListOptions {
  /** Filter by status */
  status?: TransactionStatus;
  /** Filter by batch ID */
  batchId?: number;
  /** Filter by sender address */
  from?: string;
  /** Filter by recipient address */
  to?: string;
}

export interface BatchListOptions extends ListOptions {
  /** Filter by status */
  status?: BatchStatus;
}

// ============================================================================
// Response Types
// ============================================================================

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  total?: number;
}

export interface WithdrawalResult {
  withdrawalId: string;
  newBalance: string;
  amountWithdrawn: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Event Types
// ============================================================================

export interface ProofProgressEvent {
  type: 'PROOF_PROGRESS';
  jobId: string;
  batchId: number;
  status: ProofJobStatus;
  progress: number;
  progressMsg: string;
  estimatedTimeMs?: number;
}

export interface BatchUpdateEvent {
  type: 'BATCH_UPDATE';
  batchId: number;
  status: BatchStatus;
  proofHash?: string;
  l1TxHash?: string;
}

export interface TransactionUpdateEvent {
  type: 'TX_UPDATE';
  txId: string;
  status: TransactionStatus;
  batchId?: number;
}

export interface ConnectedEvent {
  type: 'CONNECTED';
  clientId: string;
}

export interface PingEvent {
  type: 'PING';
  timestamp: number;
}

export type SDKEvent =
  | ProofProgressEvent
  | BatchUpdateEvent
  | TransactionUpdateEvent
  | ConnectedEvent
  | PingEvent;

export interface EventHandlers {
  onProofProgress?: (event: ProofProgressEvent) => void;
  onBatchUpdate?: (event: BatchUpdateEvent) => void;
  onTransactionUpdate?: (event: TransactionUpdateEvent) => void;
  onConnect?: (clientId: string) => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface EventSubscription {
  /** Unsubscribe from events */
  unsubscribe: () => void;
  /** Check if connected to event stream */
  isConnected: () => boolean;
}

// ============================================================================
// Rate Limiting
// ============================================================================

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  dailyLimit?: number;
  dailyRemaining?: number;
}

// ============================================================================
// SDK Namespaces (for type hints)
// ============================================================================

export interface AccountsAPI {
  get(address: string): Promise<Account>;
  list(options?: ListOptions): Promise<PaginatedResult<Account>>;
  getBalance(address: string): Promise<bigint>;
  getMerkleProof(address: string): Promise<MerkleProof>;
}

export interface TransactionsAPI {
  create(params: CreateTransactionParams): Promise<Transaction>;
  get(txId: string): Promise<Transaction>;
  getByHash(txHash: string): Promise<Transaction>;
  list(options?: TransactionListOptions): Promise<PaginatedResult<Transaction>>;
  waitForStatus(txId: string, status: TransactionStatus, timeoutMs?: number): Promise<Transaction>;
}

export interface BatchesAPI {
  get(batchId: number): Promise<Batch>;
  list(options?: BatchListOptions): Promise<PaginatedResult<Batch>>;
  getLatest(): Promise<Batch | null>;
}

export interface ProofsAPI {
  getJob(jobId: string): Promise<ProofJob>;
  getByBatch(batchId: number): Promise<ProofJob | null>;
}

export interface WithdrawAPI {
  create(address: string, amount: string | number | bigint): Promise<WithdrawalResult>;
}

export interface StatusAPI {
  get(): Promise<SystemStatus>;
  isHealthy(): Promise<boolean>;
}

export interface EventsAPI {
  subscribe(handlers: EventHandlers): EventSubscription;
  onProofProgress(handler: (event: ProofProgressEvent) => void): EventSubscription;
  onBatchUpdate(handler: (event: BatchUpdateEvent) => void): EventSubscription;
  onTransactionUpdate(handler: (event: TransactionUpdateEvent) => void): EventSubscription;
}
