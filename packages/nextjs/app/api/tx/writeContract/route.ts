import { NextRequest, NextResponse } from "next/server";
import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";
import { ethers } from "ethers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, walletId, walletAddress, functionName, recipient, amount, tokenId } = body;

  const circleUserSdk = initiateUserControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
  });

  const ABI1 = ["function mint(address account, uint256 amount)"];
  const ABI2 = ["function transfer(address to, uint256 amount)"];
  const ABI3 = ["function mint(address to)"];
  const ABI4 = ["function transferNft(address from, address to, uint256 tokenId)"];

  const iface1 = new ethers.utils.Interface(ABI1);
  const iface2 = new ethers.utils.Interface(ABI2);
  const iface3 = new ethers.utils.Interface(ABI3);
  const iface4 = new ethers.utils.Interface(ABI4);

  let transferCalldata, mintNftCalldata, mintErc20Calldata, transferNftCalldata;
  if (functionName == "transfer" && amount) {
    transferCalldata = iface2.encodeFunctionData("transfer", [recipient, ethers.utils.parseEther(amount)]);
  } else if (functionName == "mintNft") {
    mintNftCalldata = iface3.encodeFunctionData("mint", [walletAddress]);
  } else if (functionName == "transferNft") {
    transferNftCalldata = iface4.encodeFunctionData("transferNft", [walletAddress, recipient, tokenId]);
  } else {
    mintErc20Calldata = iface1.encodeFunctionData("mint", [walletAddress, ethers.utils.parseEther("100.0")]);
  }

  const response = await circleUserSdk.createUserToken({
    userId: userId,
  });

  let userToken, encryptionKey;

  const callData = `${
    functionName === "mintNft"
      ? mintNftCalldata
      : functionName === "mint"
      ? mintErc20Calldata
      : functionName === "transferNft"
      ? transferNftCalldata
      : transferCalldata
  }`;

  if (response && response.data && response.data.userToken && response.data.encryptionKey) {
    userToken = response.data.userToken;
    encryptionKey = response.data.encryptionKey;
    const response1 = await circleUserSdk.createUserTransactionContractExecutionChallenge({
      userToken: userToken,
      callData: callData,
      contractAddress: `${
        functionName == "mintNft" || functionName == "transferNft"
          ? "0xF2a17b4563CFD65bAF26eB1aDA6d37Ea4Bbe337C"
          : "0x373aF30074BeEB7010bB4042013bac6f559F5f5E"
      }`,
      walletId: walletId,
      fee: {
        type: "level",
        config: {
          feeLevel: "HIGH",
        },
      },
    });

    let challengeId;

    if (response1.data && response1.data.challengeId) {
      challengeId = response1.data.challengeId;
    }

    const data = {
      userToken: userToken,
      encryptionKey: encryptionKey,
      challengeId: challengeId,
    };

    return NextResponse.json(data);
  }
}
