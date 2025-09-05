"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import {
  Module as ApiModule,
  getModules,
  updateModuleStatus,
  uninstallModule,
} from "../../../lib/api-legacy/admin-modules";

interface Module {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled" | "uninstalled";
  canDisable: boolean;
  canUninstall: boolean;
  conflicts: string[] | null;
}

// --- Animation Variants ---
const sectionVariants: Variants = {
  /* ... */
};
const cardVariants: Variants = {
  /* ... */
};

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching and Handlers ---
  useEffect(() => {
    const fetchModules = async () => {
      /* ... */
    };
    fetchModules();
  }, []);
  const handleToggleModule = async (moduleId: number) => {
    /* ... */
  };
  const handleUninstall = async (moduleId: number) => {
    /* ... */
  };

  const enabledModules = modules.filter((m) => m.status === "enabled");
  const disabledModules = modules.filter((m) => m.status === "disabled");
  const uninstalledModules = modules.filter((m) => m.status === "uninstalled");

  // --- Reusable Animated Components ---

  const ModuleCard = ({ module }: { module: Module }) => (
    <motion.div
      whileHover={{ y: -3, boxShadow: "var(--card-shadow-hover)" }}
      className="p-4 bg-surface rounded-lg border border-default transition-shadow h-full flex flex-col"
    >
      <div className="flex-1">{/* ... Card Content ... */}</div>
      <div className="flex gap-2 pt-3 border-t border-default">
        {/* ... Card Buttons ... */}
      </div>
    </motion.div>
  );

  // FIX: Restore the full implementation for the AnimatedCounter component.
  const AnimatedCounter = ({
    value,
    className,
  }: {
    value: number;
    className?: string;
  }) => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`text-2xl font-bold ${className}`}
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
      {/* ... The rest of the animated JSX remains the same ... */}
    </motion.div>
  );
};

export default ModulesPage;
