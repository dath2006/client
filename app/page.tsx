"use client";

import HeroSection from "../components/home/HeroSection";
import SearchSection from "../components/home/SearchSection";
import PostGrid from "../components/home/PostGrid";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <HeroSection />

        <PostGrid />
      </div>
      <Footer />
    </main>
  );
}
