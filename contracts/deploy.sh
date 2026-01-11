#!/bin/bash
# Deploy Casper Accelerate Full Contract to Testnet
# Usage: ./deploy.sh /path/to/secret_key.pem

set -e

SECRET_KEY=${1:-"$HOME/.casper/secret_key.pem"}
WASM_FILE="./target/wasm32-unknown-unknown/release/casper_accelerate_contract.wasm"
NODE_URL="https://rpc.testnet.casperlabs.io/rpc"
CHAIN_NAME="casper-test"
PAYMENT="150000000000"  # 150 CSPR for contract deployment

if [ ! -f "$SECRET_KEY" ]; then
    echo "Error: Secret key not found at $SECRET_KEY"
    echo "Usage: ./deploy.sh /path/to/secret_key.pem"
    exit 1
fi

if [ ! -f "$WASM_FILE" ]; then
    echo "Error: WASM file not found. Run: cargo +nightly build --release --target wasm32-unknown-unknown"
    exit 1
fi

echo "Deploying Casper Accelerate contract..."
echo "  WASM: $WASM_FILE"
echo "  Node: $NODE_URL"
echo "  Chain: $CHAIN_NAME"
echo "  Payment: $PAYMENT motes (150 CSPR)"
echo ""

# Deploy the contract
DEPLOY_HASH=$(casper-client put-deploy \
    --node-address "$NODE_URL" \
    --chain-name "$CHAIN_NAME" \
    --secret-key "$SECRET_KEY" \
    --payment-amount "$PAYMENT" \
    --session-path "$WASM_FILE" \
    | jq -r '.result.deploy_hash')

echo "Deploy hash: $DEPLOY_HASH"
echo ""
echo "Waiting for deployment to complete..."
echo "Check status at: https://testnet.cspr.live/deploy/$DEPLOY_HASH"
