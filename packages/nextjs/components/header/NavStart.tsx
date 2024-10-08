"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeaderMenuLinks } from "./HeaderMenuLinks";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

export const NavStart = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="navbar-start w-auto lg:w-1/2">
      <div className="lg:hidden dropdown" ref={burgerMenuRef}>
        <label
          tabIndex={0}
          className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
          onClick={() => {
            setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
          }}
        >
          <Bars3Icon className="h-1/2" />
        </label>
        {isDrawerOpen && (
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            onClick={() => {
              setIsDrawerOpen(false);
            }}
          >
            <HeaderMenuLinks />
          </ul>
        )}
      </div>
      <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
        <div className="flex relative w-10 h-10">
          <Image alt="SE2 logo" className="cursor-pointer" fill src="/circle_icon.png" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold leading-tight">Circle Hackathon 2024</span>
          <span className="text-xs">Building with open money</span>
        </div>
      </Link>
      <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
        <HeaderMenuLinks />
      </ul>
    </div>
  );
};
