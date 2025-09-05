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

      {/* Source */}
      <MarkdownEditor
        value={content.source || ""}
        onChange={(value: string) => onChange("source", value)}
        placeholder="Add your thoughts about this quote. Why does it resonate with you? What does it mean to you?"
        height="h-24 sm:h-32"
        label="Source"
        showToolbar={true}
      />
    </div>
  );
};

export default QuotePost;
