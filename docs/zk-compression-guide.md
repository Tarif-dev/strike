# ZK Compression Integration in Strike

This document explains how to use the ZK Compression feature integrated into the Strike application.

## Overview

ZK Compression is a Solana primitive that allows for significantly more efficient data storage on-chain by using Zero-Knowledge proofs to compress account data. This demo integrates Light Protocol's ZK Compression technology to demonstrate creating, minting, and transferring compressed tokens.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Solana CLI tools
- Light Protocol's ZK Compression CLI

### Setup

1. Install dependencies:

   ```
   npm install --save @lightprotocol/stateless.js @lightprotocol/compressed-token @solana/web3.js @lightprotocol/zk-compression-cli
   ```

2. Start the local test validator:
   ```
   ./start-zk-validator.sh
   ```
   This will start a local Solana validator with ZK Compression capabilities, including an RPC node and a prover node.

### Using the ZK Compression Demo

1. Navigate to the ZK Compression page in the app via the "ZK Demo" tab in the navigation bar.

2. The demo interface includes:
   - Network selection (Localnet/Devnet)
   - Wallet management for both admin (payer) and user wallets
   - Token operations (create, mint, transfer)
   - Transaction status monitoring

## Features

### Create ZK Compressed Token Mint

Create a new ZK compressed token with 9 decimals. This token uses significantly less storage space than traditional SPL tokens.

### Mint Tokens

Mint tokens to either the admin wallet or the user wallet. This demonstrates how to create new compressed tokens.

### Transfer Tokens

Transfer tokens between wallets, showcasing how compressed tokens can be moved between accounts with the same efficiency as traditional tokens but with much lower state bloat.

## Technical Implementation

The implementation includes:

- `ZkCompressionContext.tsx`: Context provider for managing ZK Compression state
- `zkCompressionService.ts`: Service layer for interacting with Light Protocol's ZK Compression API
- `ZkCompression.tsx`: UI component for demonstrating ZK Compression operations
- `zkUtils.ts`: Utility functions for the ZK Compression feature

## Switching to Devnet

To switch from local testing to devnet:

1. Update the RPC endpoint in the UI by clicking the "Switch to Devnet" button
2. Ensure you have a Helius API key for accessing the devnet RPC with compression support
3. Update the `devnetEndpoint` in `ZkCompressionContext.tsx` with your API key

## Troubleshooting

- If operations fail with the local validator, ensure the validator is running using `./start-zk-validator.sh`
- For devnet issues, verify your API key and check that the account has SOL for gas fees

## Resources

- [Light Protocol Documentation](https://docs.lightprotocol.com)
- [Solana Documentation](https://docs.solana.com)
- [ZK Compression Specification](https://github.com/solana-labs/solana/blob/master/sdk/program/src/state_compression.rs)
