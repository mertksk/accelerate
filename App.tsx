import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Architecture } from './views/Architecture';
import { UseCases } from './views/UseCases';
import { WalletState } from './types';
import { CasperService } from './services/casperService';

// Fallback address for simulation mode (when wallet is not available)
const SIMULATION_ADDRESS = "01a4567b...8f2e";

export default function App() {
    const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'architecture' | 'usecases'>('home');
    const [wallet, setWallet] = useState<WalletState>({
        address: null,
        isConnected: false,
        l1Balance: 0,
        l2Balance: 0
    });

    const connectWallet = async () => {
        // 1. Try Real Casper Wallet Connection
        const realAddress = await CasperService.connect();

        if (realAddress) {
            setWallet({
                address: realAddress,
                isConnected: true,
                l1Balance: 0, // TODO: Fetch real balance from RPC via CasperService
                l2Balance: 0
            });
            return;
        }

        // 2. Fallback to Simulation Mode (only if not explicitly disabled)
        // In production/testnet, set NEXT_PUBLIC_USE_MOCK=false
        if (process.env.NEXT_PUBLIC_USE_MOCK !== 'false') {
            setTimeout(() => {
                setWallet({
                    address: SIMULATION_ADDRESS,
                    isConnected: true,
                    l1Balance: 4500, // Simulation CSPR
                    l2Balance: 1000  // Simulation L2 Token
                });
            }, 800);
        } else {
            alert("Please install the Casper Wallet extension to connect.");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Home onConnect={connectWallet} onEnterApp={() => setActiveTab('dashboard')} />;
            case 'dashboard':
                return <Dashboard wallet={wallet} />;
            case 'architecture':
                return <Architecture />;
            case 'usecases':
                return <UseCases />;
            default:
                return <Home onConnect={connectWallet} onEnterApp={() => setActiveTab('dashboard')} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-red-500/30">
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                wallet={wallet}
                onConnect={connectWallet}
            />

            <main className="container mx-auto px-4 py-6">
                {renderContent()}
            </main>

            <footer className="border-t border-slate-800 py-8 mt-12 text-center text-slate-500 text-sm">
                <p>© 2026 Casper Accelerate Team. Built for the Casper Network Hackathon.</p>
                <p className="mt-2">Status: <span className="text-green-500">Testnet Live</span></p>
            </footer>
        </div>
    );
}
