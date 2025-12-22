#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

extern crate alloc;

#[cfg(not(test))]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[cfg(not(test))]
#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    // Loop forever on panic, which traps the Wasm execution
    loop {}
}

use casper_contract::contract_api::{account, runtime, system};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{runtime_args, U512};
use casper_types::contracts::ContractHash;
use alloc::string::String;

const ARG_AMOUNT: &str = "amount";
const ARG_CONTRACT_HASH: &str = "contract_hash";
const ARG_L2_ADDRESS: &str = "l2_address";
const ENTRY_POINT_DEPOSIT: &str = "deposit";

#[no_mangle]
pub extern "C" fn call() {
    // 1. Get arguments - contract_hash as byte array, then convert to ContractHash
    let contract_hash_bytes: [u8; 32] = runtime::get_named_arg(ARG_CONTRACT_HASH);
    let contract_hash = ContractHash::new(contract_hash_bytes);
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    let l2_address: String = runtime::get_named_arg(ARG_L2_ADDRESS);

    // 2. Create a temporary purse to hold the deposit amount
    let temp_purse = system::create_purse();

    // 3. Transfer the amount from the caller's main purse to the temp purse
    let main_purse = account::get_main_purse();
    system::transfer_from_purse_to_purse(main_purse, temp_purse, amount, None).unwrap_or_revert();

    // 4. Call the contract's deposit entry point
    runtime::call_contract::<()>(
        contract_hash,
        ENTRY_POINT_DEPOSIT,
        runtime_args! {
            "amount" => amount,
            "purse" => temp_purse,
            "l2_address" => l2_address
        },
    );
}