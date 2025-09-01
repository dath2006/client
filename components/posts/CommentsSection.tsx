"use client";

import React, { useState } from "react";
import { Comment } from "@/types/post";
import { Heart, MessageSquare, MoreHorizontal, Send } from "lucide-react";

interface CommentsSectionProps {
  comments: Comment[];
  onCommentSubmit: (content: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onCommentSubmit,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onCommentSubmit(newComment.trim());
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      // In a real app, this would handle replies differently
      onCommentSubmit(
        `@${
          comments.find((c) => c.id === commentId)?.author.name
        }: ${replyContent.trim()}`
      );
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const toggleCommentLike = (commentId: string) => {
    const newLikedComments = new Set(likedComments);
    if (likedComments.has(commentId)) {
      newLikedComments.delete(commentId);
    } else {
      newLikedComments.add(commentId);
    }
    setLikedComments(newLikedComments);
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`space-y-3 ${isReply ? "ml-8" : ""}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface flex-shrink-0">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Comment Content */}
        <div className="flex-1 space-y-2">
          {/* Author and Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary">
                {comment.author.name}
              </span>
              <span className="text-xs text-text-secondary">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <button className="p-1 text-text-secondary hover:text-text-primary rounded">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Comment Text */}
          <p className="text-text-primary leading-relaxed">{comment.content}</p>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => toggleCommentLike(comment.id)}
              className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                likedComments.has(comment.id)
                  ? "text-red-500"
                  : "text-text-secondary"
              }`}
            >
              <Heart
                size={14}
                className={likedComments.has(comment.id) ? "fill-current" : ""}
              />
              <span>
                {comment.likes + (likedComments.has(comment.id) ? 1 : 0)}
              </span>
            </button>

            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1 text-text-secondary hover:text-primary transition-colors"
              >
                <MessageSquare size={14} />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author.name}...`}
                className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmitReply(comment.id);
                  }
                }}
              />
              <button
                onClick={() => handleSubmitReply(comment.id)}
                disabled={!replyContent.trim()}
                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="px-3 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
            <span>Post Comment</span>
          </button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 text-text-secondary">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </section>
  );
};

export default CommentsSection;
