"use client";

import { useState } from "react";
import { useAccount } from "@alchemy/aa-alchemy/react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { Address } from "viem";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

declare global {
  interface HTMLDialogElement extends HTMLElement {
    showModal(): void;
  }
}

const Home: NextPage = () => {
  const { account } = useAccount({ type: "MultiOwnerModularAccount" });
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<string | bigint>("");

  const { data: balance, refetch } = useScaffoldReadContract({
    contractName: "SuperMintable",
    functionName: "balanceOf",
    args: [account?.address],
  });

  const { writeContractAsync } = useScaffoldWriteContract("SuperMintable");

  async function mint() {
    writeContractAsync({
      functionName: "mint",
      args: [account?.address, parseEther("100")],
    }).then(() => refetch());
  }

  async function transfer() {
    writeContractAsync({
      functionName: "transfer",
      args: [recipient as Address, BigInt(amount)],
    }).then(() => refetch());
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <div className="stat">
          <div className="stat-title">Your Tokens</div>
          <div className="stat-value">{formatEther(balance || 0n)}</div>
          <div className="stat-actions">
            <button className="btn btn-sm" onClick={mint}>
              Mint 100
            </button>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 w-96 shadow-xl mt-12">
        <div className="card-body">
          <h2 className="card-title">Transfer Tokens</h2>

          <label>
            <AddressInput value={recipient} onChange={val => setRecipient(val)} />
          </label>
          <label>
            Amount:
            <IntegerInput value={amount} onChange={val => setAmount(val)} />
          </label>

          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={transfer}>
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
