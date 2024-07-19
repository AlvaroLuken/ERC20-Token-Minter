import { NextRequest, NextResponse } from "next/server";
import { initiateUserControlledWalletsClient } from "@circle-fin/user-controlled-wallets";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, txId } = body;

  console.log(userId, txId);

  const circleUserSdk = initiateUserControlledWalletsClient({
    apiKey: process.env.CIRCLE_API_KEY!,
  });

  const response = await circleUserSdk.createUserToken({
    userId: userId,
  });

  let userToken;

  if (response && response.data && response.data.userToken) {
    userToken = response.data.userToken;
    // encryptionKey = response.data.encryptionKey;
  }

  const url = `https://api.circle.com/v1/w3s/transactions/${txId}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-User-Token": String(userToken),
      authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
  };

  const res = await fetch(url, options);
  const body1 = await res.json();

  console.log(body1);

  const data = {
    body1,
  };

  return NextResponse.json(data);
}
