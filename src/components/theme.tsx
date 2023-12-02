"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSwitch() {
  const { setTheme, theme } = useTheme();

  return (
    <>
      {theme === "light" ? (
        <Button
          variant="link"
          className="flex gap-2"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon />
          Dark
        </Button>
      ) : (
        <Button
          variant="link"
          className=" flex gap-2"
          onClick={() => setTheme("light")}
        >
          <SunIcon />
          Light
        </Button>
      )}
    </>
  );
}
