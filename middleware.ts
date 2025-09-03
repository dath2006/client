import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // Log access attempts to protected routes
  console.log(`Protected route accessed: ${req.nextUrl.pathname}`);
  console.log(`Auth status:`, !!req.auth);

  // Check if user is authenticated
  const isAuthenticated = !!req.auth;

  if (!isAuthenticated) {
    // Redirect to signin page with callback URL
    return NextResponse.redirect(
      new URL(
        `/auth/signin?callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`,
        req.url
      )
    );
  }

  // Add custom middleware logic here if needed
  // For example, role-based access control:
  // if (req.nextUrl.pathname.startsWith("/admin") && !req.auth?.user?.role?.includes("admin")) {
  //   return NextResponse.redirect(new URL("/auth/signin", req.url));
  // }

  return NextResponse.next();
});

// Protect admin routes and any other authenticated routes
export const config = {
  matcher: [
    // Protect admin routes
    "/admin/:path*",
    // Add other protected routes as needed
    // "/dashboard/:path*",
    // "/profile/:path*",
  ],
};
