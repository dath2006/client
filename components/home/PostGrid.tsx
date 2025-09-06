"use client";

import { useState, useEffect } from "react";
import { Post } from "@/types/post";
import { feedAPI } from "@/lib/api";
import PostCard from "../feed/PostCard";
import { useRouter } from "next/navigation";

const PostGrid = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPinnedPosts = async () => {
      try {
        setLoading(true);
        const pinnedPosts = await feedAPI.getPinnedPosts();
        setPosts(pinnedPosts);
      } catch (err) {
        console.error("Error fetching pinned posts:", err);
        setError("Failed to load pinned posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPinnedPosts();
  }, []);

  if (loading) {
    return (
      <section id="posts" className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Pinned Posts
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Loading pinned posts...
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-6 animate-pulse"
            >
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-32 bg-gray-300 rounded mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-4 bg-gray-300 rounded w-12"></div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="posts" className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Pinned Posts
          </h2>
          <p className="text-lg text-error max-w-2xl mx-auto">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="posts" className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-text-primary mb-4">
          Pinned Posts
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Discover a diverse collection of content from our community. From
          thoughts and photos to quotes and resources.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-text-secondary">
            No pinned posts available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {posts.length > 0 && (
        <div className="text-center mt-12">
          <button
            className="btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => router.push("/feed")}
          >
            Load More Posts
          </button>
        </div>
      )}
    </section>
  );
};

export default PostGrid;
