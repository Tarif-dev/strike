#!/bin/zsh

# Start ZK Compression test validator
# This script starts the Light Protocol test validator for ZK Compression
# which includes a Solana validator, RPC node, and a prover node

echo "Starting Light Protocol ZK Compression Test Validator..."
echo "This will start a Solana validator at port 8899, an RPC node at port 8784, and a prover node at port 3001."
echo ""
echo "You can stop the validator with Ctrl+C"
echo ""

# Start the test validator
npx light test-validator
