# Engineering Debug Report: Casper Testnet Migration

## Objective
Deploy the "Casper Accelerate" L1 Rollup Contract (`casper_accelerate_contract.wasm`) to the Casper Testnet.

## Constraints & Requirements
1.  **No Floating Point:** Casper 1.x execution engine strictly forbids `f32` and `f64` instructions and "floating point value" strings in the data segment.
2.  **No Bulk Memory:** The execution engine does not support WebAssembly bulk memory operations (`memory.copy`, `memory.fill`).
3.  **WASM Size:** Must be small enough to deploy (under 1MB ideally, definitely under 4MB).

## Execution History

### Phase 1: Floating Point Elimination
*   **Issue:** Initial builds contained `f32`/`f64` ops and "floating point value" panic strings.
*   **Root Cause:** Dependencies `serde` and `casper-types` (via `num-traits` and `num-rational`) included float serialization logic by default.
*   **Action:**
    *   Vendored `serde` and `serde_core`, patching source to remove float serialization.
    *   Vendored `casper-types`, removing `ToPrimitive`/`FromPrimitive` derives.
*   **Result:** Float usage removed from user code.

### Phase 2: Bulk Memory Elimination
*   **Issue:** Deployment failed with `Wasm preprocessing error: Deserialization error: Bulk memory operations are not supported`.
*   **Root Cause:** The Rust compiler (especially `nightly`) compiles the standard library `core` (e.g., `memcpy`) using `memory.copy` instructions when targeting `wasm32`. Standard `RUSTFLAGS` were ignored for the pre-compiled `core` library.
*   **Failed Attempt (wasm-opt):** Tried using `wasm-opt` to lower these instructions.
    *   *Failure:* `wasm-opt` refused to process the file because the input contained bulk memory ops while the validator settings (MVP) forbade them.
*   **Successful Strategy (build-std):** Use `cargo build -Z build-std=core,alloc` to recompile the standard library from source with strict settings (`target-feature=-bulk-memory`).

### Phase 3: Compilation Fixes (Current Status)
*   **Issue:** Switching to `build-std` required disabling `casper-contract/no-std-helpers` to prevent conflict with the new allocator.
*   **Side Effect:** Disabling helpers broke implicit imports. The compiler now fails with:
    *   `error: cannot find macro vec`
    *   `error: failed to resolve ... String`
    *   `error: no method named unwrap_or_revert`
    *   `error: failed to resolve ... system`
*   **Solution:** Manually import these missing types and traits in `contracts/lib.rs`.

## Next Steps
1.  **Patch `contracts/lib.rs`**: Add `use alloc::vec`, `use alloc::string::String`, `use casper_contract::contract_api::system`, and `use casper_contract::unwrap_or_revert::UnwrapOrRevert`.
2.  **Rebuild:** Run the `build-std` pipeline.
3.  **Verify:** Confirm `memory.copy` is absent from the final WASM.
4.  **Deploy:** Execute the deployment script.
