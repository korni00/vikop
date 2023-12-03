"use client";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider, useSession } from "next-auth/react";
import React from "react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const SessionWrapper = () => {
    return <>{children}</>;
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <SessionWrapper />
      </SessionProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
