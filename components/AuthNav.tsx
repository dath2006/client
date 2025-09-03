"use client";

import { useSession } from "next-auth/react";
import { LogIn, UserPlus } from "lucide-react";
import UserMenu from "./UserMenu";

export default function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (session) {
    return <UserMenu />;
  }

  return (
    <>
      <a
        href="/auth/signin"
        className="px-4 py-1.5 rounded-full border border-primary/20 hover:bg-accent/20 transition-colors flex items-center gap-2"
      >
        <LogIn size={16} />
        Sign In
      </a>
      <a
        href="/auth/signup"
        className="px-4 py-1.5 rounded-full bg-primary text-background hover:bg-secondary transition-colors flex items-center gap-2"
      >
        <UserPlus size={16} />
        Sign Up
      </a>
    </>
  );
}
