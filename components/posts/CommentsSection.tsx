// src/components/CommentsSection.tsx

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Comment } from "@/types/post";

// Define the component's props interface
interface CommentsSectionProps {
  comments: Comment[];
  onCommentSubmit: (content: string) => void;
  commentVariants: Variants; // <-- ADD THIS LINE
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onCommentSubmit,
  commentVariants, // <-- AND ADD IT HERE
}) => {
  const [newCommentContent, setNewCommentContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentContent.trim()) {
      onCommentSubmit(newCommentContent);
      setNewCommentContent("");
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Comments ({comments.length})
      </h2>

      {/* Comment Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 bg-card border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          placeholder="Write a comment..."
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
        ></textarea>
        <motion.button
          type="submit"
          className="mt-3 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Post Comment
        </motion.button>
      </form>

      {/* List of Comments */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              className="bg-card p-4 rounded-lg shadow-sm border border-border"
              variants={commentVariants} // Now this will work without error
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div className="flex items-center mb-2">
                <img
                  src={comment.author.avatar || "/api/placeholder/40/40"}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {comment.author.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-text-primary break-words">{comment.content}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {comments.length === 0 && (
          <p className="text-text-secondary text-center py-4">
            No comments yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
