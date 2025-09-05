"use client";

import React from "react";
import MarkdownEditor from "../MarkdownEditor";

interface AudioPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

const AudioPost: React.FC<AudioPostProps> = ({ content, onChange, errors }) => {
  return (
    <div className="space-y-4">
      {/* Audio File Upload */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Audio File *
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => onChange("audioFile", e.target.files?.[0])}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        {errors?.audioFile && (
          <p className="text-red-400 text-xs mt-1">{errors.audioFile}</p>
        )}
      </div>

      {/* Caption/Transcript File */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Transcript File (Optional)
        </label>
        <input
          type="file"
          accept=".vtt,.srt,.ass,.txt"
          onChange={(e) => onChange("captionFile", e.target.files?.[0])}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#f7a5a5] file:text-white file:cursor-pointer hover:file:bg-[#f7a5a5]/90 file:transition-colors"
        />
        <p className="text-xs text-white/60 mt-1">
          Supported formats: VTT, SRT, ASS, TXT
        </p>
      </div>

      {/* Description with Markdown */}
      <MarkdownEditor
        value={content.description || ""}
        onChange={(value: string) => onChange("description", value)}
        placeholder="Describe your audio content, show notes, or episode summary..."
        height="h-32 sm:h-40"
        label="Description"
        showToolbar={true}
      />
    </div>
  );
};

export default AudioPost;
