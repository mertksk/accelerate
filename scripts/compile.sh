#!/bin/bash
set -e

echo "Starting build pipeline for Casper Accelerate..."

# Compile ZK Circuits
echo "Compiling Circom circuits..."
if command -v circom >/dev/null 2>&1; then
  circom circuits/root.circom --r1cs --wasm --sym -o circuits/
  echo "Circuits compiled."
else
  echo "Circom not found. Skipping circuit compilation."
fi

# Compile Rust Contracts
echo "Compiling Casper contracts..."
if command -v cargo >/dev/null 2>&1; then
  pushd contracts >/dev/null
  cargo build --release --target wasm32-unknown-unknown
  popd >/dev/null
  echo "Contracts compiled."
else
  echo "Cargo not found. Skipping contract compilation."
fi

echo "Build complete."
