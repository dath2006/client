import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// This is the main configuration file for NextAuth.js.
// It defines how users can sign in (providers) and other security settings.

export const {
  handlers, // This object contains the GET and POST request handlers
  auth,     // This is a helper function to get the current user's session
  signIn,   // Function to initiate sign-in
  signOut,  // Function to initiate sign-out
} = NextAuth({
  // === PROVIDERS ===
  // Here, you define the different ways a user can log in.
  // We'll start with a "Credentials" provider for email/password login.
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // This is where you would put your logic to verify the user's credentials
      // against your database. For now, we'll use a mock user for demonstration.
      async authorize(credentials) {
        // This check ensures that credentials and its properties exist, resolving the TypeScript error.
        if (!credentials?.email || !credentials?.password) return null;

        // IMPORTANT: Replace this with your actual user validation logic.
        if (credentials.email === "test@example.com" && credentials.password === "password") {
          // Return the user object if authentication is successful
          return { id: "1", name: "Test User", email: "test@example.com" };
        }
        // Return null if authentication fails
        return null;
      },
    }),
    // You can add other providers here, like Google, GitHub, etc.
    // e.g., GoogleProvider({ clientId: "...", clientSecret: "..." })
  ],

  // ✅ ADD THIS LINE
  // This reads the secret from your .env.local file and is required.
  secret: process.env.AUTH_SECRET,

  // === OTHER SETTINGS ===
  // You can add session strategies, callbacks, and other configurations here.
  // For now, the default settings are fine.
});