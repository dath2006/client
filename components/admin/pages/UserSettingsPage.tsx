"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Toggle from "../../common/Toggle";
import { useSettings } from "@/hooks/useSettings";

// Framer Motion Variants for cleaner animation definitions
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

// --- COMPONENT ---
const UserSettingsPage = () => {
  const { settings, loading, saving, error, updateSetting, saveSettings } =
    useSettings({
      onSaveSuccess: () => console.log("User settings saved successfully"),
      onSaveError: (err) => console.error("Failed to save user settings:", err),
    });

  const handleInputChange = (field: string, value: string | boolean) => {
    updateSetting(field, value);
  };

  const handleSave = async () => {
    await saveSettings();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          className="flex items-center justify-center h-64 text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading settings...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-primary mb-2">User Settings</h1>
        <p className="text-secondary text-sm">
          Configure user registration, email settings, and default groups.
        </p>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-error/5 border border-error/20 rounded-lg p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-error text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Registration & Email Settings */}
        <motion.div
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-3">
            Registration & Communication
          </h2>
          <motion.div
            className="flex items-center justify-between p-4 bg-surface rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <label className="text-sm font-medium text-primary">
                Registration
              </label>
              <p className="text-xs text-tertiary mt-1">
                Allow people to register.
              </p>
            </div>
            <Toggle
              checked={settings.allowRegistration || false}
              onChange={(checked) =>
                handleInputChange("allowRegistration", checked)
              }
              label="Registration toggle"
            />
          </motion.div>
          <motion.div
            className="flex items-center justify-between p-4 bg-surface rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <label className="text-sm font-medium text-primary">
                Email Correspondence
              </label>
              <p className="text-xs text-tertiary mt-1">
                Allow sending emails to users.
              </p>
            </div>
            <Toggle
              checked={settings.emailCorrespondence}
              onChange={(checked) =>
                handleInputChange("emailCorrespondence", checked)
              }
              label="Email Correspondence toggle"
            />
          </motion.div>
          <motion.div
            className="flex items-center justify-between p-4 bg-surface rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <label className="text-sm font-medium text-primary">
                Activate by Email
              </label>
              <p className="text-xs text-tertiary mt-1">
                Require users to verify their email.
              </p>
            </div>
            <Toggle
              checked={settings.activateByEmail}
              onChange={(checked) =>
                handleInputChange("activateByEmail", checked)
              }
              label="Activate by Email toggle"
            />
          </motion.div>
        </motion.div>

        {/* Group Settings */}
        <motion.div
          className="bg-card rounded-lg card-shadow p-6 space-y-6"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-3">
            User Groups
          </h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default User Group
            </label>
            <motion.select
              value={settings.defaultUserGroup}
              onChange={(e) =>
                handleInputChange("defaultUserGroup", e.target.value)
              }
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              whileHover={{ scale: 1.01 }}
            >
              <option value="Member">Member</option>
              <option value="Contributor">Contributor</option>
              <option value="Editor">Editor</option>
              <option value="Author">Author</option>
              <option value="Moderator">Moderator</option>
            </motion.select>
            <p className="text-xs text-tertiary">
              Assigned to new users upon registration.
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              "Guest" Group
            </label>
            <motion.select
              value={settings.guestGroup}
              onChange={(e) => handleInputChange("guestGroup", e.target.value)}
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              whileHover={{ scale: 1.01 }}
            >
              <option value="Guest">Guest</option>
              <option value="Anonymous">Anonymous</option>
              <option value="Visitor">Visitor</option>
              <option value="Public">Public</option>
            </motion.select>
            <p className="text-xs text-tertiary">
              For non-registered users and visitors.
            </p>
          </div>
        </motion.div>

        {/* Settings Summary Info */}
        <motion.div
          className="bg-card rounded-lg card-shadow p-6"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-3">
            Configuration Summary
          </h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div
                layout
                className={`p-4 rounded-lg border-l-4`}
                animate={{
                  borderColor: settings.allowRegistration
                    ? "#22c55e"
                    : "#64748b",
                  backgroundColor: settings.allowRegistration
                    ? "rgba(34,197,94,0.05)"
                    : "rgba(100,116,139,0.05)",
                }}
              >
                <h3 className="font-medium text-sm text-primary mb-1">
                  Registration Status
                </h3>
                <p className="text-xs text-secondary">
                  {settings.allowRegistration
                    ? "New users can register"
                    : "Registration is disabled"}
                </p>
              </motion.div>
              <motion.div
                layout
                className={`p-4 rounded-lg border-l-4`}
                animate={{
                  borderColor: settings.emailCorrespondence
                    ? "#22c55e"
                    : "#64748b",
                  backgroundColor: settings.emailCorrespondence
                    ? "rgba(34,197,94,0.05)"
                    : "rgba(100,116,139,0.05)",
                }}
              >
                <h3 className="font-medium text-sm text-primary mb-1">
                  Email System
                </h3>
                <p className="text-xs text-secondary">
                  {settings.emailCorrespondence
                    ? "Email notifications are enabled"
                    : "Email notifications are disabled"}
                </p>
              </motion.div>
            </div>
            <motion.div
              layout
              className={`p-4 rounded-lg border-l-4`}
              animate={{
                borderColor: settings.activateByEmail ? "#f97316" : "#3b82f6",
                backgroundColor: settings.activateByEmail
                  ? "rgba(249,115,22,0.05)"
                  : "rgba(59,130,246,0.05)",
              }}
            >
              <h3 className="font-medium text-sm text-primary mb-1">
                Account Activation
              </h3>
              <p className="text-xs text-secondary">
                {settings.activateByEmail
                  ? "Requires email verification"
                  : "Activated immediately"}
              </p>
            </motion.div>
            <div className="p-4 rounded-lg border-l-4 bg-primary/5 border-primary">
              <h3 className="font-medium text-sm text-primary mb-1">
                Group Assignment
              </h3>
              <p className="text-xs text-secondary">
                New users are assigned as "{settings.defaultUserGroup}".
                Visitors are treated as "{settings.guestGroup}".
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div className="flex justify-end pt-6" variants={itemVariants}>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: saving ? 1 : 1.05 }}
          whileTap={{ scale: saving ? 1 : 0.95 }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={saving ? "saving" : "save"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              {saving ? "Saving..." : "Save User Settings"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default UserSettingsPage;
