#!/bin/bash
export PATH=$HOME/.cargo/bin:$PATH
TARGET_DIR=target/wasm32-unknown-unknown/release
WASM_FILE=$TARGET_DIR/casper_accelerate_contract.wasm
WAT_FILE=$TARGET_DIR/casper_accelerate_contract.wat
FINAL_WASM=$TARGET_DIR/casper_accelerate_contract_patched.wasm

echo "Converting WASM to WAT..."
wasm2wat $WASM_FILE -o $WAT_FILE

echo "Patching WAT to remove bulk memory..."
# Remove (memory.copy ...) and (memory.fill ...) instructions
# This is a naive replacement that might break logic but is worth a try if they are just optimizations.
# Better: Replace with a call to a polyfill or just a loop?
# For now, we will try to remove the data count section which triggers bulk memory validation?
# No, we must remove the instructions.

# Actually, since we know wasm-opt failed, let's try to use sed to replace memory.copy with a sequence that crashes or does nothing?
# No, that's dangerous.

# Let's try to use `wasm-opt` with a very specific pass sequence.
# The pass `lower-bulk-memory` is what we want. It might not be enabled by default.
# Let's try running wasm-opt with explicit passes.

echo "Retrying wasm-opt with explicit lowering pass..."
wasm-opt $WASM_FILE \
    --enable-bulk-memory \
    --disable-bulk-memory \
    --no-validation \
    -O1 \
    --print \
    -o $FINAL_WASM > /dev/null

# Check again
if wasm2wat $FINAL_WASM | grep -qE "memory.copy|memory.fill"; then
    echo "Failed again. Attempting nuclear option: text replacement."
    # This is risky but effective for removing the feature declaration
    # Using sed to remove the "bulk-memory" feature request from the WAT might not be enough if instructions exist.
    
    # Let's try to compile a dummy contract that definitely has no bulk memory and see if toolchain is poisoning it.
    echo "Toolchain is likely poisoning the build with intrinsics."
    exit 1
else
    echo "Success! Patched binary ready."
    mv $FINAL_WASM $WASM_FILE
fi
