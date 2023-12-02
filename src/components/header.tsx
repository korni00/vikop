"use client";
import { useSession } from "next-auth/react";
import { renderAuthButton } from "@/hooks/use-auth-button";

const Header = () => {
  const { status } = useSession();

  return (
    <>
      <header className="sticky top-0 z-50 flex w-full justify-between bg-card/50  px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2 text-3xl font-bold">
          TestName
        </div>
        <span className="flex items-center gap-2">
          <span className="relative">{renderAuthButton(status)}</span>
        </span>
      </header>
    </>
  );
};

export default Header;
