import { NextRequest, NextResponse } from "next/server";
import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId } = body;

  const circleUserSdk = initiateUserControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
  });

  await circleUserSdk.createUser({
    userId: userId,
  });

  const response = await circleUserSdk.createUserToken({
    userId: userId,
  });

  let userToken;
  let encryptionKey;

  if (response && response.data && response.data.userToken && response.data.encryptionKey) {
    userToken = response.data.userToken;
    encryptionKey = response.data.encryptionKey;
    const response1 = await circleUserSdk.createUserPinWithWallets({
      userToken: userToken,
      accountType: "SCA",
      blockchains: ["MATIC-AMOY"],
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
