"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";

const Admin = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg card-shadow p-6 border border-border">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Posts
            </h3>
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-sm text-muted">Total published posts</p>
          </div>
          <div className="bg-card rounded-lg card-shadow p-6 border border-border">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Pages
            </h3>
            <p className="text-2xl font-bold text-success">5</p>
            <p className="text-sm text-muted">Static pages</p>
          </div>
          <div className="bg-card rounded-lg card-shadow p-6 border border-border">
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Users
            </h3>
            <p className="text-2xl font-bold text-secondary">8</p>
            <p className="text-sm text-muted">Registered users</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            Recent Activity
          </h2>
          <div className="bg-card rounded-lg card-shadow border border-border">
            <div className="p-4 border-b border-border">
              <p className="text-sm">
                <span className="font-medium">John Doe</span> created a new post
                <span className="text-muted ml-2">2 hours ago</span>
              </p>
            </div>
            <div className="p-4 border-b border-border">
              <p className="text-sm">
                <span className="font-medium">Jane Smith</span> updated user
                settings
                <span className="text-muted ml-2">4 hours ago</span>
              </p>
            </div>
            <div className="p-4">
              <p className="text-sm">
                <span className="font-medium">Admin</span> installed new module
                <span className="text-muted ml-2">1 day ago</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
