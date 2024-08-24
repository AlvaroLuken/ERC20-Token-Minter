"use client";

import { useState } from "react";
import { useAuth } from "./auth/AuthProvider";
import NftMinter from "./nft-minter/page";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import type { NextPage } from "next";
import { formatEther } from "viem";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<string | bigint>("");
  const [, setIsMining] = useState(false);

  const { data: balance, refetch } = useScaffoldReadContract({
    contractName: "SuperMintable",
    functionName: "balanceOf",
    args: [user?.walletAddress],
  });

  async function mint() {
    if (!user) {
      notification.error("Please sign in to make a transaction!");
      return;
    }
    setIsMining(true);
    const sdk = new W3SSdk();

    const executeMethod = (challengeId: any) => {
      notification.remove("");
      return new Promise((resolve, reject) => {
        sdk.execute(challengeId!, (error: any, result: any) => {
          if (error) {
            notification.error(error);
            reject(error);
          } else if (result) {
            resolve(result);
          }
        });
      });
    };

    notification.info("Awaiting your approval...", {
      duration: 2000,
    });

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

      notification.success("Sent tx!", {
        duration: 3500,
      });
    } catch (err) {
      // If any error, It will be caught here.
      console.log(err);
    }
    notification.remove("");
  }

  async function transfer() {
    if (!user) {
      notification.error("Please sign in to make a transaction!");
      return;
    }

    const sdk = new W3SSdk();

    const executeMethod = (challengeId: any) => {
      return new Promise((resolve, reject) => {
        sdk.execute(challengeId!, (error: any, result: any) => {
          if (error) {
            notification.error(error);
            reject(error);
          } else if (result) {
            resolve(result);
            refetch();
          }
        });
      });
    };

    const data = {
      userId: user?.userId,
      walletId: user?.walletId,
      walletAddress: user?.walletAddress,
      functionName: "transfer",
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

      notification.success("Sent tx!", {
        duration: 3500,
      });

      // CHECK FOR TX STATUS HERE
    } catch (err) {
      // If any error, It will be caught here.
      console.log(err);
    }
  }

  return (
    <div className="container mx-auto p-4 lg:p-2">
      <div className="flex flex-col lg:flex-row items-center justify-center m-4 lg:m-10 gap-4 lg:gap-10">
        <div className="flex flex-col gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="card-title">Your Tokens</div>
              <div className="stat">
                <div className="stat-value">{formatEther(balance || 0n)}</div>
              </div>
              <div className="card-actions flex justify-end">
                <button className="btn btn-primary" onClick={mint}>
                  Mint 100
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl w-full max-w-md">
            <div className="card-body">
              <h2 className="card-title">Transfer Tokens</h2>
              <label>
                <div className="w-full max-w-xs overflow-hidden">
                  <AddressInput value={recipient} onChange={val => setRecipient(val)} />
                </div>
              </label>
              <label>
                Amount:
                <IntegerInput disableMultiplyBy1e18 value={amount} onChange={val => setAmount(val)} />
              </label>
              <div className="card-actions justify-end">
                <button className="btn btn-primary mt-2" onClick={transfer}>
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl w-full lg:max-w-sm">
          <NftMinter />
        </div>
      </div>
    </div>
  );
};

export default Home;
