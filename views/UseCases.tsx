import React from 'react';
import { Icons } from '../components/Icons';

interface UseCase {
    title: string;
    description: string;
    feasibility: 'ready' | 'possible' | 'future';
    timeEstimate: string;
    features: string[];
    icon: string;
}

const useCases: UseCase[] = [
    {
        title: 'DeFi & Payments',
        description: 'High-speed token transfers, micro-payments, and payment channels for instant settlements.',
        feasibility: 'ready',
        timeEstimate: 'Now',
        features: [
            'Instant L2 transfers (~2s)',
            'Near-zero transaction fees',
            'Batch settlements to L1',
            'Multi-token support possible'
        ],
        icon: 'payment'
    },
    {
        title: 'NFT Marketplace',
        description: 'Trade NFTs with minimal gas fees. Bulk minting and transfers become economically viable.',
        feasibility: 'possible',
        timeEstimate: '2-4 weeks',
        features: [
            'Low-cost NFT minting',
            'Instant NFT transfers on L2',
            'Bulk operations support',
            'Royalty enforcement'
        ],
        icon: 'nft'
    },
    {
        title: 'Gaming Assets',
        description: 'In-game currencies, items, and rewards. Perfect for play-to-earn economies.',
        feasibility: 'possible',
        timeEstimate: '1-2 months',
        features: [
            'In-game token economy',
            'Item ownership on L2',
            'Reward distribution',
            'Cross-game assets'
        ],
        icon: 'gaming'
    },
    {
        title: 'Decentralized Exchange',
        description: 'Order book DEX with fast order matching and settlement batching.',
        feasibility: 'possible',
        timeEstimate: '2-3 months',
        features: [
            'Fast order placement',
            'Batch trade settlements',
            'Low trading fees',
            'AMM liquidity pools'
        ],
        icon: 'exchange'
    },
    {
        title: 'Turn-based Games',
        description: 'Chess, card games, strategy games with provably fair moves.',
        feasibility: 'future',
        timeEstimate: '3-6 months',
        features: [
            'Verifiable game state',
            'Anti-cheat via ZK proofs',
            'Tournaments with prizes',
            'Ranking systems'
        ],
        icon: 'strategy'
    },
    {
        title: 'Real-time Gaming',
        description: 'Fast-paced games requiring sub-second finality with state channels.',
        feasibility: 'future',
        timeEstimate: '6+ months',
        features: [
            'State channel integration',
            'GPU-accelerated proofs',
            'Recursive proof batching',
            'Real-time multiplayer'
        ],
        icon: 'realtime'
    },
    {
        title: 'Supply Chain',
        description: 'Track products through supply chain with privacy-preserving proofs.',
        feasibility: 'possible',
        timeEstimate: '2-3 months',
        features: [
            'Product tracking',
            'Batch certifications',
            'Privacy for business data',
            'Audit trails'
        ],
        icon: 'supply'
    },
    {
        title: 'Identity & Credentials',
        description: 'Issue and verify credentials without revealing underlying data.',
        feasibility: 'future',
        timeEstimate: '4-6 months',
        features: [
            'ZK identity proofs',
            'Credential issuance',
            'Selective disclosure',
            'Reputation systems'
        ],
        icon: 'identity'
    }
];

const getFeasibilityColor = (feasibility: UseCase['feasibility']) => {
    switch (feasibility) {
        case 'ready': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'possible': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'future': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
};

const getFeasibilityLabel = (feasibility: UseCase['feasibility']) => {
    switch (feasibility) {
        case 'ready': return 'Ready Now';
        case 'possible': return 'Achievable';
        case 'future': return 'Future Development';
    }
};

const getIcon = (icon: string) => {
    switch (icon) {
        case 'payment': return <Icons.Transaction className="w-8 h-8" />;
        case 'nft': return <Icons.Contract className="w-8 h-8" />;
        case 'gaming': return <Icons.Layer2 className="w-8 h-8" />;
        case 'exchange': return <Icons.Activity className="w-8 h-8" />;
        case 'strategy': return <Icons.Security className="w-8 h-8" />;
        case 'realtime': return <Icons.Clock className="w-8 h-8" />;
        case 'supply': return <Icons.Server className="w-8 h-8" />;
        case 'identity': return <Icons.Lock className="w-8 h-8" />;
        default: return <Icons.Transaction className="w-8 h-8" />;
    }
};

export const UseCases: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-white mb-4">
                    Build on <span className="text-red-500">Casper Accelerate</span>
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Our ZK-Rollup infrastructure enables a wide range of applications
                    with instant finality, minimal fees, and cryptographic security.
                </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-red-500">1000+</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">TPS Capacity</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-500">~2s</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">L2 Finality</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-500">99%</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Fee Reduction</div>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-500">ZK</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Secured</div>
                </div>
            </div>

            {/* Feasibility Legend */}
            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-slate-400">Ready Now</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-400">Achievable (weeks)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-slate-400">Future Development</span>
                </div>
            </div>

            {/* Use Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {useCases.map((useCase, index) => (
                    <div
                        key={index}
                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-black/20 group"
                    >
                        {/* Icon & Badge */}
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${
                                useCase.feasibility === 'ready' ? 'bg-green-500/10 text-green-400' :
                                useCase.feasibility === 'possible' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-blue-500/10 text-blue-400'
                            }`}>
                                {getIcon(useCase.icon)}
                            </div>
                            <span className={`px-2 py-1 text-[10px] font-medium rounded-full border ${getFeasibilityColor(useCase.feasibility)}`}>
                                {getFeasibilityLabel(useCase.feasibility)}
                            </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">
                            {useCase.title}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            {useCase.description}
                        </p>

                        {/* Time Estimate */}
                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                            <Icons.Clock className="w-3 h-3" />
                            <span>Est. Development: {useCase.timeEstimate}</span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2">
                            {useCase.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-center gap-2 text-xs text-slate-400">
                                    <Icons.Success className="w-3 h-3 text-green-500 shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Technical Stack Section */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mt-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Technical Foundation</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
                            <Icons.Compute className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Groth16 ZK-SNARKs</h3>
                        <p className="text-sm text-slate-500">
                            248,930 constraint circuit with Poseidon hashing for efficient proof generation and verification.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
                            <Icons.Database className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">16-Level Merkle Tree</h3>
                        <p className="text-sm text-slate-500">
                            Supports up to 65,536 accounts with cryptographic proof of inclusion for every state transition.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <Icons.Security className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">Casper L1 Settlement</h3>
                        <p className="text-sm text-slate-500">
                            All proofs are verified on Casper Network mainnet, inheriting full L1 security guarantees.
                        </p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Build?</h2>
                <p className="text-slate-400 mb-6">
                    Contact us to discuss your project requirements and integration options.
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="https://github.com/anthropics/casper-accelerate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Icons.ExternalLink className="w-4 h-4" />
                        View on GitHub
                    </a>
                    <a
                        href="#"
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                    >
                        Contact Team
                    </a>
                </div>
            </div>
        </div>
    );
};
