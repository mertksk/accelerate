#!/bin/bash
export PATH=$HOME/.cargo/bin:$PATH
cd contracts

echo "Cleaning..."
cargo +nightly clean

echo "Building with build-std..."
cargo +nightly build \
    --release \
    --target wasm32-unknown-unknown \
    -Z build-std=core,alloc,panic_abort \
    --config 'profile.release.panic="abort"'

echo "Verifying..."
if wasm2wat target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm | grep -qE "memory.copy|memory.fill"; then
  echo "Failed: Instructions still present"
  exit 1
else
  echo "Success: Instructions removed"
  ls -lh target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm
fi
