// Proof Generation Worker Thread
// Runs Groth16 proof generation in a separate thread to avoid blocking

import { parentPort, workerData } from 'worker_threads';
import * as snarkjs from 'snarkjs';
import * as fs from 'fs';
import * as path from 'path';

interface WorkerInput {
  circuitInput: any;
  wasmPath: string;
  zkeyPath: string;
}

interface WorkerResult {
  success: boolean;
  proof?: any;
  publicSignals?: string[];
  error?: string;
  duration?: number;
}

async function generateProof(): Promise<void> {
  const startTime = Date.now();
  const input = workerData as WorkerInput;

  try {
    // Send progress update
    parentPort?.postMessage({ type: 'progress', stage: 'loading', percent: 10 });

    // Load circuit files
    const wasmBuffer = fs.readFileSync(input.wasmPath);
    const zkeyBuffer = fs.readFileSync(input.zkeyPath);

    parentPort?.postMessage({ type: 'progress', stage: 'loaded', percent: 30 });

    // Generate proof
    parentPort?.postMessage({ type: 'progress', stage: 'proving', percent: 40 });

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input.circuitInput,
      new Uint8Array(wasmBuffer),
      new Uint8Array(zkeyBuffer)
    );

    const duration = Date.now() - startTime;

    parentPort?.postMessage({ type: 'progress', stage: 'complete', percent: 100 });

    // Send result
    const result: WorkerResult = {
      success: true,
      proof: {
        ...proof,
        protocol: 'groth16',
        curve: 'bn128',
      },
      publicSignals,
      duration,
    };

    parentPort?.postMessage({ type: 'result', data: result });
  } catch (error) {
    const result: WorkerResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: Date.now() - startTime,
    };

    parentPort?.postMessage({ type: 'result', data: result });
  }
}

// Start proof generation
generateProof();
