"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2, HelpCircle } from "lucide-react";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  // 1. Added state for the security answer
  const [securityAnswer, setSecurityAnswer] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // A placeholder security question
  const securityQuestion = "What is 2 + 2?";

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    // 2. Added validation for the security question
    if (securityAnswer.trim() !== "4") {
      setMessage("Incorrect answer to the security question.");
      setIsLoading(false);
      return;
    }

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
          {/* ... Google Sign In Button Content ... */}
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
          
          {/* 3. Added Security Question and Answer fields */}
          <div className="mb-6">
            <label
              className="block text-text-secondary text-sm font-bold mb-2"
              htmlFor="security-question"
            >
              {securityQuestion}
            </label>
            <div className="relative">
              <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                className="shadow-sm appearance-none border border-default rounded-xl w-full py-3 pl-10 pr-4 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-surface transition-colors duration-300 hover:bg-surface-elevated focus:bg-surface-elevated focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                id="security-question"
                type="text"
                placeholder="Your answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
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
              message.includes("successful") || message.includes("sent")
                ? "text-success"
                : "text-error"
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