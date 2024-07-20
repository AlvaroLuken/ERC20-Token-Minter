"use client";

import { useRef, useState } from "react";
import { useAuth } from "~~/app/auth/AuthProvider";
import Loader from "~~/utils/Loader";

export const LOGIN_DIALOG_ID = "login-dialog";

export const LoginDialog = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const loginButtonRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const closeModal2 = () => {
    (document.getElementById(LOGIN_DIALOG_ID) as HTMLDialogElement).close();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form from submitting if inside a form
      loginButtonRef.current?.click();
    }
  };

  async function handleLogin() {
    setIsLoading(true);
    setTimeout(closeModal2, 1800);
    login(email, password);
    // setIsLoading(false);
  }

  return (
    <dialog id={LOGIN_DIALOG_ID} className="modal">
      <div className="modal-box flex justify-center self-center z-10 mt-12">
        <div className="p-12 mx-auto rounded-2xl w-100 ">
          <div className="mb-4">
            <h3 className="font-semibold text-2xl">Sign In </h3>
            <p className="">Please sign in to your account.</p>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium tracking-wide">Username</label>
              <input
                onKeyDown={handleKeyDown}
                onChange={handleEmailChange}
                className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type=""
                placeholder="pikachu24"
              />
            </div>
            <div className="space-y-2">
              <label className="mb-5 text-sm font-medium tracking-wide">Password</label>
              <input
                onKeyDown={handleKeyDown}
                onChange={handlePasswordChange}
                className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <button
                onClick={handleLogin}
                type="submit"
                ref={loginButtonRef}
                className="w-full flex justify-center bg-green-400  hover:bg-green-500 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
              >
                {isLoading ? <Loader /> : "Sign In"}
              </button>
            </div>
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
