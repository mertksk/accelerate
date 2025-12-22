pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/mux1.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

// Hash account state: H(address, balance, nonce)
template AccountHash() {
    signal input address;
    signal input balance;
    signal input nonce;
    signal output out;

    component hasher = Poseidon(3);
    hasher.inputs[0] <== address;
    hasher.inputs[1] <== balance;
    hasher.inputs[2] <== nonce;
    out <== hasher.out;
}

// Verify Merkle inclusion proof
template MerkleProofVerifier(levels) {
    signal input leaf;
    signal input root;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    component hashers[levels];
    component mux[levels];

    signal levelHashes[levels + 1];
    levelHashes[0] <== leaf;

    for (var i = 0; i < levels; i++) {
        // Ensure pathIndices are binary (0 or 1)
        pathIndices[i] * (1 - pathIndices[i]) === 0;

        hashers[i] = Poseidon(2);
        mux[i] = MultiMux1(2);

        // If pathIndices[i] == 0: hash(current, sibling)
        // If pathIndices[i] == 1: hash(sibling, current)
        mux[i].c[0][0] <== levelHashes[i];
        mux[i].c[0][1] <== pathElements[i];
        mux[i].c[1][0] <== pathElements[i];
        mux[i].c[1][1] <== levelHashes[i];
        mux[i].s <== pathIndices[i];

        hashers[i].inputs[0] <== mux[i].out[0];
        hashers[i].inputs[1] <== mux[i].out[1];

        levelHashes[i + 1] <== hashers[i].out;
    }

    // Final computed root must equal the provided root
    root === levelHashes[levels];
}

// Compute new root after updating a leaf
template MerkleRootUpdater(levels) {
    signal input oldLeaf;
    signal input newLeaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];
    signal input oldRoot;
    signal output newRoot;

    // First verify the old leaf is in the tree
    component verifier = MerkleProofVerifier(levels);
    verifier.leaf <== oldLeaf;
    verifier.root <== oldRoot;
    for (var i = 0; i < levels; i++) {
        verifier.pathElements[i] <== pathElements[i];
        verifier.pathIndices[i] <== pathIndices[i];
    }

    // Now compute the new root with the updated leaf
    component hashers[levels];
    component mux[levels];
    signal levelHashes[levels + 1];
    levelHashes[0] <== newLeaf;

    for (var i = 0; i < levels; i++) {
        hashers[i] = Poseidon(2);
        mux[i] = MultiMux1(2);

        mux[i].c[0][0] <== levelHashes[i];
        mux[i].c[0][1] <== pathElements[i];
        mux[i].c[1][0] <== pathElements[i];
        mux[i].c[1][1] <== levelHashes[i];
        mux[i].s <== pathIndices[i];

        hashers[i].inputs[0] <== mux[i].out[0];
        hashers[i].inputs[1] <== mux[i].out[1];

        levelHashes[i + 1] <== hashers[i].out;
    }

    newRoot <== levelHashes[levels];
}
