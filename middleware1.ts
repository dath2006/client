import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// // Protect admin routes
// export const config = {
//   matcher: ["/admin/:path*"],
// };
