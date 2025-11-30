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
    CLType,
    addressable_entity::{
        EntryPointAccess, EntryPointType, EntryPoints, EntityEntryPoint, EntryPointPayment,
    },
};

// Contract constants
const CONTRACT_HASH_NAME: &str = "casper_accelerate_contract_hash";
const CONTRACT_PACKAGE_HASH_NAME: &str = "casper_accelerate_contract_package_hash";
const ENTRY_POINT_GET_VERSION: &str = "get_version";

/// Simple entry point that returns a version number
#[no_mangle]
pub extern "C" fn get_version() {
    // Just return success - this is a minimal test
    runtime::ret(casper_types::CLValue::from_t(1u32).unwrap_or_revert());
}

/// Contract installation entry point
#[no_mangle]
pub extern "C" fn call() {
    // Create a minimal entry point
    let mut entry_points = EntryPoints::new();

    entry_points.add_entry_point(EntityEntryPoint::new(
        ENTRY_POINT_GET_VERSION,
        vec![],
        CLType::U32,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    // Create contract with no named keys (simplest possible)
    let (contract_hash, _version) = storage::new_contract(
        entry_points,
        None,
        Some(String::from(CONTRACT_HASH_NAME)),
        Some(String::from(CONTRACT_PACKAGE_HASH_NAME)),
        None, // message_topics - new in SDK v5
    );

    runtime::put_key(CONTRACT_HASH_NAME, contract_hash.into());
}
