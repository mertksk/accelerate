
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './views/Home';
import { Dashboard } from './views/Dashboard';
import { Architecture } from './views/Architecture';
import { WalletState } from './types';
import { MOCK_ADDRESS } from './services/mockChain';
import { CasperService } from './services/casperService';

export default function App() {
    const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'architecture'>('home');
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
                l1Balance: 15420, // Mock Balance for real address
                l2Balance: 0      // New user starts with 0 L2 tokens
            });
            return;
        }

        // 2. Fallback to Simulation Mode
        // Simulate connection delay
        setTimeout(() => {
            setWallet({
                address: MOCK_ADDRESS,
                isConnected: true,
                l1Balance: 4500, // Mock CSPR
                l2Balance: 1000  // Mock L2 Token
            });
        }, 800);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <Home onConnect={connectWallet} onEnterApp={() => setActiveTab('dashboard')} />;
            case 'dashboard':
                return <Dashboard wallet={wallet} />;
            case 'architecture':
                return <Architecture />;
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
