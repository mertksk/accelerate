
import React, { useState } from 'react';
import { Icons } from './Icons';
import { WalletState } from '../types';
import { ConnectWalletModal } from './ConnectWalletModal';

type TabKey = 'home' | 'dashboard' | 'architecture';

interface HeaderProps {
    activeTab: TabKey;
    setActiveTab: (tab: TabKey) => void;
    wallet: WalletState;
    onConnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, wallet, onConnect }) => {
    const [copied, setCopied] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const copyAddress = () => {
        if (wallet.address) {
            navigator.clipboard.writeText(wallet.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
                            <Icons.Layer2 className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Casper<span className="text-red-500">Accelerate</span></span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <button 
                            onClick={() => setActiveTab('home')}
                            className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-red-500' : 'text-slate-400 hover:text-white'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className={`text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'text-red-500' : 'text-slate-400 hover:text-white'}`}
                        >
                            L2 Dashboard
                        </button>
                        <button 
                            onClick={() => setActiveTab('architecture')}
                            className={`text-sm font-medium transition-colors ${activeTab === 'architecture' ? 'text-red-500' : 'text-slate-400 hover:text-white'}`}
                        >
                            Architecture
                        </button>
                    </nav>

                    <div className="flex items-center gap-4">
                        {wallet.isConnected ? (
                            <div className="flex items-center gap-3 bg-slate-800/50 pl-4 pr-2 py-1.5 rounded-full border border-slate-700">
                                <div className="hidden lg:flex flex-col items-end mr-3 border-r border-slate-700 pr-3">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">L2 Balance</span>
                                    <span className="text-sm font-bold text-white">{wallet.l2Balance.toLocaleString()} ACCEL</span>
                                </div>
                                
                                <div className="flex flex-col items-end leading-none">
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                        Connected
                                    </span>
                                    <div className="flex items-center gap-2 group cursor-pointer" onClick={copyAddress}>
                                        <span className="text-sm font-mono text-white">
                                            {wallet.address?.substring(0, 6)}...{wallet.address?.substring(wallet.address.length - 4)}
                                        </span>
                                        {copied ? (
                                            <Icons.Success className="w-3 h-3 text-green-500" />
                                        ) : (
                                            <Icons.Copy className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                                        )}
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-red-900/20">
                                    {wallet.address?.substring(2,4).toUpperCase()}
                                </div>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition-all transform active:scale-95 shadow-lg shadow-white/5"
                            >
                                <Icons.Wallet className="w-4 h-4" />
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <ConnectWalletModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onConnect={onConnect} 
            />
        </>
    );
};
