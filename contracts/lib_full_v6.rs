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

use casper_contract::contract_api::{runtime, storage, system};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use alloc::vec;
use alloc::string::String;
use casper_types::{
    CLType, U512, Parameter, URef,
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
const EP_DEPOSIT: &str = "deposit";
const EP_WITHDRAW: &str = "withdraw";
const EP_GET_STATE: &str = "get_state";

// Argument names
const ARG_ROOT: &str = "root";
const ARG_PROOF: &str = "proof";
const ARG_AMOUNT: &str = "amount";
const ARG_PURSE: &str = "purse";
const ARG_L2_ADDRESS: &str = "l2_address";
const ARG_RECIPIENT: &str = "recipient";

// Storage keys
const KEY_STATE_ROOT: &str = "state_root";
const KEY_BATCH_COUNT: &str = "batch_count";
const KEY_TOTAL_DEPOSITS: &str = "total_deposits";
const KEY_TOTAL_WITHDRAWALS: &str = "total_withdrawals";
const KEY_CONTRACT_PURSE: &str = "contract_purse";

/// Initialize contract - stores initial state root and creates contract purse
#[no_mangle]
pub extern "C" fn init() {
    // Initialize state root to 0
    let root_uref = storage::new_uref(U512::zero());
    runtime::put_key(KEY_STATE_ROOT, root_uref.into());

    // Initialize batch counter
    let count_uref = storage::new_uref(0u64);
    runtime::put_key(KEY_BATCH_COUNT, count_uref.into());

    // Initialize deposit counter
    let deposits_uref = storage::new_uref(U512::zero());
    runtime::put_key(KEY_TOTAL_DEPOSITS, deposits_uref.into());

    // Initialize withdrawal counter
    let withdrawals_uref = storage::new_uref(U512::zero());
    runtime::put_key(KEY_TOTAL_WITHDRAWALS, withdrawals_uref.into());

    // Create contract purse for holding deposited funds
    let contract_purse = system::create_purse();
    runtime::put_key(KEY_CONTRACT_PURSE, contract_purse.into());
}

/// Deposit CSPR into the L2 rollup
/// Records the deposit for the sequencer to credit on L2
/// Arguments: amount (U512), purse (URef), l2_address (String)
#[no_mangle]
pub extern "C" fn deposit() {
    // Get deposit amount
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);

    // Get source purse (passed by caller - this is the caller's main purse)
    let source_purse: URef = runtime::get_named_arg(ARG_PURSE);

    // Get L2 address to credit
    let _l2_address: String = runtime::get_named_arg(ARG_L2_ADDRESS);

    // Get contract purse
    let purse_key = runtime::get_key(KEY_CONTRACT_PURSE).unwrap_or_revert();
    let contract_purse: URef = purse_key.into_uref().unwrap_or_revert();

    // Transfer from caller's purse to contract purse
    system::transfer_from_purse_to_purse(source_purse, contract_purse, amount, None)
        .unwrap_or_revert();

    // Update total deposits
    let deposits_key = runtime::get_key(KEY_TOTAL_DEPOSITS).unwrap_or_revert();
    let deposits_uref = deposits_key.into_uref().unwrap_or_revert();
    let current_deposits: U512 = storage::read(deposits_uref)
        .unwrap_or_revert()
        .unwrap_or_revert();
    storage::write(deposits_uref, current_deposits + amount);

    // Note: In production, emit an event for the sequencer to pick up
    // The sequencer will credit the L2 address with the deposited amount
}

/// Withdraw CSPR from L2 back to L1
/// Requires a valid Merkle proof of the withdrawal
#[no_mangle]
pub extern "C" fn withdraw() {
    // Get withdrawal amount
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);

    // Get proof (Merkle inclusion proof for withdrawal)
    let _proof: U512 = runtime::get_named_arg(ARG_PROOF);

    // Get recipient purse
    let recipient: URef = runtime::get_named_arg(ARG_RECIPIENT);

    // TODO: Verify Merkle proof that this withdrawal is valid
    // For now, we trust the caller (in production, verify against state root)

    // Get contract purse
    let purse_key = runtime::get_key(KEY_CONTRACT_PURSE).unwrap_or_revert();
    let contract_purse: URef = purse_key.into_uref().unwrap_or_revert();

    // Transfer from contract to recipient
    system::transfer_from_purse_to_purse(contract_purse, recipient, amount, None)
        .unwrap_or_revert();

    // Update total withdrawals
    let withdrawals_key = runtime::get_key(KEY_TOTAL_WITHDRAWALS).unwrap_or_revert();
    let withdrawals_uref = withdrawals_key.into_uref().unwrap_or_revert();
    let current_withdrawals: U512 = storage::read(withdrawals_uref)
        .unwrap_or_revert()
        .unwrap_or_revert();
    storage::write(withdrawals_uref, current_withdrawals + amount);
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

/// Get current contract state (view function)
#[no_mangle]
pub extern "C" fn get_state() {
    // This is a read-only entry point
    // State can be queried via global state queries
    // Returns nothing but allows checking contract is callable
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

    // deposit(amount: U512, purse: URef, l2_address: String)
    entry_points.add_entry_point(EntityEntryPoint::new(
        EP_DEPOSIT,
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

    // withdraw(amount: U512, proof: U512, recipient: URef)
    entry_points.add_entry_point(EntityEntryPoint::new(
        EP_WITHDRAW,
        vec![
            Parameter::new(ARG_AMOUNT, CLType::U512),
            Parameter::new(ARG_PROOF, CLType::U512),
            Parameter::new(ARG_RECIPIENT, CLType::URef),
        ],
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

    // get_state() - read-only
    entry_points.add_entry_point(EntityEntryPoint::new(
        EP_GET_STATE,
        vec![],
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
