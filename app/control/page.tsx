'use client';
import React, { useState } from 'react';

// The main App component containing the entire UI for the controls page
const App = () => {
  // State for the form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [xLink, setXLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // State for profile picture and its preview
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  // State to manage loading status for the update button
  const [isLoading, setIsLoading] = useState(false);
  // State for displaying messages to the user
  const [message, setMessage] = useState('');

  // Function to handle the file selection for the profile picture
  const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Function to handle the form submission for updating user info
  const handleUpdate = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission
    setIsLoading(true);
    setMessage('');

    // Client-side validation: check if passwords match
    if (newPassword !== confirmPassword) {
      setIsLoading(false);
      setMessage('Error: Passwords do not match!');
      return;
    }

    // Simulate an API call to update the user's information
    setTimeout(() => {
      // In a real application, you would send the data to your backend
      setIsLoading(false);
      setMessage('Profile updated successfully!');
    }, 2000);
  };
  
  // Function to handle account deletion
  const handleDeleteAccount = () => {
    // You should add a confirmation modal here in a real app
    const isConfirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (isConfirmed) {
      setIsLoading(true);
      setMessage('Deleting account...');
      // Simulate an API call for account deletion
      setTimeout(() => {
        // In a real app, this would delete the user from your database
        setIsLoading(false);
        setMessage('Account deleted successfully. You will now be logged out.');
      }, 2000);
    }
  };

  return (
    // Main container with a dark background and a centered flex layout
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4">
      
      {/* The central controls card */}
      <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl p-8 transform transition-transform duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Controls</h2>
        
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 shadow-lg mb-4">
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.93 0 3.5 1.57 3.5 3.5S13.93 12 12 12s-3.5-1.57-3.5-3.5S10.07 5 12 5zm0 14.9c-2.48 0-4.75-1.2-6.1-3.26l.46-.77c1.39 1.76 3.69 2.93 5.64 2.93 2.53 0 4.89-1.39 6.27-3.77l.55.93c-1.4 2.22-3.83 3.86-6.42 3.86z"/>
              </svg>
            )}
          </div>
          <label htmlFor="profile-pic-upload" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-colors cursor-pointer">
            Change Photo
            <input 
              id="profile-pic-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleProfilePicChange} 
            />
          </label>
        </div>

        {/* The update form */}
        <form onSubmit={handleUpdate}>
          {/* Full name input field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="fullName">
              Full name
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email input field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="email"
              type="email"
              placeholder="rohan.blr21@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Website input field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="website">
              Website
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="website"
              type="url"
              placeholder="https://example.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          
          {/* X (Twitter) input field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="xLink">
              X (Twitter) Link
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="xLink"
              type="url"
              placeholder="https://x.com/your-profile"
              value={xLink}
              onChange={(e) => setXLink(e.target.value)}
            />
          </div>
          
          {/* Facebook input field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="facebookLink">
              Facebook Link
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="facebookLink"
              type="url"
              placeholder="https://facebook.com/your-profile"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
            />
          </div>

          {/* New password input field */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="newPassword">
              New password
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          {/* Confirm password input field */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm
            </label>
            <input
              className="shadow-sm appearance-none border border-gray-700 rounded-xl w-full py-3 px-4 text-white leading-tight focus:outline-none focus:shadow-outline bg-gray-700 transition-colors duration-300 hover:bg-gray-600 focus:bg-gray-600"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Update button */}
          <div className="flex items-center justify-end">
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
                'Update'
              )}
            </button>
          </div>
        </form>

        {/* Delete Account button */}
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-4"
          disabled={isLoading}
        >
          Delete Account
        </button>

        {/* Message display area */}
        {message && (
          <div className={`mt-6 text-center text-sm font-medium ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
