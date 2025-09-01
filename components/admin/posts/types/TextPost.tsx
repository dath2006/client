"use client";

import React from "react";
import MarkdownEditor from "../MarkdownEditor";

interface TextPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

const TextPost: React.FC<TextPostProps> = ({ content, onChange, errors }) => {
  return (
    <div className="space-y-4">
      <MarkdownEditor
        value={content.body || ""}
        onChange={(value: string) => onChange("body", value)}
        placeholder="Write your post content in Markdown..."
        height="h-64 sm:h-80"
        label="Content *"
        error={errors?.body}
        showToolbar={true}
      />
    </div>
  );
};

export default TextPost;
