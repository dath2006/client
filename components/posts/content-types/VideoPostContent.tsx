"use client";

import React, { useRef, useState } from "react";
import { PostContent } from "@/types/post";
import { Play, Pause, Volume2, Maximize, Download } from "lucide-react";
import MarkdownContent from "@/components/common/MarkdownContent";

interface VideoPostContentProps {
  content: PostContent;
}

const VideoPostContent: React.FC<VideoPostContentProps> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!content.videoUrl) {
    return null;
  }

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div
        className="relative rounded-lg overflow-hidden bg-black group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={content.videoUrl}
          poster={content.videoThumbnail}
          className="w-full max-h-[600px] object-contain cursor-pointer"
          onClick={handleVideoClick}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Overlay Controls */}
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-16 h-16 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>

        {/* Control Bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={togglePlayPause}
              className="hover:text-primary transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div className="flex-1">{/* Video progress would go here */}</div>

            <button className="hover:text-primary transition-colors">
              <Volume2 size={20} />
            </button>
            <button className="hover:text-primary transition-colors">
              <Download size={20} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="hover:text-primary transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Description */}
      {(content.body || content.audioDescription) && (
        <div className="bg-card p-4 rounded-lg">
          <MarkdownContent
            content={content.body || content.audioDescription || ""}
            className="text-text-secondary text-sm leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};

export default VideoPostContent;
