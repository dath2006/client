import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV === "development",
  providers: [
    // Only add Google provider if credentials are available
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("Environment check:");
        console.log("FASTAPI_URL:", process.env.FASTAPI_URL);
        console.log(
          "NEXTAUTH_SECRET:",
          process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET"
        );
        console.log("Authorize called with:", { email: credentials?.email });

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log("Calling FastAPI backend...");
          // Call your FastAPI backend to authenticate
          const response = await fetch(
            `${process.env.FASTAPI_URL}/api/v1/auth/signin`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          console.log("Backend response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.log("Backend error:", errorText);
            return null;
          }

          const user = await response.json();
          console.log("User data from backend:", user);

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
          if (error instanceof Error) {
            console.error("Error details:", error.message);
          }
          return null;
        }

        console.log("No user returned from backend");
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Extract username from email (part before @)
          const username = user.email?.split("@")[0] || "";

          // Send Google user data to your FastAPI backend
          const response = await fetch(
            `${process.env.FASTAPI_URL}/api/v1/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                username,
                google_id: user.id,
                image: user.image,
              }),
            }
          );

          if (response.ok) {
            const backendUser = await response.json();
            user.id = backendUser.id;
            return true;
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
});
