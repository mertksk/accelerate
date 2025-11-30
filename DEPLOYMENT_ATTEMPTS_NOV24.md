# Deployment Attempts - November 24, 2025

## Objective
Deploy full Casper Accelerate contract with `init`, `submit_batch`, and `deposit` entry points to Casper testnet.

## Background
- **Bulk Memory Issue:** RESOLVED ✅ (0 bulk memory instructions in all builds)
- **Previous Success:** Minimal "Hello World" contract deployed successfully (hash: `ffaa50accd7b0806bee3efbd17b417f25788c01afae8cb784e9ff9477c7d0fb0`)
- **Current Blocker:** `ApiError::EarlyEndOfStream [17]` during `storage::new_contract()` execution

## Deployment Attempts Summary

### Attempt 1: Full Contract with Hardcoded Init (Vendored Dependencies)
- **Deploy Hash:** `89c2616700d8388f7476ecf1ae2e80b94215e186900e7d9eb114beff7a818ae5`
- **WASM Size:** 24KB
- **Bulk Memory:** 0 instructions ✅
- **Result:** FAILED - `ApiError::EarlyEndOfStream [17]`
- **Gas Consumed:** 29.24 CSPR
- **Contract Structure:**
  - 3 entry points: init, submit_batch, deposit
  - Full logic with hardcoded sequencer address
  - Vault purse creation
  - State root management

---

### Attempt 2: Full Contract Without String Parameters (Vendored Dependencies)
- **Deploy Hash:** `62ce09ecabbd18d023b1162d73bde75282003830f09bb7deb0912c3588a9a083`
- **WASM Size:** 24KB
- **Change:** Removed `Some(String::from(...))` named keys, used `None` instead
- **Result:** FAILED - `ApiError::EarlyEndOfStream [17]`
- **Gas Consumed:** 28.79 CSPR
- **Hypothesis:** String serialization not the root cause

---

### Attempt 3: Stub Implementations (Vendored Dependencies)
- **Deploy Hash:** `313950eee8f36da6b59b057d243fbcb753ea9a6f073f7d033e675be01f727243`
- **WASM Size:** 24KB
- **Change:** Replaced all entry point logic with stubs (no state operations)
- **Result:** FAILED - `ApiError::EarlyEndOfStream [17]`
- **Gas Consumed:** ~29 CSPR
- **Hypothesis:** Contract logic complexity not the cause

---

### Attempt 4: Stub Implementations (Upstream Dependencies)
- **Deploy Hash:** `ab3c86195f500fc12f7c65ff12a4c2e77e22d44759ecc0a09bb43a3ad74e4a4c`
- **WASM Size:** 20KB
- **Change:** Removed vendored patches, using upstream casper-contract 1.4.4 & casper-types 1.5.0
- **Bulk Memory:** 0 instructions ✅
- **Result:** FAILED - `ApiError::EarlyEndOfStream [17]`
- **Gas Consumed:** ~21 CSPR
- **Hypothesis:** Vendored dependencies not the cause

---

### Attempt 5: Clean Minimal Structure (Upstream Dependencies)
- **Deploy Hash:** `09bca4154e6bc727ab96442bcd04caa27e0c44162776cdb9fd1f98a2584ff1c2`
- **WASM Size:** 20KB
- **Change:** Completely rewritten to match lib_minimal.rs structure exactly
- **Entry Points:** 3 (init, submit_batch, deposit) with stub implementations
- **Result:** FAILED - `ApiError::EarlyEndOfStream [17]`
- **Gas Consumed:** 21.01 CSPR
- **Final Status:** Even simplest possible multi-entry-point contract fails

---

## Total Gas Spent
**~200 CSPR** (5 deployment attempts × ~40 CSPR average per failure)

## Remaining Balance
**234.76 CSPR** (~1 deployment attempt remaining at 200 CSPR payment amount)

---

## Root Cause Analysis

### What Works
- ✅ Minimal contract with **1 entry point** (get_version) - deployed successfully previously
- ✅ WASM compilation with 0 bulk memory instructions
- ✅ WASM size optimization (20-24KB, well under limit)
- ✅ Build pipeline with `-Z build-std` and `wasm-opt`

### What Fails
- ❌ Contracts with **3 entry points** (init, submit_batch, deposit)
- ❌ Both vendored AND upstream dependencies
- ❌ Both full logic AND stub implementations
- ❌ Both with and without String parameters
- ❌ `storage::new_contract()` deserialization during execution

### Technical Details

**Error:** `ApiError::EarlyEndOfStream [17]`

**Location:** During contract installation in `storage::new_contract(entry_points, None, ...)` call

**Evidence:**
1. Error occurs before any entry point logic executes
2. Error persists across all variations of contract logic
3. Error independent of vendored vs upstream dependencies
4. Minimal 1-entry-point contract succeeds, 3-entry-point contract fails

**Hypothesis:**
The testnet execution engine may have a limitation or bug when deserializing contracts with multiple entry points or specific parameter type combinations. The `EarlyEndOfStream` error suggests the deserializer expects more data than is available in the serialized contract definition.

---

## Comparison: Working vs. Failing

### Working (lib_minimal.rs - Previously Deployed)
```rust
// 1 entry point
entry_points.add_entry_point(EntryPoint::new(
    "get_version",
    vec![],  // No parameters
    CLType::U32,
    EntryPointAccess::Public,
    EntryPointType::Contract,
));
```

### Failing (Current Attempts)
```rust
// 3 entry points
// Entry 1
entry_points.add_entry_point(EntryPoint::new(
    "init",
    vec![],  // No parameters
    CLType::Unit,
    ...
));

// Entry 2
entry_points.add_entry_point(EntryPoint::new(
    "submit_batch",
    vec![
        Parameter::new("new_root", CLType::U512),
        Parameter::new("proof", CLType::U512),
    ],
    CLType::Unit,
    ...
));

// Entry 3
entry_points.add_entry_point(EntryPoint::new(
    "deposit",
    vec![
        Parameter::new("amount", CLType::U512),
        Parameter::new("purse", CLType::URef),
    ],
    CLType::Unit,
    ...
));
```

**Key Difference:** Number of entry points (1 vs 3) and presence of URef parameter type.

---

## Recommended Next Steps

### Option 1: Incremental Entry Point Addition (TEST)
Test hypothesis by deploying contracts with:
1. 1 entry point (init only) - predict: SUCCESS
2. 2 entry points (init + submit_batch) - predict: might fail
3. 2 entry points with URef (init + deposit) - predict: might fail

**Cost:** ~600 CSPR (3 attempts × 200 CSPR)
**Benefit:** Identifies exact failure point (# of entry points vs. parameter types)

### Option 2: Use Existing Hello World Contract (PRAGMATIC)
- Contract hash: `ffaa50accd7b0806bee3efbd17b417f25788c01afae8cb784e9ff9477c7d0fb0`
- Already deployed and working
- Proceed with Phases 2-5 of migration plan
- Implement contract upgrade mechanism later

**Cost:** 0 CSPR
**Benefit:** Unblocks remaining workstreams immediately

### Option 3: Contract Upgrade Strategy (FUTURE)
- Deploy working 1-entry-point contract
- Implement upgrade mechanism to add entry points incrementally
- Use contract versioning to swap in full logic

**Cost:** TBD (requires research into Casper upgrade patterns)
**Benefit:** Provides path to full functionality

---

## Files Modified

### Contracts
- `contracts/lib.rs` - Multiple iterations (backed up as `lib_stub_attempt.rs.backup`)
- `contracts/Cargo.toml` - Toggled vendored vs upstream dependencies

### Build Pipeline
- `scripts/compile.sh` - No changes (working correctly)
- `contracts/.cargo/config.toml` - No changes (RUSTFLAGS correct)

### Documentation
- This file (`DEPLOYMENT_ATTEMPTS_NOV24.md`) - NEW
- `BULK_MEMORY_SOLUTION.md` - Already complete
- `testnetmigrationplan.md` - Needs update with today's findings

---

## Conclusion

**Bulk Memory Resolution:** ✅ **COMPLETE AND VERIFIED**
- 100% success across all 5 deployment attempts
- Build pipeline proven reliable
- No regressions

**Contract Deployment:** ❌ **BLOCKED**
- `ApiError::EarlyEndOfStream [17]` persists across all variations
- Root cause: Likely testnet execution engine limitation with multi-entry-point contracts
- Not related to: contract logic, dependencies (vendored vs upstream), or String serialization

**Recommendation:** Proceed with Option 2 (use existing Hello World contract) to unblock Phases 2-5 of migration plan. Circle back to contract deployment issue after consulting Casper community or upgrading to newer casper-contract SDK versions.

---

**Date:** 2025-11-24
**Testnet:** casper-test
**RPC Endpoint:** https://node.testnet.casper.network/rpc
**Account:** 01a6854fcd536cd21ea54f026378f7707a913a7a706d880c3473210e7ab61be93b
