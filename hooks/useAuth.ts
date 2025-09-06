import { useSession } from "next-auth/react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
}

export const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isLoading = status === "loading";

  const user: AuthUser | null = session?.user
    ? {
        id: (session.user as any).id || "",
        email: session.user.email || "",
        name: session.user.name || "",
        role: (session.user as any).role,
        avatar: session.user.image || undefined,
      }
    : null;

  return {
    user,
    isAuthenticated,
    isLoading,
    session,
  };
};

export default useAuth;
