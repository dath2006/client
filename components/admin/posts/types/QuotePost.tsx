"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import MarkdownEditor from "../MarkdownEditor";

// --- PROPS INTERFACE ---
interface QuotePostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// --- COMPONENT ---
const QuotePost: React.FC<QuotePostProps> = ({ content, onChange, errors }) => {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quote Text with Markdown */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}>
        <MarkdownEditor
          value={content.quote || ""}
          onChange={(value: string) => onChange("quote", value)}
          placeholder="Enter the quote text... You can use *italic* and **bold** formatting."
          height="h-32 sm:h-40"
          label="Quote Text *"
          error={errors?.quote}
          showToolbar={true}
        />
      </motion.div>

      {/* Source */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }}>
        <MarkdownEditor
          value={content.source || ""}
          onChange={(value: string) => onChange("source", value)}
          placeholder="Add the source of the quote or your own thoughts about it. Why does it resonate with you?"
          height="h-24 sm:h-32"
          label="Source / Commentary"
          showToolbar={true}
        />
      </motion.div>
    </motion.div>
  );
};

export default QuotePost;
