// Casper Service for L1 Contract Interactions
// Uses casper-js-sdk v5.x for RPC communication and Casper Wallet for signing

// Types for the Casper Wallet Provider
// Based on standard Casper Wallet injection patterns
interface CasperProvider {
    isConnected: () => Promise<boolean>;
    connect: () => Promise<boolean>;
    getActivePublicKey: () => Promise<string>;
    sign: (deployJson: string, publicKeyHex: string) => Promise<string>;
    signMessage: (message: string, publicKeyHex: string) => Promise<string>;
}

declare global {
    interface Window {
        CasperWalletProvider?: () => CasperProvider;
        casperlabsHelper?: any; // Legacy support
    }
}

// Configuration from environment
const RPC_URL = process.env.NEXT_PUBLIC_NODE_URL || 'https://node.testnet.casper.network/rpc';
const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_ID || 'casper-test';
const CONTRACT_HASH = process.env.NEXT_PUBLIC_CONTRACT_HASH || 'contract-a854708de979d52e5df3fdc36d40897991fd785bb406fb78c65f32ce53fc2989';
const CONTRACT_PACKAGE_HASH = 'contract-package-15747c4d50d690dcee287b0685690a78bd89d42a02e6de92414e470a1d1eabf3';

// Gas costs (in motes: 1 CSPR = 1,000,000,000 motes)
const SUBMIT_BATCH_PAYMENT = '10000000000'; // 10 CSPR
const DEPOSIT_PAYMENT = '5000000000'; // 5 CSPR

export class CasperService {
    private static provider: CasperProvider | null = null;

    /**
     * Initialize the provider if available in the window object
     */
    private static getProvider(): CasperProvider | null {
        if (typeof window === 'undefined') return null;

        if (this.provider) return this.provider;

        if (typeof window.CasperWalletProvider === 'function') {
            this.provider = window.CasperWalletProvider();
            return this.provider;
        }

        return null;
    }

    /**
     * Attempt to connect to the Casper Wallet
     * Returns the public key if successful, or null if failed/not installed
     */
    static async connect(): Promise<string | null> {
        const provider = this.getProvider();

        if (!provider) {
            console.log("[CasperService] Casper Wallet extension not detected.");
            return null;
        }

        try {
            const isConnected = await provider.isConnected();

            if (!isConnected) {
                const connected = await provider.connect();
                if (!connected) throw new Error("User rejected connection");
            }

            const activeKey = await provider.getActivePublicKey();
            console.log("[CasperService] Connected with public key:", activeKey);
            return activeKey;
        } catch (error) {
            console.error("[CasperService] Error connecting to Casper Wallet:", error);
            return null;
        }
    }

    /**
     * Check if the wallet is installed
     */
    static isInstalled(): boolean {
        if (typeof window === 'undefined') return false;
        return !!(window.CasperWalletProvider || window.casperlabsHelper);
    }

    /**
     * Get the current state root from the L1 contract via RPC
     */
    static async getStateRoot(): Promise<string | null> {
        try {
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'chain_get_state_root_hash',
                    params: []
                })
            });

            const data = await response.json();
            if (data.result?.state_root_hash) {
                console.log("[CasperService] Current state root:", data.result.state_root_hash);
                return data.result.state_root_hash;
            }
            return null;
        } catch (error) {
            console.error("[CasperService] Error fetching state root:", error);
            return null;
        }
    }

    /**
     * Submit a batch verification to the L1 Contract
     * This calls the submit_batch entry point with new_root and proof parameters
     */
    static async submitBatch(newRoot: string, proof: string): Promise<string | null> {
        console.log(`[CasperService] Submitting batch to contract...`);
        console.log(`- Contract: ${CONTRACT_HASH}`);
        console.log(`- New Root: ${newRoot}`);
        console.log(`- Proof Hash: ${proof}`);

        const provider = this.getProvider();
        if (!provider) {
            console.warn("[CasperService] No wallet connected. Cannot submit batch.");
            return null;
        }

        try {
            const activeKey = await provider.getActivePublicKey();
            console.log(`[CasperService] Submitting from: ${activeKey}`);

            // Convert root and proof to hex strings for U512
            const rootHex = newRoot.replace(/^0x/, '').padStart(64, '0');
            const proofHex = this.stringToHex(proof).padStart(64, '0');

            // Build deploy JSON for signing
            const deployJson = {
                deploy: {
                    hash: "",
                    header: {
                        account: activeKey,
                        timestamp: new Date().toISOString(),
                        ttl: "30m",
                        gas_price: 1,
                        body_hash: "",
                        dependencies: [],
                        chain_name: CHAIN_NAME
                    },
                    payment: {
                        ModuleBytes: {
                            module_bytes: "",
                            args: [["amount", { cl_type: "U512", bytes: this.u512ToBytes(SUBMIT_BATCH_PAYMENT), parsed: SUBMIT_BATCH_PAYMENT }]]
                        }
                    },
                    session: {
                        StoredContractByHash: {
                            hash: CONTRACT_HASH.replace('contract-', ''),
                            entry_point: "submit_batch",
                            args: [
                                ["root", { cl_type: "U512", bytes: rootHex, parsed: newRoot }],
                                ["proof", { cl_type: "U512", bytes: proofHex, parsed: proof }]
                            ]
                        }
                    },
                    approvals: []
                }
            };

            // Sign with wallet
            const signature = await provider.sign(JSON.stringify(deployJson), activeKey);
            console.log(`[CasperService] Deploy signed`);

            // Submit via RPC
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'account_put_deploy',
                    params: { deploy: deployJson.deploy }
                })
            });

            const result = await response.json();
            if (result.result?.deploy_hash) {
                console.log(`[CasperService] Deploy submitted: ${result.result.deploy_hash}`);
                return result.result.deploy_hash;
            }

            console.error("[CasperService] Deploy failed:", result.error);
            return null;
        } catch (error) {
            console.error("[CasperService] Error submitting batch:", error);
            return null;
        }
    }

    /**
     * Convert string to hex
     */
    private static stringToHex(str: string): string {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            hex += str.charCodeAt(i).toString(16).padStart(2, '0');
        }
        return hex;
    }

    /**
     * Convert U512 amount to bytes
     */
    private static u512ToBytes(amount: string): string {
        const num = BigInt(amount);
        let hex = num.toString(16);
        if (hex.length % 2) hex = '0' + hex;
        const byteLen = (hex.length / 2).toString(16).padStart(2, '0');
        return byteLen + hex;
    }

    /**
     * Deposit CSPR into the L2 rollup
     * Calls the deposit entry point on the deployed contract
     */
    static async deposit(amountMotes: string): Promise<string | null> {
        console.log(`[CasperService] Constructing Deploy for 'deposit'...`);
        console.log(`- Contract: ${CONTRACT_HASH}`);
        console.log(`- Amount: ${amountMotes} motes (${Number(amountMotes) / 1e9} CSPR)`);

        const provider = this.getProvider();
        if (!provider) {
            console.warn("[CasperService] No wallet connected. Cannot deposit.");
            return null;
        }

        try {
            const activeKey = await provider.getActivePublicKey();
            console.log(`[CasperService] Depositing from: ${activeKey}`);

            // Build deploy JSON for deposit
            const deployJson = {
                deploy: {
                    hash: "",
                    header: {
                        account: activeKey,
                        timestamp: new Date().toISOString(),
                        ttl: "30m",
                        gas_price: 1,
                        body_hash: "",
                        dependencies: [],
                        chain_name: CHAIN_NAME
                    },
                    payment: {
                        ModuleBytes: {
                            module_bytes: "",
                            args: [["amount", { cl_type: "U512", bytes: this.u512ToBytes(DEPOSIT_PAYMENT), parsed: DEPOSIT_PAYMENT }]]
                        }
                    },
                    session: {
                        StoredContractByHash: {
                            hash: CONTRACT_HASH.replace('contract-', ''),
                            entry_point: "deposit",
                            args: [
                                ["amount", { cl_type: "U512", bytes: this.u512ToBytes(amountMotes), parsed: amountMotes }]
                            ]
                        }
                    },
                    approvals: []
                }
            };

            // Sign with wallet
            const signature = await provider.sign(JSON.stringify(deployJson), activeKey);
            console.log(`[CasperService] Deploy signed`);

            // Submit via RPC
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'account_put_deploy',
                    params: { deploy: deployJson.deploy }
                })
            });

            const result = await response.json();
            if (result.result?.deploy_hash) {
                console.log(`[CasperService] Deposit deploy submitted: ${result.result.deploy_hash}`);
                return result.result.deploy_hash;
            }

            console.error("[CasperService] Deposit failed:", result.error);
            return null;
        } catch (error) {
            console.error("[CasperService] Error depositing:", error);
            return null;
        }
    }

    /**
     * Get deploy status by hash via RPC
     */
    static async getDeployStatus(deployHash: string): Promise<{
        status: 'pending' | 'success' | 'failed';
        error?: string;
        blockHash?: string;
    }> {
        try {
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'info_get_deploy',
                    params: { deploy_hash: deployHash }
                })
            });

            const data = await response.json();

            if (!data.result?.execution_info) {
                return { status: 'pending' };
            }

            const execResult = data.result.execution_info.execution_result;
            if (execResult?.Success) {
                return {
                    status: 'success',
                    blockHash: data.result.execution_info.block_hash
                };
            } else if (execResult?.Failure) {
                return {
                    status: 'failed',
                    error: execResult.Failure.error_message
                };
            }

            return { status: 'pending' };
        } catch (error) {
            console.error("[CasperService] Error getting deploy status:", error);
            return { status: 'pending' };
        }
    }

    /**
     * Get account balance in CSPR via explorer API
     * Falls back to testnet.cspr.live API for balance lookup
     */
    static async getBalance(publicKeyHex: string): Promise<string | null> {
        try {
            // Use CSPR.live API for balance (more reliable than direct RPC)
            const response = await fetch(
                `https://event-store-api-clarity-testnet.make.services/accounts/${publicKeyHex}`
            );

            if (!response.ok) return null;

            const data = await response.json();
            if (data.data?.balance) {
                // Convert motes to CSPR
                const cspr = (BigInt(data.data.balance) / BigInt(1_000_000_000)).toString();
                return cspr;
            }
            return null;
        } catch (error) {
            console.error("[CasperService] Error getting balance:", error);
            return null;
        }
    }

    /**
     * Get chain info (for status display)
     */
    static async getChainInfo(): Promise<{ chainName: string; stateRootHash: string } | null> {
        try {
            const stateRootHash = await this.getStateRoot();
            return {
                chainName: CHAIN_NAME,
                stateRootHash: stateRootHash || 'unknown'
            };
        } catch (error) {
            console.error("[CasperService] Error getting chain info:", error);
            return null;
        }
    }

    /**
     * Get contract configuration
     */
    static getContractConfig() {
        return {
            contractHash: CONTRACT_HASH,
            contractPackageHash: CONTRACT_PACKAGE_HASH,
            chainName: CHAIN_NAME,
            rpcUrl: RPC_URL,
            isConfigured: true
        };
    }
}
