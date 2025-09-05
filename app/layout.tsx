import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import ReduxProvider from "@/components/ReduxProvider";
import Navigation from "@/components/Navigation";
import "./globals.css";
import { AppInitializer } from "@/components/common/AppInitializer";

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
        <ReduxProvider>
          <AuthProvider>
            <Navigation />
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
