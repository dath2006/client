'use client';
import React, { useState } from 'react';

// The main App component containing the entire UI
const App = () => {
  // State for the email and password input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to manage loading status for the sign-in buttons
  const [isLoading, setIsLoading] = useState(false);
  // State for displaying messages to the user (e.g., success or error)
  const [message, setMessage] = useState('');

  // Function to handle the sign-in form submission
  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission
    setIsLoading(true);
    setMessage('');

    // Simulate an API call
    setTimeout(() => {
      // In a real application, you would validate credentials here
      setIsLoading(false);
      setMessage('Sign-in successful!');
    }, 2000);
  };

  // Function to handle Google sign-in
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setMessage('');

    // Simulate an API call for Google sign-in
    setTimeout(() => {
      // In a real app, this would redirect to Google's auth page
      setIsLoading(false);
      setMessage('Redirecting to Google for sign-in...');
    }, 2000);
  };

  // Function to handle the forgot password action
  const handleForgotPassword = () => {
    setMessage('Forgot password link sent to your email.');
  };

  return (
    // Main container with a dark background and a centered flex layout
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4">
      
      {/* The central login card */}
      <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back!</h2>
        <p className="text-gray-400 text-center mb-8">Sign in to your account</p>

        {/* Sign-in with Google button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-gray-800 font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mb-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <>
              {/* Google SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.88c-.26 1.37-1.04 2.54-2.22 3.32v2.79h3.58c2.09-1.94 3.31-4.77 3.31-8.12z" fill="#4285F4"></path>
                <path d="M12 23c3.27 0 6.01-1.08 8.01-2.93l-3.58-2.79c-.93.6-2.11.96-3.71.96-2.86 0-5.3-1.92-6.19-4.52H1.95v2.89C3.99 20.91 7.74 23 12 23z" fill="#34A853"></path>
                <path d="M5.81 16.48c-.25-.71-.4-1.48-.4-2.29s.15-1.58.4-2.29V8.9h-3.96v2.89c.89 2.51 2.92 4.41 5.41 5.39z" fill="#FBBC05"></path>
                <path d="M12 4.19c1.88 0 3.12.81 3.93 1.5l3.1-3.08c-1.87-1.74-4.51-2.81-7.03-2.81-4.26 0-8.01 2.09-10.05 5.17l3.96 2.89c.89-2.6 3.33-4.52 6.19-4.52z" fill="#EA4335"></path>
              </svg>
              <span>Sign In with Google</span>
            </>
          )}
        </button>

        {/* Separator for the form */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-600"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Email and password form */}
        <form onSubmit={handleSignIn}>
          {/* Email input field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input field */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot password button */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="inline-block text-sm text-blue-400 font-semibold hover:text-blue-300 transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign-in button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Message display area */}
        {message && (
          <div className="mt-6 text-center text-sm font-medium text-green-400">
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
