"use client";

import React, { useState } from "react";
import WebmentionCard from "@/components/admin/webmentions/WebmentionCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import WebmentionBatchActions from "@/components/admin/webmentions/WebmentionBatchActions";
import WebmentionModal, {
  WebmentionFormData,
} from "@/components/admin/webmentions/WebmentionModal";

export interface Webmention {
  id: string;
  type: "mention" | "like" | "repost" | "reply" | "bookmark" | "rsvp";
  source: {
    url: string;
    title?: string;
    author: {
      name: string;
      url?: string;
      avatar?: string;
    };
    publishedAt: Date;
    content?: string;
    excerpt?: string;
  };
  target: {
    url: string;
    post: {
      id: string;
      title: string;
      slug: string;
    };
  };
  status: "pending" | "approved" | "rejected" | "spam";
  receivedAt: Date;
  verifiedAt?: Date;
  isValid: boolean;
  validationErrors?: string[];
  properties: {
    likeOf?: string;
    repostOf?: string;
    inReplyTo?: string;
    bookmarkOf?: string;
    rsvp?: "yes" | "no" | "maybe" | "interested";
  };
}

const WebmentionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Webmention["type"]>(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | Webmention["status"]
  >("all");
  const [selectedWebmentions, setSelectedWebmentions] = useState<string[]>([]);
  const [webmentions, setWebmentions] = useState<Webmention[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock webmentions data
  const mockWebmentions: Webmention[] = [
    {
      id: "w1",
      type: "mention",
      source: {
        url: "https://techblog.example.com/article-about-nextjs",
        title: "Why Next.js 14 is a Game Changer",
        author: {
          name: "Sarah Chen",
          url: "https://techblog.example.com/author/sarah",
          avatar: "https://techblog.example.com/avatars/sarah.jpg",
        },
        publishedAt: new Date("2024-03-01T10:30:00"),
        content:
          "Great insights on Next.js 14 server components in this post: https://yoursite.com/getting-started-nextjs-14",
        excerpt:
          "Great insights on Next.js 14 server components in this post...",
      },
      target: {
        url: "https://yoursite.com/getting-started-nextjs-14",
        post: {
          id: "1",
          title: "Getting Started with Next.js 14",
          slug: "getting-started-nextjs-14",
        },
      },
      status: "pending",
      receivedAt: new Date("2024-03-01T11:00:00"),
      verifiedAt: new Date("2024-03-01T11:05:00"),
      isValid: true,
      properties: {},
    },
    {
      id: "w2",
      type: "like",
      source: {
        url: "https://mastodon.social/@developer123/status/123456789",
        author: {
          name: "Alex Developer",
          url: "https://mastodon.social/@developer123",
          avatar: "https://mastodon.social/avatars/alex.jpg",
        },
        publishedAt: new Date("2024-02-28T15:45:00"),
      },
      target: {
        url: "https://yoursite.com/building-modern-uis-react",
        post: {
          id: "2",
          title: "Building Modern UIs with React",
          slug: "building-modern-uis-react",
        },
      },
      status: "approved",
      receivedAt: new Date("2024-02-28T16:00:00"),
      verifiedAt: new Date("2024-02-28T16:05:00"),
      isValid: true,
      properties: {
        likeOf: "https://yoursite.com/building-modern-uis-react",
      },
    },
    {
      id: "w3",
      type: "reply",
      source: {
        url: "https://twitter.com/webdev_pro/status/987654321",
        title: "Response to React UI patterns",
        author: {
          name: "WebDev Pro",
          url: "https://twitter.com/webdev_pro",
          avatar: "https://pbs.twimg.com/profile_images/webdev_pro.jpg",
        },
        publishedAt: new Date("2024-02-29T09:20:00"),
        content:
          "This is exactly what I needed! The component patterns you show are so clean and reusable. Thanks for sharing! 🚀",
        excerpt:
          "This is exactly what I needed! The component patterns you show are so clean...",
      },
      target: {
        url: "https://yoursite.com/building-modern-uis-react",
        post: {
          id: "2",
          title: "Building Modern UIs with React",
          slug: "building-modern-uis-react",
        },
      },
      status: "approved",
      receivedAt: new Date("2024-02-29T09:30:00"),
      verifiedAt: new Date("2024-02-29T09:35:00"),
      isValid: true,
      properties: {
        inReplyTo: "https://yoursite.com/building-modern-uis-react",
      },
    },
    {
      id: "w4",
      type: "repost",
      source: {
        url: "https://linkedin.com/posts/john-designer-123456",
        title: "Shared: Understanding Web Security",
        author: {
          name: "John Designer",
          url: "https://linkedin.com/in/john-designer",
          avatar: "https://media.licdn.com/avatars/john.jpg",
        },
        publishedAt: new Date("2024-03-02T14:15:00"),
        content: "Essential reading for all web developers! 💯",
        excerpt: "Essential reading for all web developers!",
      },
      target: {
        url: "https://yoursite.com/understanding-web-security",
        post: {
          id: "3",
          title: "Understanding Web Security",
          slug: "understanding-web-security",
        },
      },
      status: "pending",
      receivedAt: new Date("2024-03-02T14:30:00"),
      verifiedAt: new Date("2024-03-02T14:35:00"),
      isValid: true,
      properties: {
        repostOf: "https://yoursite.com/understanding-web-security",
      },
    },
    {
      id: "w5",
      type: "mention",
      source: {
        url: "https://suspicious-site.com/fake-article",
        title: "Buy cheap products now!",
        author: {
          name: "Spam Bot",
          url: "https://suspicious-site.com",
        },
        publishedAt: new Date("2024-03-03T02:00:00"),
        content:
          "Check out this amazing deal mentioned here: https://yoursite.com/getting-started-nextjs-14",
        excerpt: "Check out this amazing deal mentioned here...",
      },
      target: {
        url: "https://yoursite.com/getting-started-nextjs-14",
        post: {
          id: "1",
          title: "Getting Started with Next.js 14",
          slug: "getting-started-nextjs-14",
        },
      },
      status: "spam",
      receivedAt: new Date("2024-03-03T02:15:00"),
      isValid: false,
      validationErrors: [
        "Source appears to be spam",
        "No actual reference to target content",
        "Suspicious domain pattern",
      ],
      properties: {},
    },
    {
      id: "w6",
      type: "bookmark",
      source: {
        url: "https://bookmarks.indie.dev/bookmark/456",
        author: {
          name: "Indie Developer",
          url: "https://indie.dev/profile/jane",
          avatar: "https://indie.dev/avatars/jane.png",
        },
        publishedAt: new Date("2024-03-01T20:30:00"),
      },
      target: {
        url: "https://yoursite.com/understanding-web-security",
        post: {
          id: "3",
          title: "Understanding Web Security",
          slug: "understanding-web-security",
        },
      },
      status: "approved",
      receivedAt: new Date("2024-03-01T20:45:00"),
      verifiedAt: new Date("2024-03-01T20:50:00"),
      isValid: true,
      properties: {
        bookmarkOf: "https://yoursite.com/understanding-web-security",
      },
    },
  ];

  // Initialize with mock data
  React.useEffect(() => {
    setWebmentions(mockWebmentions);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNew = () => {
    // Open modal to manually add a webmention
    setIsModalOpen(true);
  };

  const handleWebmentionStatusChange = (
    webmentionId: string,
    newStatus: Webmention["status"]
  ) => {
    setWebmentions((prev) =>
      prev.map((item) =>
        item.id === webmentionId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleWebmentionDelete = (webmentionId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this webmention? This action cannot be undone."
      )
    ) {
      setWebmentions((prev) => prev.filter((item) => item.id !== webmentionId));
      setSelectedWebmentions((prev) =>
        prev.filter((id) => id !== webmentionId)
      );
    }
  };

  const handleWebmentionSelect = (webmentionId: string, selected: boolean) => {
    if (selected) {
      setSelectedWebmentions((prev) => [...prev, webmentionId]);
    } else {
      setSelectedWebmentions((prev) =>
        prev.filter((id) => id !== webmentionId)
      );
    }
  };

  const handleBatchAction = (
    action: "approve" | "reject" | "spam" | "delete",
    webmentionIds: string[]
  ) => {
    if (action === "delete") {
      if (
        confirm(
          `Are you sure you want to delete ${webmentionIds.length} webmention(s)? This action cannot be undone.`
        )
      ) {
        setWebmentions((prev) =>
          prev.filter((item) => !webmentionIds.includes(item.id))
        );
        setSelectedWebmentions([]);
      }
    } else {
      const statusMap = {
        approve: "approved" as const,
        reject: "rejected" as const,
        spam: "spam" as const,
      };

      setWebmentions((prev) =>
        prev.map((item) =>
          webmentionIds.includes(item.id)
            ? { ...item, status: statusMap[action] }
            : item
        )
      );
      setSelectedWebmentions([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleWebmentionSave = (webmentionData: WebmentionFormData) => {
    // Create new webmention
    const newWebmention: Webmention = {
      id: Date.now().toString(),
      type: webmentionData.type,
      source: {
        url: webmentionData.sourceUrl,
        title: webmentionData.sourceTitle,
        author: {
          name: webmentionData.authorName,
          url: webmentionData.authorUrl,
          avatar: webmentionData.authorAvatar,
        },
        publishedAt: new Date(webmentionData.publishedAt || Date.now()),
        content: webmentionData.content,
        excerpt: webmentionData.content
          ? webmentionData.content.substring(0, 200) + "..."
          : undefined,
      },
      target: {
        url: webmentionData.targetUrl,
        post: {
          id: "manual", // This would be resolved from the target URL
          title: "Manual Entry",
          slug: "manual-entry",
        },
      },
      status: "pending",
      receivedAt: new Date(),
      isValid: true,
      properties: {},
    };

    setWebmentions((prev) => [newWebmention, ...prev]);
  };

  // Filter webmentions
  const filteredWebmentions = webmentions.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.source.author.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.source.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target.post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.source.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const webmentionStats = {
    total: webmentions.length,
    pending: webmentions.filter((item) => item.status === "pending").length,
    approved: webmentions.filter((item) => item.status === "approved").length,
    rejected: webmentions.filter((item) => item.status === "rejected").length,
    spam: webmentions.filter((item) => item.status === "spam").length,
    invalid: webmentions.filter((item) => !item.isValid).length,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Webmention"
          onSearch={handleSearch}
          onNew={handleNew}
        />

        {/* Statistics */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="bg-white/5 rounded-lg px-3 py-2 text-sm">
            <span className="text-[#f7a5a5]/70">Total:</span>
            <span className="text-[#f7a5a5] font-medium ml-1">
              {webmentionStats.total}
            </span>
          </div>
          <div className="bg-yellow-500/10 rounded-lg px-3 py-2 text-sm">
            <span className="text-yellow-400/70">Pending:</span>
            <span className="text-yellow-400 font-medium ml-1">
              {webmentionStats.pending}
            </span>
          </div>
          <div className="bg-green-500/10 rounded-lg px-3 py-2 text-sm">
            <span className="text-green-400/70">Approved:</span>
            <span className="text-green-400 font-medium ml-1">
              {webmentionStats.approved}
            </span>
          </div>
          <div className="bg-red-500/10 rounded-lg px-3 py-2 text-sm">
            <span className="text-red-400/70">Invalid:</span>
            <span className="text-red-400 font-medium ml-1">
              {webmentionStats.invalid}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <div className="flex gap-1">
            <span className="text-[#f7a5a5]/70 text-sm py-1 px-2">Type:</span>
            {[
              { key: "all", label: "All", count: filteredWebmentions.length },
              {
                key: "mention",
                label: "Mentions",
                count: filteredWebmentions.filter(
                  (item) => item.type === "mention"
                ).length,
              },
              {
                key: "like",
                label: "Likes",
                count: filteredWebmentions.filter(
                  (item) => item.type === "like"
                ).length,
              },
              {
                key: "reply",
                label: "Replies",
                count: filteredWebmentions.filter(
                  (item) => item.type === "reply"
                ).length,
              },
              {
                key: "repost",
                label: "Reposts",
                count: filteredWebmentions.filter(
                  (item) => item.type === "repost"
                ).length,
              },
              {
                key: "bookmark",
                label: "Bookmarks",
                count: filteredWebmentions.filter(
                  (item) => item.type === "bookmark"
                ).length,
              },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setTypeFilter(filter.key as any)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  typeFilter === filter.key
                    ? "bg-[#f7a5a5] text-[#5d688a]"
                    : "bg-white/5 text-[#f7a5a5]/70 hover:bg-white/10"
                }`}
                suppressHydrationWarning={true}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            <span className="text-[#f7a5a5]/70 text-sm py-1 px-2">Status:</span>
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "approved", label: "Approved" },
              { key: "rejected", label: "Rejected" },
              { key: "spam", label: "Spam" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key as any)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  statusFilter === filter.key
                    ? "bg-[#f7a5a5] text-[#5d688a]"
                    : "bg-white/5 text-[#f7a5a5]/70 hover:bg-white/10"
                }`}
                suppressHydrationWarning={true}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedWebmentions.length > 0 && (
        <WebmentionBatchActions
          selectedCount={selectedWebmentions.length}
          onBatchAction={handleBatchAction}
          selectedWebmentionIds={selectedWebmentions}
        />
      )}

      <div className="flex-1 overflow-y-auto pt-4">
        <div className="space-y-4">
          {filteredWebmentions.map((webmention) => (
            <WebmentionCard
              key={webmention.id}
              webmention={webmention}
              onWebmentionStatusChange={handleWebmentionStatusChange}
              onWebmentionDelete={handleWebmentionDelete}
              onWebmentionSelect={handleWebmentionSelect}
              selectedWebmentions={selectedWebmentions}
            />
          ))}

          {filteredWebmentions.length === 0 && webmentions.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No webmentions found
              </h3>
              <p className="text-[#f7a5a5]/70">
                Try adjusting your search query or filter settings.
              </p>
            </div>
          )}

          {webmentions.length === 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No webmentions yet
              </h3>
              <p className="text-[#f7a5a5]/70 mb-4">
                Webmentions will appear here when other sites link to your
                content.
              </p>
              <button
                onClick={handleNew}
                className="bg-[#f7a5a5] text-white px-4 py-2 rounded-lg hover:bg-[#f7a5a5]/90 transition-colors"
                suppressHydrationWarning={true}
              >
                Add Manual Webmention
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Webmention Modal */}
      <WebmentionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleWebmentionSave}
      />
    </div>
  );
};

export default WebmentionsPage;
