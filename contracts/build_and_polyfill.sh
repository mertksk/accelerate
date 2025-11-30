#!/bin/bash
export PATH=$HOME/.cargo/bin:$PATH
# Paths relative to root
TARGET_DIR=contracts/target/wasm32-unknown-unknown/release
WASM_FILE=$TARGET_DIR/casper_accelerate_contract.wasm
WAT_FILE=$TARGET_DIR/casper_accelerate_contract.wat
PATCHED_WAT=$TARGET_DIR/casper_accelerate_contract_patched.wat
FINAL_WASM=$TARGET_DIR/casper_accelerate_contract_final.wasm

echo "Building contract (with bulk memory is fine)..."
cd contracts
cargo +nightly build --release --target wasm32-unknown-unknown -Z build-std=core,alloc,panic_abort --config 'profile.release.panic="abort"'
cd ..

echo "Converting to WAT..."
wasm2wat $WASM_FILE -o $WAT_FILE

echo "Applying Polyfill..."
python3 contracts/polyfill_wat.py $WAT_FILE $PATCHED_WAT

echo "Converting back to WASM..."
wat2wasm $PATCHED_WAT -o $FINAL_WASM

echo "Verifying..."
if wasm2wat $FINAL_WASM | grep -qE "memory.copy|memory.fill"; then
    echo "Failed: Bulk memory still present!"
    exit 1
else
    echo "Success: Clean binary produced."
    mv $FINAL_WASM $WASM_FILE
    ls -lh $WASM_FILE
fi
