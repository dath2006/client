"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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

// --- PROPS INTERFACE ---
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  label?: string;
  error?: string;
  showToolbar?: boolean;
}

// --- CONSTANTS (Moved outside component) ---
const MARKDOWN_BUTTONS = [
  { icon: Bold, label: "Bold", syntax: "**text**" },
  { icon: Italic, label: "Italic", syntax: "*text*" },
  { icon: Code, label: "Inline Code", syntax: "`code`" },
  { icon: Heading1, label: "H1", syntax: "# " },
  { icon: Heading2, label: "H2", syntax: "## " },
  { icon: Heading3, label: "H3", syntax: "### " },
  { icon: List, label: "List", syntax: "- " },
  { icon: ListOrdered, label: "Ordered List", syntax: "1. " },
  { icon: Link2, label: "Link", syntax: "[text](url)" },
  { icon: Image, label: "Image", syntax: "![alt](url)" },
  { icon: Quote, label: "Quote", syntax: "> " },
  {
    icon: Table,
    label: "Table",
    syntax: "| Col1 | Col2 |\n|------|------|\n| Cell | Cell |",
  },
  { icon: Code, label: "Code Block", syntax: "```\ncode\n```" },
];

const MARKDOWN_HELP = [
  {
    title: "Headers",
    syntax: "# H1\n## H2\n### H3",
    description: "Create headers of different sizes",
  },
  {
    title: "Emphasis",
    syntax: "**bold** and *italic*",
    description: "Make text bold or italic",
  },
  {
    title: "Lists",
    syntax: "- Item 1\n- Item 2\n\n1. First\n2. Second",
    description: "Create bulleted or numbered lists",
  },
  {
    title: "Links",
    syntax: "[Link text](https://example.com)",
    description: "Create clickable links",
  },
  {
    title: "Images",
    syntax: "![Alt text](image-url)",
    description: "Embed images",
  },
  {
    title: "Code",
    syntax: "`inline code` or\n```\ncode block\n```",
    description: "Format code inline or in blocks",
  },
  {
    title: "Quotes",
    syntax: "> This is a quote",
    description: "Create blockquotes",
  },
  {
    title: "Tables",
    syntax: "| Header | Header |\n|--------|--------|\n| Cell   | Cell   |",
    description: "Create tables",
  },
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};
const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const modalPanelVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// --- COMPONENT ---
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write something amazing...",
  height = "h-64",
  label,
  error,
  showToolbar = true,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMarkdownInsert = (syntax: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.substring(start, end);
    let newText = syntax;
    if (syntax.includes("text")) {
      newText = syntax.replace("text", selected || "text");
    } else if (syntax.includes("url")) {
      newText = syntax
        .replace("text", selected || "link text")
        .replace("url", "https://");
    } else if (syntax.includes("alt")) {
      newText = syntax
        .replace("alt", selected || "alt text")
        .replace("url", "https://");
    } else {
      newText = syntax + selected;
    }
    onChange(ta.value.substring(0, start) + newText + ta.value.substring(end));
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + newText.length;
    }, 0);
  };

  const renderMarkdownPreview = (markdown: string) => {
    // A more robust regex-based markdown parser
    let html = ` ${markdown} `.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html
      .replace(/(\r\n|\n)/g, "<br>")
      .replace(/<br><br>/g, "</p><p>")
      .replace(
        /`{3}([\s\S]+?)`{3}/g,
        (_, p1) =>
          `<pre class="bg-white/5 p-4 rounded-lg my-2"><code class="text-sm font-mono text-white">${p1.replace(
            /<br>/g,
            "\n"
          )}</code></pre>`
      )
      .replace(
        /`(.*?)`/g,
        '<code class="bg-white/10 px-1 py-0.5 rounded text-[#f7a5a5] font-mono text-sm">$1</code>'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-[#f7a5a5] underline hover:text-[#f7a5a5]/80" target="_blank" rel="noopener noreferrer">$1</a>'
      )
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />'
      )
      .replace(/<br># (.*?)<br>/g, "<h1>$1</h1>")
      .replace(/<br>## (.*?)<br>/g, "<h2>$1</h2>")
      .replace(/<br>### (.*?)<br>/g, "<h3>$1</h3>")
      .replace(/<br>\* (.*?)<br>/g, "<ul><li>$1</li></ul>")
      .replace(/<\/ul><br><ul>/g, "")
      .replace(/<br>> (.*?)<br>/g, "<blockquote>$1</blockquote>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    return `<p>${html}</p>`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-[#f7a5a5]">
          {label}
        </label>
      )}
      {showToolbar && (
        <motion.div
          className="flex flex-wrap items-center gap-1 p-2 bg-white/5 rounded-lg border border-[#f7a5a5]/20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {MARKDOWN_BUTTONS.map(({ icon: Icon, label, syntax }) => (
            <motion.button
              key={label}
              type="button"
              onClick={() => handleMarkdownInsert(syntax)}
              title={label}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded transition-colors"
            >
              <Icon size={14} />
            </motion.button>
          ))}
          <div className="flex items-center gap-1 ml-auto">
            <motion.button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? "Hide" : "Show Preview"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-1.5 rounded transition-colors ${
                showPreview
                  ? "text-[#f7a5a5] bg-[#f7a5a5]/20"
                  : "text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10"
              }`}
            >
              <AnimatePresence mode="wait">
                {showPreview ? (
                  <motion.div
                    key="off"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <EyeOff size={14} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="on"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Eye size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowHelp(true)}
              title="Markdown Help"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded transition-colors"
            >
              <HelpCircle size={14} />
            </motion.button>
          </div>
        </motion.div>
      )}

      <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(!showPreview || isDesktop) && (
          <motion.div
            layout
            className={showPreview && isDesktop ? "" : "lg:col-span-2"}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full ${height} px-3 py-2 bg-white/5 border border-[#f7a5a5]/20 rounded-lg focus:outline-none focus:border-[#f7a5a5]/50 text-white placeholder-gray-400 font-mono text-sm resize-y`}
              placeholder={placeholder}
            />
          </motion.div>
        )}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`${height} p-3 bg-white/5 border border-[#f7a5a5]/20 rounded-lg overflow-y-auto prose prose-invert max-w-none prose-headings:text-white prose-a:text-[#f7a5a5] prose-strong:text-white`}
            >
              {value ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownPreview(value),
                  }}
                />
              ) : (
                <p className="text-gray-400">Preview will appear here...</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              className="bg-gray-900 border border-[#f7a5a5]/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              variants={modalPanelVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-[#f7a5a5]/20">
                <h3 className="text-lg font-semibold text-[#f7a5a5]">
                  Markdown Guide
                </h3>
                <motion.button
                  onClick={() => setShowHelp(false)}
                  className="p-1 text-[#f7a5a5]/70 hover:text-[#f7a5a5] hover:bg-[#f7a5a5]/10 rounded"
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
              <motion.div
                className="p-6 overflow-y-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="grid gap-6">
                  {MARKDOWN_HELP.map((item, index) => (
                    <motion.div
                      key={index}
                      className="space-y-2"
                      variants={itemVariants}
                    >
                      <h4 className="font-medium text-[#f7a5a5]">
                        {item.title}
                      </h4>
                      <p className="text-sm text-white/70">
                        {item.description}
                      </p>
                      <div className="bg-white/5 p-3 rounded border border-[#f7a5a5]/20">
                        <code className="text-sm font-mono text-white whitespace-pre-wrap">
                          {item.syntax}
                        </code>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MarkdownEditor;
