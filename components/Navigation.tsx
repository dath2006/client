"use client";

import { Home, Settings, Rss } from "lucide-react";
import AuthNav from "./AuthNav";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function Navigation() {
  const { siteName } = useGlobalSettings();
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card/80 backdrop-blur-lg border border-primary/20 rounded-full px-6 py-3 flex items-center gap-6 shadow-lg">
      <div className="text-xl font-bold text-primary flex items-center gap-2">
        <Home size={20} />
        {siteName}
      </div>
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="text-primary hover:text-secondary transition-colors font-medium px-3 py-1.5 rounded-full hover:bg-primary/10 flex items-center gap-2"
        >
          <Home size={16} />
          Home
        </a>
        <a
          href="/admin"
          className="text-primary hover:text-secondary transition-colors font-medium px-3 py-1.5 rounded-full hover:bg-primary/10 flex items-center gap-2"
        >
          <Settings size={16} />
          Admin
        </a>
        <a
          href="/feed"
          className="text-primary hover:text-secondary transition-colors font-medium px-3 py-1.5 rounded-full hover:bg-primary/10 flex items-center gap-2"
        >
          <Rss size={16} />
          Feed
        </a>
        <AuthNav />
      </div>
    </nav>
  );
}
