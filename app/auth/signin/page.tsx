"use client";
import React, { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Invalid credentials. Please try again.");
      } else {
        setMessage("Sign-in successful!");
        router.push(callbackUrl);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      setMessage("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setMessage("Forgot password link sent to your email.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-sans p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 hover:scale-105 border border-default">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-2">
          Welcome Back!
        </h2>
        <p className="text-text-secondary text-center mb-6">
          Sign in to your account
        </p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-surface-elevated text-text-primary font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 mb-6 border border-default"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.88c-.26 1.37-1.04 2.54-2.22 3.32v2.79h3.58c2.09-1.94 3.31-4.77 3.31-8.12z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c3.27 0 6.01-1.08 8.01-2.93l-3.58-2.79c-.93.6-2.11.96-3.71.96-2.86 0-5.3-1.92-6.19-4.52H1.95v2.89C3.99 20.91 7.74 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.81 16.48c-.25-.71-.4-1.48-.4-2.29s.15-1.58.4-2.29V8.9h-3.96v2.89c.89 2.51 2.92 4.41 5.41 5.39z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 4.19c1.88 0 3.12.81 3.93 1.5l3.1-3.08c-1.87-1.74-4.51-2.81-7.03-2.81-4.26 0-8.01 2.09-10.05 5.17l3.96 2.89c.89-2.6 3.33-4.52 6.19-4.52z"
                  fill="#EA4335"
                ></path>
              </svg>
              <span>Sign In with Google</span>
            </>
          )}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-default"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-text-tertiary">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              className="block text-text-secondary text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                className="shadow-sm appearance-none border border-default rounded-xl w-full py-3 pl-10 pr-4 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-surface transition-colors duration-300 hover:bg-surface-elevated focus:bg-surface-elevated focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              className="block text-text-secondary text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                className="shadow-sm appearance-none border border-default rounded-xl w-full py-3 pl-10 pr-12 text-text-primary mb-3 leading-tight focus:outline-none focus:shadow-outline bg-surface transition-colors duration-300 hover:bg-surface-elevated focus:bg-surface-elevated focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text-secondary transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="inline-block text-sm text-primary font-semibold hover:text-secondary transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mx-auto animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-6 text-center text-sm font-medium ${
              message.includes("successful") ? "text-success" : "text-error"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-text-tertiary text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/auth/signup")}
              className="text-primary hover:text-secondary font-semibold transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
