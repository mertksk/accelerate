// Proof Generation Worker (JavaScript)
// Runs Groth16 proof generation in a separate thread

const { parentPort, workerData } = require('worker_threads');
const snarkjs = require('snarkjs');
const fs = require('fs');

async function generateProof() {
  const startTime = Date.now();
  const input = workerData;

  try {
    // Send progress update
    parentPort.postMessage({ type: 'progress', stage: 'loading', percent: 10 });

    // Load circuit files
    console.log('[Worker] Loading WASM:', input.wasmPath);
    const wasmBuffer = fs.readFileSync(input.wasmPath);

    console.log('[Worker] Loading ZKEY:', input.zkeyPath);
    const zkeyBuffer = fs.readFileSync(input.zkeyPath);

    parentPort.postMessage({ type: 'progress', stage: 'loaded', percent: 30 });

    // Generate proof
    console.log('[Worker] Starting Groth16 proof generation...');
    parentPort.postMessage({ type: 'progress', stage: 'proving', percent: 40 });

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input.circuitInput,
      new Uint8Array(wasmBuffer),
      new Uint8Array(zkeyBuffer)
    );

    const duration = Date.now() - startTime;
    console.log(`[Worker] Proof generated in ${duration}ms`);

    parentPort.postMessage({ type: 'progress', stage: 'complete', percent: 100 });

    // Send result
    parentPort.postMessage({
      type: 'result',
      data: {
        success: true,
        proof: {
          ...proof,
          protocol: 'groth16',
          curve: 'bn128',
        },
        publicSignals,
        duration,
      },
    });
  } catch (error) {
    console.error('[Worker] Error:', error.message);

    parentPort.postMessage({
      type: 'result',
      data: {
        success: false,
        error: error.message || 'Unknown error',
        duration: Date.now() - startTime,
      },
    });
  }
}

// Start proof generation
generateProof();
