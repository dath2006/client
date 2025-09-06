"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Admin = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to posts page immediately
    router.push("/admin/posts");
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted">Redirecting to posts...</p>
      </div>
    </div>
  );
};

export default Admin;
