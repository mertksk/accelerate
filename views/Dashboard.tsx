import React, { useState, useEffect, useCallback } from 'react';
import { chainSimulator } from '../services/mockChain';
import { CasperService } from '../services/casperService';
import { Transaction, BlockBatch, WalletState } from '../types';
import { StatsPanel } from '../components/StatsPanel';
import { TransactionForm } from '../components/TransactionForm';
import { Feed } from '../components/Feed';
import { Icons } from '../components/Icons';

interface DashboardProps {
    wallet: WalletState;
}

interface ContractState {
    stateRoot: string;
    batchCount: number;
    totalDeposits: string;
    totalWithdrawals: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ wallet }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [batches, setBatches] = useState<BlockBatch[]>([]);
    const [contractState, setContractState] = useState<ContractState | null>(null);
    const [isLoadingContract, setIsLoadingContract] = useState(true);

    // Fetch L1 contract state
    const fetchContractState = useCallback(async () => {
        const state = await CasperService.getContractState();
        if (state) {
            setContractState(state);
        }
        setIsLoadingContract(false);
    }, []);

    useEffect(() => {
        // Start the background sequencer
        chainSimulator.startSequencer();

        // Subscribe to updates
        const unsubscribe = chainSimulator.subscribe(() => {
            setTransactions(chainSimulator.getTransactions());
            setBatches(chainSimulator.getBatches());
        });

        // Fetch initial contract state
        fetchContractState();

        // Refresh contract state every 15 seconds
        const contractInterval = setInterval(fetchContractState, 15000);

        return () => {
            unsubscribe();
            clearInterval(contractInterval);
        };
    }, [fetchContractState]);

    const handleDepositSuccess = () => {
        // Refresh contract state after deposit
        setTimeout(fetchContractState, 3000);
    };

    const contractConfig = CasperService.getContractConfig();

    return (
        <div className="space-y-6 animate-fade-in">
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

            {/* Top Stats */}
            <StatsPanel transactions={transactions} batches={batches} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Input */}
                <div className="lg:col-span-1 h-[550px]">
                    <TransactionForm wallet={wallet} onDepositSuccess={handleDepositSuccess} />
                </div>

                {/* Feeds */}
                <div className="lg:col-span-2">
                    <Feed transactions={transactions} batches={batches} />
                </div>
            </div>
        </div>
    );
};