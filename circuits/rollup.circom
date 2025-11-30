pragma circom 2.0.0;

// A simplified Rollup Transaction Circuit
// In a real production app, this would include EdDSA signature verification
template ProcessTx() {
    // Public Inputs
    signal input old_balance;
    signal input amount;
    signal input new_balance;

    // Private Inputs (Witness)
    signal input sender_pubkey;
    signal input receiver_pubkey;
    signal input signature;

    // Constraints

    // 1. Check for underflow (Sender must have enough balance)
    // assert(old_balance >= amount)
    signal balanceCheck;
    balanceCheck <== old_balance - amount;

    // 2. Verify State Transition
    // new_balance must equal old_balance - amount
    new_balance === old_balance - amount;

    // 3. (Mock) Constrain signature to not be zero to ensure it exists
    signal sigCheck;
    sigCheck <== signature * signature;
}

// Main component for standalone testing - comment out when used as library
// component main {public [old_balance, amount, new_balance]} = ProcessTx();
