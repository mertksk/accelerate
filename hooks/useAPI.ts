// API Hooks for Casper Accelerate
import { useState, useCallback, useEffect } from 'react';

// Types matching API responses
export interface Transaction {
  id: string;
  txHash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  status: string;
  batchId: number | null;
  l1DepositHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProofJob {
  id: string;
  batchId: number;
  status: string;
  progress: number;
  progressMsg: string | null;
  proofData: any;
  publicSignals: any;
  proofHash: string | null;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id: number;
  oldRoot: string;
  newRoot: string;
  status: string;
  l1TxHash: string | null;
  transactions: Transaction[];
  proofJob: ProofJob | null;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  address: string;
  treeIndex: number;
  balance: string;
  nonce: string;
  createdAt: string;
  updatedAt: string;
}

// Generic fetch hook
function useApiCall<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    url: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Request failed');
      }

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, setData, loading, error, execute };
}

// Transactions hook
export function useTransactions() {
  const { data: transactions, setData, loading, error, execute } = useApiCall<Transaction[]>([]);

  const fetchTransactions = useCallback(async (params?: {
    status?: string;
    batchId?: number;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.batchId) searchParams.set('batchId', params.batchId.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const url = `/api/transactions${searchParams.toString() ? `?${searchParams}` : ''}`;
    const result = await execute(url);

    if (result && 'transactions' in result) {
      setData(result.transactions as Transaction[]);
    }
  }, [execute, setData]);

  const createTransaction = useCallback(async (
    from: string,
    to: string,
    amount: number,
    l1DepositHash?: string
  ) => {
    console.log('[useAPI] createTransaction called:', { from, to, amount, l1DepositHash });

    const result = await execute('/api/transactions', {
      method: 'POST',
      body: JSON.stringify({ from, to, amount, l1DepositHash }),
    });

    console.log('[useAPI] createTransaction result:', result);

    if (result && 'transaction' in result) {
      console.log('[useAPI] Transaction created successfully, refreshing list');
      // Refresh list after creating
      await fetchTransactions();
      return result.transaction as Transaction;
    }
    console.log('[useAPI] createTransaction failed or returned null');
    return null;
  }, [execute, fetchTransactions]);

  // Update a single transaction in the list
  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData(prev => prev.map(tx =>
      tx.id === id ? { ...tx, ...updates } : tx
    ));
  }, [setData]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
  };
}

// Batches hook
export function useBatches() {
  const { data: batches, setData, loading, error, execute } = useApiCall<Batch[]>([]);

  const fetchBatches = useCallback(async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    const url = `/api/batches${searchParams.toString() ? `?${searchParams}` : ''}`;
    const result = await execute(url);

    if (result && 'batches' in result) {
      setData(result.batches as Batch[]);
    }
  }, [execute, setData]);

  const createBatch = useCallback(async () => {
    const result = await execute('/api/batches', { method: 'POST' });

    if (result && 'batch' in result) {
      await fetchBatches();
      return result.batch as Batch;
    }
    return null;
  }, [execute, fetchBatches]);

  // Update a single batch in the list
  const updateBatch = useCallback((id: number, updates: Partial<Batch>) => {
    setData(prev => prev.map(batch =>
      batch.id === id ? { ...batch, ...updates } : batch
    ));
  }, [setData]);

  return {
    batches,
    loading,
    error,
    fetchBatches,
    createBatch,
    updateBatch,
  };
}

// Status hook
export function useStatus() {
  const { data: status, setData, loading, error, execute } = useApiCall<any>(null);

  const fetchStatus = useCallback(async () => {
    const result = await execute('/api/status');
    if (result && 'status' in result) {
      setData(result.status);
    }
  }, [execute, setData]);

  const startSequencer = useCallback(async () => {
    const result = await execute('/api/status', { method: 'POST' });
    if (result && 'status' in result) {
      setData(result.status);
    }
    return result;
  }, [execute, setData]);

  return {
    status,
    loading,
    error,
    fetchStatus,
    startSequencer,
  };
}

// Combined hook with real-time updates
export function useRollupState() {
  const { transactions, fetchTransactions, createTransaction, updateTransaction } = useTransactions();
  const { batches, fetchBatches, createBatch, updateBatch } = useBatches();
  const { status, fetchStatus, startSequencer } = useStatus();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial data load
  useEffect(() => {
    const init = async () => {
      await Promise.all([
        fetchTransactions(),
        fetchBatches(),
        fetchStatus(),
      ]);
      setIsInitialized(true);
    };
    init();
  }, [fetchTransactions, fetchBatches, fetchStatus]);

  return {
    transactions,
    batches,
    status,
    isInitialized,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    fetchBatches,
    createBatch,
    updateBatch,
    fetchStatus,
    startSequencer,
  };
}
