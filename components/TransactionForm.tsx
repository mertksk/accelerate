import React, { useState } from 'react';
import { Icons } from './Icons';
import { chainSimulator } from '../services/mockChain';
import { WalletState } from '../types';

interface TransactionFormProps {
    wallet: WalletState;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ wallet }) => {
    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', msg: string} | null>(null);

    const handleMax = () => {
        if (wallet.isConnected) {
            setAmount((wallet.l2Balance * 0.99).toFixed(2)); // Leave dust for fees
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!to || !amount) return;
        
        const val = parseFloat(amount);
        
        // Validation
        if (isNaN(val) || val <= 0) {
            setFeedback({ type: 'error', msg: 'Please enter a valid amount' });
            setTimeout(() => setFeedback(null), 3000);
            return;
        }

        if (val > wallet.l2Balance) {
            setFeedback({ type: 'error', msg: `Insufficient funds. Balance: ${wallet.l2Balance}` });
            setTimeout(() => setFeedback(null), 3000);
            return;
        }

        if (to.length < 5) {
             setFeedback({ type: 'error', msg: 'Invalid recipient address' });
             setTimeout(() => setFeedback(null), 3000);
             return;
        }
        
        setIsSubmitting(true);
        setFeedback(null);

        // Simulate network delay for signing
        await new Promise(resolve => setTimeout(resolve, 800));

        chainSimulator.addTransaction(wallet.address || '0xUnknown', to, val);
        
        setFeedback({ type: 'success', msg: 'Transaction Signed & Submitted to Sequencer' });
        setTo('');
        setAmount('');
        setIsSubmitting(false);

        setTimeout(() => setFeedback(null), 5000);
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
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Icons.Send className="text-red-500 w-5 h-5" />
                    Transfer Assets
                </h3>
                <div className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                    L2 MAINNET
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 flex-1">
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

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</label>
                        <button 
                            type="button"
                            onClick={handleMax}
                            className="text-[10px] bg-slate-800 hover:bg-slate-700 text-red-400 px-2 py-0.5 rounded transition-colors"
                        >
                            MAX: {wallet.l2Balance}
                        </button>
                    </div>
                    <div className="relative group">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={isSubmitting}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                        />
                        <span className="absolute right-4 top-3 text-xs font-bold text-slate-500">ACCEL</span>
                    </div>
                </div>

                {feedback && (
                    <div className={`p-3 rounded-lg flex items-start gap-3 text-sm animate-fade-in border ${
                        feedback.type === 'success' 
                        ? 'bg-green-950/30 border-green-900/50 text-green-400' 
                        : 'bg-red-950/30 border-red-900/50 text-red-400'
                    }`}>
                        {feedback.type === 'success' ? <Icons.Success className="w-5 h-5 shrink-0" /> : <Icons.Security className="w-5 h-5 shrink-0" />}
                        <p className="leading-tight">{feedback.msg}</p>
                    </div>
                )}

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !to || !amount}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-medium transition-all ${
                            isSubmitting || !to || !amount
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-500 active:scale-95 shadow-lg shadow-red-900/20 hover:shadow-red-900/40'
                        }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Icons.Processing className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Sign & Submit
                                <Icons.Transaction className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-auto pt-6 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span>Sequencer Fee</span>
                    <span>0.00001 CSPR</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Expected Finality</span>
                    <span className="text-green-400 flex items-center gap-1"><Icons.Clock className="w-3 h-3"/> ~2s</span>
                </div>
            </div>
        </div>
    );
};