import React, { useState, useEffect } from 'react';
import { chainSimulator } from '../services/mockChain';
import { Transaction, BlockBatch, WalletState } from '../types';
import { StatsPanel } from '../components/StatsPanel';
import { TransactionForm } from '../components/TransactionForm';
import { Feed } from '../components/Feed';

interface DashboardProps {
    wallet: WalletState;
}

export const Dashboard: React.FC<DashboardProps> = ({ wallet }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [batches, setBatches] = useState<BlockBatch[]>([]);

    useEffect(() => {
        // Start the background sequencer
        chainSimulator.startSequencer();

        // Subscribe to updates
        const unsubscribe = chainSimulator.subscribe(() => {
            setTransactions(chainSimulator.getTransactions());
            setBatches(chainSimulator.getBatches());
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Stats */}
            <StatsPanel transactions={transactions} batches={batches} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Input */}
                <div className="lg:col-span-1 h-[500px]">
                    <TransactionForm wallet={wallet} />
                </div>

                {/* Feeds */}
                <div className="lg:col-span-2">
                    <Feed transactions={transactions} batches={batches} />
                </div>
            </div>
        </div>
    );
};