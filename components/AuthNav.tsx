"use client";

import { useSession } from "next-auth/react";
import { LogIn, UserPlus } from "lucide-react";
import UserMenu from "./UserMenu";

export default function AuthNav({
  allowRegistration,
  isMobile = false,
}: {
  allowRegistration: boolean;
  isMobile?: boolean;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={`flex items-center gap-4 ${isMobile ? "flex-col" : ""}`}>
        <div
          className={`${
            isMobile ? "w-full h-10" : "w-20 h-8"
          } bg-gray-200 rounded-full animate-pulse`}
        ></div>
        <div
          className={`${
            isMobile ? "w-full h-10" : "w-20 h-8"
          } bg-gray-200 rounded-full animate-pulse`}
        ></div>
      </div>
    );
  }

  if (session) {
    return <UserMenu isMobile={isMobile} />;
  }

  return (
    <div
      className={`flex items-center gap-2 ${isMobile ? "flex-col w-full" : ""}`}
    >
      <a
        href="/auth/signin"
        className={`${
          isMobile
            ? "w-full px-3 py-2 rounded-lg justify-center"
            : "px-4 py-1.5 rounded-full"
        } border border-primary/20 hover:bg-accent/20 transition-colors flex items-center gap-2`}
      >
        <LogIn size={16} />
        Sign In
      </a>
      {allowRegistration && (
        <a
          href="/auth/signup"
          className={`${
            isMobile
              ? "w-full px-3 py-2 rounded-lg justify-center"
              : "px-4 py-1.5 rounded-full"
          } bg-primary text-background hover:bg-secondary transition-colors flex items-center gap-2`}
        >
          <UserPlus size={16} />
          Sign Up
        </a>
      )}
    </div>
  );
}
