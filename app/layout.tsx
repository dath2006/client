import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Home, Settings, Rss, LogIn, UserPlus } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chyrp Lite Reimagine",
  description: "A modern reimagining of the Chyrp Lite blogging platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-card/80 backdrop-blur-lg border border-primary/20 rounded-full px-6 py-3 flex items-center gap-6 shadow-lg">
          <div className="text-xl font-bold text-primary flex items-center gap-2">
            <Home size={20} />
            Chyrp Lite
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
            <a
              href="/login"
              className="px-4 py-1.5 rounded-full border border-primary/20 hover:bg-accent/20 transition-colors flex items-center gap-2"
            >
              <LogIn size={16} />
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-1.5 rounded-full bg-primary text-background hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <UserPlus size={16} />
              Sign up
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
