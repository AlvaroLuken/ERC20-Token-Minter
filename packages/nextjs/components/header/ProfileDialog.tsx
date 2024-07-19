"use client";

import { useAuth } from "~~/app/auth/AuthProvider";

export const PROFILE_DIALOG_ID = "profile-dialog";

export const ProfileDialog = () => {
  const { user, logout } = useAuth();

  async function handleLogout() {
    logout();
    closeModal3();
  }

  const closeModal3 = () => {
    (document.getElementById(PROFILE_DIALOG_ID) as HTMLDialogElement).close();
  };

  return (
    <dialog id={PROFILE_DIALOG_ID} className="modal">
      <div className="modal-box flex justify-center self-center z-10 mt-12">
        <div className="p-12 mx-auto rounded-2xl w-100 ">
          <div className="mb-4">
            <h3 className="flex justify-center font-semibold text-2xl ">Your Profile</h3>
          </div>
          <p className="">
            <b>Username</b>: {user?.username}
          </p>
          <p className="">
            <b>Wallet Address</b>: {user?.walletAddress}
          </p>
          <p className="">
            <b>Wallet Id</b>: {user?.walletId}
          </p>
          <div className="flex items-center btn btn-primary ml-2" onClick={handleLogout}>
            Log Out
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
