"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import userbase from "userbase-js";

interface User {
  username?: string | undefined;
  walletAddress?: string | undefined;
  walletId?: string | undefined;
  userId?: string | undefined;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  register: (username: string, password: string, walletAddress: string, walletId: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  // eslint-disable-next-line
  login: () => { },
  // eslint-disable-next-line
  logout: () => { },
  // eslint-disable-next-line
  register: () => { }
});

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userbase
      .init({
        appId: process.env.NEXT_PUBLIC_USERBASE_ID!,
      })
      .then(session => {
        // SDK initialized successfully
        const user = session.user;
        if (user) {
          // there is a valid active session
          console.log(user);
          setUser({
            username: user.username,
            walletAddress: user.profile?.walletAddress,
            walletId: user.profile?.walletId,
            userId: user.profile?.userId,
          });
        } else {
          console.log("Init success. No user logged in.");
        }
      })
      .catch(error => {
        console.error("Error initializing Userbase:", error);
        // Handle initialization error
      });
  }, []);

  const register = async (
    username: string,
    password: string,
    walletAddress: string,
    walletId: string,
    userId: string,
  ) => {
    const profile = {
      walletAddress: walletAddress,
      walletId: walletId,
      userId: userId,
    };
    try {
      const user = await userbase.signUp({ username, password, profile });
      setUser({
        username: user.username,
        walletAddress: walletAddress,
        walletId: walletId,
        userId: userId,
      });
      console.log("Registration success success", user.username);
    } catch (error) {
      console.error(error);
      // handle the error
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const user = await userbase.signIn({ username, password });
      setUser({
        username: user.username,
        walletAddress: user.profile?.walletAddress,
        walletId: user.profile?.walletId,
        userId: user.profile?.userId,
      });
      console.log("Log in success", user.username);
    } catch (error) {
      console.error(error);
      // handle the error
    }
  };

  const logout = async () => {
    try {
      await userbase.signOut();
      setUser(null);
      console.log("User has been logged out.");
    } catch (error) {
      console.error(error);
      // handle the error
    }
  };

  return <AuthContext.Provider value={{ user, login, logout, register }}>{children}</AuthContext.Provider>;
};
