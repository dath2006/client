"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Camera,
  Save,
  LogOut,
  Trash2,
  User,
  Globe,
  Twitter,
  Facebook,
  Loader2,
} from "lucide-react";
import {
  userProfileAPI,
  ApiError,
  type UserProfile,
  type UpdateProfileData,
  type ChangePasswordData,
} from "@/lib/api";

const ProfilePage = () => {
  const { data: session, status } = useSession();

  // State for user profile data
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // State for the form fields
  const [formData, setFormData] = useState({
    fullName: "",
    website: "",
    xLink: "",
    facebookLink: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for profile picture and its preview
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );

  // State to manage loading status
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for displaying messages to the user
  const [message, setMessage] = useState("");

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user?.id) {
        try {
          setIsInitialLoading(true);
          const profile = await userProfileAPI.getUserProfile(session.user.id);
          setUserProfile(profile);

          // Populate form with current data
          setFormData({
            fullName: profile.name || "",
            website: profile.website || "",
            xLink: profile.twitter_link || "",
            facebookLink: profile.facebook_link || "",
            newPassword: "",
            confirmPassword: "",
          });

          setProfilePicPreview(profile.avatar || null);
        } catch (error) {
          console.error("Error loading profile:", error);
          if (error instanceof ApiError) {
            setMessage(`Error: ${error.message}`);
          } else {
            setMessage("Error: Failed to load profile data.");
          }
        } finally {
          setIsInitialLoading(false);
        }
      }
    };

    if (session?.user?.id) {
      loadUserProfile();
    }
  }, [session?.user?.id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle the file selection for the profile picture
  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("Error: File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setMessage("Error: Please select a valid image file");
        return;
      }

      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
      setMessage("");
    }
  };

  // Function to handle the form submission for updating user info
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session?.user?.id) return;

    setIsLoading(true);
    setMessage("");

    try {
      let updatedProfile = userProfile;

      // 1. Update profile picture if changed
      if (profilePic) {
        const avatarResult = await userProfileAPI.updateAvatar(
          session.user.id,
          profilePic
        );
        setMessage("Avatar updated successfully!");
        setProfilePicPreview(avatarResult.avatar_url);
        setProfilePic(null); // Reset the file input
      }

      // 2. Update basic profile information
      const profileUpdateData: UpdateProfileData = {
        name: formData.fullName,
        website: formData.website || null,
        twitter_link: formData.xLink || null,
        facebook_link: formData.facebookLink || null,
      };

      updatedProfile = await userProfileAPI.updateProfile(
        session.user.id,
        profileUpdateData
      );
      setUserProfile(updatedProfile);

      // 3. Update password if provided
      if (formData.newPassword) {
        // Client-side validation: check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage("Error: Passwords do not match!");
          setIsLoading(false);
          return;
        }

        const passwordData: ChangePasswordData = {
          new_password: formData.newPassword,
        };

        await userProfileAPI.changePassword(session.user.id, passwordData);

        // Clear password fields after successful update
        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
      }

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      if (error instanceof ApiError) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Error: Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    if (!session?.user?.id) return;

    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      setIsLoading(true);
      setMessage("Deleting account...");

      try {
        await userProfileAPI.deleteAccount(session.user.id);
        setMessage("Account deleted successfully. You will now be logged out.");

        // Sign out after successful deletion
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 1000);
      } catch (error) {
        console.error("Delete error:", error);
        if (error instanceof ApiError) {
          setMessage(`Error: ${error.message}`);
        } else {
          setMessage("Error: Failed to delete account. Please try again.");
        }
        setIsLoading(false);
      }
    }
  };

  // Show loading state
  if (status === "loading" || isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center gap-2 text-text-secondary">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Access Denied
          </h2>
          <p className="text-text-secondary mb-6">
            Please sign in to access your profile.
          </p>
          <a
            href="/auth/signin"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-6 rounded-xl transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Profile Settings
              </h1>
              <p className="text-text-secondary">
                Manage your account settings and preferences
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-border shadow-lg mb-4 bg-surface">
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                  <User className="w-16 h-16" />
                </div>
              )}
              <label
                htmlFor="profile-pic-upload"
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="profile-pic-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>
            <div className="text-center">
              <p className="text-text-primary font-medium">
                {userProfile?.name || session.user?.name}
              </p>
              <p className="text-text-secondary text-sm">
                {userProfile?.email || session.user?.email}
              </p>
            </div>
          </div>

          {/* Update Form */}
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Basic Information
              </h3>

              <div>
                <label
                  className="block text-text-primary font-medium mb-2"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-text-primary font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-secondary cursor-not-allowed"
                  id="email"
                  type="email"
                  value={userProfile?.email || session.user?.email || ""}
                  disabled
                />
                <p className="text-text-tertiary text-sm mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Social Links
              </h3>

              <div>
                <label
                  className="flex items-center gap-2 text-text-primary font-medium mb-2"
                  htmlFor="website"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  className="flex items-center gap-2 text-text-primary font-medium mb-2"
                  htmlFor="xLink"
                >
                  <Twitter className="w-4 h-4" />X (Twitter) Link
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  id="xLink"
                  name="xLink"
                  type="url"
                  placeholder="https://x.com/your-profile"
                  value={formData.xLink}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  className="flex items-center gap-2 text-text-primary font-medium mb-2"
                  htmlFor="facebookLink"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook Link
                </label>
                <input
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  id="facebookLink"
                  name="facebookLink"
                  type="url"
                  placeholder="https://facebook.com/your-profile"
                  value={formData.facebookLink}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Change Password */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary border-b border-border pb-2">
                Change Password
              </h3>

              <div>
                <label
                  className="block text-text-primary font-medium mb-2"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 pr-12 bg-surface border border-border rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="block text-text-primary font-medium mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 pr-12 bg-surface border border-border rounded-xl text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isLoading ? "Updating..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="bg-error hover:bg-error/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Account
              </button>
            </div>
          </form>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-center font-medium ${
                message.includes("Error") || message.includes("Failed")
                  ? "bg-error/10 text-error border border-error/20"
                  : "bg-success/10 text-success border border-success/20"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
