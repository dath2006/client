"use client";

import React from "react";
import MarkdownEditor from "../MarkdownEditor";

interface VideoPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

const VideoPost: React.FC<VideoPostProps> = ({ content, onChange, errors }) => {
  return (
    <div className="space-y-4">
      {/* Video Source Type */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Video Source
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="videoSource"
              value="upload"
              checked={content.sourceType !== "url"}
              onChange={() => onChange("sourceType", "upload")}
              className="mr-2 text-[#f7a5a5]"
            />
            Upload File
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="videoSource"
              value="url"
              checked={content.sourceType === "url"}
              onChange={() => onChange("sourceType", "url")}
              className="mr-2 text-[#f7a5a5]"
            />
            Video URL
          </label>
        </div>
      </div>

      {/* Video Upload or URL */}
      {content.sourceType === "url" ? (
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Video URL *
          </label>
          <input
            type="url"
            value={content.videoUrl || ""}
            onChange={(e) => onChange("videoUrl", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="https://example.com/video.mp4 or YouTube/Vimeo URL"
          />
          {errors?.videoUrl && (
            <p className="text-red-400 text-xs mt-1">{errors.videoUrl}</p>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Video File *
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => onChange("videoFile", e.target.files?.[0])}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
          />
          {errors?.videoFile && (
            <p className="text-red-400 text-xs mt-1">{errors.videoFile}</p>
          )}
        </div>
      )}

      {/* Poster Image */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Thumbnail/Poster Image (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange("posterImage", e.target.files?.[0])}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
      </div>

      {/* Caption/Subtitle Files */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Subtitle Files (Optional)
        </label>
        <input
          type="file"
          accept=".vtt,.srt,.ass"
          multiple
          onChange={(e) =>
            onChange("captionFiles", Array.from(e.target.files || []))
          }
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        <p className="text-xs text-white/60 mt-1">
          Multiple subtitle files supported (VTT, SRT, ASS)
        </p>
      </div>

      {/* Video Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Duration (Optional)
          </label>
          <input
            type="text"
            value={content.duration || ""}
            onChange={(e) => onChange("duration", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="e.g., 5:30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Resolution (Optional)
          </label>
          <select
            value={content.resolution || ""}
            onChange={(e) => onChange("resolution", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
          >
            <option value="">Select resolution</option>
            <option value="720p">720p HD</option>
            <option value="1080p">1080p Full HD</option>
            <option value="1440p">1440p QHD</option>
            <option value="2160p">2160p 4K UHD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Frame Rate (Optional)
          </label>
          <select
            value={content.frameRate || ""}
            onChange={(e) => onChange("frameRate", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
          >
            <option value="">Select frame rate</option>
            <option value="24">24 fps</option>
            <option value="30">30 fps</option>
            <option value="60">60 fps</option>
          </select>
        </div>
      </div>

      {/* Description with Markdown */}
      <MarkdownEditor
        value={content.description || ""}
        onChange={(value: string) => onChange("description", value)}
        placeholder="Describe your video content, include chapters, or additional information..."
        height="h-32 sm:h-40"
        label="Description"
        showToolbar={true}
      />

      {/* Video Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={content.autoplay || false}
              onChange={(e) => onChange("autoplay", e.target.checked)}
              className="text-[#f7a5a5]"
            />
            <span className="text-sm text-[#f7a5a5]">Autoplay</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={content.loop || false}
              onChange={(e) => onChange("loop", e.target.checked)}
              className="text-[#f7a5a5]"
            />
            <span className="text-sm text-[#f7a5a5]">Loop</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={content.muted || false}
              onChange={(e) => onChange("muted", e.target.checked)}
              className="text-[#f7a5a5]"
            />
            <span className="text-sm text-[#f7a5a5]">Muted by default</span>
          </label>
        </div>
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={content.controls !== false}
              onChange={(e) => onChange("controls", e.target.checked)}
              className="text-[#f7a5a5]"
            />
            <span className="text-sm text-[#f7a5a5]">Show controls</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VideoPost;
