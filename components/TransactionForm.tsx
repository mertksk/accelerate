import React, { useState } from 'react';
import { Icons } from './Icons';
import { chainSimulator } from '../services/mockChain';
import { CasperService } from '../services/casperService';
import { WalletState } from '../types';

interface TransactionFormProps {
    wallet: WalletState;
    onDepositSuccess?: () => void;
}

type FormMode = 'deposit' | 'transfer';

export const TransactionForm: React.FC<TransactionFormProps> = ({ wallet, onDepositSuccess }) => {
    const [mode, setMode] = useState<FormMode>('deposit');
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', msg: string, link?: string} | null>(null);

    const handleMax = () => {
        if (wallet.isConnected) {
            if (mode === 'deposit') {
                // Leave 10 CSPR for gas on L1
                const maxDeposit = Math.max(0, wallet.l1Balance - 10);
                setAmount(maxDeposit.toFixed(2));
            } else {
                setAmount((wallet.l2Balance * 0.99).toFixed(2));
            }
        }
    };

    const handleDeposit = async (val: number) => {
        // Convert CSPR to motes (1 CSPR = 1e9 motes)
        const amountMotes = (BigInt(Math.floor(val * 1e9))).toString();

        console.log(`[TransactionForm] Initiating deposit of ${val} CSPR (${amountMotes} motes)`);

        const deployHash = await CasperService.deposit(amountMotes);

        if (deployHash) {
            const explorerUrl = `https://testnet.cspr.live/deploy/${deployHash}`;
            setFeedback({
                type: 'success',
                msg: `Deposit submitted! Hash: ${deployHash.substring(0, 12)}...`,
                link: explorerUrl
            });

            // Also add to L2 sequencer for tracking
            chainSimulator.addTransaction('L1_DEPOSIT', wallet.address || '', val);

            // Notify parent to refresh balances
            onDepositSuccess?.();
        } else {
            setFeedback({ type: 'error', msg: 'Deposit failed. Please check your wallet and try again.' });
        }
    };

    const handleTransfer = async (val: number) => {
        // L2 transfer via sequencer
        chainSimulator.addTransaction(wallet.address || '0xUnknown', to, val);
        setFeedback({ type: 'success', msg: 'Transaction Signed & Submitted to Sequencer' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount) return;
        if (mode === 'transfer' && !to) return;

        const val = parseFloat(amount);

        // Validation
        if (isNaN(val) || val <= 0) {
            setFeedback({ type: 'error', msg: 'Please enter a valid amount' });
            setTimeout(() => setFeedback(null), 3000);
            return;
        }

        if (mode === 'deposit') {
            if (val < 5) {
                setFeedback({ type: 'error', msg: 'Minimum deposit is 5 CSPR' });
                setTimeout(() => setFeedback(null), 3000);
                return;
            }
            if (val > wallet.l1Balance - 10) {
                setFeedback({ type: 'error', msg: `Insufficient L1 balance. Available: ${(wallet.l1Balance - 10).toFixed(2)} CSPR` });
                setTimeout(() => setFeedback(null), 3000);
                return;
            }
        } else {
            if (val > wallet.l2Balance) {
                setFeedback({ type: 'error', msg: `Insufficient L2 funds. Balance: ${wallet.l2Balance}` });
                setTimeout(() => setFeedback(null), 3000);
                return;
            }
            if (to.length < 5) {
                setFeedback({ type: 'error', msg: 'Invalid recipient address' });
                setTimeout(() => setFeedback(null), 3000);
                return;
            }
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            if (mode === 'deposit') {
                await handleDeposit(val);
            } else {
                await handleTransfer(val);
            }

            setTo('');
            setAmount('');
        } catch (error) {
            console.error('[TransactionForm] Error:', error);
            setFeedback({ type: 'error', msg: 'Transaction failed. Please try again.' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setFeedback(null), 10000);
        }
    };

    if (!wallet.isConnected) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-slate-800 bg-slate-900/50 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/50 pointer-events-none" />
                <div className="w-16 h-16 bg-slate-800/50 border border-slate-700 rounded-full flex items-center justify-center mb-6">
                    <Icons.Lock className="text-slate-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Wallet Disconnected</h3>
                <p className="text-slate-400 text-sm max-w-[240px]">Connect your Casper Wallet to sign and send Layer 2 transactions.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col shadow-xl shadow-black/20">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => setMode('deposit')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        mode === 'deposit'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                    Deposit (L1→L2)
                </button>
                <button
                    type="button"
                    onClick={() => setMode('transfer')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        mode === 'transfer'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                    Transfer (L2)
                </button>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Icons.Send className="text-red-500 w-5 h-5" />
                    {mode === 'deposit' ? 'Bridge to L2' : 'Transfer Assets'}
                </h3>
                <div className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                    {mode === 'deposit' ? 'L1 → L2' : 'L2 TESTNET'}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
                {mode === 'transfer' && (
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Recipient Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icons.Wallet className="h-4 w-4 text-slate-600 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="Enter Casper Public Key"
                                disabled={isSubmitting}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                            {mode === 'deposit' ? 'Deposit Amount (CSPR)' : 'Amount'}
                        </label>
                        <button
                            type="button"
                            onClick={handleMax}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-red-400 px-2 py-0.5 rounded transition-colors"
                        >
                            MAX: {mode === 'deposit' ? `${Math.max(0, wallet.l1Balance - 10).toFixed(0)} CSPR` : wallet.l2Balance}
                        </button>
                    </div>
                    <div className="relative group">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={mode === 'deposit' ? 'Min 5 CSPR' : '0.00'}
                            disabled={isSubmitting}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                        />
                        <span className="absolute right-4 top-3 text-xs font-bold text-slate-500">
                            {mode === 'deposit' ? 'CSPR' : 'ACCEL'}
                        </span>
                    </div>
                </div>

                {feedback && (
                    <div className={`p-3 rounded-lg flex flex-col gap-2 text-sm animate-fade-in border ${
                        feedback.type === 'success'
                        ? 'bg-green-950/30 border-green-900/50 text-green-400'
                        : 'bg-red-950/30 border-red-900/50 text-red-400'
                    }`}>
                        <div className="flex items-start gap-3">
                            {feedback.type === 'success' ? <Icons.Success className="w-5 h-5 shrink-0" /> : <Icons.Security className="w-5 h-5 shrink-0" />}
                            <p className="leading-tight">{feedback.msg}</p>
                        </div>
                        {feedback.link && (
                            <a
                                href={feedback.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 ml-8"
                            >
                                View on Explorer <Icons.ExternalLink className="w-3 h-3" />
                            </a>
                        )}
                    </div>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || (mode === 'transfer' && !to) || !amount}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-medium transition-all ${
                            isSubmitting || (mode === 'transfer' && !to) || !amount
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-500 active:scale-95 shadow-lg shadow-red-900/20 hover:shadow-red-900/40'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Icons.Processing className="w-4 h-4 animate-spin" />
                                {mode === 'deposit' ? 'Signing with Wallet...' : 'Processing...'}
                            </>
                        ) : (
                            <>
                                {mode === 'deposit' ? 'Deposit to L2' : 'Sign & Submit'}
                                <Icons.Transaction className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-auto pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span>{mode === 'deposit' ? 'Gas Cost' : 'Sequencer Fee'}</span>
                    <span>{mode === 'deposit' ? '~5 CSPR' : '0.00001 CSPR'}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Expected Finality</span>
                    <span className="text-green-400 flex items-center gap-1">
                        <Icons.Clock className="w-3 h-3"/>
                        {mode === 'deposit' ? '~2 min (L1)' : '~2s'}
                    </span>
                </div>
            </div>
        </div>
    );
};