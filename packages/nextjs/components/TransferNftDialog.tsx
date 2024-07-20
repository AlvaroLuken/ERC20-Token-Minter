"use client";

import { useState } from "react";
import { AddressInput } from "./scaffold-eth";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { useAuth } from "~~/app/auth/AuthProvider";
import { notification } from "~~/utils/scaffold-eth";

export const TRANSFER_NFT_DIALOG_ID = "transfer-nft-dialog";

export const TransferNftDialog = (tokenId: any, getNfts: any) => {
  const { user } = useAuth();
  const [recipient, setRecipient] = useState("");

  const closeModal4 = () => {
    (document.getElementById(TRANSFER_NFT_DIALOG_ID) as HTMLDialogElement).close();
  };

  async function transferNft() {
    if (!user) {
      notification.error("Please sign in to make a transaction!");
      return;
    }
    const sdk = new W3SSdk();

    setTimeout(closeModal4, 1800);

    const executeMethod = (challengeId: any) => {
      return new Promise((resolve, reject) => {
        sdk.execute(challengeId!, (error: any, result: any) => {
          if (error) {
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
      functionName: "transferNft",
      tokenId: tokenId.tokenId,
      recipient: recipient,
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
      getNfts();
    } catch (err) {
      // If any error, It will be caught here.
      console.log(err);
    }
  }

  return (
    <dialog id={TRANSFER_NFT_DIALOG_ID} className="modal">
      <div className="modal-box flex justify-center self-center z-10 mt-12">
        <div className="p-12 mx-auto rounded-2xl w-100 ">
          <div className="mb-4">
            <h3 className="flex justify-center font-semibold text-2xl ">Transfer Your NFT</h3>
          </div>
          <p className="">
            <b>Recipient</b>:
          </p>
          <label>
            <div className="w-full max-w-xs overflow-hidden">
              <AddressInput value={recipient} onChange={val => setRecipient(val)} />
            </div>
          </label>
          <div className="flex items-center btn btn-primary ml-2 mt-4" onClick={transferNft}>
            Transfer NFT
          </div>
          <div className="pt-5 text-center text-xs flex items-center justify-center space-x-2">
            <span>Developed by Circle.</span>
            <img src="/USDC_Icon.png" alt="Circle Logo" className="h-4 w-4" />
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button id="close-the-modal">close</button>
      </form>
    </dialog>
  );
};
