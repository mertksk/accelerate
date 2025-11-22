import React, { useMemo } from 'react';
import { Icons } from './Icons';
import { Transaction, BlockBatch, TransactionStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsPanelProps {
    transactions: Transaction[];
    batches: BlockBatch[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ transactions, batches }) => {
    const stats = useMemo(() => {
        const total = transactions.length;
        const pending = transactions.filter(t => t.status === TransactionStatus.PENDING).length;
        const finalized = transactions.filter(t => t.status === TransactionStatus.FINALIZED).length;
        const tps = total > 0 ? (total / ((Date.now() - (transactions[transactions.length - 1]?.timestamp || Date.now())) / 1000 + 1)).toFixed(2) : '0.00';

        return { total, pending, finalized, tps };
    }, [transactions]);

    const chartData = useMemo(() => {
        // Last 5 batches tx count
        return batches.slice(0, 5).reverse().map(b => ({
            name: `Batch #${b.id}`,
            txs: b.transactions.length,
            status: b.status
        }));
    }, [batches]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            {/* Card 1: Throughput */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icons.Activity className="w-16 h-16 text-blue-500" />
                </div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Throughput</div>
                <div className="text-2xl font-bold text-white">{stats.tps} <span className="text-sm font-normal text-slate-500">TPS</span></div>
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                    <Icons.Processing className="w-3 h-3 animate-pulse" /> Live Simulation
                </div>
            </div>

            {/* Card 2: Pending Pool */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icons.Pending className="w-16 h-16 text-yellow-500" />
                </div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Sequencer Queue</div>
                <div className="text-2xl font-bold text-white">{stats.pending} <span className="text-sm font-normal text-slate-500">TXs</span></div>
                <div className="mt-2 text-xs text-yellow-500 flex items-center gap-1">
                    Waiting for Batch
                </div>
            </div>

            {/* Card 3: Finalized */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Icons.Layer1 className="w-16 h-16 text-green-500" />
                </div>
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">L1 Finalized</div>
                <div className="text-2xl font-bold text-white">{stats.finalized}</div>
                <div className="mt-2 text-xs text-slate-500">
                    Secured on Casper
                </div>
            </div>

            {/* Card 4: Batch Visualizer */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl relative overflow-hidden">
                <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-2">Batch Capacity</div>
                <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                             <XAxis dataKey="name" hide />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{fill: 'transparent'}}
                            />
                            <Bar dataKey="txs" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.status === 'Verified' ? '#22c55e' : '#eab308'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};