"use client";

import React from "react";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";

export default function SocialLinks() {
  const { socialLinks, loading } = useGlobalSettings();

  if (loading) {
    return (
      <div className="flex space-x-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 h-6 w-6 rounded"
          ></div>
        ))}
      </div>
    );
  }

  const links = Object.entries(socialLinks).filter(([_, url]) => url);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex space-x-4">
      {links.map(([platform, url]) => (
        <a
          key={platform}
          href={url as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 capitalize"
        >
          {platform}
        </a>
      ))}
    </div>
  );
}
