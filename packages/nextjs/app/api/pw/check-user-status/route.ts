import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userToken } = body;

  console.log("HERE");
  console.log("user token " + userToken);

  const url = "https://api.circle.com/v1/w3s/wallets";
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
  const wallet = body1.data.wallets[0];

  console.log(body1);

  console.log(wallet);

  const data = {
    wallet,
  };

  return NextResponse.json(data);
}
