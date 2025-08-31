"use client";

import { PenTool, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="pt-32 pb-16 text-center max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-3 mb-6">
        <PenTool size={32} className="text-primary" />
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Chyrp Lite
        </h1>
        <Sparkles size={32} className="text-secondary" />
      </div>
      <p className="text-xl text-secondary mb-8 max-w-2xl mx-auto">
        A modern, elegant blogging platform designed for creators who value
        simplicity and style. Share your thoughts with the world.
      </p>
      <div className="flex items-center justify-center gap-4">
        <a
          href="/admin"
          className="btn-primary px-8 py-3 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <PenTool size={20} />
          Start Writing
        </a>
        <a
          href="#posts"
          className="btn-outline px-8 py-3 text-lg font-medium rounded-full transition-all duration-300"
        >
          Explore Posts
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
