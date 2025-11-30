# Casper Bulk Memory Solution - Technical Documentation

## Problem Statement

**Original Error:**
```
Wasm preprocessing error: Deserialization error: Bulk memory operations are not supported
```

**Root Cause:**
The Casper testnet execution engine (based on wasmi) does not support WebAssembly bulk memory operations (`memory.copy` and `memory.fill` instructions). Modern Rust compilers emit these instructions by default when compiling to `wasm32-unknown-unknown`, resulting in 51+ bulk memory instructions in the compiled WASM.

## Solution

### Complete Build Pipeline

The solution requires a multi-stage approach combining Rust compiler flags and post-processing:

#### 1. Rust Compilation with build-std
**File:** `scripts/compile.sh`

```bash
RUSTFLAGS="-C target-feature=-bulk-memory,-sign-ext,-mutable-globals" \
  cargo +nightly build -Z build-std=core,alloc --release --target wasm32-unknown-unknown
```

**Why:** Recompiles the Rust standard library (`core` and `alloc`) from source with MVP WebAssembly features only.

#### 2. Cargo Configuration
**File:** `contracts/.cargo/config.toml`

```toml
[target.wasm32-unknown-unknown]
rustflags = ["-C", "target-feature=-bulk-memory,-sign-ext,-mutable-globals"]
```

**Why:** Ensures RUSTFLAGS are consistently applied during compilation.

#### 3. Post-Processing with wasm-opt
**File:** `scripts/compile.sh`

```bash
wasm-opt -Oz \
  --enable-bulk-memory \
  --llvm-memory-copy-fill-lowering \
  --signext-lowering \
  target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm \
  -o target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm
```

**Why:**
- `--enable-bulk-memory`: Allows wasm-opt to process WASM containing bulk memory ops
- `--llvm-memory-copy-fill-lowering`: Lowers `memory.copy` and `memory.fill` to MVP-compatible loop-based implementations
- `--signext-lowering`: Lowers sign extension operations to MVP instructions
- `-Oz`: Optimizes for size

## Results

### Before
- **Bulk Memory Instructions:** 51 (`memory.copy` and `memory.fill`)
- **Deployment Status:** Failed with preprocessing error
- **WASM Size:** ~27KB

### After
- **Bulk Memory Instructions:** 0 ✅
- **Deployment Status:** WASM accepted by execution engine ✅
- **WASM Size:** 15KB (minimal contract) / 27KB (full contract)
- **Preprocessing Errors:** None ✅

### Verification Command
```bash
wasm-objdump -d target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm | grep -E "memory\\.(copy|fill)" | wc -l
# Output: 0
```

## Files Modified

### 1. scripts/compile.sh
**Changes:**
- Added `-Z build-std=core,alloc` to cargo build command
- Added RUSTFLAGS environment variable
- Updated wasm-opt command with lowering flags

### 2. contracts/.cargo/config.toml
**Changes:**
- Added `[target.wasm32-unknown-unknown]` section
- Configured rustflags for MVP WASM features

### 3. contracts/Cargo.toml
**Changes:**
- Already configured with vendored dependencies
- Release profile optimizations maintained

### 4. contracts/lib.rs
**Backup:** `contracts/lib_full.rs.backup`
**Minimal Version:** `contracts/lib_minimal.rs`

## Lessons Learned

### What Didn't Work

1. **RUSTFLAGS alone**: Standard library was already precompiled
2. **wasm-opt without --enable-bulk-memory**: Validator rejected input before lowering
3. **Older Rust toolchains**: Not compatible with ARM Mac (M-series chips)
4. **Different allocators**: `dlmalloc` vs `wee_alloc` - no impact on bulk memory

### What Worked

The combination of:
- `-Z build-std` to recompile stdlib
- RUSTFLAGS to disable bulk memory at compile time
- `wasm-opt --llvm-memory-copy-fill-lowering` to lower any remaining instructions

## Research Sources

- **Casper GitHub Issue #4367:** "Support Wasm sign extension and bulk memory extension"
  - Confirmed Casper testnet does NOT support bulk memory operations
  - Recommended `wasm-opt --signext-lowering` for sign extension issues
- **wasm-opt Documentation:** https://manpages.debian.org/experimental/binaryen/wasm-opt.1.en.html
  - Found `--llvm-memory-copy-fill-lowering` flag specifically for this use case
- **Casper Ecosystem Examples:** counter contract, contract-upgrade-example

## Deployment Attempts Log

All deployments to `casper-test` network:

| Hash | Result | Error | Notes |
|------|--------|-------|-------|
| `7ebd8...` | ❌ Failed | Bulk memory preprocessing | Original issue |
| `ff0cf...` | ⚠️ Partial | EarlyEndOfStream[17] | **First to pass WASM validation!** ✅ |
| `46b01...` | ❌ Failed | EarlyEndOfStream[17] | Parameter type mismatch |
| `c45e3...` | ❌ Failed | EarlyEndOfStream[17] | Minimal contract test |

**Key Achievement:** Starting from deploy `ff0cf1...`, NO MORE bulk memory preprocessing errors occurred.

## Current Status

### ✅ RESOLVED: Bulk Memory Issue
- 100% of bulk memory instructions eliminated
- WASM preprocessing successful
- Contract accepted by execution engine

### ⚠️ IN PROGRESS: Contract Logic
- `ApiError::EarlyEndOfStream[17]` during contract installation
- Likely related to vendored dependency compatibility
- Minimal contract also affected (rules out complexity as cause)

## Next Steps for Full Deployment

1. **Investigate vendored dependencies:**
   - Check if `casper-types` 1.5.0 and `casper-contract` 1.4.4 are compatible with current testnet
   - Consider updating to latest stable versions

2. **Alternative approach:**
   - Remove vendored patches (originally added for float elimination)
   - Test with upstream casper-contract and casper-types

3. **Simplification:**
   - Test with absolutely minimal contract (no entry points, just install)
   - Incrementally add features to identify what triggers deserialization error

## Maintenance

### To Update Dependencies

If updating `casper-contract` or `casper-types`:

1. Update version in `contracts/Cargo.toml`
2. Rebuild: `bash scripts/compile.sh`
3. Verify: `wasm-objdump -d ... | grep -E "memory\\.(copy|fill)"`
4. Test deploy to testnet

### To Modify Contract

After any changes to `contracts/lib.rs`:

1. Rebuild: `bash scripts/compile.sh`
2. Verify bulk memory: Should always be 0
3. Check WASM size: Should be < 1MB
4. Deploy to testnet for validation

## References

- Casper Node: https://github.com/casper-network/casper-node/issues/4367
- Binaryen wasm-opt: https://github.com/WebAssembly/binaryen
- Rust WebAssembly Guide: https://rustwasm.github.io/docs/book/
- Casper Contract Docs: https://docs.casper.network/developers/writing-onchain-code/

---

**Author:** Claude Code
**Date:** 2025-11-23
**Status:** Bulk memory issue RESOLVED ✅
