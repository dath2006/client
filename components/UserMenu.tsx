"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
          <User size={16} />
          <span className="text-sm font-medium">{session.user?.name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="px-3 py-1.5 rounded-full border border-primary/20 hover:bg-accent/20 transition-colors flex items-center gap-2"
        >
          <LogOut size={16} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    );
  }

  return null;
}
