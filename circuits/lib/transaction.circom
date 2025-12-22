pragma circom 2.0.0;

include "./poseidon_merkle.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

// Process a single transaction: verify and update sender/receiver states
template ProcessTransaction(treeDepth) {
    // Sender account state (before transaction)
    signal input sender_address;
    signal input sender_balance;
    signal input sender_nonce;
    signal input sender_proof[treeDepth];
    signal input sender_path[treeDepth];

    // Receiver account state (state after sender update)
    signal input receiver_address;
    signal input receiver_balance;
    signal input receiver_nonce;
    signal input receiver_proof[treeDepth];
    signal input receiver_path[treeDepth];

    // Transaction data
    signal input amount;
    signal input tx_nonce;

    // State roots
    signal input stateRoot;
    signal output newStateRoot;

    // ==========================================
    // Constraint 1: Sender has sufficient balance
    // ==========================================
    component balanceCheck = GreaterEqThan(252);
    balanceCheck.in[0] <== sender_balance;
    balanceCheck.in[1] <== amount;
    balanceCheck.out === 1;

    // ==========================================
    // Constraint 2: Transaction nonce matches sender's nonce
    // ==========================================
    tx_nonce === sender_nonce;

    // ==========================================
    // Step 1: Compute sender's old account hash
    // ==========================================
    component senderOldHash = AccountHash();
    senderOldHash.address <== sender_address;
    senderOldHash.balance <== sender_balance;
    senderOldHash.nonce <== sender_nonce;

    // ==========================================
    // Step 2: Verify sender is in the state tree
    // ==========================================
    component verifySender = MerkleProofVerifier(treeDepth);
    verifySender.leaf <== senderOldHash.out;
    verifySender.root <== stateRoot;
    for (var i = 0; i < treeDepth; i++) {
        verifySender.pathElements[i] <== sender_proof[i];
        verifySender.pathIndices[i] <== sender_path[i];
    }

    // ==========================================
    // Step 3: Compute sender's new account hash
    // ==========================================
    component senderNewHash = AccountHash();
    senderNewHash.address <== sender_address;
    senderNewHash.balance <== sender_balance - amount;
    senderNewHash.nonce <== sender_nonce + 1;

    // ==========================================
    // Step 4: Update state tree with new sender state
    // ==========================================
    component updateSender = MerkleRootUpdater(treeDepth);
    updateSender.oldLeaf <== senderOldHash.out;
    updateSender.newLeaf <== senderNewHash.out;
    updateSender.oldRoot <== stateRoot;
    for (var i = 0; i < treeDepth; i++) {
        updateSender.pathElements[i] <== sender_proof[i];
        updateSender.pathIndices[i] <== sender_path[i];
    }

    signal intermediateRoot;
    intermediateRoot <== updateSender.newRoot;

    // ==========================================
    // Step 5: Compute receiver's old account hash
    // ==========================================
    component receiverOldHash = AccountHash();
    receiverOldHash.address <== receiver_address;
    receiverOldHash.balance <== receiver_balance;
    receiverOldHash.nonce <== receiver_nonce;

    // ==========================================
    // Step 6: Verify receiver is in updated state tree
    // ==========================================
    component verifyReceiver = MerkleProofVerifier(treeDepth);
    verifyReceiver.leaf <== receiverOldHash.out;
    verifyReceiver.root <== intermediateRoot;
    for (var i = 0; i < treeDepth; i++) {
        verifyReceiver.pathElements[i] <== receiver_proof[i];
        verifyReceiver.pathIndices[i] <== receiver_path[i];
    }

    // ==========================================
    // Step 7: Compute receiver's new account hash
    // ==========================================
    component receiverNewHash = AccountHash();
    receiverNewHash.address <== receiver_address;
    receiverNewHash.balance <== receiver_balance + amount;
    receiverNewHash.nonce <== receiver_nonce;

    // ==========================================
    // Step 8: Update state tree with new receiver state
    // ==========================================
    component updateReceiver = MerkleRootUpdater(treeDepth);
    updateReceiver.oldLeaf <== receiverOldHash.out;
    updateReceiver.newLeaf <== receiverNewHash.out;
    updateReceiver.oldRoot <== intermediateRoot;
    for (var i = 0; i < treeDepth; i++) {
        updateReceiver.pathElements[i] <== receiver_proof[i];
        updateReceiver.pathIndices[i] <== receiver_path[i];
    }

    // Output the final state root
    newStateRoot <== updateReceiver.newRoot;
}
