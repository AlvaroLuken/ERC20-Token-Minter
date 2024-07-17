"use client";

import React from "react";
import { LOGIN_DIALOG_ID, LoginDialog } from "./LoginDialog";
import { PROFILE_DIALOG_ID, ProfileDialog } from "./ProfileDialog";
import { REGISTER_DIALOG_ID, RegisterDialog } from "./RegisterDialog";
import { useAuth } from "~~/app/auth/AuthProvider";

export const NavEnd = () => {
  const { user } = useAuth();

  const openModal1 = () => {
    (document.getElementById(LOGIN_DIALOG_ID) as HTMLDialogElement).showModal();
  };

  const openModal2 = () => {
    (document.getElementById(REGISTER_DIALOG_ID) as HTMLDialogElement).showModal();
  };

  const openModal3 = () => {
    (document.getElementById(PROFILE_DIALOG_ID) as HTMLDialogElement).showModal();
  };

  return (
    <>
      <div>
        <div className="navbar-end flex-grow mr-4">
          {!user ? (
            <div>
              <div className="btn btn-primary" onClick={openModal1}>
                Login
              </div>
              <div className="btn btn-primary ml-2" onClick={openModal2}>
                Register
              </div>
            </div>
          ) : (
            ""
          )}

          {user ? (
            <div className="btn btn-primary ml-2" onClick={openModal3}>
              {user.username}
            </div>
          ) : (
            ""
          )}
        </div>
        <LoginDialog />
        <RegisterDialog />
        <ProfileDialog />
      </div>
    </>
  );
};
