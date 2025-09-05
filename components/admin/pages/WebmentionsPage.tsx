"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import WebmentionCard from "@/components/admin/webmentions/WebmentionCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import WebmentionBatchActions from "@/components/admin/webmentions/WebmentionBatchActions";
import WebmentionModal, {
  WebmentionFormData,
} from "@/components/admin/webmentions/WebmentionModal";

// --- TYPE DEFINITION ---
export interface Webmention {
  id: string;
  type: "mention" | "like" | "repost" | "reply" | "bookmark" | "rsvp";
  source: {
    url: string;
    title?: string;
    author: { name: string; url?: string; avatar?: string };
    publishedAt: Date;
    content?: string;
    excerpt?: string;
  };
  target: { url: string; post: { id: string; title: string; slug: string } };
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

// --- MOCK DATA (Moved outside component for clarity) ---
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
        avatar: `https://i.pravatar.cc/40?u=sarah`,
      },
      publishedAt: new Date("2024-03-01T10:30:00"),
      content:
        "Great insights on Next.js 14 server components in this post: https://yoursite.com/getting-started-nextjs-14",
      excerpt: "Great insights on Next.js 14 server components in this post...",
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
        avatar: `https://i.pravatar.cc/40?u=alex`,
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
    properties: { likeOf: "https://yoursite.com/building-modern-uis-react" },
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
        avatar: `https://i.pravatar.cc/40?u=webdev`,
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
    properties: { inReplyTo: "https://yoursite.com/building-modern-uis-react" },
  },
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

// --- COMPONENT ---
const WebmentionsPage = () => {
  const [webmentions, setWebmentions] = useState<Webmention[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Webmention["type"]>(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | Webmention["status"]
  >("all");
  const [selectedWebmentions, setSelectedWebmentions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setWebmentions(mockWebmentions);
  }, []);

  const handleWebmentionStatusChange = (
    id: string,
    status: Webmention["status"]
  ) => {
    setWebmentions((prev) =>
      prev.map((wm) => (wm.id === id ? { ...wm, status } : wm))
    );
  };

  const handleWebmentionDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this webmention?")) {
      setWebmentions((prev) => prev.filter((wm) => wm.id !== id));
      setSelectedWebmentions((prev) =>
        prev.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const handleWebmentionSelect = (id: string, selected: boolean) => {
    setSelectedWebmentions((prev) =>
      selected ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const handleBatchAction = (
    action: "approve" | "reject" | "spam" | "delete",
    ids: string[]
  ) => {
    if (action === "delete") {
      if (window.confirm(`Delete ${ids.length} webmention(s)?`)) {
        setWebmentions((prev) => prev.filter((wm) => !ids.includes(wm.id)));
        setSelectedWebmentions([]);
      }
      return;
    }

    const statusMap = {
      approve: "approved",
      reject: "rejected",
      spam: "spam",
    };
    const newStatus = statusMap[action];

    setWebmentions((prev) =>
      prev.map((wm) =>
        ids.includes(wm.id) ? ({ ...wm, status: newStatus } as Webmention) : wm
      )
    );
    setSelectedWebmentions([]);
  };

  const handleWebmentionSave = (data: WebmentionFormData) => {
    const newWebmention: Webmention = {
      id: `wm-${Date.now()}`,
      type: data.type,
      source: {
        url: data.sourceUrl,
        title: data.sourceTitle,
        author: {
          name: data.authorName,
          url: data.authorUrl,
          avatar: data.authorAvatar,
        },
        publishedAt: new Date(data.publishedAt || Date.now()),
        content: data.content,
        excerpt: data.content
          ? `${data.content.substring(0, 150)}...`
          : undefined,
      },
      target: {
        url: data.targetUrl,
        post: { id: "manual", title: "Manual Entry", slug: "manual-entry" },
      },
      status: "pending",
      receivedAt: new Date(),
      isValid: true,
      properties: {},
    };
    setWebmentions((prev) => [newWebmention, ...prev]);
  };

  const filteredWebmentions = useMemo(() => {
    return webmentions.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.source.author.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.target.post.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.source.url.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [webmentions, searchQuery, typeFilter, statusFilter]);

  const webmentionStats = useMemo(
    () => ({
      total: webmentions.length,
      pending: webmentions.filter((item) => item.status === "pending").length,
      approved: webmentions.filter((item) => item.status === "approved").length,
      spam: webmentions.filter((item) => item.status === "spam").length,
    }),
    [webmentions]
  );

  const typeFilters = ["all", "mention", "like", "reply", "repost", "bookmark"];
  const statusFilters = ["all", "pending", "approved", "rejected", "spam"];

  return (
    <div className="flex flex-col h-full bg-[#5d688a] text-[#f7a5a5]">
      <div className="sticky top-0 z-10 bg-[#5d688a]/95 backdrop-blur-sm border-b border-[#f7a5a5]/20 pb-4 px-4">
        <SearchHeader
          title="Webmention"
          onSearch={setSearchQuery}
          onNew={() => setIsModalOpen(true)}
        />
        <motion.div
          className="space-y-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/5 rounded-lg px-3 py-2 text-sm">
              {" "}
              <span className="text-[#f7a5a5]/70">Total:</span>{" "}
              <span className="font-medium ml-1">{webmentionStats.total}</span>
            </div>
            <div className="bg-yellow-500/10 rounded-lg px-3 py-2 text-sm">
              {" "}
              <span className="text-yellow-400/70">Pending:</span>{" "}
              <span className="text-yellow-400 font-medium ml-1">
                {webmentionStats.pending}
              </span>
            </div>
            <div className="bg-green-500/10 rounded-lg px-3 py-2 text-sm">
              {" "}
              <span className="text-green-400/70">Approved:</span>{" "}
              <span className="text-green-400 font-medium ml-1">
                {webmentionStats.approved}
              </span>
            </div>
            <div className="bg-red-500/10 rounded-lg px-3 py-2 text-sm">
              {" "}
              <span className="text-red-400/70">Spam:</span>{" "}
              <span className="text-red-400 font-medium ml-1">
                {webmentionStats.spam}
              </span>
            </div>
          </div>
          <div className="flex gap-x-6 gap-y-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[#f7a5a5]/70 text-sm">Type:</span>{" "}
              {typeFilters.map((f) => (
                <FilterButton
                  key={f}
                  label={f}
                  activeFilter={typeFilter}
                  setFilter={setTypeFilter as any}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#f7a5a5]/70 text-sm">Status:</span>{" "}
              {statusFilters.map((f) => (
                <FilterButton
                  key={f}
                  label={f}
                  activeFilter={statusFilter}
                  setFilter={setStatusFilter as any}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedWebmentions.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
          >
            <WebmentionBatchActions
              selectedCount={selectedWebmentions.length}
              onBatchAction={handleBatchAction}
              selectedWebmentionIds={selectedWebmentions}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pt-4 px-4">
        <AnimatePresence mode="wait">
          {filteredWebmentions.length > 0 ? (
            <motion.div
              key="list"
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredWebmentions.map((wm) => (
                  <motion.div
                    key={wm.id}
                    layout
                    variants={itemVariants}
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <WebmentionCard
                      webmention={wm}
                      onWebmentionStatusChange={handleWebmentionStatusChange}
                      onWebmentionDelete={handleWebmentionDelete}
                      onWebmentionSelect={handleWebmentionSelect}
                      selectedWebmentions={selectedWebmentions}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center mt-10"
            >
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No webmentions found
              </h3>
              <p className="text-[#f7a5a5]/70">
                Try adjusting your search or filter settings.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <WebmentionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleWebmentionSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterButton = ({
  label,
  activeFilter,
  setFilter,
}: {
  label: string;
  activeFilter: string;
  setFilter: (f: string) => void;
}) => (
  <motion.button
    onClick={() => setFilter(label)}
    className={`px-2 py-1 rounded text-xs capitalize transition-colors ${
      activeFilter === label
        ? "bg-[#f7a5a5] text-[#5d688a] font-semibold"
        : "bg-white/5 text-[#f7a5a5]/70 hover:bg-white/10"
    }`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    {label}
  </motion.button>
);

export default WebmentionsPage;
