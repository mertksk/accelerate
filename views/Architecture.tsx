import React from 'react';
import { Icons } from '../components/Icons';

export const Architecture: React.FC = () => {
    const flow = [
        {
            title: 'User Wallet',
            subtitle: 'User signs transaction + nonce',
            output: 'Signed payload',
            badge: 'Ingress',
            icon: Icons.Wallet,
            cardClass: 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/20 via-emerald-500/10 to-slate-950',
            chipClass: 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30',
            iconClass: 'text-emerald-300'
        },
        {
            title: 'L2 Sequencer',
            subtitle: 'Orders txs, prevents double-spend, adds to batch queue',
            output: 'Ordered mempool entry',
            badge: 'Ordering',
            icon: Icons.Server,
            cardClass: 'border-blue-500/30 bg-gradient-to-b from-blue-500/20 via-blue-500/10 to-slate-950',
            chipClass: 'bg-blue-500/20 text-blue-200 border border-blue-500/30',
            iconClass: 'text-blue-300'
        },
        {
            title: 'Merkle State + Batch',
            subtitle: 'Updates L2 state tree, seals batch root',
            output: 'New Merkle root',
            badge: 'State',
            icon: Icons.Database,
            cardClass: 'border-cyan-400/30 bg-gradient-to-b from-cyan-400/20 via-cyan-400/10 to-slate-950',
            chipClass: 'bg-cyan-400/20 text-cyan-100 border border-cyan-400/30',
            iconClass: 'text-cyan-200'
        },
        {
            title: 'ZK Prover',
            subtitle: 'Runs Circom constraints, generates Groth16 proof',
            output: 'Proof π(batch)',
            badge: 'Proof',
            icon: Icons.Compute,
            cardClass: 'border-purple-500/30 bg-gradient-to-b from-purple-500/20 via-purple-500/10 to-slate-950',
            chipClass: 'bg-purple-500/20 text-purple-200 border border-purple-500/30',
            iconClass: 'text-purple-200'
        },
        {
            title: 'Casper L1 Finalization',
            subtitle: 'Verifier contract checks π; State contract writes root',
            output: 'Finalized state root',
            badge: 'Finality',
            icon: Icons.Contract,
            cardClass: 'border-red-500/30 bg-gradient-to-b from-red-500/20 via-red-500/10 to-slate-950',
            chipClass: 'bg-red-500/20 text-red-200 border border-red-500/30',
            iconClass: 'text-red-200'
        }
    ];

    const assuranceCards = [
        {
            title: 'Data Carried Forward',
            points: ['Signed tx (Casper Wallet)', 'Batch ID + Merkle root', 'Groth16 proof + public inputs'],
            accent: 'bg-slate-900/60 border border-slate-800'
        },
        {
            title: 'Trust Boundaries',
            points: ['L2 ordering is centralized in MVP', 'Proof eliminates L1 re-execution', 'Finality only after verifier passes'],
            accent: 'bg-slate-900/60 border border-slate-800'
        },
        {
            title: 'Failure Handling',
            points: ['If proof fails → batch rejected', 'L1 state root remains previous trusted root', 'Users can re-submit or withdraw on failover'],
            accent: 'bg-slate-900/60 border border-slate-800'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto py-10 space-y-8 animate-fade-in">
            <div className="relative overflow-hidden border border-slate-800 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8">
                <div className="absolute -top-10 -right-16 w-72 h-72 bg-red-500/10 blur-3xl" />
                <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-blue-500/10 blur-3xl" />
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-200 text-xs font-medium">
                            <Icons.Layer2 className="w-4 h-4" /> User → L1 Finalization
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white">System Architecture</h2>
                            <p className="text-slate-400 mt-2 max-w-2xl">
                                A single journey: user signs on L2, batches are proven with Groth16, Casper L1 finalizes the state root.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">L2: Ordering + Execution</span>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">Proof: Circom + Groth16</span>
                            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">L1: Verifier + State Root</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-200 min-w-[220px]">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                            <div className="text-[11px] text-slate-400">Batch cadence</div>
                            <div className="font-semibold">~6s</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                            <div className="text-[11px] text-slate-400">Proof time</div>
                            <div className="font-semibold">~4s</div>
                        </div>
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 col-span-2">
                            <div className="text-[11px] text-slate-400">Finality window</div>
                            <div className="font-semibold">Batch → Proof → L1 Root</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-emerald-500/30 via-blue-400/30 to-red-500/30 opacity-60 hidden md:block" />
                <div className="absolute left-0 right-0 top-0 h-20 bg-gradient-to-b from-slate-900/50 to-transparent pointer-events-none" />
                <div className="relative space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Flow</p>
                            <h3 className="text-xl font-semibold text-white">Transaction journey to finality</h3>
                            <p className="text-sm text-slate-400">Each step emits the artifact the next layer needs.</p>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-300">
                            <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30">L2 Off-chain</span>
                            <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30">L1 Casper</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:flex-wrap xl:flex-nowrap gap-3">
                        {flow.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.title} className="relative flex-1 min-w-[200px]">
                                    {idx < flow.length - 1 && (
                                        <div className="hidden xl:block absolute right-[-12px] top-1/2 -translate-y-1/2 w-6 h-[1px] bg-gradient-to-r from-slate-700 via-slate-400 to-slate-700 opacity-70" />
                                    )}
                                    <div className={`h-full rounded-xl border p-4 shadow-inner ${step.cardClass}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${step.chipClass}`}>
                                                {step.badge}
                                            </div>
                                            <Icon className={`w-6 h-6 ${step.iconClass}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-white font-semibold text-sm">{step.title}</h4>
                                            <p className="text-xs text-slate-300 leading-relaxed">{step.subtitle}</p>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
                                            <span className="text-slate-500">Artifact</span>
                                            <span className="font-mono text-slate-200">{step.output}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {assuranceCards.map((card) => (
                    <div key={card.title} className={`${card.accent} rounded-xl p-5`}>
                        <div className="text-sm font-semibold text-white mb-2">{card.title}</div>
                        <ul className="space-y-1.5 text-sm text-slate-300">
                            {card.points.map((point) => (
                                <li key={point} className="flex items-start gap-2">
                                    <Icons.Success className="w-4 h-4 text-emerald-400 mt-[2px]" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};
