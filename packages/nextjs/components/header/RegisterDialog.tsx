"use client";

import { useState } from "react";
import { useAuth } from "~~/app/auth/AuthProvider";

export const REGISTER_DIALOG_ID = "register-dialog";

export const RegisterDialog = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // const handleFormSubmit = (e: any) => {
  //     e.preventDefault();
  //     // Handle form submission logic here
  //     console.log('Form submitted');
  //     var closeModalButton = document.getElementById("close-the-modal");
  //     closeModalButton?.click();
  // };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    console.log(email);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  async function handleRegister() {
    console.log("Registering...");
    /*
          
        CIRCLE PROGRAMMABLE WALLET LOGIC GOES HERE
        
        */
    const walletAddress = "0x";
    const walletId = "123";
    register(email, password, walletAddress, walletId);
    const closeModalButton = document.getElementById("close-the-modal");
    closeModalButton?.click();
  }

  return (
    <dialog id={REGISTER_DIALOG_ID} className="modal">
      {/* <form onSubmit={handleFormSubmit} method="dialog"> */}
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
