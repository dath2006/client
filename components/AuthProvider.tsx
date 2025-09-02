"use client";

import React from "react";

// This is a mock SessionProvider. In a real Next.js app, this would be
// imported from "next-auth/react". We create a simple version here to
// prevent the "Module not found" error in this environment.
const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  // The real SessionProvider uses React Context to share session data.
  // For this mock, we just need it to render the components inside it.
  return <>{children}</>;
};

// This is the AuthProvider component that uses our mock SessionProvider.
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
