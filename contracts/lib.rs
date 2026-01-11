#![no_std]
#![no_main]

extern crate alloc;

use casper_contract::contract_api::{runtime, storage};
use alloc::vec;
use alloc::string::String;
use casper_types::{
    addressable_entity::{EntityEntryPoint as EntryPoint, EntryPoints},
    CLType, EntryPointAccess, EntryPointPayment, EntryPointType,
    Parameter, URef, U512,
};

// Contract constants
const CONTRACT_HASH_NAME: &str = "casper_accelerate_contract_hash";
const CONTRACT_PACKAGE_HASH_NAME: &str = "casper_accelerate_contract_package_hash";
const ENTRY_POINT_INIT: &str = "init";
const ENTRY_POINT_SUBMIT_BATCH: &str = "submit_batch";
const ENTRY_POINT_DEPOSIT: &str = "deposit";
const ARG_NEW_ROOT: &str = "new_root";
const ARG_PROOF: &str = "proof";
const ARG_AMOUNT: &str = "amount";
const ARG_PURSE: &str = "purse";
const ARG_L2_ADDRESS: &str = "l2_address";

/// Initialize contract state
#[no_mangle]
pub extern "C" fn init() {
    let marker = storage::new_uref(U512::from(1));
    runtime::put_key("initialized", marker.into());
}

/// Submit a batch with ZK proof
#[no_mangle]
pub extern "C" fn submit_batch() {
    let _new_root: U512 = runtime::get_named_arg(ARG_NEW_ROOT);
    let _proof: U512 = runtime::get_named_arg(ARG_PROOF);
    // Stub: will be implemented after deployment
}

/// Deposit CSPR into L2
#[no_mangle]
pub extern "C" fn deposit() {
    let _amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    let _purse: URef = runtime::get_named_arg(ARG_PURSE);
    let _l2_address: String = runtime::get_named_arg(ARG_L2_ADDRESS);
    // Stub: will be implemented after deployment
}

/// Contract installation entry point
#[no_mangle]
pub extern "C" fn call() {
    let mut entry_points = EntryPoints::new();

    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_INIT,
        vec![],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_SUBMIT_BATCH,
        vec![
            Parameter::new(ARG_NEW_ROOT, CLType::U512),
            Parameter::new(ARG_PROOF, CLType::U512),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_DEPOSIT,
        vec![
            Parameter::new(ARG_AMOUNT, CLType::U512),
            Parameter::new(ARG_PURSE, CLType::URef),
            Parameter::new(ARG_L2_ADDRESS, CLType::String),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Called,
        EntryPointPayment::Caller,
    ));

    let (contract_hash, _version) = storage::new_contract(
        entry_points,
        None,
        Some(String::from(CONTRACT_HASH_NAME)),
        Some(String::from(CONTRACT_PACKAGE_HASH_NAME)),
        None,
    );

    runtime::put_key(CONTRACT_HASH_NAME, contract_hash.into());
}
