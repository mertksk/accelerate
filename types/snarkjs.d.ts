declare module 'snarkjs' {
    export const groth16: {
        fullProve: (input: any, wasmPath: string | Uint8Array, zkeyPath: string | Uint8Array) => Promise<{ proof: any; publicSignals: string[] }>;
        verify: (vkey: any, publicSignals: string[], proof: any) => Promise<boolean>;
    };
}
