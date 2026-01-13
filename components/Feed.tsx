import React from 'react';
import { Icons } from './Icons';
import { Transaction, BlockBatch } from '../types';

interface FeedProps {
    transactions: Transaction[];
    batches: BlockBatch[];
}

export const Feed: React.FC<FeedProps> = ({ transactions, batches }) => {
    // Filter out failed transactions from display
    const visibleTransactions = transactions.filter(tx => tx.status !== 'FAILED');
    const failedCount = transactions.length - visibleTransactions.length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'BATCHED': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'PROVING': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'FINALIZED': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'FAILED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return Icons.Pending;
            case 'BATCHED': return Icons.Block;
            case 'PROVING': return Icons.Compute;
            case 'FINALIZED': return Icons.Security;
            case 'FAILED': return Icons.Security;
            default: return Icons.Pending;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Left: Transaction Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[500px]">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm sticky top-0">
                    <h3 className="font-medium text-white flex items-center gap-2">
                        <Icons.Activity className="text-red-500 w-4 h-4" />
                        Live Transactions
                    </h3>
                    <div className="flex items-center gap-2">
                        {failedCount > 0 && (
                            <span className="text-[10px] text-slate-600" title={`${failedCount} failed transaction(s) hidden`}>
                                {failedCount} hidden
                            </span>
                        )}
                        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{visibleTransactions.length} Total</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {visibleTransactions.length === 0 && (
                        <div className="text-center text-slate-500 py-10 text-sm">No transactions yet. Start by sending tokens!</div>
                    )}
                    {visibleTransactions.map((tx) => {
                        const StatusIcon = getStatusIcon(tx.status);
                        return (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${getStatusColor(tx.status)}`}>
                                        <StatusIcon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-mono text-slate-200">{tx.id?.substring(0, 16) || 'Unknown'}...</div>
                                        <div className="text-xs text-slate-500">{(tx.from || '0x0').substring(0, 8)}... → {(tx.to || '0x0').substring(0, 8)}...</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-white">{tx.amount} ACCEL</div>
                                    <div className={`text-[10px] font-medium uppercase tracking-wider ${getStatusColor(tx.status).split(' ')[0]}`}>
                                        {tx.status}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right: Batches & Proofs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden h-[500px]">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm sticky top-0">
                    <h3 className="font-medium text-white flex items-center gap-2">
                        <Icons.Layer2 className="text-blue-500 w-4 h-4" />
                        L2 Batches & Proofs
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {batches.length === 0 && (
                        <div className="text-center text-slate-500 py-10 text-sm">Sequencer waiting for transactions...</div>
                    )}
                    {batches.map((batch) => (
                        <div key={batch.id} className="relative border border-slate-700 bg-slate-800/30 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="text-xs text-slate-400 font-mono mb-1">BATCH #{batch.id}</div>
                                    <div className="text-sm text-white font-mono break-all">{(batch.rootHash || '0x0').substring(0, 20)}...</div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${batch.status === 'Verified' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {batch.status}
                                </span>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs bg-slate-900/50 p-2 rounded">
                                    <span className="text-slate-500">TX Count</span>
                                    <span className="text-white">{batch.transactions.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs bg-slate-900/50 p-2 rounded">
                                    <span className="text-slate-500">Proof Hash</span>
                                    <span className="text-slate-400 font-mono">{batch.proofHash || 'Generating...'}</span>
                                </div>
                            </div>

                            {batch.status === 'Processing' && (
                                <div className="mt-3 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-progress-indeterminate"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};