import React from "react";
import Header from "./header";
import Navbar from "./navbar";

interface LayoutProps {
  content: React.ReactNode;
  layoutNotFound?: boolean;
  layout?: boolean;
  skeleton?: React.ReactNode;
  error?: string;
}

const Layout = ({
  content,
  layoutNotFound,
  layout,
  skeleton,
  error,
}: LayoutProps) => {
  return (
    <main className="mx-auto flex max-w-7xl flex-col bg-background">
      <Header />
      <div className="flex max-h-[calc(100vh-52px)] w-full">
        <Navbar />
        <div className="flex w-full flex-col overflow-auto">
          {layout === undefined && !layoutNotFound ? (
            <>{skeleton}</>
          ) : layoutNotFound ? (
            <div className="flex h-[calc(100vh-60px)] w-full items-center justify-center">
              <p className="text-xl font-semibold">{error ?? "404"}</p>
            </div>
          ) : (
            <div className="h-screen overflow-auto">{content}</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Layout;
