#![no_std]
#![no_main]
#![feature(core_intrinsics)]

extern crate alloc;

#[cfg(not(test))]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(not(test))]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    core::intrinsics::abort()
}

use casper_contract::contract_api::{runtime, storage};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use alloc::vec;
use alloc::string::String;
use casper_types::{
    CLType, U512, Parameter,
    addressable_entity::{
        EntryPointAccess, EntryPointType, EntryPoints, EntityEntryPoint, EntryPointPayment,
    },
};

// Contract constants
const CONTRACT_HASH_NAME: &str = "casper_accelerate_hash";
const CONTRACT_PACKAGE_NAME: &str = "casper_accelerate_package";

// Entry point names
const EP_INIT: &str = "init";
const EP_SUBMIT_BATCH: &str = "submit_batch";

// Argument names
const ARG_ROOT: &str = "root";
const ARG_PROOF: &str = "proof";

// Storage keys
const KEY_STATE_ROOT: &str = "state_root";
const KEY_BATCH_COUNT: &str = "batch_count";

/// Initialize contract - stores initial state root
#[no_mangle]
pub extern "C" fn init() {
    // Initialize state root to 0
    let root_uref = storage::new_uref(U512::zero());
    runtime::put_key(KEY_STATE_ROOT, root_uref.into());

    // Initialize batch counter
    let count_uref = storage::new_uref(0u64);
    runtime::put_key(KEY_BATCH_COUNT, count_uref.into());
}

/// Submit a batch - updates state root after ZK proof verification
#[no_mangle]
pub extern "C" fn submit_batch() {
    // Get arguments
    let new_root: U512 = runtime::get_named_arg(ARG_ROOT);
    let _proof: U512 = runtime::get_named_arg(ARG_PROOF);

    // TODO: Verify ZK proof on-chain (future enhancement)
    // For now, we trust the sequencer's proof

    // Update state root
    let root_key = runtime::get_key(KEY_STATE_ROOT).unwrap_or_revert();
    let root_uref = root_key.into_uref().unwrap_or_revert();
    storage::write(root_uref, new_root);

    // Increment batch counter
    let count_key = runtime::get_key(KEY_BATCH_COUNT).unwrap_or_revert();
    let count_uref = count_key.into_uref().unwrap_or_revert();
    let current: u64 = storage::read(count_uref).unwrap_or_revert().unwrap_or_revert();
    storage::write(count_uref, current + 1);
}

/// Contract installation
#[no_mangle]
pub extern "C" fn call() {
    let mut entry_points = EntryPoints::new();

    // init() - no parameters
    entry_points.add_entry_point(EntityEntryPoint::new(
        EP_INIT,
        vec![],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    // submit_batch(root: U512, proof: U512)
    entry_points.add_entry_point(EntityEntryPoint::new(
        EP_SUBMIT_BATCH,
        vec![
            Parameter::new(ARG_ROOT, CLType::U512),
            Parameter::new(ARG_PROOF, CLType::U512),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    let (contract_hash, _) = storage::new_contract(
        entry_points,
        None,
        Some(String::from(CONTRACT_HASH_NAME)),
        Some(String::from(CONTRACT_PACKAGE_NAME)),
        None,
    );

    runtime::put_key(CONTRACT_HASH_NAME, contract_hash.into());
}
