"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostContent } from "@/types/post";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Download,
} from "lucide-react";

interface VideoPostContentProps {
  content: PostContent;
}

const VideoPostContent: React.FC<VideoPostContentProps> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleDurationChange);
    video.volume = volume;

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleDurationChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      }
      if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    const container = containerRef.current;
    container?.addEventListener("keydown", handleKeyDown);
    return () => container?.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  if (!content.videoUrl) {
    return null;
  }

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = parseFloat(e.target.value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    video.volume = newVolume;
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden bg-black group aspect-video"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        tabIndex={0}
      >
        <video
          ref={videoRef}
          src={content.videoUrl}
          poster={content.videoThumbnail}
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlayPause}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <AnimatePresence>
          {(showControls || !isPlaying) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none"
            >
              <motion.button
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                exit={{ scale: 1.2 }}
                onClick={togglePlayPause}
                className="flex items-center justify-center w-16 h-16 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors pointer-events-auto"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isPlaying ? "pause" : "play"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    {isPlaying ? (
                      <Pause size={28} fill="currentColor" />
                    ) : (
                      <Play size={28} fill="currentColor" className="ml-1" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
            >
              <div className="flex flex-col gap-2">
                <div className="relative h-2 w-full group/progress">
                  <div className="absolute top-0 left-0 h-full w-full bg-white/20 rounded-full" />
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-primary rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute top-0 left-0 w-full h-full appearance-none cursor-pointer bg-transparent 
                                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:scale-0 group-hover/progress:[&::-webkit-slider-thumb]:scale-100 transition-transform"
                  />
                </div>
                <div className="flex items-center gap-4 text-white">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </motion.button>

                  <div className="text-xs font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>

                  <div className="flex-1"></div>

                  <div
                    className="flex items-center"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <VolumeIcon size={20} />
                    </motion.button>
                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 80, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          className="ml-2"
                        >
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer
                                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.a
                    href={content.videoUrl}
                    download
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Download size={20} />
                  </motion.a>
                  <motion.button
                    onClick={toggleFullscreen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Maximize size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FIX: Reverted to 'audioDescription' to match your PostContent type */}
      {content.audioDescription && (
        <div className="text-text-secondary text-sm leading-relaxed bg-card p-4 rounded-lg">
          {content.audioDescription}
        </div>
      )}
    </motion.div>
  );
};

export default VideoPostContent;
