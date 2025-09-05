"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import MarkdownEditor from "../MarkdownEditor";

// --- PROPS INTERFACE ---
interface TextPostProps {
  content: any;
  onChange: (field: string, value: any) => void;
  errors?: any;
}

// --- FRAMER MOTION VARIANTS ---
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, delay: 0.1 },
  },
};

// --- COMPONENT ---
const TextPost: React.FC<TextPostProps> = ({ content, onChange, errors }) => {
  return (
    <div className="space-y-4">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01 }}
      >
        <MarkdownEditor
          value={content.body || ""}
          onChange={(value: string) => onChange("body", value)}
          placeholder="Write your post content here... Markdown is fully supported."
          height="h-64 sm:h-80 md:h-96" // Increased height for better writing experience
          label="Content *"
          error={errors?.body}
          showToolbar={true}
        />
      </motion.div>
    </div>
  );
};

export default TextPost;
