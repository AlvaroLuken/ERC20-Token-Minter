import { NextRequest, NextResponse } from "next/server";
import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";
import { ethers } from "ethers";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, walletId, walletAddress, functionName, recipient, amount } = body;

  const circleUserSdk = initiateUserControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
  });

  const ABI1 = ["function mint(address account, uint256 amount)"];
  const ABI2 = ["function transfer(address to, uint256 amount)"];

  const iface1 = new ethers.utils.Interface(ABI1);
  const iface2 = new ethers.utils.Interface(ABI2);

  const mintCalldata = iface1.encodeFunctionData("mint", [walletAddress, ethers.utils.parseEther("100.0")]);

  let transferCalldata;
  if (functionName == "transfer" && amount) {
    transferCalldata = iface2.encodeFunctionData("transfer", [recipient, ethers.utils.parseEther(amount)]);
  }

  const response = await circleUserSdk.createUserToken({
    userId: userId,
  });

  let userToken, encryptionKey;

  if (response && response.data && response.data.userToken && response.data.encryptionKey) {
    userToken = response.data.userToken;
    encryptionKey = response.data.encryptionKey;
    const response1 = await circleUserSdk.createUserTransactionContractExecutionChallenge({
      userToken: userToken,
      callData: `${functionName == "mint" ? mintCalldata : transferCalldata}`,
      contractAddress: "0xac72293B5b59E4e6D44A4260DE72922fE9110131",
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
