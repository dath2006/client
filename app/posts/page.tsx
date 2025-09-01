"use client";
import React, { useState, useEffect, useRef } from "react";

// SVG Icon Components
const BoldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-bold"
  >
    <path d="M14 12a4 4 0 0 0 0-8H6v8" />
    <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
  </svg>
);
const ItalicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-italic"
  >
    <line x1="19" x2="10" y1="4" y2="4" />
    <line x1="14" x2="5" y1="20" y2="20" />
    <line x1="15" x2="9" y1="4" y2="20" />
  </svg>
);
const UnderlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-underline"
  >
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" x2="20" y1="20" y2="20" />
  </svg>
);
const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-code"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-link"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
  </svg>
);
const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-list"
  >
    <line x1="8" x2="21" y1="6" y2="6" />
    <line x1="8" x2="21" y1="12" y2="12" />
    <line x1="8" x2="21" y1="18" y2="18" />
    <line x1="3" x2="3.01" y1="6" y2="6" />
    <line x1="3" x2="3.01" y1="12" y2="12" />
    <line x1="3" x2="3.01" y1="18" y2="18" />
  </svg>
);
const ListOrderedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-list-ordered"
  >
    <line x1="10" x2="21" y1="6" y2="6" />
    <line x1="10" x2="21" y1="12" y2="12" />
    <line x1="10" x2="21" y1="18" y2="18" />
    <path d="M4 6h1v4" />
    <path d="M4 10h2" />
    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </svg>
);
const UploadCloudIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-upload-cloud"
  >
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-eye"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const MarkdownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-markdown"
  >
    <path d="M9 12v-3h6v3M9 17h6M9 12H3L6 9l-3-3h6v6zM21 12h-6l-3 3 3 3h6v-6z" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-down"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-x"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
const Heading1Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-heading-1"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="m17 12 3-2v8" />
  </svg>
);
const Heading2Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-heading-2"
  >
    <path d="M4 12h8" />
    <path d="M4 18V6" />
    <path d="M12 18V6" />
    <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" />
  </svg>
);
const QuoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-quote"
  >
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21zm12 0c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);
const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-minus"
  >
    <path d="M5 12h14" />
  </svg>
);
const VideoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-video"
  >
    <path d="m22 8-6 4 6 4V8Z" />
    <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  </svg>
);
const MusicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-music"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

// Mock Data
const allCategories = {
  Tech: ["React", "JavaScript", "Tailwind CSS", "Vite", "Node.js"],
  Programming: ["Python", "TypeScript", "Go", "Rust", "DevOps", "Algorithms"],
  Science: ["Physics", "Biology", "Chemistry", "Astronomy", "Neuroscience"],
  Lifestyle: ["Skincare", "Beauty", "Travel", "Food", "Health"],
  Business: ["Startups", "Marketing", "Finance", "Productivity"],
};

const markdownCheatsheet = [
  { syntax: "# H1", description: "Largest heading." },
  { syntax: "## H2", description: "Second largest heading." },
  { syntax: "**Bold**", description: "Makes text bold." },
  { syntax: "*Italic*", description: "Makes text italic." },
  { syntax: "`Code`", description: "Formats text as inline code." },
  { syntax: "[Link](url)", description: "Creates a hyperlink." },
  { syntax: "> Quote", description: "Creates a blockquote." },
  { syntax: "* List item", description: "Creates a bullet point." },
  { syntax: "1. List item", description: "Creates a numbered list item." },
  { syntax: "---", description: "Creates a horizontal rule." },
];

// Simple Markdown to HTML renderer for preview
const renderMarkdown = (text: string) => {
  let html = text
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">$1</a>'
    )
    .replace(/^\s*[-*]\s(.*)/gm, "<ul><li>$1</li></ul>")
    .replace(/^\s*\d\.\s(.*)/gm, "<ol><li>$1</li></ol>")
    .replace(/<\/ul>\s*<ul>/g, "") // Merge consecutive lists
    .replace(/<\/ol>\s*<ol>/g, "") // Merge consecutive lists
    .replace(/\n/g, "<br />");
  return { __html: html };
};

export default function App() {
  const [feather, setFeather] = useState("Text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [category, setCategory] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isMarkdownHelpOpen, setIsMarkdownHelpOpen] = useState(false);
  const tagsRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const markdownHelpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWordCount(body.trim() === "" ? 0 : body.trim().split(/\s+/).length);
  }, [body]);

  useEffect(() => {
    if (category && allCategories[category as keyof typeof allCategories]) {
      setAvailableTags(allCategories[category as keyof typeof allCategories]);
      setSelectedTags([]);
    } else {
      setAvailableTags([]);
      setSelectedTags([]);
    }
  }, [category]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagsRef.current && !tagsRef.current.contains(event.target as Node)) {
        setIsTagsOpen(false);
      }
      if (
        markdownHelpRef.current &&
        !markdownHelpRef.current.contains(event.target as Node)
      ) {
        setIsMarkdownHelpOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFormat = (
    formatType:
      | "bold"
      | "italic"
      | "code"
      | "link"
      | "ul"
      | "ol"
      | "underline"
      | "h1"
      | "h2"
      | "quote"
      | "hr"
  ) => {
    const textarea = bodyRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    let newText;

    const formatting = {
      bold: { start: "**", end: "**" },
      italic: { start: "*", end: "*" },
      underline: { start: "<u>", end: "</u>" },
      code: { start: "`", end: "`" },
      link: { start: "[", end: "](url)" },
      ul: { start: "* ", end: "" },
      ol: { start: "1. ", end: "" },
      h1: { start: "# ", end: "" },
      h2: { start: "## ", end: "" },
      quote: { start: "> ", end: "" },
      hr: { start: "\n---\n", end: "" },
    };

    const { start: startChar, end: endChar } = formatting[formatType];

    if (["ul", "ol", "h1", "h2", "quote"].includes(formatType)) {
      const lines = body.substring(start, end).split("\n");
      const formattedLines = lines
        .map((line) => `${startChar}${line}`)
        .join("\n");
      newText = body.substring(0, start) + formattedLines + body.substring(end);
    } else if (formatType === "hr") {
      newText = body.substring(0, start) + startChar + body.substring(end);
    } else {
      newText = `${body.substring(
        0,
        start
      )}${startChar}${selectedText}${endChar}${body.substring(end)}`;
    }

    setBody(newText);

    setTimeout(() => {
      if (
        selectedText.length === 0 &&
        !["ul", "ol", "hr"].includes(formatType)
      ) {
        textarea.focus();
        textarea.setSelectionRange(
          start + startChar.length,
          start + startChar.length
        );
      }
    }, 0);
  };

  const handlePublish = () => {
    if (!title.trim() || !body.trim()) {
      setNotification({
        type: "error",
        message: "Title and Body cannot be empty.",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (feather === "Photo" && !photo) {
      setNotification({ type: "error", message: "Please upload a photo." });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (feather === "Video" && !video) {
      setNotification({ type: "error", message: "Please upload a video." });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    if (feather === "Audio" && !audio) {
      setNotification({
        type: "error",
        message: "Please upload an audio file.",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const postData = {
      title,
      body,
      feather,
      category,
      tags: selectedTags,
      photo,
      video,
      audio,
      createdAt: new Date().toISOString(),
    };

    console.log("Publishing Post:", postData);

    setNotification({
      type: "success",
      message: "Post published successfully!",
    });

    setTimeout(() => setNotification(null), 3000);
  };

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleNewTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      e.preventDefault();
      const newTagTrimmed = newTag.trim();
      if (
        !availableTags.includes(newTagTrimmed) &&
        !selectedTags.includes(newTagTrimmed)
      ) {
        setAvailableTags([...availableTags, newTagTrimmed]);
        setSelectedTags([...selectedTags, newTagTrimmed]);
      } else if (
        availableTags.includes(newTagTrimmed) &&
        !selectedTags.includes(newTagTrimmed)
      ) {
        setSelectedTags([...selectedTags, newTagTrimmed]);
      }
      setNewTag("");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };
  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudio(file);
      setAudioPreview(URL.createObjectURL(file));
    }
  };
  const removeAudio = () => {
    setAudio(null);
    setAudioPreview(null);
  };

  const renderFeatherFields = () => {
    switch (feather) {
      case "Photo":
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Photo
            </label>
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75"
                >
                  <XIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloudIcon />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            )}
          </div>
        );
      case "Video":
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Video
            </label>
            {videoPreview ? (
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75"
                >
                  <XIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="video-dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <VideoIcon />
                    <p className="mt-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">MP4, WEBM, OGG</p>
                  </div>
                  <input
                    id="video-dropzone-file"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoUpload}
                  />
                </label>
              </div>
            )}
          </div>
        );
      case "Audio":
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Audio
            </label>
            {audioPreview ? (
              <div className="relative">
                <audio
                  src={audioPreview}
                  controls
                  className="w-full rounded-lg"
                />
                <button
                  onClick={removeAudio}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75"
                >
                  <XIcon />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="audio-dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <MusicIcon />
                    <p className="mt-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">MP3, WAV, OGG</p>
                  </div>
                  <input
                    id="audio-dropzone-file"
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                  />
                </label>
              </div>
            )}
          </div>
        );
      case "Quote":
        return (
          <div className="mt-4">
            <label
              htmlFor="quote-source"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Quote Source
            </label>
            <input
              type="text"
              id="quote-source"
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Albert Einstein"
            />
          </div>
        );
      case "Link":
        return (
          <div className="mt-4">
            <label
              htmlFor="link-url"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              Link URL
            </label>
            <input
              type="url"
              id="link-url"
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen lg:h-screen lg:overflow-y-hidden text-white font-sans flex flex-col lg:flex-row p-4 sm:p-6 lg:p-8 gap-6 relative">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white ${
            notification.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Markdown Help Modal */}
      {isMarkdownHelpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div
            ref={markdownHelpRef}
            className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Markdown Cheatsheet</h2>
              <button
                onClick={() => setIsMarkdownHelpOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon />
              </button>
            </div>
            <ul className="space-y-3">
              {markdownCheatsheet.map((item) => (
                <li
                  key={item.syntax}
                  className="flex items-center justify-between p-2 bg-gray-900 rounded-md"
                >
                  <code className="text-sm text-cyan-400 bg-gray-700 px-2 py-1 rounded">
                    {item.syntax}
                  </code>
                  <span className="text-gray-400 text-sm">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:flex-[3] bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col lg:overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Write a new post</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <div className="border border-gray-600 rounded-lg flex-1 flex flex-col">
          <div className="flex items-center p-2 bg-gray-900 rounded-t-lg border-b border-gray-600 gap-2 flex-wrap">
            <button
              onClick={() => setIsMarkdownHelpOpen(true)}
              className="p-2 rounded hover:bg-gray-700"
            >
              <MarkdownIcon />
            </button>
            <div className="w-px h-5 bg-gray-600 mx-1"></div>
            <button
              onClick={() => handleFormat("h1")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <Heading1Icon />
            </button>
            <button
              onClick={() => handleFormat("h2")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <Heading2Icon />
            </button>
            <div className="w-px h-5 bg-gray-600 mx-1"></div>
            <button
              onClick={() => handleFormat("bold")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <BoldIcon />
            </button>
            <button
              onClick={() => handleFormat("italic")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <ItalicIcon />
            </button>
            <button
              onClick={() => handleFormat("underline")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <UnderlineIcon />
            </button>
            <button
              onClick={() => handleFormat("code")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <CodeIcon />
            </button>
            <button
              onClick={() => handleFormat("link")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <LinkIcon />
            </button>
            <div className="w-px h-5 bg-gray-600 mx-1"></div>
            <button
              onClick={() => handleFormat("quote")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <QuoteIcon />
            </button>
            <button
              onClick={() => handleFormat("ul")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <ListIcon />
            </button>
            <button
              onClick={() => handleFormat("ol")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <ListOrderedIcon />
            </button>
            <button
              onClick={() => handleFormat("hr")}
              className="p-2 rounded hover:bg-gray-700"
            >
              <MinusIcon />
            </button>
            <div className="w-px h-5 bg-gray-600 mx-1"></div>
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded ${
                isPreview ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <EyeIcon />
            </button>
          </div>
          {isPreview ? (
            <div
              className="w-full bg-gray-800 rounded-b-md p-4 flex-1 overflow-y-auto prose prose-invert max-w-none"
              dangerouslySetInnerHTML={renderMarkdown(body)}
            ></div>
          ) : (
            <textarea
              ref={bodyRef}
              placeholder="Body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-gray-800 rounded-b-md p-4 flex-1 resize-none focus:outline-none"
            ></textarea>
          )}
          <div className="text-right text-sm text-gray-400 p-2 border-t border-gray-600">
            Words: {wordCount}
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <aside className="lg:flex-1 bg-gray-800 p-6 rounded-lg shadow-lg h-fit lg:overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Post Settings</h2>

        <div className="mb-4">
          <label
            htmlFor="feather"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Feather
          </label>
          <select
            id="feather"
            value={feather}
            onChange={(e) => setFeather(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Text</option>
            <option>Photo</option>
            <option>Video</option>
            <option>Audio</option>
            <option>Quote</option>
            <option>Link</option>
          </select>
        </div>

        {renderFeatherFields()}

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category...</option>
            {Object.keys(allCategories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div ref={tagsRef} className="relative mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tags
          </label>
          <div
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 flex items-center justify-between cursor-pointer"
            onClick={() => setIsTagsOpen(!isTagsOpen)}
          >
            <span
              className={
                selectedTags.length > 0 ? "text-white" : "text-gray-500"
              }
            >
              {selectedTags.length > 0
                ? `${selectedTags.length} tags selected`
                : "Select tags..."}
            </span>
            <ChevronDownIcon />
          </div>
          {isTagsOpen && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-600 rounded-md shadow-lg">
              <div className="p-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleNewTagKeyDown}
                  placeholder="Add new tag..."
                  className="w-full bg-gray-800 border-b border-gray-600 p-2 text-white focus:outline-none"
                />
              </div>
              <ul className="max-h-40 overflow-y-auto p-2">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <li
                      key={tag}
                      className={`p-2 rounded-md cursor-pointer ${
                        selectedTags.includes(tag)
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-700"
                      }`}
                      onClick={() =>
                        selectedTags.includes(tag)
                          ? handleTagRemove(tag)
                          : handleTagSelect(tag)
                      }
                    >
                      {tag}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">
                    Select a category first.
                  </li>
                )}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="bg-blue-600/50 text-blue-100 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="hover:text-white"
                >
                  <XIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePublish}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Publish
        </button>
      </aside>
    </div>
  );
}
