"use client";

import { Home, Settings, Rss, Menu, X } from "lucide-react";
import { useState } from "react";
import AuthNav from "./AuthNav";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { useSession } from "next-auth/react";
import { useGlobalPermissions } from "@/hooks/useGlobalPermissions";

export default function Navigation() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { siteName, allowRegistration } = useGlobalSettings();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card/80 backdrop-blur-lg border border-primary/20 rounded-full px-6 py-3 items-center gap-6 shadow-lg">
        <div className="text-xl font-bold text-primary flex items-center gap-2">
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
            {session?.user?.role === "admin" ? "Admin" : "Dashboard"}
          </a>

          <a
            href="/feed"
            className="text-primary hover:text-secondary transition-colors font-medium px-3 py-1.5 rounded-full hover:bg-primary/10 flex items-center gap-2"
          >
            <Rss size={16} />
            Feed
          </a>
          <AuthNav allowRegistration={allowRegistration} />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-2 left-2 right-2 z-50 bg-card/90 backdrop-blur-lg border border-primary/20 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-lg font-bold text-primary flex items-center gap-2">
            <Home size={18} />
            <span className="truncate max-w-[120px]">{siteName}</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-primary hover:text-secondary transition-colors p-2 rounded-lg hover:bg-primary/10"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Items */}
        {isMobileMenuOpen && (
          <div className="border-t border-primary/20 px-4 py-3 space-y-2">
            <a
              href="/"
              className="text-primary hover:text-secondary transition-colors font-medium px-3 py-2 rounded-lg hover:bg-primary/10 flex items-center gap-3 w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              Home
            </a>
            {session?.user?.role === "admin" && (
              <a
                href="/admin"
                className="text-primary hover:text-secondary transition-colors font-medium px-3 py-2 rounded-lg hover:bg-primary/10 flex items-center gap-3 w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings size={18} />
                Admin
              </a>
            )}
            <a
              href="/feed"
              className="text-primary hover:text-secondary transition-colors font-medium px-3 py-2 rounded-lg hover:bg-primary/10 flex items-center gap-3 w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Rss size={18} />
              Feed
            </a>
            <div className="pt-2 border-t border-primary/20">
              <AuthNav allowRegistration={allowRegistration} isMobile={true} />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
