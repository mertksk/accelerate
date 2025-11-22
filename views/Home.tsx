import React from 'react';
import { Icons } from '../components/Icons';

interface HomeProps {
    onConnect: () => void;
    onEnterApp: () => void;
}

export const Home: React.FC<HomeProps> = ({ onConnect, onEnterApp }) => {
    return (
        <div className="max-w-5xl mx-auto space-y-16 py-10">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/20 border border-red-900/50 text-red-400 text-xs font-medium uppercase tracking-wide animate-fade-in-up">
                    Hackathon 2026 Project
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight animate-fade-in-up delay-100">
                    Scaling Casper with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Zero-Knowledge</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                    Casper Accelerate is a Layer 2 Scaling Solution (ZK-Rollup) designed to unleash high-throughput smart contract execution on the Casper Network using Circom & Groth16.
                </p>
                <div className="flex justify-center gap-4 pt-4 animate-fade-in-up delay-300">
                    <button 
                        onClick={onEnterApp}
                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-red-900/20 transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        Launch App <Icons.Dashboard className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => window.open('https://docs.casper.network/', '_blank')}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2"
                    >
                        Read Proposal <Icons.Contract className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: Icons.Compute,
                        title: "100x Throughput",
                        desc: "Batches contract calls off-chain to overcome L1 execution limits."
                    },
                    {
                        icon: Icons.Lock,
                        title: "Cryptographic Security",
                        desc: "Leverages Groth16 SNARKs to inherit the security of the Casper L1."
                    },
                    {
                        icon: Icons.Contract,
                        title: "Production Ready",
                        desc: "Built on proven Circom circuits and standard WebAssembly interfaces."
                    }
                ].map((feature, idx) => (
                    <div key={idx} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-red-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                            <feature.icon className="w-6 h-6 text-slate-300 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* Problem Statement */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-white">The Problem: Contract Saturation</h2>
                    <p className="text-slate-400">
                        While Casper excels at native token transfers, the "lane" for smart contract execution becomes saturated easily. 
                        Casper Accelerate moves execution off-chain, posting only a succinct proof to L1.
                    </p>
                    <div className="flex items-center gap-8 pt-4">
                        <div>
                            <div className="text-3xl font-bold text-white">~10 TPS</div>
                            <div className="text-xs text-slate-500 uppercase">Current L1 Limit</div>
                        </div>
                        <div className="h-10 w-px bg-slate-700"></div>
                        <div>
                            <div className="text-3xl font-bold text-red-500">~1000+ TPS</div>
                            <div className="text-xs text-slate-500 uppercase">With Accelerate</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full h-64 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    {/* Abstract visualization */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative z-10 text-center">
                        <Icons.Server className="w-16 h-16 text-slate-600 mx-auto mb-2" />
                        <div className="text-sm font-mono text-slate-500">L1 State Congestion</div>
                    </div>
                </div>
            </div>
        </div>
    );
};