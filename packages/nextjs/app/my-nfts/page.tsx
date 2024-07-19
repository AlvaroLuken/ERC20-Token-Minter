"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import type { NextPage } from "next";
import { TRANSFER_NFT_DIALOG_ID, TransferNftDialog } from "~~/components/TransferNftDialog";
import Loader from "~~/utils/Loader";

type NFT = {
  nftTokenId: string;
  amount: string;
  metadata: string;
  updateDate: string;
  name: string;
  token: Token;
  tokenId: any;
};

type Token = {
  name: string;
};

const openModal4 = () => {
  (document.getElementById(TRANSFER_NFT_DIALOG_ID) as HTMLDialogElement).showModal();
};

const MyNfts: NextPage = () => {
  const { user } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (user) {
        getNfts();
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, 1500);

    // Cleanup the timer if the component unmounts before the delay is over
    return () => clearTimeout(timer);
  }, [user]);

  async function handleTransferNft(tokenId: any) {
    console.log("CHAT0");
    console.log(tokenId);
    setTokenId(tokenId);
    openModal4();
  }

  async function getNfts() {
    const data = {
      userId: user?.userId,
      walletId: user?.walletId,
    };

    const response = await fetch("/api/nft/get-wallet-nfts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const data2 = await response.json();
    console.log(data2.nfts);
    setNfts(data2.nfts);
  }

  return (
    <div className="nft-gallery flex items-center justify-center m-10">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map(nft => (
            <div key={nft.nftTokenId} className="card bg-base-100 w-96 shadow-xl">
              <figure className="px-10 pt-10">
                <img src={nft.metadata} alt={`NFT ${nft.nftTokenId}`} className="rounded-xl" />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">
                  {nft.token.name} {nft.nftTokenId}
                </h2>
                <div className="card-actions flex justify-end">
                  <button className="btn btn-primary" onClick={() => handleTransferNft(nft.nftTokenId)}>
                    Transfer NFT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <TransferNftDialog tokenId={tokenId} getNfts={getNfts} />
    </div>
  );
};

export default MyNfts;
