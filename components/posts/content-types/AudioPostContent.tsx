"use client";

import React, { useState, useRef, useEffect } from "react";
import { PostContent } from "@/types/post";
import { Play, Pause, Volume2, Download } from "lucide-react";

interface AudioPostContentProps {
  content: PostContent;
}

const AudioPostContent: React.FC<AudioPostContentProps> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Audio Player */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <audio ref={audioRef} src={content.audioUrl} />

        {/* Player Controls */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Progress Bar */}
          <div className="flex-1 space-y-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-secondary">
              <span>{formatTime(currentTime)}</span>
              <span>{content.duration || formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume and Download */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-secondary hover:text-foreground transition-colors">
              <Volume2 size={20} />
            </button>
            <button className="p-2 text-text-secondary hover:text-foreground transition-colors">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Audio Info */}
        {content.audioDescription && (
          <div className="text-text-secondary text-sm leading-relaxed">
            {content.audioDescription}
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary);
          cursor: pointer;
          border: none;
        }
        .slider::-webkit-slider-track {
          height: 8px;
          background: var(--surface);
          border-radius: 4px;
        }
        .slider::-moz-range-track {
          height: 8px;
          background: var(--surface);
          border-radius: 4px;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default AudioPostContent;
