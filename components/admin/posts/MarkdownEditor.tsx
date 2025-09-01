"use client";

import React, { useState } from "react";
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  Image,
  Quote,
  Table,
  Eye,
  EyeOff,
  HelpCircle,
  X,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  label?: string;
  error?: string;
  showToolbar?: boolean;
}

const MARKDOWN_BUTTONS = [
  { icon: Bold, label: "Bold", syntax: "**text**", example: "**bold text**" },
  { icon: Italic, label: "Italic", syntax: "*text*", example: "*italic text*" },
  { icon: Code, label: "Inline Code", syntax: "`code`", example: "`inline code`" },
  { icon: Heading1, label: "Heading 1", syntax: "# ", example: "# Heading 1" },
  { icon: Heading2, label: "Heading 2", syntax: "## ", example: "## Heading 2" },
  { icon: Heading3, label: "Heading 3", syntax: "### ", example: "### Heading 3" },
  { icon: List, label: "Bullet List", syntax: "- ", example: "- List item" },
  { icon: ListOrdered, label: "Numbered List", syntax: "1. ", example: "1. Numbered item" },
  { icon: Link2, label: "Link", syntax: "[text](url)", example: "[Link text](https://example.com)" },
  { icon: Image, label: "Image", syntax: "![alt](url)", example: "![Alt text](https://example.com/image.jpg)" },
  { icon: Quote, label: "Quote", syntax: "> ", example: "> This is a quote" },
  { icon: Table, label: "Table", syntax: "| Col1 | Col2 |\n|------|------|\n| Cell | Cell |", example: "| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |" },
  { icon: Code, label: "Code Block", syntax: "```\ncode\n```", example: "```javascript\nconsole.log('Hello World');\n```" },
];

const MARKDOWN_HELP = [
  { title: "Headers", syntax: "# H1\n## H2\n### H3", description: "Create headers of different sizes" },
  { title: "Emphasis", syntax: "**bold** and *italic*", description: "Make text bold or italic" },
  { title: "Lists", syntax: "- Item 1\n- Item 2\n\n1. First\n2. Second", description: "Create bulleted or numbered lists" },
  { title: "Links", syntax: "[Link text](https://example.com)", description: "Create clickable links" },
  { title: "Images", syntax: "![Alt text](image-url)", description: "Embed images" },
  { title: "Code", syntax: "`inline code` or\n```\ncode block\n```", description: "Format code inline or in blocks" },
  { title: "Quotes", syntax: "> This is a quote", description: "Create blockquotes" },
  { title: "Tables", syntax: "| Header | Header |\n|--------|--------|\n| Cell   | Cell   |", description: "Create tables" },
  { title: "Line Break", syntax: "Line 1  \nLine 2", description: "Two spaces at end of line for break" },
  { title: "Horizontal Rule", syntax: "---", description: "Create a horizontal line" },
];

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your markdown here...",
  height = "h-64",
  label,
  error,
  showToolbar = true,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  const handleMarkdownInsert = (syntax: string) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const selectedText = textareaRef.value.substring(start, end);
    const before = textareaRef.value.substring(0, start);
    const after = textareaRef.value.substring(end);

    let newText = syntax;
    if (syntax.includes("text")) {
      newText = syntax.replace("text", selectedText || "text");
    } else if (syntax.includes("url")) {
      newText = syntax
        .replace("text", selectedText || "link text")
        .replace("url", "https://");
    } else if (syntax.includes("alt")) {
      newText = syntax
        .replace("alt", "Alt text")
        .replace("url", "https://");
    } else {
      newText = syntax + selectedText;
    }

    const newValue = before + newText + after;
    onChange(newValue);

    // Set cursor position
    setTimeout(() => {
      textareaRef.focus();
      if (syntax.includes("text") || syntax.includes("url")) {
        textareaRef.setSelectionRange(start, start + newText.length);
      } else {
        textareaRef.setSelectionRange(start + newText.length, start + newText.length);
      }
    }, 0);
  };

  const renderMarkdownPreview = (markdown: string) => {
    // Simple markdown to HTML conversion
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-white mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Inline code
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[#f7a5a5] font-mono text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#f7a5a5] underline hover:text-[#f7a5a5]/80" target="_blank" rel="noopener noreferrer">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />')
      // Lists
      .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      // Quotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-[#f7a5a5] pl-4 italic text-white/80 my-2">$1</blockquote>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre class="bg-white/5 p-4 rounded-lg overflow-x-auto my-2"><code class="text-sm font-mono text-white">$2</code></pre>')
      // Line breaks
      .replace(/\n/g, '<br>');

    // Wrap list items in ul/ol
    html = html.replace(/(<li class="ml-4 list-disc">.*<\/li>)/g, '<ul class="my-2">$1</ul>');
    html = html.replace(/(<li class="ml-4 list-decimal">.*<\/li>)/g, '<ol class="my-2">$1</ol>');

    return html;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#f7a5a5]">
          {label}
        </label>
      )}
      
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-white/5 rounded-lg border border-[#f7a5a5]/20">
          <span className="text-xs text-[#f7a5a5]/70 mr-2 hidden sm:block">Format:</span>
          
          {/* Toolbar buttons - responsive grid */}
          <div className="flex flex-wrap gap-1">
            {MARKDOWN_BUTTONS.slice(0, 8).map(({ icon: Icon, label, syntax }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleMarkdownInsert(syntax)}
                className="p-1.5 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded transition-colors"
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          {/* More tools dropdown for mobile */}
          <div className="hidden sm:flex gap-1">
            {MARKDOWN_BUTTONS.slice(8).map(({ icon: Icon, label, syntax }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleMarkdownInsert(syntax)}
                className="p-1.5 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded transition-colors"
                title={label}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>

          {/* Preview and Help buttons */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`p-1.5 rounded transition-colors ${
                showPreview
                  ? "text-[#f7a5a5] bg-[#f7a5a5]/20"
                  : "text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10"
              }`}
              title={showPreview ? "Hide Preview" : "Show Preview"}
            >
              {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="p-1.5 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded transition-colors"
              title="Markdown Help"
            >
              <HelpCircle size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Editor/Preview Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        {!showPreview || window.innerWidth >= 1024 ? (
          <div className={showPreview && window.innerWidth >= 1024 ? "" : "lg:col-span-2"}>
            <textarea
              ref={setTextareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full ${height} px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 font-mono text-sm resize-none`}
              placeholder={placeholder}
            />
          </div>
        ) : null}

        {/* Preview */}
        {showPreview && (
          <div className={`${height} p-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg overflow-y-auto prose prose-invert max-w-none`}>
            {value ? (
              <div
                className="text-white/90 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownPreview(value),
                }}
              />
            ) : (
              <p className="text-gray-400 text-sm">Preview will appear here...</p>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[#f7a5a5]/20">
              <h3 className="text-lg font-semibold text-[#f7a5a5]">Markdown Guide</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-4">
                {MARKDOWN_HELP.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-[#f7a5a5]">{item.title}</h4>
                    <p className="text-sm text-white/70">{item.description}</p>
                    <div className="bg-white/5 p-3 rounded border border-[#f7a5a5]/20">
                      <code className="text-sm font-mono text-white whitespace-pre-line">
                        {item.syntax}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
