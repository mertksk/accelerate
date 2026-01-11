import React, { useState } from 'react';
import { Icons } from '../components/Icons';

// ============================================================================
// Code Examples
// ============================================================================

const codeExamples = {
  installation: `# npm
npm install @accelerate/sdk

# yarn
yarn add @accelerate/sdk

# pnpm
pnpm add @accelerate/sdk`,

  initialization: `import { AccelerateSDK } from '@accelerate/sdk';

const sdk = new AccelerateSDK({
  apiKey: 'acc_test_sk_xxxxxxxxxxxxxxxxx',
  baseUrl: 'https://testnet.accelerate.casper.network',
  timeout: 30000, // optional, default 30s
  retries: 3      // optional, default 3
});`,

  checkBalance: `// Get player balance
const balance = await sdk.accounts.getBalance(playerAddress);
console.log(\`Balance: \${balance / BigInt(1e9)} ACCEL\`);

// Get full account info
const account = await sdk.accounts.get(playerAddress);
console.log({
  address: account.address,
  balance: account.balance,
  nonce: account.nonce,
  treeIndex: account.treeIndex
});`,

  sendReward: `// Send game reward to player
const tx = await sdk.transactions.create({
  from: GAME_TREASURY_ADDRESS,
  to: playerAddress,
  amount: 10 * 1e9 // 10 ACCEL in motes
});

console.log(\`Reward sent! TX: \${tx.txHash}\`);

// Wait for L2 confirmation (~2s)
await sdk.transactions.waitForStatus(tx.id, 'BATCHED');
console.log('Transaction batched!');

// Wait for ZK proof verification
await sdk.transactions.waitForStatus(tx.id, 'FINALIZED');
console.log('Transaction finalized with ZK proof!');`,

  realTimeEvents: `// Subscribe to real-time updates
const subscription = sdk.events.subscribe({
  // Transaction status changes
  onTransactionUpdate: (event) => {
    console.log(\`TX \${event.txHash}: \${event.status}\`);
    if (event.status === 'FINALIZED') {
      showSuccessNotification(event);
    }
  },

  // Batch updates
  onBatchUpdate: (event) => {
    console.log(\`Batch #\${event.batchId}: \${event.status}\`);
  },

  // ZK proof progress (0-100%)
  onProofProgress: (event) => {
    updateProgressBar(event.progress);
    console.log(\`Proof: \${event.progressMsg}\`);
  },

  // Connection events
  onConnect: () => console.log('Connected!'),
  onDisconnect: () => console.log('Disconnected'),
  onError: (error) => console.error('SSE Error:', error)
});

// Later: cleanup
subscription.unsubscribe();`,

  batchOperations: `// List recent batches
const batches = await sdk.batches.list({ limit: 10 });

// Get latest batch
const latest = await sdk.batches.getLatest();
console.log(\`Latest batch #\${latest.id}: \${latest.status}\`);

// Get proof for a batch
const proof = await sdk.proofs.getByBatch(batchId);
if (proof?.status === 'COMPLETED') {
  console.log('Proof data:', proof.proofData);
  console.log('Public signals:', proof.publicSignals);
}`,

  errorHandling: `import {
  AccelerateSDK,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  NotFoundError
} from '@accelerate/sdk';

try {
  const tx = await sdk.transactions.create({
    from: senderAddress,
    to: recipientAddress,
    amount: amount
  });
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Invalid or expired API key
    console.error('Auth failed:', error.message);
    refreshApiKey();
  } else if (error instanceof RateLimitError) {
    // Too many requests
    console.log(\`Rate limited. Retry after \${error.retryAfter}s\`);
    await sleep(error.retryAfter * 1000);
    // Retry...
  } else if (error instanceof ValidationError) {
    // Invalid input (address, amount, etc.)
    console.error('Validation:', error.message);
    showUserError(error.message);
  } else if (error instanceof NotFoundError) {
    // Account or transaction not found
    console.error('Not found:', error.message);
  } else {
    // Network or unknown error
    console.error('Error:', error);
  }
}`,

  withdrawal: `// Withdraw from L2 to L1 Casper Network
const withdrawal = await sdk.withdraw.create(
  playerAddress,
  50 * 1e9 // 50 ACCEL
);

console.log('Withdrawal initiated:', withdrawal);
// Returns: { success: true, message: '...', merkleProof: {...} }`,

  systemStatus: `// Check system health
const status = await sdk.status.get();

console.log({
  database: status.database.connected,
  sequencer: status.sequencer.isInitialized,
  stateManager: status.stateManager.isInitialized,
  currentRoot: status.stateManager.currentRoot,
  accountCount: status.stateManager.accountCount
});

// Quick health check
const isHealthy = await sdk.status.isHealthy();
if (!isHealthy) {
  showMaintenanceMode();
}`
};

// ============================================================================
// API Reference Data
// ============================================================================

interface ApiMethod {
  name: string;
  description: string;
  params?: { name: string; type: string; description: string }[];
  returns: string;
  example?: string;
}

interface ApiNamespace {
  name: string;
  description: string;
  methods: ApiMethod[];
}

const apiReference: ApiNamespace[] = [
  {
    name: 'accounts',
    description: 'Account management and balance queries',
    methods: [
      {
        name: 'get(address)',
        description: 'Get full account information',
        params: [{ name: 'address', type: 'string', description: '0x-prefixed account address' }],
        returns: 'Promise<Account>'
      },
      {
        name: 'getBalance(address)',
        description: 'Get account balance in motes',
        params: [{ name: 'address', type: 'string', description: '0x-prefixed account address' }],
        returns: 'Promise<bigint>'
      },
      {
        name: 'list(options?)',
        description: 'List all accounts with pagination',
        params: [{ name: 'options', type: 'ListOptions', description: 'limit, offset' }],
        returns: 'Promise<PaginatedResult<Account>>'
      },
      {
        name: 'getMerkleProof(address)',
        description: 'Get Merkle inclusion proof for account',
        params: [{ name: 'address', type: 'string', description: '0x-prefixed account address' }],
        returns: 'Promise<MerkleProof>'
      }
    ]
  },
  {
    name: 'transactions',
    description: 'Create and track transactions',
    methods: [
      {
        name: 'create(params)',
        description: 'Create a new L2 transaction',
        params: [
          { name: 'from', type: 'string', description: 'Sender address' },
          { name: 'to', type: 'string', description: 'Recipient address' },
          { name: 'amount', type: 'string | number | bigint', description: 'Amount in motes' }
        ],
        returns: 'Promise<Transaction>'
      },
      {
        name: 'get(txId)',
        description: 'Get transaction by ID',
        params: [{ name: 'txId', type: 'string', description: 'Transaction ID' }],
        returns: 'Promise<Transaction>'
      },
      {
        name: 'getByHash(txHash)',
        description: 'Get transaction by hash',
        params: [{ name: 'txHash', type: 'string', description: '0x-prefixed tx hash' }],
        returns: 'Promise<Transaction>'
      },
      {
        name: 'list(options?)',
        description: 'List transactions with filters',
        params: [{ name: 'options', type: 'TransactionListOptions', description: 'status, from, to, batchId, limit, offset' }],
        returns: 'Promise<PaginatedResult<Transaction>>'
      },
      {
        name: 'waitForStatus(txId, status, timeout?)',
        description: 'Wait for transaction to reach status',
        params: [
          { name: 'txId', type: 'string', description: 'Transaction ID' },
          { name: 'status', type: 'TransactionStatus', description: 'Target status' },
          { name: 'timeout', type: 'number', description: 'Timeout in ms (default 5min)' }
        ],
        returns: 'Promise<Transaction>'
      }
    ]
  },
  {
    name: 'batches',
    description: 'Batch information and tracking',
    methods: [
      {
        name: 'get(batchId)',
        description: 'Get batch by ID',
        params: [{ name: 'batchId', type: 'number', description: 'Batch ID' }],
        returns: 'Promise<Batch>'
      },
      {
        name: 'list(options?)',
        description: 'List batches with filters',
        params: [{ name: 'options', type: 'BatchListOptions', description: 'status, limit, offset' }],
        returns: 'Promise<PaginatedResult<Batch>>'
      },
      {
        name: 'getLatest()',
        description: 'Get the most recent batch',
        returns: 'Promise<Batch | null>'
      }
    ]
  },
  {
    name: 'events',
    description: 'Real-time event subscriptions via SSE',
    methods: [
      {
        name: 'subscribe(handlers)',
        description: 'Subscribe to all event types',
        params: [{ name: 'handlers', type: 'EventHandlers', description: 'Event callback handlers' }],
        returns: 'EventSubscription'
      },
      {
        name: 'onTransactionUpdate(handler)',
        description: 'Subscribe to transaction updates only',
        returns: 'EventSubscription'
      },
      {
        name: 'onBatchUpdate(handler)',
        description: 'Subscribe to batch updates only',
        returns: 'EventSubscription'
      },
      {
        name: 'onProofProgress(handler)',
        description: 'Subscribe to proof generation progress',
        returns: 'EventSubscription'
      },
      {
        name: 'disconnect()',
        description: 'Disconnect from event stream',
        returns: 'void'
      }
    ]
  },
  {
    name: 'status',
    description: 'System health and status',
    methods: [
      {
        name: 'get()',
        description: 'Get detailed system status',
        returns: 'Promise<SystemStatus>'
      },
      {
        name: 'isHealthy()',
        description: 'Quick health check',
        returns: 'Promise<boolean>'
      }
    ]
  }
];

// ============================================================================
// Components
// ============================================================================

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-slate-300 font-mono whitespace-pre">{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Icons.Success className="w-4 h-4 text-green-400" />
        ) : (
          <Icons.Copy className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </div>
  );
};

const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-900/50 hover:bg-slate-900 transition-colors text-left"
      >
        <span className="text-white font-medium">{title}</span>
        {isOpen ? (
          <Icons.ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <Icons.ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="p-4 bg-slate-900/30">{children}</div>}
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export const GameSDK: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'reference' | 'examples'>('quickstart');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icons.Gamepad className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl font-bold text-white">
              Game <span className="text-red-500">SDK</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Production-ready TypeScript SDK for integrating games with Casper Accelerate ZK-Rollup.
            Instant transfers, real-time events, and cryptographic security.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2">
              <Icons.Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-white font-medium">~2s</span>
              <span className="text-slate-500 text-sm">L2 Finality</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2">
              <Icons.Activity className="w-4 h-4 text-green-500" />
              <span className="text-white font-medium">1000+</span>
              <span className="text-slate-500 text-sm">TPS</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2">
              <Icons.Security className="w-4 h-4 text-blue-500" />
              <span className="text-white font-medium">ZK</span>
              <span className="text-slate-500 text-sm">Secured</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-full px-4 py-2">
              <Icons.Package className="w-4 h-4 text-purple-500" />
              <span className="text-white font-medium">0</span>
              <span className="text-slate-500 text-sm">Dependencies</span>
            </div>
          </div>

          {/* Quick Install */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
              <span className="px-4 py-3 text-slate-500 font-mono text-sm">$</span>
              <code className="flex-1 py-3 text-green-400 font-mono text-sm">npm install @accelerate/sdk</code>
              <button
                onClick={() => navigator.clipboard.writeText('npm install @accelerate/sdk')}
                className="px-4 py-3 hover:bg-slate-800 transition-colors"
              >
                <Icons.Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center border-b border-slate-800">
        {[
          { id: 'quickstart', label: 'Quick Start', icon: <Icons.Play className="w-4 h-4" /> },
          { id: 'reference', label: 'API Reference', icon: <Icons.Docs className="w-4 h-4" /> },
          { id: 'examples', label: 'Examples', icon: <Icons.Code className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-red-500 border-red-500'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'quickstart' && (
          <div className="space-y-8">
            {/* Step 1: Installation */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-sm">1</span>
                Installation
              </h2>
              <CodeBlock code={codeExamples.installation} language="bash" />
            </section>

            {/* Step 2: Initialize */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-sm">2</span>
                Initialize the SDK
              </h2>
              <p className="text-slate-400 mb-4">
                Get your API key from the developer dashboard and initialize the SDK.
              </p>
              <CodeBlock code={codeExamples.initialization} />
            </section>

            {/* Step 3: Check Balance */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-sm">3</span>
                Check Player Balance
              </h2>
              <CodeBlock code={codeExamples.checkBalance} />
            </section>

            {/* Step 4: Send Reward */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-sm">4</span>
                Send Game Rewards
              </h2>
              <p className="text-slate-400 mb-4">
                Create transactions to reward players. Track status from PENDING → BATCHED → PROVING → FINALIZED.
              </p>
              <CodeBlock code={codeExamples.sendReward} />
            </section>

            {/* Step 5: Real-time Events */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center text-sm">5</span>
                Real-time Events
              </h2>
              <p className="text-slate-400 mb-4">
                Subscribe to Server-Sent Events for instant updates on transactions, batches, and proof generation.
              </p>
              <CodeBlock code={codeExamples.realTimeEvents} />
            </section>
          </div>
        )}

        {activeTab === 'reference' && (
          <div className="space-y-6">
            {apiReference.map((namespace) => (
              <CollapsibleSection
                key={namespace.name}
                title={`sdk.${namespace.name}`}
                defaultOpen={namespace.name === 'accounts'}
              >
                <p className="text-slate-400 text-sm mb-4">{namespace.description}</p>
                <div className="space-y-4">
                  {namespace.methods.map((method) => (
                    <div key={method.name} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                      <code className="text-green-400 font-mono">{method.name}</code>
                      <p className="text-slate-400 text-sm mt-2">{method.description}</p>
                      {method.params && (
                        <div className="mt-3">
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Parameters</div>
                          <div className="space-y-1">
                            {method.params.map((param) => (
                              <div key={param.name} className="flex items-start gap-2 text-sm">
                                <code className="text-yellow-400">{param.name}</code>
                                <span className="text-slate-600">:</span>
                                <code className="text-blue-400">{param.type}</code>
                                <span className="text-slate-500">- {param.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-3">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Returns</div>
                        <code className="text-purple-400 text-sm">{method.returns}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            ))}
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Activity className="w-5 h-5 text-green-500" />
                Batch Operations
              </h2>
              <CodeBlock code={codeExamples.batchOperations} />
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Security className="w-5 h-5 text-red-500" />
                Error Handling
              </h2>
              <p className="text-slate-400 mb-4">
                The SDK provides typed errors for different failure scenarios.
              </p>
              <CodeBlock code={codeExamples.errorHandling} />
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Wallet className="w-5 h-5 text-purple-500" />
                Withdrawals (L2 → L1)
              </h2>
              <CodeBlock code={codeExamples.withdrawal} />
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icons.Server className="w-5 h-5 text-blue-500" />
                System Status
              </h2>
              <CodeBlock code={codeExamples.systemStatus} />
            </section>
          </div>
        )}
      </div>

      {/* Rate Limits Section */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Icons.Zap className="w-6 h-6 text-yellow-500" />
          Rate Limits
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="pb-3 text-slate-400 font-medium">Tier</th>
                <th className="pb-3 text-slate-400 font-medium">Requests/Min</th>
                <th className="pb-3 text-slate-400 font-medium">Requests/Day</th>
                <th className="pb-3 text-slate-400 font-medium">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-4">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm">FREE</span>
                </td>
                <td className="py-4 text-white">60</td>
                <td className="py-4 text-white">1,000</td>
                <td className="py-4 text-slate-400">Development & Testing</td>
              </tr>
              <tr>
                <td className="py-4">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">STARTER</span>
                </td>
                <td className="py-4 text-white">300</td>
                <td className="py-4 text-white">10,000</td>
                <td className="py-4 text-slate-400">Small Games & MVPs</td>
              </tr>
              <tr>
                <td className="py-4">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">PRO</span>
                </td>
                <td className="py-4 text-white">1,000</td>
                <td className="py-4 text-white">100,000</td>
                <td className="py-4 text-slate-400">Production Games</td>
              </tr>
              <tr>
                <td className="py-4">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">ENTERPRISE</span>
                </td>
                <td className="py-4 text-white">Custom</td>
                <td className="py-4 text-white">Custom</td>
                <td className="py-4 text-slate-400">High-volume Applications</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Rate limit headers are included in every response: <code className="text-slate-400">X-RateLimit-Limit</code>,{' '}
          <code className="text-slate-400">X-RateLimit-Remaining</code>, <code className="text-slate-400">X-RateLimit-Reset</code>
        </p>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Game Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <Icons.Transaction className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">In-Game Rewards</h3>
            <p className="text-slate-400 text-sm">
              Distribute tokens for achievements, quests, and milestones. Instant L2 transfers with ZK proof settlement.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Icons.Activity className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Real-Time Trading</h3>
            <p className="text-slate-400 text-sm">
              Enable player-to-player trading with instant finality. Perfect for marketplaces and auction systems.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-red-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Icons.Gamepad className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tournament Prizes</h3>
            <p className="text-slate-400 text-sm">
              Automated prize distribution with verifiable on-chain settlement. Perfect for esports and competitive gaming.
            </p>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="text-center py-8 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
        <p className="text-slate-400 mb-6">
          Join our community or check out the source code.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/casper-accelerate/sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            <Icons.Github className="w-5 h-5" />
            GitHub
          </a>
          <a
            href="https://discord.gg/casper-accelerate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-medium transition-colors"
          >
            <Icons.Discord className="w-5 h-5" />
            Discord
          </a>
          <a
            href="mailto:sdk@accelerate.casper.network"
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
          >
            <Icons.Send className="w-5 h-5" />
            Contact
          </a>
        </div>
      </section>
    </div>
  );
};

export default GameSDK;
