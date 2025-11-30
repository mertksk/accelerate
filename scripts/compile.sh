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
  # Use nightly for better no_std support and optimizations
  # Use -Z build-std to recompile core and alloc from source with MVP WASM (no bulk memory)
  # Set RUSTFLAGS explicitly to ensure they apply to build-std compilation
  RUSTFLAGS="-C target-feature=-bulk-memory,-sign-ext,-mutable-globals" \
    $HOME/.cargo/bin/cargo +nightly build -Z build-std=core,alloc --release --target wasm32-unknown-unknown
  
  # Optimize and lower bulk memory operations to MVP WASM for Casper compatibility
  if command -v wasm-opt >/dev/null 2>&1; then
    echo "Optimizing and lowering bulk memory operations..."
    wasm-opt -Oz \
      --enable-bulk-memory \
      --llvm-memory-copy-fill-lowering \
      --signext-lowering \
      target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm \
      -o target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm
  else
    echo "wasm-opt not found. Skipping optimization (REQUIRED for Casper deployment)."
    exit 1
  fi
  
  popd >/dev/null
  echo "Contracts compiled."
else
  echo "Cargo not found. Skipping contract compilation."
fi

echo "Build complete."
