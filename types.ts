export enum TransactionStatus {
    PENDING = 'PENDING',       // Waiting in Mempool
    BATCHED = 'BATCHED',       // Included in a Batch (L2)
    PROVING = 'PROVING',       // ZK Proof being generated
    FINALIZED = 'FINALIZED'    // Proof Verified on L1
}

export interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: number;
    timestamp: number;
    status: TransactionStatus;
    batchId?: number;
}

export interface BlockBatch {
    id: number;
    transactions: Transaction[];
    rootHash: string;
    proofHash: string;
    status: 'Processing' | 'Verified';
    timestamp: number;
}

export interface WalletState {
    address: string | null;
    isConnected: boolean;
    l1Balance: number; // CSPR
    l2Balance: number; // L2 Token
}

export interface SystemStats {
    totalTransactions: number;
    avgBlockTime: number;
    currentThroughput: number; // TPS
    lastProofTime: number; // ms
}