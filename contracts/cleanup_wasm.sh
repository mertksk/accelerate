#!/bin/bash
# cleanup_wasm.sh
# Lowers bulk memory operations to support Casper 1.x execution engine

export PATH=$HOME/.cargo/bin:$PATH
# Paths relative to project root
TARGET_DIR=contracts/target/wasm32-unknown-unknown/release

echo "Processing WASM..."

# Force lower bulk memory
if command -v wasm-opt >/dev/null 2>&1; then
    # Try -Oz again
    wasm-opt $TARGET_DIR/casper_accelerate_contract.wasm \
        --enable-bulk-memory \
        --disable-bulk-memory \
        --no-validation \
        -Oz \
        -o $TARGET_DIR/casper_accelerate_contract_final.wasm
else
    echo "Error: wasm-opt not found"
    exit 1
fi

# Verify
if wasm2wat $TARGET_DIR/casper_accelerate_contract_final.wasm | grep -qE "memory.copy|memory.fill"; then
  echo "Failed: Binary still has bulk memory operations!"
  exit 1
else
  echo "Success: Binary is clean (no bulk memory ops)."
  mv $TARGET_DIR/casper_accelerate_contract_final.wasm $TARGET_DIR/casper_accelerate_contract.wasm
  ls -lh $TARGET_DIR/casper_accelerate_contract.wasm
fi

