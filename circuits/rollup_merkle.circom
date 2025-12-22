pragma circom 2.0.0;

include "./lib/transaction.circom";

// Main rollup batch circuit with Merkle proofs
// Processes nTx transactions and verifies state transition from oldRoot to newRoot
template RollupBatchMerkle(nTx, treeDepth) {
    // Public inputs - these are visible on-chain
    signal input oldRoot;
    signal input newRoot;

    // Private inputs per transaction - these are hidden in the proof
    signal input sender_addresses[nTx];
    signal input sender_balances[nTx];
    signal input sender_nonces[nTx];
    signal input sender_proofs[nTx][treeDepth];
    signal input sender_paths[nTx][treeDepth];

    signal input receiver_addresses[nTx];
    signal input receiver_balances[nTx];
    signal input receiver_nonces[nTx];
    signal input receiver_proofs[nTx][treeDepth];
    signal input receiver_paths[nTx][treeDepth];

    signal input amounts[nTx];
    signal input tx_nonces[nTx];

    // Intermediate state roots - chain each transaction's output to the next input
    signal stateRoots[nTx + 1];
    stateRoots[0] <== oldRoot;

    // Process each transaction sequentially
    component txProcessors[nTx];

    for (var i = 0; i < nTx; i++) {
        txProcessors[i] = ProcessTransaction(treeDepth);

        // Connect sender inputs
        txProcessors[i].sender_address <== sender_addresses[i];
        txProcessors[i].sender_balance <== sender_balances[i];
        txProcessors[i].sender_nonce <== sender_nonces[i];
        for (var j = 0; j < treeDepth; j++) {
            txProcessors[i].sender_proof[j] <== sender_proofs[i][j];
            txProcessors[i].sender_path[j] <== sender_paths[i][j];
        }

        // Connect receiver inputs
        txProcessors[i].receiver_address <== receiver_addresses[i];
        txProcessors[i].receiver_balance <== receiver_balances[i];
        txProcessors[i].receiver_nonce <== receiver_nonces[i];
        for (var j = 0; j < treeDepth; j++) {
            txProcessors[i].receiver_proof[j] <== receiver_proofs[i][j];
            txProcessors[i].receiver_path[j] <== receiver_paths[i][j];
        }

        // Connect transaction data
        txProcessors[i].amount <== amounts[i];
        txProcessors[i].tx_nonce <== tx_nonces[i];

        // Chain state roots: input comes from previous tx, output goes to next
        txProcessors[i].stateRoot <== stateRoots[i];
        stateRoots[i + 1] <== txProcessors[i].newStateRoot;
    }

    // Final constraint: the last computed root must equal the declared newRoot
    newRoot === stateRoots[nTx];
}

// Main component configuration:
// - 10 transactions per batch
// - 16-level Merkle tree (supports 65,536 accounts)
component main {public [oldRoot, newRoot]} = RollupBatchMerkle(10, 16);
