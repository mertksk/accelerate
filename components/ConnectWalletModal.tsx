
import React from 'react';
import { Icons } from './Icons';

interface ConnectWalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: () => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({ isOpen, onClose, onConnect }) => {
    if (!isOpen) return null;

    const handleConnect = () => {
        onConnect();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <Icons.Refresh className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handleConnect}
                        className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl group transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                C
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white">Casper Wallet</div>
                                <div className="text-xs text-slate-400">Official Browser Extension</div>
                            </div>
                        </div>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-600 group-hover:border-red-500 group-hover:bg-red-500 transition-colors"></div>
                    </button>

                    <button 
                        disabled
                        className="w-full flex items-center justify-between p-4 bg-slate-800/20 border border-slate-800 rounded-xl opacity-50 cursor-not-allowed"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                L
                            </div>
                            <div className="text-left">
                                <div className="font-bold text-white">Ledger</div>
                                <div className="text-xs text-slate-400">Coming Soon</div>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-500">
                        By connecting, you agree to the <span className="text-red-500 cursor-pointer hover:underline">Terms of Service</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};
