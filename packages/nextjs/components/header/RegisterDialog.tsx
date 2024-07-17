"use client";

import { useState } from "react";
import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "~~/app/auth/AuthProvider";

export const REGISTER_DIALOG_ID = "register-dialog";

export const RegisterDialog = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    console.log(email);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  async function handleRegister() {
    const delay = (ms: any) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    console.log("Registering...");

    const userId = uuidv4();

    console.log(userId);

    const data1 = { userId: userId };

    const initUserWalletResponse = await fetch("/api/pw/create-user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data1),
    });

    const data2 = await initUserWalletResponse.json();
    const userToken = data2.userToken;
    const encryptionKey = data2.encryptionKey;
    const challengeId = data2.challengeId;

    /// ENTER THE WEB3 SDK ///

    const sdk = new W3SSdk();

    const executeMethod = (challengeId: any) => {
      return new Promise((resolve, reject) => {
        sdk.execute(challengeId!, (error: any, result: any) => {
          if (error) {
            reject(error);
          } else if (result) {
            console.log("User registered!");
            resolve(result);
          }
        });
      });
    };

    let walletAddress, walletId;

    try {
      sdk.setAppSettings({ appId: process.env.NEXT_PUBLIC_APP_ID! });
      sdk.setAuthentication({
        userToken: userToken,
        encryptionKey: encryptionKey,
      });

      // Wait for the successful completion of executeMethod
      await executeMethod(challengeId!);

      await delay(2000);

      const data = { userToken: userToken };

      // After successful completion of sdk.execute() make another API call
      const status = await fetch("/api/pw/check-user-status/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Status: ");
      const body = await status.json();
      walletAddress = body.wallet.address;
      walletId = body.wallet.id;
    } catch (err) {
      // If any error, It will be caught here.
      console.log(err);
    }
    register(email, password, walletAddress, walletId, userId);
  }

  return (
    <dialog id={REGISTER_DIALOG_ID} className="modal">
      <div id="modal-register" className="modal-box flex justify-center self-center z-10 mt-12">
        <div className="p-12 mx-auto rounded-2xl w-100 ">
          <div className="mb-4">
            <h3 className="font-semibold text-2xl">Register</h3>
            <p className="">Please register your account.</p>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium tracking-wide">Email</label>
              <input
                onChange={handleEmailChange}
                className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type=""
                placeholder="mail@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="mb-5 text-sm font-medium tracking-wide">Password</label>
              <input
                onChange={handlePasswordChange}
                className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type=""
                placeholder="Enter your password"
              />
            </div>
            <div>
              <button
                onClick={handleRegister}
                type="submit"
                className="w-full flex justify-center bg-green-400  hover:bg-green-500 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
              >
                Register
              </button>
            </div>
          </div>
          <div className="pt-5 text-center text-xs">
            <span>Developed in-house by Circle.</span>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button id="close-the-modal">close</button>
      </form>
      {/* </form> */}
    </dialog>
  );
};
