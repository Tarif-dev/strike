import React from "react";

const ZkInfoCard = () => {
  return (
    <div className="bg-gray-950 rounded-lg p-6 border border-neon-green/20 mb-8">
      <h2 className="text-2xl font-bold text-neon-green mb-4">
        What is ZK Compression?
      </h2>

      <div className="space-y-4 text-gray-300">
        <p>
          ZK Compression is a revolutionary Solana primitive that uses
          Zero-Knowledge proofs to compress on-chain data, significantly
          reducing storage costs and increasing throughput.
        </p>

        <h3 className="text-xl font-semibold text-neon-green mt-4">
          Key Benefits:
        </h3>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium text-neon-green">
              Reduced Storage Costs:
            </span>{" "}
            Store up to 10,000x more data at the same cost compared to
            traditional Solana accounts.
          </li>
          <li>
            <span className="font-medium text-neon-green">
              Higher Throughput:
            </span>{" "}
            Process more transactions per second by reducing the data footprint.
          </li>
          <li>
            <span className="font-medium text-neon-green">Scalability:</span>{" "}
            Support billions of on-chain assets without state bloat.
          </li>
          <li>
            <span className="font-medium text-neon-green">Same Security:</span>{" "}
            Maintain the same security guarantees as traditional Solana
            accounts.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-neon-green mt-4">
          Use Cases:
        </h3>

        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-medium text-neon-green">
              NFT Collections:
            </span>{" "}
            Store millions of NFTs with lower costs.
          </li>
          <li>
            <span className="font-medium text-neon-green">Gaming Assets:</span>{" "}
            Track in-game items and achievements efficiently.
          </li>
          <li>
            <span className="font-medium text-neon-green">DeFi:</span> Store
            trading history and user data with minimal overhead.
          </li>
          <li>
            <span className="font-medium text-neon-green">Social Media:</span>{" "}
            Store user profiles, posts, and interactions on-chain.
          </li>
        </ul>

        <div className="mt-6 text-sm bg-gray-900 p-4 rounded-md">
          <p className="mb-2">
            <span className="font-medium text-neon-green">How it works:</span>{" "}
            ZK Compression uses a Merkle tree to store compressed data
            off-chain, while keeping only the Merkle root on-chain.
            Zero-Knowledge proofs validate operations without revealing the
            entire data structure.
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-400">
            This demo shows how to create, mint, and transfer ZK Compressed
            tokens on Solana using Light Protocol&apos;s implementation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZkInfoCard;
