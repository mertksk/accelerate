// Casper Service for L1 Contract Interactions
// Uses casper-js-sdk v5.x for RPC communication and Casper Wallet for signing

// Types for the Casper Wallet Provider (v1.x API)
interface CasperWalletState {
    isLocked: boolean;
    isConnected: boolean;
    activeKey: string | null;
}

interface CasperProvider {
    // Modern Casper Wallet API
    requestConnection: () => Promise<boolean>;
    disconnectFromSite: () => Promise<boolean>;
    getActivePublicKey: () => Promise<string>;
    sign: (deployJson: string, signingPublicKeyHex: string) => Promise<{ signature: Uint8Array; signatureHex: string }>;
    signMessage: (message: string, signingPublicKeyHex: string) => Promise<{ signature: Uint8Array; signatureHex: string }>;
    isConnected: () => Promise<boolean>;
}

declare global {
    interface Window {
        CasperWalletProvider?: () => CasperProvider;
        casperlabsHelper?: any; // Legacy Signer support
    }
}

// Configuration from environment
const DIRECT_RPC_URL = process.env.NEXT_PUBLIC_NODE_URL || 'https://node.testnet.casper.network/rpc';
// Use local proxy to avoid CORS issues in browser
const RPC_URL = typeof window !== 'undefined' ? '/api/rpc' : DIRECT_RPC_URL;
const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_ID || 'casper-test';
const CONTRACT_HASH = process.env.NEXT_PUBLIC_CONTRACT_HASH || 'hash-97d19d7103e13147bd027cc8fdc25dac74ca454947c24ba0d6a28871827c6524';
const CONTRACT_PACKAGE_HASH = 'contract-package-3e3e458f59228c8a29e3b9151d89b535b76326ae10b43115b6abe419799f121f';

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

        console.log("[CasperService] Checking for wallet...");
        console.log("[CasperService] CasperWalletProvider exists:", typeof window.CasperWalletProvider);
        console.log("[CasperService] casperlabsHelper exists:", typeof window.casperlabsHelper);

        if (typeof window.CasperWalletProvider === 'function') {
            try {
                this.provider = window.CasperWalletProvider();
                console.log("[CasperService] Provider initialized:", this.provider);
                console.log("[CasperService] Provider methods:", Object.keys(this.provider || {}));
                return this.provider;
            } catch (e) {
                console.error("[CasperService] Error initializing provider:", e);
            }
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
            // Always request connection first to ensure site is approved
            // The wallet may report isConnected=true but still need site approval
            console.log("[CasperService] Requesting site connection...");
            try {
                const connected = await provider.requestConnection();
                console.log("[CasperService] Connection result:", connected);
                if (!connected) {
                    throw new Error("User rejected connection");
                }
            } catch (connError: any) {
                // If already connected, this might throw - that's okay
                console.log("[CasperService] requestConnection result:", connError?.message || connError);
            }

            // Get the active public key
            console.log("[CasperService] Getting active public key...");
            const activeKey = await provider.getActivePublicKey();
            console.log("[CasperService] Connected with public key:", activeKey);
            return activeKey;
        } catch (error: any) {
            console.error("[CasperService] Error connecting to Casper Wallet:", error);
            console.error("[CasperService] Error message:", error?.message);

            // Provide helpful message for common errors
            if (error?.message?.includes('not approved')) {
                console.error("[CasperService] Please approve this site in your Casper Wallet extension");
            }
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
                    params: [ deployJson.deploy ]
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
     * Get the main purse URef for a public key
     */
    private static async getMainPurse(publicKeyHex: string): Promise<string | null> {
        try {
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'state_get_account_info',
                    params: {
                        public_key: publicKeyHex,
                        block_identifier: null
                    }
                })
            });
            const data = await response.json();
            if (data.result?.account?.main_purse) {
                console.log(`[CasperService] Main purse: ${data.result.account.main_purse}`);
                return data.result.account.main_purse;
            }
            console.error('[CasperService] Could not get main purse:', data);
            return null;
        } catch (error) {
            console.error('[CasperService] Error getting main purse:', error);
            return null;
        }
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
            // Import SDK v5.x and blakejs for proper hashing
            const sdk = await import('casper-js-sdk');
            const { blake2b } = await import('blakejs');

            const activeKey = await provider.getActivePublicKey();
            console.log(`[CasperService] Depositing from: ${activeKey}`);

            // Parse public key using SDK v5 API
            const publicKey = sdk.PublicKey.fromHex(activeKey);

            // Use session wasm approach to handle purse access correctly
            // The session wasm runs in user's context and can access their main purse

            // Fetch the client_deposit.wasm session code
            const wasmResponse = await fetch('/client_deposit.wasm');
            if (!wasmResponse.ok) {
                throw new Error(`Failed to load client_deposit.wasm: ${wasmResponse.statusText}`);
            }
            const wasmBuffer = await wasmResponse.arrayBuffer();
            const wasmBytes = new Uint8Array(wasmBuffer);
            console.log(`[CasperService] Loaded client_deposit.wasm (${wasmBytes.length} bytes)`);

            // Build args for session wasm: contract_hash, amount, l2_address
            // The session wasm will handle the purse internally via account::get_main_purse()
            const amount = sdk.CLValue.newCLUInt512(amountMotes);
            const l2_address = sdk.CLValue.newCLString(activeKey);
            console.log(`[CasperService] L2 address to credit: ${activeKey}`);

            // Contract hash as a Key type for the session wasm
            const contractHashHex = CONTRACT_HASH.replace('hash-', '');
            console.log(`[CasperService] Contract hash hex: ${contractHashHex}`);

            // Create contract hash bytes (32 bytes)
            const contractHashBytes = Buffer.from(contractHashHex, 'hex');

            // Build args map for the session wasm
            const args = sdk.Args.fromMap({
                amount,
                l2_address,
                contract_hash: sdk.CLValue.newCLByteArray(contractHashBytes)
            });

            // Build session using ModuleBytes (SDK v5)
            const session = new sdk.ModuleBytes(wasmBytes, args);
            console.log(`[CasperService] Session created (ModuleBytes)`);

            // Build payment
            const payment = sdk.ExecutableDeployItem.standardPayment(DEPOSIT_PAYMENT);
            console.log(`[CasperService] Payment created`);

            // Get bytes for body hash computation
            const sessionBytesRaw = session.bytes();
            const paymentBytes = payment.bytes();

            // ModuleBytes tag is 0x00
            const sessionBytes = new Uint8Array([0x00, ...sessionBytesRaw]);
            console.log(`[CasperService] Session bytes (first 20): ${Buffer.from(sessionBytes.slice(0, 20)).toString('hex')}...`);

            // Compute correct body_hash: blake2b256(payment || session)
            const bodyBytes = new Uint8Array([...paymentBytes, ...sessionBytes]);
            const bodyHash = Buffer.from(blake2b(bodyBytes, null, 32)).toString('hex');
            console.log(`[CasperService] Correct body hash: ${bodyHash}`);

            // Create timestamp
            const timestamp = new Date();
            const timestampStr = timestamp.toISOString();

            // Helper to convert bytes to hex
            const toHex = (bytes: Uint8Array) => Buffer.from(bytes).toString('hex');

            // Build header bytes for deploy hash computation
            const accountBytes = publicKey.bytes();
            const timestampMs = BigInt(timestamp.getTime());
            const ttlMs = BigInt(1800000); // 30 minutes in ms
            const gasPrice = BigInt(1);

            // Serialize header for hashing
            const headerParts: number[] = [];
            // Account (public key bytes with length prefix)
            headerParts.push(...accountBytes);
            // Timestamp (u64 little endian)
            for (let i = 0; i < 8; i++) headerParts.push(Number((timestampMs >> BigInt(i * 8)) & BigInt(0xff)));
            // TTL (u64 little endian)
            for (let i = 0; i < 8; i++) headerParts.push(Number((ttlMs >> BigInt(i * 8)) & BigInt(0xff)));
            // Gas price (u64 little endian)
            for (let i = 0; i < 8; i++) headerParts.push(Number((gasPrice >> BigInt(i * 8)) & BigInt(0xff)));
            // Body hash (32 bytes)
            const bodyHashBytes = Buffer.from(bodyHash, 'hex');
            headerParts.push(...bodyHashBytes);
            // Dependencies (empty vec = 4 bytes of zeros for u32 length)
            headerParts.push(0, 0, 0, 0);
            // Chain name (string with u32 length prefix)
            const chainNameBytes = Buffer.from(CHAIN_NAME, 'utf8');
            const chainNameLen = chainNameBytes.length;
            headerParts.push(chainNameLen & 0xff, (chainNameLen >> 8) & 0xff, (chainNameLen >> 16) & 0xff, (chainNameLen >> 24) & 0xff);
            headerParts.push(...chainNameBytes);

            const headerBytes = new Uint8Array(headerParts);
            const deployHash = Buffer.from(blake2b(headerBytes, null, 32)).toString('hex');
            console.log(`[CasperService] Computed deploy hash: ${deployHash}`);

            // Build deploy JSON
            // We need to be careful with manual construction.
            // The easiest way is to construct the JSON args manually matching the bytes we just built.
            
            const paymentAmountCL = sdk.CLValue.newCLUInt512(DEPOSIT_PAYMENT);
            const deployObject = {
                hash: deployHash,
                header: {
                    account: activeKey,
                    timestamp: timestampStr,
                    ttl: '30m',
                    gas_price: 1,
                    body_hash: bodyHash,
                    dependencies: [],
                    chain_name: CHAIN_NAME
                },
                payment: {
                    ModuleBytes: {
                        module_bytes: '',
                        args: [
                            ['amount', {
                                bytes: toHex(paymentAmountCL.bytes()),
                                cl_type: 'U512',
                                parsed: DEPOSIT_PAYMENT
                            }]
                        ]
                    }
                },
                session: {
                    ModuleBytes: {
                        module_bytes: toHex(wasmBytes),
                        args: [
                            ['amount', {
                                bytes: toHex(amount.bytes()),
                                cl_type: 'U512',
                                parsed: amountMotes
                            }],
                            ['l2_address', {
                                bytes: toHex(l2_address.bytes()),
                                cl_type: 'String',
                                parsed: activeKey
                            }],
                            ['contract_hash', {
                                bytes: toHex(sdk.CLValue.newCLByteArray(contractHashBytes).bytes()),
                                cl_type: { ByteArray: 32 },
                                parsed: contractHashHex
                            }]
                        ]
                    }
                },
                approvals: [] as Array<{signer: string, signature: string}>
            };
            console.log(`[CasperService] Deploy JSON created (wasm size: ${wasmBytes.length} bytes)`);

            // Sign the deploy hash
            console.log(`[CasperService] Signing deploy hash: ${deployHash}`);

            let signature: string;
            try {
                // First try the standard sign method with deploy JSON
                const signResult = await provider.sign(JSON.stringify(deployObject), activeKey);
                console.log(`[CasperService] Deploy signed via sign():`, signResult);
                // signResult.signature is Uint8Array, we need signatureHex (hex string)
                // Also need to prefix with algorithm identifier: 01 = Ed25519, 02 = Secp256k1
                const algoPrefix = activeKey.startsWith('01') ? '01' : '02';
                signature = algoPrefix + signResult.signatureHex;
                console.log(`[CasperService] Final signature (${signature.length} chars):`, signature.substring(0, 32) + '...');
            } catch (signError: any) {
                console.log(`[CasperService] sign() failed, trying signMessage():`, signError?.message);
                // Fall back to signMessage with the deploy hash
                const messageResult = await provider.signMessage(deployHash, activeKey);
                console.log(`[CasperService] Deploy signed via signMessage():`, messageResult);
                // For Ed25519/Secp256k1, we need to prefix the signature with the algorithm identifier
                // 01 = Ed25519, 02 = Secp256k1
                // Use signatureHex (hex string), not signature (Uint8Array)
                const algoPrefix = activeKey.startsWith('01') ? '01' : '02';
                signature = algoPrefix + messageResult.signatureHex;
                console.log(`[CasperService] Final signature (${signature.length} chars):`, signature);
            }

            // Add signature to approvals
            deployObject.approvals = [{
                signer: activeKey,
                signature: signature
            }];

            // Submit via RPC
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'account_put_deploy',
                    params: { deploy: deployObject }
                })
            });

            const result = await response.json();
            console.log(`[CasperService] RPC response:`, JSON.stringify(result, null, 2));

            if (result.result?.deploy_hash) {
                console.log(`[CasperService] Deposit deploy submitted: ${result.result.deploy_hash}`);
                return result.result.deploy_hash;
            }

            console.error("[CasperService] Deposit failed:", JSON.stringify(result.error, null, 2));
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
     * Get account balance in CSPR via RPC
     * Returns both L1 and L2 balances
     */
    static async getBalance(publicKeyHex: string): Promise<{ l1Balance: number; l2Balance: number } | null> {
        console.log("[CasperService] Fetching balance for:", publicKeyHex);

        try {
            // First get state root hash
            const stateRootHash = await this.getStateRoot();
            if (!stateRootHash) {
                console.warn("[CasperService] Could not get state root for balance query");
                return { l1Balance: 0, l2Balance: 0 };
            }

            // Query balance using RPC
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'query_balance',
                    params: {
                        purse_identifier: {
                            main_purse_under_public_key: publicKeyHex
                        },
                        state_identifier: {
                            StateRootHash: stateRootHash
                        }
                    }
                })
            });

            const data = await response.json();
            console.log("[CasperService] Balance response:", data);

            if (data.result?.balance) {
                // Convert motes to CSPR
                const balanceMotes = BigInt(data.result.balance);
                const l1Balance = Number(balanceMotes / BigInt(1_000_000_000));
                console.log("[CasperService] L1 Balance:", l1Balance, "CSPR");
                return { l1Balance, l2Balance: 0 };
            }

            // Fallback: try legacy state_get_balance if query_balance fails
            if (data.error) {
                console.log("[CasperService] query_balance failed, trying state_get_account_info...");
                const accountResponse = await fetch(RPC_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: Date.now(),
                        method: 'state_get_account_info',
                        params: {
                            public_key: publicKeyHex,
                            block_identifier: null
                        }
                    })
                });

                const accountData = await accountResponse.json();
                console.log("[CasperService] Account info response:", accountData);

                if (accountData.result?.account?.main_purse) {
                    const mainPurse = accountData.result.account.main_purse;
                    // Now query the purse balance
                    const purseResponse = await fetch(RPC_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            jsonrpc: '2.0',
                            id: Date.now(),
                            method: 'state_get_balance',
                            params: {
                                state_root_hash: stateRootHash,
                                purse_uref: mainPurse
                            }
                        })
                    });

                    const purseData = await purseResponse.json();
                    console.log("[CasperService] Purse balance response:", purseData);

                    if (purseData.result?.balance_value) {
                        const balanceMotes = BigInt(purseData.result.balance_value);
                        const l1Balance = Number(balanceMotes / BigInt(1_000_000_000));
                        console.log("[CasperService] L1 Balance (from purse):", l1Balance, "CSPR");
                        return { l1Balance, l2Balance: 0 };
                    }
                }
            }

            console.warn("[CasperService] Could not fetch balance");
            return { l1Balance: 0, l2Balance: 0 };
        } catch (error) {
            console.error("[CasperService] Error getting balance:", error);
            return null;
        }
    }

    /**
     * Get contract state (total deposits, batch count, state root)
     */
    static async getContractState(): Promise<{
        stateRoot: string;
        batchCount: number;
        totalDeposits: string;
        totalWithdrawals: string;
    } | null> {
        try {
            const stateRootHash = await this.getStateRoot();
            if (!stateRootHash) return null;

            // Query contract state via RPC
            const contractHash = CONTRACT_HASH.replace('hash-', '');

            // Get account info to find named keys
            const response = await fetch(RPC_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: Date.now(),
                    method: 'state_get_entity',
                    params: {
                        entity_identifier: {
                            AddressableEntity: `entity-contract-${contractHash}`
                        },
                        block_identifier: null
                    }
                })
            });

            const data = await response.json();

            // Extract named keys from contract entity
            const namedKeys = data.result?.entity?.named_keys || [];
            let stateRoot = '0';
            let batchCount = 0;
            let totalDeposits = '0';
            let totalWithdrawals = '0';

            // Parse named keys to get state values
            for (const key of namedKeys) {
                if (key.name === 'state_root') {
                    stateRoot = key.key || '0';
                } else if (key.name === 'batch_count') {
                    batchCount = parseInt(key.key || '0');
                } else if (key.name === 'total_deposits') {
                    totalDeposits = key.key || '0';
                } else if (key.name === 'total_withdrawals') {
                    totalWithdrawals = key.key || '0';
                }
            }

            return {
                stateRoot: stateRoot.substring(0, 24) + '...',
                batchCount,
                totalDeposits,
                totalWithdrawals
            };
        } catch (error) {
            console.error("[CasperService] Error getting contract state:", error);
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
