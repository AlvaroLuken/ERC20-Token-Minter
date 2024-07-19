"use client";

import { useAuth } from "../auth/AuthProvider";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import type { NextPage } from "next";
import { notification } from "~~/utils/scaffold-eth";

const NftMinter: NextPage = () => {
  const { user } = useAuth();
  async function mintNft() {
    if (!user) {
      notification.error("Please sign in to make a transaction!");
      return;
    }
    const sdk = new W3SSdk();

    const executeMethod = (challengeId: any) => {
      notification.remove("");
      return new Promise((resolve, reject) => {
        sdk.execute(challengeId!, (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            console.log(result);
            resolve(result);
            console.log(result);
          }
        });
      });
    };

    notification.info("Awaiting your approval...", {
      duration: 1500,
    });

    const data = {
      userId: user?.userId,
      walletId: user?.walletId,
      walletAddress: user?.walletAddress,
      functionName: "mintNft",
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
    const txId = data2.txId;

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
      // check for tx here??
      const data = {
        userId: user?.userId,
        txId: txId,
      };

      const response = await fetch("/api/tx/get-tx-by-id/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const data2 = await response.json();
      console.log(data2);
    } catch (err) {
      // If any error, It will be caught here.
      console.log(err);
    }
    notification.remove("");
  }
  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <img src="/cp.png" alt="Shoes" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">Mint A CirclePunk</h2>
          <p className="mt-[-8]">Select Mint in order to unlock your own CirclePunk!</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={mintNft}>
              Mint NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftMinter;
