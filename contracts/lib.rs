#![no_std]

extern crate alloc;

use alloc::{format, string::String};

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    runtime_args, ApiError, CLType, EntryPoint, EntryPointAccess, EntryPointType, EntryPoints, Key,
    Parameter, U512,
};

const KEY_STATE_ROOT: &str = "state_root";
const KEY_SEQUENCER: &str = "sequencer";
const CONTRACT_HASH_NAME: &str = "casper_accelerate_contract_hash";
const CONTRACT_PACKAGE_HASH_NAME: &str = "casper_accelerate_contract_package_hash";

const ENTRY_POINT_INIT: &str = "init";
const ENTRY_POINT_SUBMIT_BATCH: &str = "submit_batch";
const ENTRY_POINT_DEPOSIT: &str = "deposit";

const ARG_INITIAL_ROOT: &str = "initial_root";
const ARG_SEQUENCER: &str = "sequencer";
const ARG_NEW_ROOT: &str = "new_root";
const ARG_PROOF: &str = "proof";
const ARG_AMOUNT: &str = "amount";

fn sequencer_key() -> Key {
    let sequencer_uref = runtime::get_key(KEY_SEQUENCER)
        .unwrap_or_revert()
        .into_uref()
        .unwrap_or_revert();

    storage::read(sequencer_uref)
        .unwrap_or_revert()
        .unwrap_or_revert()
}

#[no_mangle]
pub extern "C" fn init() {
    if runtime::get_key(KEY_STATE_ROOT).is_some() {
        runtime::revert(ApiError::User(3));
    }

    let initial_root: String = runtime::get_named_arg(ARG_INITIAL_ROOT);
    let sequencer: Key = runtime::get_named_arg(ARG_SEQUENCER);

    let root_uref = storage::new_uref(initial_root);
    let seq_uref = storage::new_uref(sequencer);

    runtime::put_key(KEY_STATE_ROOT, root_uref.into());
    runtime::put_key(KEY_SEQUENCER, seq_uref.into());
}

// Called by the Sequencer to submit a ZK Proof and update the state.
#[no_mangle]
pub extern "C" fn submit_batch() {
    let new_root: String = runtime::get_named_arg(ARG_NEW_ROOT);
    let proof: String = runtime::get_named_arg(ARG_PROOF);

    // 1. Verify Sequencer Authorization
    let authorized_sequencer = sequencer_key();
    if authorized_sequencer != Key::from(runtime::get_caller()) {
        runtime::revert(ApiError::User(1)); // Unauthorized
    }

    // 2. Verify ZK Proof (Groth16)
    // In a full implementation, we would parse the 'proof' bytes and run pairing checks here.
    if proof.is_empty() {
        runtime::revert(ApiError::User(2)); // Invalid Proof
    }

    // 3. Update State Root
    let root_uref = runtime::get_key(KEY_STATE_ROOT)
        .unwrap_or_revert()
        .into_uref()
        .unwrap_or_revert();

    storage::write(root_uref, new_root);
}

// Simplified deposit: records the intent but does not move funds in this MVP.
#[no_mangle]
pub extern "C" fn deposit() {
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);
    let caller = runtime::get_caller();

    // Emit a textual log for observability.
    let message = format!("deposit:{}:{}", caller, amount);
    runtime::print(message);
}

#[no_mangle]
pub extern "C" fn call() {
    let initial_root: String = runtime::get_named_arg(ARG_INITIAL_ROOT);
    let sequencer: Key = runtime::get_named_arg(ARG_SEQUENCER);

    let mut entry_points = EntryPoints::new();
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_INIT,
        vec![
            Parameter::new(ARG_INITIAL_ROOT, CLType::String),
            Parameter::new(ARG_SEQUENCER, CLType::Key),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_SUBMIT_BATCH,
        vec![
            Parameter::new(ARG_NEW_ROOT, CLType::String),
            Parameter::new(ARG_PROOF, CLType::String),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_DEPOSIT,
        vec![Parameter::new(ARG_AMOUNT, CLType::U512)],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    let (contract_hash, _version) = storage::new_contract(
        entry_points,
        None,
        Some(String::from(CONTRACT_HASH_NAME)),
        Some(String::from(CONTRACT_PACKAGE_HASH_NAME)),
    );

    runtime::put_key(CONTRACT_HASH_NAME, contract_hash.into());

    // Initialize contract storage with the provided root and sequencer.
    runtime::call_contract::<()>(
        contract_hash,
        ENTRY_POINT_INIT,
        runtime_args! {
            ARG_INITIAL_ROOT => initial_root,
            ARG_SEQUENCER => sequencer,
        },
    );
}
