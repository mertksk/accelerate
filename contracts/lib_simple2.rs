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
use alloc::vec;
use alloc::string::String;
use casper_types::{
    CLType, EntryPoint, EntryPointAccess, EntryPointType, EntryPoints,
};

const CONTRACT_HASH_NAME: &str = "accelerate_hash";
const CONTRACT_PACKAGE_NAME: &str = "accelerate_pkg";

/// Entry point 1: Just returns
#[no_mangle]
pub extern "C" fn entry_one() {
    // Do nothing - simplest possible entry point
}

/// Entry point 2: Just returns
#[no_mangle]
pub extern "C" fn entry_two() {
    // Do nothing - simplest possible entry point
}

/// Contract installation
#[no_mangle]
pub extern "C" fn call() {
    let mut entry_points = EntryPoints::new();

    entry_points.add_entry_point(EntryPoint::new(
        "entry_one",
        vec![],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        "entry_two",
        vec![],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    let (contract_hash, _) = storage::new_contract(
        entry_points,
        None,
        Some(String::from(CONTRACT_HASH_NAME)),
        Some(String::from(CONTRACT_PACKAGE_NAME)),
    );

    runtime::put_key(CONTRACT_HASH_NAME, contract_hash.into());
}
