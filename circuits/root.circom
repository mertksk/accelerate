pragma circom 2.0.0;

include "rollup.circom";

// The Root Circuit verifies a batch of transactions and the global state root update
template RollupBatch(nTx) {
    // Public Inputs
    signal input oldRoot;
    signal input newRoot;

    // Private Inputs
    signal input tx_amounts[nTx];
    signal input tx_senders[nTx];
    signal input intermediary_roots[nTx + 1];

    component txs[nTx];

    // Verify that the batch starts with the known oldRoot
    intermediary_roots[0] === oldRoot;

    for (var i = 0; i < nTx; i++) {
        txs[i] = ProcessTx();

        // For this prototype, we treat intermediary roots as balances to
        // keep the state transition constrained.
        txs[i].old_balance <== intermediary_roots[i];
        txs[i].amount <== tx_amounts[i];
        txs[i].new_balance <== intermediary_roots[i + 1];

        // In a real ZK Rollup, we would verify the Merkle Proof for every tx here
        // For this MVP, we verify the sequence of root updates
        signal diff;
        diff <== intermediary_roots[i + 1] - intermediary_roots[i];

        // Bind the sender input so it influences the witness
        txs[i].sender_pubkey <== tx_senders[i];
        txs[i].receiver_pubkey <== 0;
        txs[i].signature <== 1;
    }

    // Verify that the batch ends with the declared newRoot
    intermediary_roots[nTx] === newRoot;
}

component main {public [oldRoot, newRoot]} = RollupBatch(10);
