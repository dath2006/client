"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

interface MathSymbol {
  symbol: string;
  display: string;
  description: string;
}

const commonSymbols: MathSymbol[] = [
  { symbol: "\\frac{a}{b}", display: "a/b", description: "Fraction" },
  { symbol: "x^{2}", display: "x²", description: "Superscript" },
  { symbol: "x_{i}", display: "xᵢ", description: "Subscript" },
  { symbol: "\\sqrt{x}", display: "√x", description: "Square root" },
  { symbol: "\\int", display: "∫", description: "Integral" },
  { symbol: "\\sum", display: "∑", description: "Summation" },
  { symbol: "\\alpha", display: "α", description: "Greek alpha" },
  { symbol: "\\beta", display: "β", description: "Greek beta" },
  { symbol: "\\infty", display: "∞", description: "Infinity" },
  { symbol: "\\pi", display: "π", description: "Pi" },
  { symbol: "\\theta", display: "θ", description: "Theta" },
  { symbol: "\\leq", display: "≤", description: "Less or equal" },
];

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const previewItemVariants: Variants = {
  hidden: { opacity: 0, y: 10, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -10, height: 0, transition: { duration: 0.3 } },
};

const MathJaxSettingsPage = () => {
  // FIX: Restore the useSettings hook call to define 'saving' and other state.
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("MathJax settings saved successfully"),
      onSaveError: (error: any) =>
        console.error("Failed to save MathJax settings:", error),
    });

  const handleInputChange = (field: string, value: boolean) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 max-w-4xl p-6 mx-auto">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading settings...
        </motion.div>
      </div>
    );
  }

  const generateMathPreview = () => (
    <div className="space-y-4">
      <AnimatePresence>
        {settings.texLatexSupport && (
          <motion.div
            key="tex-preview"
            variants={previewItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden p-4 bg-card rounded-lg border border-success/20"
          >
            <h5 className="font-medium text-success mb-2">
              TeX/LaTeX Examples
            </h5>
            <div className="space-y-2 font-mono text-sm">
              {/* ... TeX/LaTeX preview content ... */}
            </div>
          </motion.div>
        )}
        {settings.mathmlSupport && (
          <motion.div
            key="mathml-preview"
            variants={previewItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden p-4 bg-card rounded-lg border border-primary/20"
          >
            <h5 className="font-medium text-primary mb-2">MathML Example</h5>
            <div className="font-mono text-sm">
              {/* ... MathML preview content ... */}
            </div>
          </motion.div>
        )}
        {!settings.texLatexSupport && !settings.mathmlSupport && (
          <motion.div
            key="no-support-preview"
            variants={previewItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden p-4 bg-warning/5 border border-warning/20 rounded-lg text-center"
          >
            <p className="text-warning font-medium">No math support enabled</p>
            <p className="text-secondary text-sm mt-1">
              Enable a format to see a preview
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="max-w-4xl p-6 mx-auto space-y-8"
    >
      <motion.div variants={sectionVariants}>
        <h1 className="mb-2 text-3xl font-bold text-primary">
          MathJax Settings
        </h1>
        <p className="text-sm text-secondary">
          Configure mathematical notation rendering
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* ... All other sections ... */}

        {/* Save Button */}
        <motion.div
          variants={sectionVariants}
          className="flex justify-end pt-6"
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 font-medium btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Update MathJax Settings"}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MathJaxSettingsPage;
