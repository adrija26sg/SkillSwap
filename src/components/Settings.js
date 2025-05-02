import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateUserSettings, getUserSettings } from "../services/userService";

function Settings() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      sessionReminders: true,
      messages: true,
      updates: false
    },
    privacy: {
      profileVisibility: "public", // public, connections, private
      showEmail: false,
      showSkills: true,
      showAvailability: true
    },
    appearance: {
      theme: "dark", // dark, light, system
      compactView: false,
      fontSize: "medium" // small, medium, large
    },
    account: {
      twoFactorAuth: false,
      sessionTimeout: 60 // minutes
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setLoading(true);
        const userSettings = await getUserSettings(currentUser.uid);
        if (userSettings) {
          setSettings(userSettings);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
        setError("Failed to load your settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [currentUser?.uid]);

  const handleChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      await updateUserSettings(currentUser.uid, settings);
      
      setSuccessMessage("Settings saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin animation-delay-500"></div>
        </div>
        <p className="mt-4 text-blue-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          Account Settings
        </h2>
        <p className="text-gray-300 max-w-3xl">
          Customize your SkillSwap experience and manage your account preferences.
        </p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-4 mb-6">
          <p className="text-green-200 text-sm">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 sticky top-24">
            <nav className="space-y-1">
              <a href="#notifications" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Notifications
              </a>
              <a href="#privacy" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Privacy
              </a>
              <a href="#appearance" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" />
                </svg>
                Appearance
              </a>
              <a href="#account" className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
                Account
              </a>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Notifications Section */}
          <section id="notifications" className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-gray-400 text-sm">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.email}
                    onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Browser Notifications</h4>
                  <p className="text-gray-400 text-sm">Receive notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.browser}
                    onChange={(e) => handleChange('notifications', 'browser', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Session Reminders</h4>
                  <p className="text-gray-400 text-sm">Get reminders about upcoming learning sessions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.sessionReminders}
                    onChange={(e) => handleChange('notifications', 'sessionReminders', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Message Notifications</h4>
                  <p className="text-gray-400 text-sm">Get notified when you receive new messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.messages}
                    onChange={(e) => handleChange('notifications', 'messages', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Platform Updates</h4>
                  <p className="text-gray-400 text-sm">Receive updates about new features and improvements</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications.updates}
                    onChange={(e) => handleChange('notifications', 'updates', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section id="privacy" className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white">Privacy Settings</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Profile Visibility</h4>
                <p className="text-gray-400 text-sm mb-3">Control who can see your profile</p>
                <select 
                  className="w-full rounded-lg bg-gray-700/50 border border-gray-600 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleChange('privacy', 'profileVisibility', e.target.value)}
                >
                  <option value="public">Public - Anyone can view your profile</option>
                  <option value="connections">Connections Only - Only people you've connected with</option>
                  <option value="private">Private - Only you can see your profile</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Show Email Address</h4>
                  <p className="text-gray-400 text-sm">Display your email on your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.privacy.showEmail}
                    onChange={(e) => handleChange('privacy', 'showEmail', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Show Skills</h4>
                  <p className="text-gray-400 text-sm">Display your skills on your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.privacy.showSkills}
                    onChange={(e) => handleChange('privacy', 'showSkills', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Show Availability</h4>
                  <p className="text-gray-400 text-sm">Display your availability on your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.privacy.showAvailability}
                    onChange={(e) => handleChange('privacy', 'showAvailability', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section id="appearance" className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white">Appearance Settings</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Theme</h4>
                <p className="text-gray-400 text-sm mb-3">Choose your preferred theme</p>
                <div className="grid grid-cols-3 gap-4">
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.appearance.theme === 'dark' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}`}
                    onClick={() => handleChange('appearance', 'theme', 'dark')}
                  >
                    <div className="h-12 bg-gray-900 rounded-md mb-2"></div>
                    <p className="text-center text-sm text-white">Dark</p>
                  </div>
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.appearance.theme === 'light' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}`}
                    onClick={() => handleChange('appearance', 'theme', 'light')}
                  >
                    <div className="h-12 bg-gray-100 rounded-md mb-2"></div>
                    <p className="text-center text-sm text-white">Light</p>
                  </div>
                  <div 
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.appearance.theme === 'system' ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}`}
                    onClick={() => handleChange('appearance', 'theme', 'system')}
                  >
                    <div className="h-12 bg-gradient-to-r from-gray-900 to-gray-100 rounded-md mb-2"></div>
                    <p className="text-center text-sm text-white">System</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Compact View</h4>
                  <p className="text-gray-400 text-sm">Use a more compact layout</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.appearance.compactView}
                    onChange={(e) => handleChange('appearance', 'compactView', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Font Size</h4>
                <p className="text-gray-400 text-sm mb-3">Adjust the text size</p>
                <select 
                  className="w-full rounded-lg bg-gray-700/50 border border-gray-600 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.appearance.fontSize}
                  onChange={(e) => handleChange('appearance', 'fontSize', e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section id="account" className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold mb-4 text-white">Account Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                  <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.account.twoFactorAuth}
                    onChange={(e) => handleChange('account', 'twoFactorAuth', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Session Timeout</h4>
                <p className="text-gray-400 text-sm mb-3">Automatically log out after inactivity</p>
                <select 
                  className="w-full rounded-lg bg-gray-700/50 border border-gray-600 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settings.account.sessionTimeout}
                  onChange={(e) => handleChange('account', 'sessionTimeout', parseInt(e.target.value))}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                  <option value={240}>4 hours</option>
                </select>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-2">Danger Zone</h4>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    Change Password
                  </button>
                  <button className="w-full py-2 px-4 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;