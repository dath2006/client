"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostContent } from "@/types/post";
import { Play, Pause, Volume2, Download, Volume1, VolumeX } from "lucide-react";

interface AudioPostContentProps {
  content: PostContent;
}

const AudioPostContent: React.FC<AudioPostContentProps> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  if (!content.audioUrl) {
    return null;
  }

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audio.volume = newVolume;
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6 space-y-4 shadow-lg shadow-black/10">
        <audio ref={audioRef} src={content.audioUrl} preload="metadata" />

        <div className="flex items-center gap-4">
          <motion.button
            onClick={togglePlayPause}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isPlaying ? "pause" : "play"}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <div className="flex-1 space-y-1">
            <div className="relative h-2 w-full group">
              {/* Custom Progress Bar */}
              <div className="absolute top-0 left-0 h-full w-full bg-surface rounded-full" />
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
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:scale-0 group-hover:[&::-webkit-slider-thumb]:scale-100 transition-transform
                           [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:scale-0 group-hover:[&::-moz-range-thumb]:scale-100 transition-transform"
              />
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>{formatTime(currentTime)}</span>
              <span>{content.duration || formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-text-secondary hover:text-foreground transition-colors"
              >
                <VolumeIcon size={20} />
              </motion.button>
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 80 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="ml-1 overflow-hidden"
                  >
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1.5 bg-surface rounded-lg appearance-none cursor-pointer
                                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                                [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Functional Download Button */}
            <motion.a
              href={content.audioUrl}
              download
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-text-secondary hover:text-foreground transition-colors"
              aria-label="Download audio"
            >
              <Download size={20} />
            </motion.a>
          </div>
        </div>

        {content.audioDescription && (
          <div className="text-text-secondary text-sm leading-relaxed border-t border-border pt-4">
            {content.audioDescription}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AudioPostContent;
