#!/usr/bin/env node
// Proof Generation as Child Process
// More stable than Worker Threads for heavy computation

const snarkjs = require('snarkjs');
const fs = require('fs');

// Read input from stdin
let inputData = '';

process.stdin.on('data', (chunk) => {
  inputData += chunk;
});

process.stdin.on('end', async () => {
  const startTime = Date.now();

  try {
    const input = JSON.parse(inputData);

    // Send progress
    console.error(JSON.stringify({ type: 'progress', percent: 10, stage: 'loading' }));

    // Load files
    const wasmBuffer = fs.readFileSync(input.wasmPath);
    const zkeyBuffer = fs.readFileSync(input.zkeyPath);

    console.error(JSON.stringify({ type: 'progress', percent: 30, stage: 'loaded' }));

    // Generate proof
    console.error(JSON.stringify({ type: 'progress', percent: 40, stage: 'proving' }));

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input.circuitInput,
      new Uint8Array(wasmBuffer),
      new Uint8Array(zkeyBuffer)
    );

    const duration = Date.now() - startTime;

    // Output result to stdout
    console.log(JSON.stringify({
      success: true,
      proof: { ...proof, protocol: 'groth16', curve: 'bn128' },
      publicSignals,
      duration,
    }));

    process.exit(0);
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      duration: Date.now() - startTime,
    }));
    process.exit(1);
  }
});
