import React, { useState, useEffect, useCallback } from 'react';
import { CasperService } from '../services/casperService';
import { WalletState } from '../types';
import { StatsPanel } from '../components/StatsPanel';
import { TransactionForm } from '../components/TransactionForm';
import { Feed } from '../components/Feed';
import { ProofProgress } from '../components/ProofProgress';
import { Icons } from '../components/Icons';
import { useRollupState, Transaction, Batch } from '../hooks/useAPI';
import { useEventSource, ProofProgressMessage, BatchUpdateMessage, TransactionUpdateMessage } from '../hooks/useEventSource';

interface DashboardProps {
    wallet: WalletState;
}

interface ContractState {
    stateRoot: string;
    batchCount: number;
    totalDeposits: string;
    totalWithdrawals: string;
}

// Map API Transaction to legacy Transaction format for compatibility
function mapTransaction(tx: Transaction): any {
    return {
        id: tx.txHash,
        from: tx.fromAddress,
        to: tx.toAddress,
        amount: Number(tx.amount) / 1e9, // Convert motes back to CSPR
        timestamp: new Date(tx.createdAt).getTime(),
        status: tx.status,
        batchId: tx.batchId,
    };
}

// Map API Batch to legacy BlockBatch format for compatibility
function mapBatch(batch: Batch): any {
    return {
        id: batch.id,
        transactions: batch.transactions.map(mapTransaction),
        rootHash: batch.newRoot,
        proofHash: batch.proofJob?.proofHash || '',
        status: batch.status === 'VERIFIED' ? 'Verified' : batch.status === 'PROVING' ? 'Processing' : 'Pending',
        timestamp: new Date(batch.createdAt).getTime(),
    };
}

export const Dashboard: React.FC<DashboardProps> = ({ wallet }) => {
    const {
        transactions,
        batches,
        status,
        isInitialized,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        fetchBatches,
        updateBatch,
        fetchStatus,
        startSequencer,
    } = useRollupState();

    const [contractState, setContractState] = useState<ContractState | null>(null);
    const [isLoadingContract, setIsLoadingContract] = useState(true);
    const [activeProofJobs, setActiveProofJobs] = useState<Map<string, ProofProgressMessage>>(new Map());
    const [isConnected, setIsConnected] = useState(false);

    // SSE event handlers
    const handleProofProgress = useCallback((msg: ProofProgressMessage) => {
        console.log('[Dashboard] Proof progress received:', msg);
        setActiveProofJobs(prev => {
            const next = new Map(prev);
            if (msg.status === 'COMPLETED' || msg.status === 'FAILED') {
                // Keep completed/failed jobs visible for a bit then remove
                setTimeout(() => {
                    setActiveProofJobs(p => {
                        const n = new Map(p);
                        n.delete(msg.jobId);
                        return n;
                    });
                }, 5000);
            }
            next.set(msg.jobId, msg);
            console.log('[Dashboard] Active proof jobs:', next.size);
            return next;
        });

        // Refresh batches when proof completes
        if (msg.status === 'COMPLETED' || msg.status === 'FAILED') {
            fetchBatches();
        }
    }, [fetchBatches]);

    const handleBatchUpdate = useCallback((msg: BatchUpdateMessage) => {
        updateBatch(msg.batchId, { status: msg.status });
        // Refresh to get full batch data
        fetchBatches();
    }, [updateBatch, fetchBatches]);

    const handleTransactionUpdate = useCallback((msg: TransactionUpdateMessage) => {
        updateTransaction(msg.txId, {
            status: msg.status,
            batchId: msg.batchId ?? null,
        });
    }, [updateTransaction]);

    // Setup SSE connection
    const { isConnected: sseConnected } = useEventSource({
        onProofProgress: handleProofProgress,
        onBatchUpdate: handleBatchUpdate,
        onTransactionUpdate: handleTransactionUpdate,
        onConnect: () => setIsConnected(true),
        onError: () => setIsConnected(false),
    });

    useEffect(() => {
        setIsConnected(sseConnected);
    }, [sseConnected]);

    // Fetch L1 contract state
    const fetchContractState = useCallback(async () => {
        const state = await CasperService.getContractState();
        if (state) {
            setContractState(state);
        }
        setIsLoadingContract(false);
    }, []);

    // Start sequencer on mount
    useEffect(() => {
        if (isInitialized) {
            startSequencer();
        }
    }, [isInitialized, startSequencer]);

    // Fetch contract state on mount and periodically
    useEffect(() => {
        fetchContractState();
        const contractInterval = setInterval(fetchContractState, 15000);
        return () => clearInterval(contractInterval);
    }, [fetchContractState]);

    // Poll for active proof jobs (fallback for SSE)
    useEffect(() => {
        const pollProofJobs = async () => {
            try {
                const res = await fetch('/api/batches');
                const data = await res.json();
                if (data.success && data.batches) {
                    const activeJobs = data.batches
                        .filter((b: Batch) => b.proofJob && !['COMPLETED', 'FAILED'].includes(b.proofJob.status))
                        .map((b: Batch) => ({
                            type: 'PROOF_PROGRESS' as const,
                            jobId: b.proofJob!.id,
                            batchId: b.id,
                            status: b.proofJob!.status,
                            progress: b.proofJob!.progress,
                            progressMsg: b.proofJob!.progressMsg || '',
                        }));

                    if (activeJobs.length > 0) {
                        setActiveProofJobs(prev => {
                            const next = new Map(prev);
                            for (const job of activeJobs) {
                                next.set(job.jobId, job);
                            }
                            return next;
                        });
                    }
                }
            } catch (e) {
                // Ignore polling errors
            }
        };

        pollProofJobs();
        const pollInterval = setInterval(pollProofJobs, 3000);
        return () => clearInterval(pollInterval);
    }, []);

    // Handle transaction form submission
    const handleTransactionSubmit = async (from: string, to: string, amount: number) => {
        await createTransaction(from, to, amount);
    };

    const handleDepositSuccess = () => {
        setTimeout(fetchContractState, 3000);
        fetchTransactions();
    };

    const contractConfig = CasperService.getContractConfig();

    // Map transactions and batches for legacy components
    const mappedTransactions = transactions.map(mapTransaction);
    const mappedBatches = batches.map(mapBatch);

    // Get active proof job for display
    const activeProofJobsList = Array.from(activeProofJobs.values());

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Connection Status */}
            <div className="flex items-center justify-end gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-slate-500">
                    {isConnected ? 'Real-time updates active' : 'Connecting...'}
                </span>
            </div>

            {/* Active Proof Jobs */}
            {activeProofJobsList.length > 0 ? (
                <div className="space-y-3">
                    {activeProofJobsList.map(job => (
                        <ProofProgress
                            key={job.jobId}
                            progress={job.progress}
                            progressMsg={job.progressMsg}
                            status={job.status}
                            batchId={job.batchId}
                            estimatedTimeMs={job.estimatedTimeMs}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-xs text-slate-600 bg-slate-900 p-2 rounded">
                    Proof jobs: {activeProofJobs.size} | SSE: {isConnected ? 'Connected' : 'Disconnected'}
                </div>
            )}

            {/* L1 Contract State Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-white">L1 Contract State</span>
                        <span className="text-xs text-slate-500">({contractConfig.chainName})</span>
                    </div>
                    <button
                        onClick={fetchContractState}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                        title="Refresh"
                    >
                        <Icons.Refresh className={`w-4 h-4 ${isLoadingContract ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {isLoadingContract && !contractState ? (
                    <div className="text-slate-500 text-sm">Loading contract state...</div>
                ) : contractState ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">State Root</div>
                            <div className="text-sm font-mono text-white">{contractState.stateRoot}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Batches</div>
                            <div className="text-sm font-bold text-white">{contractState.batchCount}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Deposits</div>
                            <div className="text-sm font-bold text-green-400">{contractState.totalDeposits} motes</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Contract</div>
                            <a
                                href={`https://testnet.cspr.live/contract/${contractConfig.contractHash.replace('hash-', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                                {contractConfig.contractHash.substring(0, 16)}...
                                <Icons.ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm">Unable to load contract state</div>
                )}
            </div>

            {/* Sequencer Status */}
            {status && (
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>
                        Sequencer: {status.isRunning ? (
                            <span className="text-green-400">Running</span>
                        ) : (
                            <span className="text-yellow-400">Stopped</span>
                        )}
                    </span>
                    <span>
                        Pending TXs: {status.stats?.pendingTxCount || 0}
                    </span>
                    <span>
                        Proof Queue: {status.proofQueueLength || 0}
                    </span>
                </div>
            )}

            {/* Top Stats */}
            <StatsPanel transactions={mappedTransactions} batches={mappedBatches} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Input */}
                <div className="lg:col-span-1 h-[550px]">
                    <TransactionForm
                        wallet={wallet}
                        onDepositSuccess={handleDepositSuccess}
                        onTransactionSubmit={handleTransactionSubmit}
                    />
                </div>

                {/* Feeds */}
                <div className="lg:col-span-2">
                    <Feed transactions={mappedTransactions} batches={mappedBatches} />
                </div>
            </div>
        </div>
    );
};
