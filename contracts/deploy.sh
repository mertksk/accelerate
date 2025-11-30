#!/bin/bash
# Deploy contract to Casper Testnet
# usage: ./deploy.sh

/Users/mertk/.cargo/bin/casper-client put-deploy \
    --node-address https://node.testnet.casper.network/rpc \
    --chain-name casper-test \
    --secret-key contracts/keys/secret_key.pem \
    --payment-amount 180000000000 \
    --session-path contracts/target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm