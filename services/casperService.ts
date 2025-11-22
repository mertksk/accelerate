
// Types for the Casper Wallet Provider
// Based on standard Casper Wallet injection patterns

interface CasperProvider {
    isConnected: () => Promise<boolean>;
    connect: () => Promise<boolean>;
    getActivePublicKey: () => Promise<string>;
    sign: (msg: string, publicKey: string) => Promise<string>;
}

declare global {
    interface Window {
        CasperWalletProvider?: () => CasperProvider;
        casperlabsHelper?: any; // Legacy support
    }
}

export class CasperService {
    private static provider: CasperProvider | null = null;

    /**
     * Initialize the provider if available in the window object
     */
    private static getProvider(): CasperProvider | null {
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
            console.log("Casper Wallet extension not detected.");
            return null;
        }

        try {
            const isConnected = await provider.isConnected();
            
            if (!isConnected) {
                const connected = await provider.connect();
                if (!connected) throw new Error("User rejected connection");
            }

            const activeKey = await provider.getActivePublicKey();
            return activeKey;
        } catch (error) {
            console.error("Error connecting to Casper Wallet:", error);
            return null;
        }
    }

    /**
     * Check if the wallet is installed
     */
    static isInstalled(): boolean {
        return !!(window.CasperWalletProvider || window.casperlabsHelper);
    }
}
