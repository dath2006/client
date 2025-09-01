"use client";

import React, { useState } from "react";
import Toggle from "../../common/Toggle";

const UserSettingsPage = () => {
  const [formData, setFormData] = useState({
    allowRegistration: true,
    emailCorrespondence: true,
    activateByEmail: true,
    defaultUserGroup: "Member",
    guestGroup: "Guest",
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving user settings:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">User Settings</h1>
        <p className="text-secondary text-sm">
          Configure user registration, email settings, and default groups
        </p>
      </div>

      <div className="space-y-6">
        {/* Registration & Email Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Registration & Communication
          </h2>

          {/* Registration */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Registration
              </label>
              <p className="text-xs text-tertiary mt-1">
                Allow people to register.
              </p>
            </div>
            <Toggle
              checked={formData.allowRegistration}
              onChange={(checked) =>
                handleInputChange("allowRegistration", checked)
              }
              label="Registration toggle"
              variant="primary"
              size="md"
            />
          </div>

          {/* Email Correspondence */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Email Correspondence
              </label>
              <p className="text-xs text-tertiary mt-1">
                Allow the site to send email correspondence to users?
              </p>
            </div>
            <Toggle
              checked={formData.emailCorrespondence}
              onChange={(checked) =>
                handleInputChange("emailCorrespondence", checked)
              }
              label="Email Correspondence toggle"
              variant="secondary"
              size="md"
            />
          </div>

          {/* Activate by Email */}
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg">
            <div>
              <label className="text-sm font-medium text-primary">
                Activate by Email
              </label>
              <p className="text-xs text-tertiary mt-1">
                Should users activate by email?
              </p>
            </div>
            <Toggle
              checked={formData.activateByEmail}
              onChange={(checked) =>
                handleInputChange("activateByEmail", checked)
              }
              label="Activate by Email toggle"
              variant="success"
              size="md"
            />
          </div>
        </div>

        {/* Group Settings */}
        <div className="bg-card rounded-lg card-shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            User Groups
          </h2>

          {/* Default User Group */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              Default User Group
            </label>
            <select
              value={formData.defaultUserGroup}
              onChange={(e) =>
                handleInputChange("defaultUserGroup", e.target.value)
              }
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="Member">Member</option>
              <option value="Contributor">Contributor</option>
              <option value="Editor">Editor</option>
              <option value="Author">Author</option>
              <option value="Moderator">Moderator</option>
            </select>
            <p className="text-xs text-tertiary">
              The default group assigned to new users upon registration.
            </p>
          </div>

          {/* Guest Group */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-primary">
              "Guest" Group
            </label>
            <select
              value={formData.guestGroup}
              onChange={(e) => handleInputChange("guestGroup", e.target.value)}
              className="w-full p-3 border border-default rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            >
              <option value="Guest">Guest</option>
              <option value="Anonymous">Anonymous</option>
              <option value="Visitor">Visitor</option>
              <option value="Public">Public</option>
            </select>
            <p className="text-xs text-tertiary">
              The group name for non-registered users and visitors.
            </p>
          </div>
        </div>

        {/* Registration Requirements Info */}
        <div className="bg-card rounded-lg card-shadow p-6">
          <h2 className="text-xl font-semibold text-primary mb-4 border-b border-default pb-2">
            Registration Requirements
          </h2>

          <div className="space-y-4">
            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  formData.allowRegistration
                    ? "bg-success/5 border-success"
                    : "bg-muted/5 border-muted"
                }`}
              >
                <h3 className="font-medium text-sm text-primary mb-1">
                  Registration Status
                </h3>
                <p className="text-xs text-secondary">
                  {formData.allowRegistration
                    ? "New users can register accounts"
                    : "Registration is currently disabled"}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg border-l-4 ${
                  formData.emailCorrespondence
                    ? "bg-success/5 border-success"
                    : "bg-muted/5 border-muted"
                }`}
              >
                <h3 className="font-medium text-sm text-primary mb-1">
                  Email System
                </h3>
                <p className="text-xs text-secondary">
                  {formData.emailCorrespondence
                    ? "Email notifications are enabled"
                    : "Email notifications are disabled"}
                </p>
              </div>
            </div>

            {/* Activation Method */}
            <div
              className={`p-4 rounded-lg border-l-4 ${
                formData.activateByEmail
                  ? "bg-warning/5 border-warning"
                  : "bg-primary/5 border-primary"
              }`}
            >
              <h3 className="font-medium text-sm text-primary mb-1">
                Account Activation
              </h3>
              <p className="text-xs text-secondary">
                {formData.activateByEmail
                  ? "Users must activate accounts via email verification"
                  : "Accounts are activated immediately upon registration"}
              </p>
            </div>

            {/* Group Assignment */}
            <div className="p-4 rounded-lg border-l-4 bg-primary/5 border-primary">
              <h3 className="font-medium text-sm text-primary mb-1">
                Group Assignment
              </h3>
              <p className="text-xs text-secondary">
                New users will be assigned to the "{formData.defaultUserGroup}"
                group. Non-registered visitors are treated as "
                {formData.guestGroup}" users.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            className="btn-primary px-6 py-3 font-medium"
          >
            Save User Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
