import React from "react";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="fixed right-4 bottom-4">
      <SwitchTheme className="pointer-events-auto" />
    </div>
  );
};
