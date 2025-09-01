"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import PostsPage from "@/components/admin/pages/PostsPage";
import PagesPage from "@/components/admin/pages/PagesPage";
import UsersPage from "@/components/admin/pages/UsersPage";
import GroupsPage from "@/components/admin/pages/GroupsPage";
import UploadsPage from "@/components/admin/pages/UploadsPage";
import GeneralSettingsPage from "@/components/admin/pages/GeneralSettingsPage";
import ContentSettingsPage from "@/components/admin/pages/ContentSettingsPage";
import UserSettingsPage from "@/components/admin/pages/UserSettingsPage";
import CommentsSettingsPage from "@/components/admin/pages/CommentsSettingsPage";
import RoutesSettingsPage from "@/components/admin/pages/RoutesSettingsPage";
import ModulesPage from "@/components/admin/pages/ModulesPage";
import FeathersPage from "@/components/admin/pages/FeathersPage";
import ThemesPage from "@/components/admin/pages/ThemesPage";
import SitemapSettingsPage from "@/components/admin/pages/SitemapSettingsPage";
import ReadmoreSettingsPage from "@/components/admin/pages/ReadmoreSettingsPage";
import LikesSettingsPage from "@/components/admin/pages/LikesSettingsPage";
import CascadeSettingsPage from "@/components/admin/pages/CascadeSettingsPage";
import LightboxSettingsPage from "@/components/admin/pages/LightboxSettingsPage";
import SyntaxHighlightingSettingsPage from "@/components/admin/pages/SyntaxHighlightingSettingsPage";
import MathJaxSettingsPage from "@/components/admin/pages/MathJaxSettingsPage";
import TagsPage from "@/components/admin/pages/TagsPage";

interface AdminSectionPageProps {
  params: Promise<{
    section: string;
  }>;
}

const AdminSectionPage = ({ params }: AdminSectionPageProps) => {
  const { section } = React.use(params);

  const renderSectionContent = () => {
    switch (section.toLowerCase()) {
      case "posts":
        return <PostsPage />;
      case "pages":
        return <PagesPage />;
      case "users":
        return <UsersPage />;
      case "groups":
        return <GroupsPage />;
      case "uploads":
        return <UploadsPage />;
      case "tags":
        return <TagsPage />;
      case "general":
        return <GeneralSettingsPage />;
      case "content":
        return <ContentSettingsPage />;
      case "usersettings":
        return <UserSettingsPage />;
      case "comments":
        return <CommentsSettingsPage />;
      case "routes":
        return <RoutesSettingsPage />;
      case "sitemap":
        return <SitemapSettingsPage />;
      case "readmore":
        return <ReadmoreSettingsPage />;
      case "likes":
        return <LikesSettingsPage />;
      case "cascade":
        return <CascadeSettingsPage />;
      case "lightbox":
        return <LightboxSettingsPage />;
      case "syntaxhighlighting":
        return <SyntaxHighlightingSettingsPage />;
      case "mathjax":
        return <MathJaxSettingsPage />;
      case "modules":
        return <ModulesPage />;
      case "feathers":
        return <FeathersPage />;
      case "themes":
        return <ThemesPage />;
      default:
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#f7a5a5] mb-6">
              Section Not Found
            </h1>
            <p className="text-gray-600">
              The section "{section}" does not exist.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto mt-16 p-8">
        {renderSectionContent()}
      </main>
    </div>
  );
};

export default AdminSectionPage;
