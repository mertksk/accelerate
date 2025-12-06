'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Home } from '@/views/Home';
import { Dashboard } from '@/views/Dashboard';
import { Architecture } from '@/views/Architecture';
import { WalletState } from '@/types';
import { CasperService } from '@/services/casperService';

export default function Page() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'architecture'>('home');
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    l1Balance: 0,
    l2Balance: 0
  });
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Fetch balance for connected wallet
  const refreshBalance = useCallback(async (address: string) => {
    const balances = await CasperService.getBalance(address);
    if (balances) {
      setWallet(prev => ({
        ...prev,
        l1Balance: balances.l1Balance,
        l2Balance: balances.l2Balance
      }));
    }
  }, []);

  // Periodic balance refresh (every 30s)
  useEffect(() => {
    if (!wallet.isConnected || !wallet.address) return;

    const interval = setInterval(() => {
      refreshBalance(wallet.address!);
    }, 30000);

    return () => clearInterval(interval);
  }, [wallet.isConnected, wallet.address, refreshBalance]);

  const connectWallet = async () => {
    setConnectionError(null);

    // Check if Casper Wallet extension is installed
    if (!CasperService.isInstalled()) {
      setConnectionError('Casper Wallet not installed. Please install the browser extension.');
      return;
    }

    // Connect to Casper Wallet
    const realAddress = await CasperService.connect();

    if (!realAddress) {
      setConnectionError('Connection failed. Please try again.');
      return;
    }

    // Fetch real balance
    const balances = await CasperService.getBalance(realAddress);

    setWallet({
      address: realAddress,
      isConnected: true,
      l1Balance: balances?.l1Balance ?? 0,
      l2Balance: balances?.l2Balance ?? 0
    });
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      isConnected: false,
      l1Balance: 0,
      l2Balance: 0
    });
    setConnectionError(null);
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
        onDisconnect={disconnectWallet}
        connectionError={connectionError}
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
