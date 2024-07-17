"use client";

import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<string | bigint>("");

  const { data: balance } = useScaffoldReadContract({
    contractName: "SuperMintable",
    functionName: "balanceOf",
    args: [user?.walletAddress],
  });

  async function mint() {
    const sdk = new W3SSdk();

    const executeMethod = (challengeId: any) => {
      return new Promise((resolve, reject) => {
        sdk.execute(challengeId!, (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            console.log("Mint tx sent!");
            resolve(result);
          }
        });
      });
    };

    const data = {
      userId: user?.userId,
      walletId: user?.walletId,
      walletAddress: user?.walletAddress,
      functionName: "mint",
    };

    const response = await fetch("/api/tx/writeContract/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const data2 = await response.json();
    const userToken = data2.userToken;
    const encryptionKey = data2.encryptionKey;
    const challengeId = data2.challengeId;

    try {
      sdk.setAppSettings({ appId: process.env.NEXT_PUBLIC_APP_ID! });
      sdk.setAuthentication({
        userToken: userToken,
        encryptionKey: encryptionKey,
      });

      // Wait for the successful completion of executeMethod
      await executeMethod(challengeId!);
    } catch (err) {
      // If any error, It will be caught here.
      console.log(err);
    }
  }

  async function transfer() {
    const sdk = new W3SSdk();

    const executeMethod = (challengeId: any) => {
      return new Promise((resolve, reject) => {
        sdk.execute(challengeId!, (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            console.log("Transfer tx sent!");
            resolve(result);
          }
        });
      });
    };

    const data = {
      userId: user?.userId,
      walletId: user?.walletId,
      walletAddress: user?.walletAddress,
      methodName: "transfer",
      recipient: recipient,
      amount: amount,
    };

    const response = await fetch("/api/tx/writeContract/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const data2 = await response.json();
    const userToken = data2.userToken;
    const encryptionKey = data2.encryptionKey;
    const challengeId = data2.challengeId;

    try {
      sdk.setAppSettings({ appId: process.env.NEXT_PUBLIC_APP_ID! });
      sdk.setAuthentication({
        userToken: userToken,
        encryptionKey: encryptionKey,
      });

      // Wait for the successful completion of executeMethod
      await executeMethod(challengeId!);
    } catch (err) {
      // If any error, It will be caught here.
      console.log(err);
    }
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
