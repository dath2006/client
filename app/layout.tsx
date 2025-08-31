import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-background/70 backdrop-blur-lg border border-primary/10 rounded-full px-6 py-3 flex items-center gap-6 shadow-lg">
          <a
            href="/"
            className="text-primary hover:text-secondary transition-colors font-medium"
          >
            Home
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="px-4 py-1.5 rounded-full border border-primary/20 hover:bg-accent/20 transition-colors"
            >
              Login
            </a>
            <a
              href="/signup"
              className="px-4 py-1.5 rounded-full bg-primary text-background hover:bg-secondary transition-colors"
            >
              Sign up
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
