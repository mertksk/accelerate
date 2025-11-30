#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

use casper_contract::contract_api::runtime;
use casper_types::{runtime_args, Key, RuntimeArgs, URef, U512};

const ENTRY_POINT_DEPOSIT: &str = "deposit";
const ARG_AMOUNT: &str = "amount";
const ARG_PURSE: &str = "purse";

#[no_mangle]
pub extern "C" fn call() {
    let contract_hash: Key = runtime::get_named_arg("contract_hash");
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    let purse: URef = runtime::get_named_arg(ARG_PURSE);

    // Call the deposit entry point to record the deposit on L2
    runtime::call_contract::<()>(
        contract_hash.into_hash().unwrap().into(),
        ENTRY_POINT_DEPOSIT,
        runtime_args! {
            ARG_AMOUNT => amount,
            ARG_PURSE => purse,
        },
    );
}
