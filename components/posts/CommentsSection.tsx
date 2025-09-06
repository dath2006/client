// src/components/CommentsSection.tsx

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Comment } from "@/types/post";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { useAuth } from "@/hooks/useAuth";
import { userCommentsAPI } from "@/lib/api";
import {
  useGlobalPermissions,
  useHasPermission,
} from "@/hooks/useGlobalPermissions";

// Define the component's props interface
interface CommentsSectionProps {
  comments: Comment[];
  onCommentSubmit: (content: string) => void;
  onCommentUpdate: (commentId: string, content: string) => void;
  onCommentDelete: (commentId: string) => void;
  commentVariants: Variants;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onCommentSubmit,
  onCommentUpdate,
  onCommentDelete,
  commentVariants,
}) => {
  const [newCommentContent, setNewCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getSetting } = useGlobalSettings();
  const { user, isAuthenticated } = useAuth();
  const { canAddComments } = useGlobalPermissions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentContent.trim()) {
      onCommentSubmit(newCommentContent);
      setNewCommentContent("");
    }
  };

  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.body || comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      await userCommentsAPI.updateComment(commentId, {
        content: editContent,
        body: editContent,
      });
      onCommentUpdate(commentId, editContent);
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Failed to update comment:", error);
      // You could show a toast/notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      await userCommentsAPI.deleteComment(commentId);
      onCommentDelete(commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // You could show a toast/notification here
    }
  };

  const isCommentOwner = (comment: Comment) => {
    return isAuthenticated && user && comment.author.id === user.id;
  };

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h2 className="text-xl font-semibold mb-4 text-foreground">
        Comments ({comments.length})
      </h2>
      {useHasPermission("use_html_comments", false) &&
        getSetting("htmlInComments", false) &&
        (() => {
          const allowed = getSetting("allowedHtml", "no tags");
          const allowedTags =
            typeof allowed === "string"
              ? allowed
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : Array.isArray(allowed)
              ? allowed
              : [];

          return (
            <div className="note mb-4 flex items-start gap-3">
              <div className="note-icon flex-shrink-0 mt-1">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                    fill="currentColor"
                    opacity="0.06"
                  />
                  <path
                    d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="note-heading text-sm font-medium text-foreground mb-1">
                  NOTE: HTML in comments is allowed
                </p>
                <p className="text-sm text-text-secondary mb-2">
                  You can use the following HTML tags in comments. Use them
                  responsibly — malformed HTML may be sanitized.
                </p>

                {allowedTags.length > 0 ? (
                  <div className="tag-list flex flex-wrap gap-2">
                    {allowedTags.map((tag) => (
                      <span key={tag} className="tag-badge text-xs">
                        &lt;{tag.replace(/[<>]/g, "")}&gt;
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">
                    No tags allowed.
                  </p>
                )}
              </div>
            </div>
          );
        })()}
      {/* Comment Input Form */}
      {canAddComments && (
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
      )}

      {/* List of Comments */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              className="comment-item bg-card p-4 rounded-lg shadow-sm border border-border"
              variants={commentVariants}
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
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {comment.author.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Edit/Delete buttons for comment owner */}
                {isCommentOwner(comment) && (
                  <div className="comment-actions flex items-center gap-2">
                    {useHasPermission("edit_own_comments") && (
                      <button
                        onClick={() => handleEditStart(comment)}
                        className="comment-edit-btn"
                        disabled={editingCommentId === comment.id}
                      >
                        Edit
                      </button>
                    )}
                    {useHasPermission("delete_own_comments") && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="comment-delete-btn"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Comment content - either editing or displaying */}
              {editingCommentId === comment.id ? (
                <div className="mt-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 bg-card border border-border rounded text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleEditSubmit(comment.id)}
                      disabled={isSubmitting || !editContent.trim()}
                      className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={handleEditCancel}
                      disabled={isSubmitting}
                      className="px-3 py-1 bg-surface border border-border text-text-primary text-sm rounded hover:bg-surface-elevated disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {getSetting("htmlInComments", false) ? (
                    <div
                      className="mt-2 text-text-primary"
                      dangerouslySetInnerHTML={{
                        __html: comment.body || comment.content,
                      }}
                    ></div>
                  ) : (
                    <p className="mt-2 text-text-primary break-words">
                      {comment.body || comment.content}
                    </p>
                  )}
                </>
              )}
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
