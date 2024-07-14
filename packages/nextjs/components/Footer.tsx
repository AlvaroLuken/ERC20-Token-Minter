import React from "react";
//import { useTheme } from "next-themes";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  //const { resolvedTheme } = useTheme();

  // const isDarkMode = resolvedTheme === "dark";

  return (
    <div className="fixed right-4 bottom-4">
      <SwitchTheme className="pointer-events-auto" />
    </div>
  );
};
