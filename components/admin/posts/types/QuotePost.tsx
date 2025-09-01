"use client";

import React from "react";
import MarkdownEditor from "../MarkdownEditor";

interface QuotePostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

const QuotePost: React.FC<QuotePostProps> = ({ content, onChange, errors }) => {
  return (
    <div className="space-y-4">
      {/* Quote Text with Markdown */}
      <MarkdownEditor
        value={content.quote || ""}
        onChange={(value: string) => onChange("quote", value)}
        placeholder="Enter the quote text... You can use *italic* and **bold** formatting."
        height="h-32 sm:h-40"
        label="Quote Text *"
        error={errors?.quote}
        showToolbar={true}
      />

      {/* Quote Source Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Author/Source
          </label>
          <input
            type="text"
            value={content.author || ""}
            onChange={(e) => onChange("author", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="Who said this quote?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Context/Source
          </label>
          <input
            type="text"
            value={content.source || ""}
            onChange={(e) => onChange("source", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="Book, speech, interview, etc."
          />
        </div>
      </div>

      {/* Additional Source Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Date (Optional)
          </label>
          <input
            type="text"
            value={content.date || ""}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="When was this said?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Location (Optional)
          </label>
          <input
            type="text"
            value={content.location || ""}
            onChange={(e) => onChange("location", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
            placeholder="Where was this said?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
            Language (Optional)
          </label>
          <select
            value={content.language || ""}
            onChange={(e) => onChange("language", e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
          >
            <option value="">Select language</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
            <option value="zh">Chinese</option>
            <option value="ar">Arabic</option>
            <option value="hi">Hindi</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Source URL */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-1">
          Source URL (Optional)
        </label>
        <input
          type="url"
          value={content.sourceUrl || ""}
          onChange={(e) => onChange("sourceUrl", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400"
          placeholder="https://source.com (link to original source)"
        />
      </div>

      {/* Quote Category */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Quote Category
        </label>
        <select
          value={content.category || ""}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white"
        >
          <option value="">Select category</option>
          <option value="inspirational">Inspirational</option>
          <option value="motivational">Motivational</option>
          <option value="wisdom">Wisdom</option>
          <option value="funny">Funny</option>
          <option value="philosophical">Philosophical</option>
          <option value="historical">Historical</option>
          <option value="literary">Literary</option>
          <option value="scientific">Scientific</option>
          <option value="political">Political</option>
          <option value="religious">Religious</option>
          <option value="business">Business</option>
          <option value="life">Life</option>
          <option value="love">Love</option>
          <option value="success">Success</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Quote Style */}
      <div>
        <label className="block text-sm font-medium text-[#f7a5a5] mb-2">
          Display Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="quoteStyle"
              value="blockquote"
              checked={content.style === "blockquote" || !content.style}
              onChange={(e) => onChange("style", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Blockquote</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="quoteStyle"
              value="card"
              checked={content.style === "card"}
              onChange={(e) => onChange("style", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Card</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="quoteStyle"
              value="minimal"
              checked={content.style === "minimal"}
              onChange={(e) => onChange("style", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Minimal</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="quoteStyle"
              value="highlight"
              checked={content.style === "highlight"}
              onChange={(e) => onChange("style", e.target.value)}
              className="mr-2 text-[#f7a5a5]"
            />
            <span className="text-sm">Highlight</span>
          </label>
        </div>
      </div>

      {/* Translation */}
      {content.language && content.language !== "en" && (
        <MarkdownEditor
          value={content.translation || ""}
          onChange={(value: string) => onChange("translation", value)}
          placeholder="English translation of the quote (optional)..."
          height="h-20 sm:h-24"
          label="English Translation (Optional)"
          showToolbar={false}
        />
      )}

      {/* Personal Commentary */}
      <MarkdownEditor
        value={content.commentary || ""}
        onChange={(value: string) => onChange("commentary", value)}
        placeholder="Add your thoughts about this quote. Why does it resonate with you? What does it mean to you?"
        height="h-24 sm:h-32"
        label="Personal Commentary (Optional)"
        showToolbar={true}
      />

      {/* Quote Options */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={content.showAuthor !== false}
            onChange={(e) => onChange("showAuthor", e.target.checked)}
            className="text-[#f7a5a5]"
          />
          <label className="text-sm text-[#f7a5a5]">
            Show author attribution
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={content.allowSharing !== false}
            onChange={(e) => onChange("allowSharing", e.target.checked)}
            className="text-[#f7a5a5]"
          />
          <label className="text-sm text-[#f7a5a5]">
            Allow social media sharing
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={content.featured || false}
            onChange={(e) => onChange("featured", e.target.checked)}
            className="text-[#f7a5a5]"
          />
          <label className="text-sm text-[#f7a5a5]">
            Feature this quote (highlight in quote collections)
          </label>
        </div>
      </div>

      {/* Quote Preview */}
      {content.quote && (
        <div className="mt-6 p-4 bg-white/5 border-l-4 border-[#f7a5a5] rounded-r-lg">
          <h4 className="text-sm font-medium text-[#f7a5a5] mb-2">Preview</h4>
          <blockquote className="text-white/90 italic text-lg leading-relaxed">
            "{content.quote}"
          </blockquote>
          {(content.author || content.source) && (
            <cite className="block text-[#f7a5a5] mt-3 text-sm">
              — {content.author}
              {content.source && content.author && ", "}
              {content.source}
              {content.date && ` (${content.date})`}
            </cite>
          )}
        </div>
      )}
    </div>
  );
};

export default QuotePost;
