"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import {
  Feather as ApiFeather,
  getFeathers,
  updateFeatherStatus,
} from "../../../lib/api-legacy/admin-feathers";

interface Feather {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled";
  canDisable?: boolean;
}

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const FeathersPage = () => {
  const [feathers, setFeathers] = useState<Feather[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeathers = async () => {
      try {
        setLoading(true);
        const response = await getFeathers();
        setFeathers(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch feathers:", err);
        setError("Failed to load feathers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeathers();
  }, []);

  const handleToggleFeather = async (featherId: number) => {
    const originalFeathers = [...feathers];
    const feather = feathers.find((f) => f.id === featherId);
    if (!feather) return;

    const newStatus = feather.status === "enabled" ? "disabled" : "enabled";

    // Optimistically update UI for instant feedback
    setFeathers((prev) =>
      prev.map((f) => (f.id === featherId ? { ...f, status: newStatus } : f))
    );

    try {
      await updateFeatherStatus(featherId, newStatus);
    } catch (err) {
      console.error("Failed to update feather status:", err);
      setError("Failed to update feather. Please try again later.");
      // Revert on error
      setFeathers(originalFeathers);
    }
  };

  const enabledFeathers = feathers.filter((f) => f.status === "enabled");
  const disabledFeathers = feathers.filter((f) => f.status === "disabled");

  // --- Reusable FeatherCard Component ---
  const FeatherCard = ({ feather }: { feather: Feather }) => {
    // Helper functions remain the same
    const getStatusColor = (status: string) => {
      /* ... */
    };
    const getFeatherIcon = (name: string) => {
      /* ... */
    };

    return (
      <motion.div
        whileHover={{ y: -3, boxShadow: "var(--card-shadow-hover)" }}
        className="p-4 bg-surface rounded-lg border border-default transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* ... card content from original file ... */}
          </div>
          <div className="ml-4 flex flex-col items-end gap-2">
            <Toggle
              checked={feather.status === "enabled"}
              onChange={() => handleToggleFeather(feather.id)}
              variant={feather.status === "enabled" ? "success" : "warning"}
              size="md"
              label={`Toggle ${feather.name} feather`}
            />
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                feather.status
              )}`}
            >
              {feather.status.charAt(0).toUpperCase() + feather.status.slice(1)}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // --- Animated Counter for Stats ---
  const AnimatedCounter = ({ value }: { value: number }) => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold"
        >
          {value}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="max-w-4xl p-6 mx-auto space-y-8"
    >
      <motion.div variants={sectionVariants} className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-primary">Feathers</h1>
        <p className="text-sm text-secondary">
          Manage content types for your blog
        </p>
      </motion.div>

      {loading ? (
        <motion.div
          variants={sectionVariants}
          className="p-6 bg-card rounded-lg card-shadow"
        >
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div
          variants={sectionVariants}
          className="p-4 text-error bg-error/10 border border-error/20 rounded-lg"
        >
          {error}
        </motion.div>
      ) : (
        <div className="space-y-8">
          <motion.div
            variants={sectionVariants}
            className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          >
            <h2 className="flex items-center gap-2 pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
              <span className="w-3 h-3 rounded-full bg-success"></span>
              Enabled Feathers
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence>
                {enabledFeathers.map((feather) => (
                  <motion.div
                    key={feather.id}
                    layout
                    variants={cardVariants}
                    exit={{ opacity: 0 }}
                  >
                    <FeatherCard feather={feather} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {enabledFeathers.length === 0 && (
              <p className="text-sm text-center text-secondary">
                No feathers are currently enabled.
              </p>
            )}
          </motion.div>

          <motion.div
            variants={sectionVariants}
            className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          >
            <h2 className="flex items-center gap-2 pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
              <span className="w-3 h-3 rounded-full bg-warning"></span>
              Available Feathers
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <AnimatePresence>
                {disabledFeathers.map((feather) => (
                  <motion.div
                    key={feather.id}
                    layout
                    variants={cardVariants}
                    exit={{ opacity: 0 }}
                  >
                    <FeatherCard feather={feather} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {disabledFeathers.length === 0 && (
              <p className="text-sm text-center text-secondary">
                All available feathers are enabled.
              </p>
            )}
          </motion.div>

          {/* ... "About Feathers" and "Feather Statistics" sections ... */}
          <motion.div
            variants={sectionVariants}
            className="p-6 space-y-6 bg-card rounded-lg card-shadow"
          >
            <h2 className="pb-2 mb-4 text-xl font-semibold border-b text-primary border-default">
              Feather Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 text-center border rounded-lg bg-success/10 border-success/20">
                <div className="text-success">
                  <AnimatedCounter value={enabledFeathers.length} />
                </div>
                <div className="text-sm text-secondary">Enabled</div>
              </div>
              <div className="p-4 text-center border rounded-lg bg-warning/10 border-warning/20">
                <div className="text-warning">
                  <AnimatedCounter value={disabledFeathers.length} />
                </div>
                <div className="text-sm text-secondary">Available</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default FeathersPage;
