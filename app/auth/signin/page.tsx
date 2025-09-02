"use client";
import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, CheckCircle } from "lucide-react";

// --- Modern Checkbox Challenge Component ---
// This simulates a modern "I'm not a robot" checkbox that tracks mouse behavior.
const CheckboxChallenge = ({ onVerified }: { onVerified: (isVerified: boolean) => void }) => {
  // 'initial': waiting for user | 'analyzing': mouse entered, "verifying" | 'ready': checkbox enabled | 'verified': success
  const [status, setStatus] = useState<'initial' | 'analyzing' | 'ready' | 'verified'>('initial');
  const mouseMovements = useRef(0);
  const analysisTimer = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (analysisTimer.current) {
        clearTimeout(analysisTimer.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Start analysis only once
    if (status === 'initial') {
      setStatus('analyzing');
      mouseMovements.current = 0;

      // Simulate a backend check. After 1.5s, if the mouse has moved, verification is ready.
      analysisTimer.current = setTimeout(() => {
        if (mouseMovements.current > 5) { // Check for a small amount of movement
          setStatus('ready');
        } else {
          // If no movement, it might be a bot. Reset.
          setStatus('initial');
        }
      }, 1500);
    }
  };

  const handleMouseLeave = () => {
    // If user leaves before analysis is complete, reset
    if (status === 'analyzing') {
        setStatus('initial');
        if (analysisTimer.current) clearTimeout(analysisTimer.current);
    }
  };

  const handleMouseMove = () => {
    if (status === 'analyzing') {
      mouseMovements.current++;
    }
  };

  const handleCheckboxClick = () => {
    if (status === 'ready') {
      setStatus('verified');
      onVerified(true);
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case 'analyzing':
        return <Loader2 className="h-6 w-6 text-muted animate-spin" />;
      case 'ready':
        return <div onClick={handleCheckboxClick} className="h-6 w-6 border-2 border-muted rounded cursor-pointer hover:border-primary"></div>;
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-success" />;
      case 'initial':
      default:
        return <div className="h-6 w-6 border-2 border-muted rounded"></div>;
    }
  };

  return (
    <div 
      className="mb-6 p-4 border border-default rounded-xl bg-surface flex items-center justify-start space-x-4 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="flex-shrink-0">
        {getStatusContent()}
      </div>
      <p className="font-semibold text-text-secondary">
        {status === 'verified' ? 'You are verified!' : "I'm not a robot"}
      </p>
    </div>
  );
};


const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isHumanVerified, setIsHumanVerified] = useState(false);

  // Mock Next.js router
  const router = {
    push: (path: string) => {
      setMessage(`Navigating to ${path}...`);
      console.log(`Navigating to ${path}`);
    },
  };
  
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams('');
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Mock signIn function
  const signIn = (provider: string, options?: { email?: string; password?: string; callbackUrl?: string; redirect?: boolean; }) => {
    return new Promise<{ ok: boolean; error: string | null }>((resolve) => {
      setTimeout(() => {
        if (provider === 'credentials') {
          if (options?.email === "test@example.com" && options?.password === "password") {
            resolve({ ok: true, error: null });
          } else {
            resolve({ ok: false, error: "Invalid credentials" });
          }
        } else if (provider === 'google') {
          setMessage("Redirecting to Google for sign-in...");
          console.log("Simulating Google Sign-In redirect.");
        }
      }, 1500);
    });
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isHumanVerified) {
      setMessage("Please complete the human verification check.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setMessage("Invalid credentials. Please try again.");
      } else {
        setMessage("Sign-in successful!");
        router.push(callbackUrl);
      }
    } catch (error: any) {
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
    } catch (error: any) {
      setMessage("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setMessage("If an account exists, a password reset link has been sent.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-sans p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 hover:scale-105 border border-default">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-2">Welcome Back!</h2>
        <p className="text-text-secondary text-center mb-6">Sign in to your account</p>

        <button onClick={handleGoogleSignIn} className="w-full bg-surface-elevated text-text-primary font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 mb-6 border border-default" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.88c-.26 1.37-1.04 2.54-2.22 3.32v2.79h3.58c2.09-1.94 3.31-4.77 3.31-8.12z" fill="#4285F4"></path>
                <path d="M12 23c3.27 0 6.01-1.08 8.01-2.93l-3.58-2.79c-.93.6-2.11.96-3.71.96-2.86 0-5.3-1.92-6.19-4.52H1.95v2.89C3.99 20.91 7.74 23 12 23z" fill="#34A853"></path>
                <path d="M5.81 16.48c-.25-.71-.4-1.48-.4-2.29s.15-1.58.4-2.29V8.9h-3.96v2.89c.89 2.51 2.92 4.41 5.41 5.39z" fill="#FBBC05"></path>
                <path d="M12 4.19c1.88 0 3.12.81 3.93 1.5l3.1-3.08c-1.87-1.74-4.51-2.81-7.03-2.81-4.26 0-8.01 2.09-10.05 5.17l3.96 2.89c.89-2.6 3.33-4.52 6.19-4.52z" fill="#EA4335"></path>
              </svg>
              <span>Sign In with Google</span>
            </>
          )}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-default"></span></div>
          <div className="relative flex justify-center text-sm"><span className="bg-card px-2 text-text-tertiary">Or continue with</span></div>
        </div>

        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
              <input className="shadow-sm appearance-none border border-default rounded-xl w-full py-3 pl-10 pr-4 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-surface transition-colors duration-300 hover:bg-surface-elevated focus:bg-surface-elevated focus:ring-2 focus:ring-primary focus:ring-opacity-50" id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted" />
              <input className="shadow-sm appearance-none border border-default rounded-xl w-full py-3 pl-10 pr-12 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-surface transition-colors duration-300 hover:bg-surface-elevated focus:bg-surface-elevated focus:ring-2 focus:ring-primary focus:ring-opacity-50" id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-text-secondary transition-colors duration-200">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <CheckboxChallenge onVerified={setIsHumanVerified} />

          <div className="flex justify-end mb-6">
            <button type="button" onClick={handleForgotPassword} className="inline-block text-sm text-primary font-semibold hover:text-secondary transition-colors duration-200">
              Forgot Password?
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:bg-muted disabled:cursor-not-allowed disabled:hover:scale-100" disabled={isLoading || !isHumanVerified}>
              {isLoading ? <Loader2 className="h-5 w-5 mx-auto animate-spin" /> : "Sign In"}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-6 text-center text-sm font-medium ${message.includes("successful") ? "text-success" : message.includes("verification") ? "text-yellow-500" : "text-error"}`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-text-tertiary text-sm">
            Don't have an account?{" "}
            <button onClick={() => router.push("/auth/signup")} className="text-primary hover:text-secondary font-semibold transition-colors duration-200">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

