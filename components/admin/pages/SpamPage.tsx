"use client";

import React, { useState } from "react";
import SpamCard from "@/components/admin/spam/SpamCard";
import SearchHeader from "@/components/admin/common/SearchHeader";
import SpamBatchActions from "@/components/admin/spam/SpamBatchActions";

export interface SpamItem {
  id: string;
  type: "comment" | "pingback" | "trackback" | "contact_form";
  author: {
    name: string;
    email: string;
    website?: string;
    ipAddress: string;
    userAgent?: string;
  };
  content: string;
  detectedAt: Date;
  spamScore: number; // 0-100
  spamReasons: string[];
  source?: {
    post?: {
      id: string;
      title: string;
      slug: string;
    };
    form?: string;
  };
  status: "detected" | "confirmed" | "false_positive" | "deleted";
}

const SpamPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | SpamItem["type"]>("all");
  const [selectedSpamItems, setSelectedSpamItems] = useState<string[]>([]);
  const [spamItems, setSpamItems] = useState<SpamItem[]>([]);

  // Mock spam data
  const mockSpamItems: SpamItem[] = [
    {
      id: "s1",
      type: "comment",
      author: {
        name: "Spammer Bot",
        email: "spam@badsite.com",
        website: "http://spam-pills.com",
        ipAddress: "45.123.456.789",
        userAgent: "Spam Bot 2.0",
      },
      content:
        "🎉 AMAZING DEALS ON PRESCRIPTION PILLS!!! 💊 No prescription needed! Buy now and get 50% OFF! Visit our website for more incredible offers! Limited time only!!!",
      detectedAt: new Date("2024-03-02T16:20:00"),
      spamScore: 95,
      spamReasons: [
        "Contains pharmaceutical spam keywords",
        "Excessive use of emojis and exclamation marks",
        "Known spam IP address",
        "Suspicious domain in website field",
      ],
      source: {
        post: {
          id: "1",
          title: "Getting Started with Next.js 14",
          slug: "getting-started-nextjs-14",
        },
      },
      status: "detected",
    },
    {
      id: "s2",
      type: "comment",
      author: {
        name: "CheapDeals123",
        email: "deals@fake-deals.com",
        website: "http://fake-deals.com",
        ipAddress: "192.168.999.1",
        userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36",
      },
      content:
        "OMG this is so useful! BTW, check out my website for amazing discounts on electronics and gadgets! Free shipping worldwide!!! Click here now!!!",
      detectedAt: new Date("2024-03-01T14:30:00"),
      spamScore: 87,
      spamReasons: [
        "Contains promotional content",
        "Suspicious website promotion",
        "Generic positive comment followed by promotion",
        "Excessive exclamation marks",
      ],
      source: {
        post: {
          id: "2",
          title: "Building Modern UIs with React",
          slug: "building-modern-uis-react",
        },
      },
      status: "confirmed",
    },
    {
      id: "s3",
      type: "pingback",
      author: {
        name: "Auto Pingback",
        email: "pingback@suspicious-site.ru",
        ipAddress: "203.0.113.99",
        userAgent: "Pingback Bot 1.0",
      },
      content:
        "This post was mentioned on http://suspicious-site.ru/fake-article-123",
      detectedAt: new Date("2024-02-28T22:15:00"),
      spamScore: 78,
      spamReasons: [
        "Pingback from suspicious domain",
        "Russian domain with random subdirectory",
        "No actual backlink found on source page",
      ],
      source: {
        post: {
          id: "3",
          title: "Understanding Web Security",
          slug: "understanding-web-security",
        },
      },
      status: "detected",
    },
    {
      id: "s4",
      type: "contact_form",
      author: {
        name: "Marketing Expert",
        email: "marketing@seo-spam.com",
        ipAddress: "198.51.100.50",
        userAgent: "Mozilla/5.0 (compatible; SEO Bot)",
      },
      content:
        "Hello! I noticed your website could use better SEO. We offer premium SEO services that will boost your ranking to #1 on Google! Special offer: 90% off for new customers. Contact us now!",
      detectedAt: new Date("2024-02-27T10:45:00"),
      spamScore: 92,
      spamReasons: [
        "SEO/Marketing spam content",
        "Promotional discount offer",
        "Generic website improvement pitch",
        "Known SEO spam domain pattern",
      ],
      source: {
        form: "Contact Form",
      },
      status: "confirmed",
    },
    {
      id: "s5",
      type: "comment",
      author: {
        name: "John Smith",
        email: "john@legitimate-email.com",
        website: "https://johnsportfolio.dev",
        ipAddress: "172.16.0.50",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      content:
        "Great article! I found this really helpful for my recent project. Thanks for sharing your insights.",
      detectedAt: new Date("2024-02-25T09:20:00"),
      spamScore: 25,
      spamReasons: [
        "Generic positive comment pattern",
        "New user with no comment history",
      ],
      source: {
        post: {
          id: "1",
          title: "Getting Started with Next.js 14",
          slug: "getting-started-nextjs-14",
        },
      },
      status: "false_positive",
    },
  ];

  // Initialize with mock data
  React.useEffect(() => {
    setSpamItems(mockSpamItems);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNew = () => {
    // This could open a modal to manually mark something as spam
    console.log("Manual spam reporting feature");
  };

  const handleSpamStatusChange = (
    spamId: string,
    newStatus: SpamItem["status"]
  ) => {
    setSpamItems((prev) =>
      prev.map((item) =>
        item.id === spamId ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleSpamDelete = (spamId: string) => {
    if (
      confirm(
        "Are you sure you want to permanently delete this spam item? This action cannot be undone."
      )
    ) {
      setSpamItems((prev) => prev.filter((item) => item.id !== spamId));
      setSelectedSpamItems((prev) => prev.filter((id) => id !== spamId));
    }
  };

  const handleSpamSelect = (spamId: string, selected: boolean) => {
    if (selected) {
      setSelectedSpamItems((prev) => [...prev, spamId]);
    } else {
      setSelectedSpamItems((prev) => prev.filter((id) => id !== spamId));
    }
  };

  const handleBatchAction = (
    action: "confirm" | "false_positive" | "delete",
    spamIds: string[]
  ) => {
    if (action === "delete") {
      if (
        confirm(
          `Are you sure you want to permanently delete ${spamIds.length} spam item(s)? This action cannot be undone.`
        )
      ) {
        setSpamItems((prev) =>
          prev.filter((item) => !spamIds.includes(item.id))
        );
        setSelectedSpamItems([]);
      }
    } else {
      const statusMap = {
        confirm: "confirmed" as const,
        false_positive: "false_positive" as const,
      };

      setSpamItems((prev) =>
        prev.map((item) =>
          spamIds.includes(item.id)
            ? { ...item, status: statusMap[action] }
            : item
        )
      );
      setSelectedSpamItems([]);
    }
  };

  // Filter spam items
  const filteredSpamItems = spamItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.source?.post?.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const spamStats = {
    total: spamItems.length,
    detected: spamItems.filter((item) => item.status === "detected").length,
    confirmed: spamItems.filter((item) => item.status === "confirmed").length,
    falsePositives: spamItems.filter((item) => item.status === "false_positive")
      .length,
    highRisk: spamItems.filter((item) => item.spamScore >= 80).length,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border pb-4">
        <SearchHeader
          title="Spam Report"
          onSearch={handleSearch}
          onNew={handleNew}
        />

        {/* Statistics */}
        <div className="flex gap-4 mt-4 flex-wrap">
          <div className="bg-white/5 rounded-lg px-3 py-2 text-sm">
            <span className="text-[#f7a5a5]/70">Total:</span>
            <span className="text-[#f7a5a5] font-medium ml-1">
              {spamStats.total}
            </span>
          </div>
          <div className="bg-red-500/10 rounded-lg px-3 py-2 text-sm">
            <span className="text-red-400/70">High Risk:</span>
            <span className="text-red-400 font-medium ml-1">
              {spamStats.highRisk}
            </span>
          </div>
          <div className="bg-yellow-500/10 rounded-lg px-3 py-2 text-sm">
            <span className="text-yellow-400/70">Detected:</span>
            <span className="text-yellow-400 font-medium ml-1">
              {spamStats.detected}
            </span>
          </div>
          <div className="bg-green-500/10 rounded-lg px-3 py-2 text-sm">
            <span className="text-green-400/70">False Positives:</span>
            <span className="text-green-400 font-medium ml-1">
              {spamStats.falsePositives}
            </span>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {[
            { key: "all", label: "All Types", count: filteredSpamItems.length },
            {
              key: "comment",
              label: "Comments",
              count: filteredSpamItems.filter((item) => item.type === "comment")
                .length,
            },
            {
              key: "pingback",
              label: "Pingbacks",
              count: filteredSpamItems.filter(
                (item) => item.type === "pingback"
              ).length,
            },
            {
              key: "trackback",
              label: "Trackbacks",
              count: filteredSpamItems.filter(
                (item) => item.type === "trackback"
              ).length,
            },
            {
              key: "contact_form",
              label: "Contact Form",
              count: filteredSpamItems.filter(
                (item) => item.type === "contact_form"
              ).length,
            },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setTypeFilter(filter.key as any)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
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
      </div>

      {/* Batch Actions */}
      {selectedSpamItems.length > 0 && (
        <SpamBatchActions
          selectedCount={selectedSpamItems.length}
          onBatchAction={handleBatchAction}
          selectedSpamIds={selectedSpamItems}
        />
      )}

      <div className="flex-1 overflow-y-auto pt-4">
        <div className="space-y-4">
          {filteredSpamItems.map((spamItem) => (
            <SpamCard
              key={spamItem.id}
              spamItem={spamItem}
              onSpamStatusChange={handleSpamStatusChange}
              onSpamDelete={handleSpamDelete}
              onSpamSelect={handleSpamSelect}
              selectedSpamItems={selectedSpamItems}
            />
          ))}

          {filteredSpamItems.length === 0 && spamItems.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No spam items found
              </h3>
              <p className="text-[#f7a5a5]/70">
                Try adjusting your search query or filter settings.
              </p>
            </div>
          )}

          {spamItems.length === 0 && (
            <div className="bg-white/5 rounded-lg border border-[#f7a5a5]/20 p-8 text-center">
              <h3 className="text-lg font-medium text-[#f7a5a5] mb-2">
                No spam detected
              </h3>
              <p className="text-[#f7a5a5]/70">
                Great! Your site is currently spam-free. Detected spam will
                appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpamPage;
