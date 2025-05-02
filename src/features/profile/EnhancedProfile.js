import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import SkillsSection from "./SkillsSection";
import PortfolioSection from "./PortfolioSection";
import AvailabilityCalendar from "./AvailabilityCalendar";
import ProfileStats from "./ProfileStats";
import {
  getUserProfile,
  updateUserProfile,
  addUserSkill,
  removeUserSkill,
  getUserPortfolio,
  updateUserAvailability,
} from "../../services/profileService";

function EnhancedProfile() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // User profile state
  const [user, setUser] = useState({
    name: "",
    location: "",
    rating: 0,
    reviews: 0,
    verified: false,
    avatar: null,
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [skills, setSkills] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [availability, setAvailability] = useState({});
  const [preferences, setPreferences] = useState({
    learningMethods: [],
    sessionDuration: "",
    languages: [],
  });

  // Load user profile data
  const loadUserProfile = useCallback(async () => {
    if (!currentUser?.uid) {
      console.log("No current user, skipping profile loading");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Loading profile for user:", currentUser.uid);

      // Get user profile data
      const profileData = await getUserProfile(currentUser.uid);
      console.log("Profile data loaded:", profileData);

      // Set user basic info
      setUser({
        name: profileData.name || "",
        location: profileData.location || "",
        rating: profileData.rating || 0,
        reviews: profileData.totalReviews || 0,
        verified: !!profileData.verified,
        avatar: profileData.avatar || null,
        bio: profileData.bio || "",
      });

      // Set completion percentage
      setCompletionPercentage(profileData.completionPercentage || 0);

      // Convert skills array to required format

      // Check if skillDetails exists and use it
      if (profileData.skillDetails && profileData.skillDetails.length > 0) {
        setSkills(profileData.skillDetails);
      }
      // Otherwise, create from skills array
      else if (profileData.skills && profileData.skills.length > 0) {
        const skillsArray = profileData.skills.map((skill) => ({
          name: skill,
          level: "Intermediate", // Default level
          description: "",
          verificationStatus: "pending",
          certifications: [],
          experience: "",
        }));
        setSkills(skillsArray);
      }

      // Load portfolio items
      const portfolioItems = await getUserPortfolio(currentUser.uid);
      setPortfolio(portfolioItems);

      // Set availability
      setAvailability(profileData.availability || {});

      // Set preferences
      setPreferences({
        learningMethods: profileData.learningMethods || ["Online"],
        sessionDuration: profileData.sessionDuration || "1-2 hours per session",
        languages: profileData.languages || ["English"],
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  // Load profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // Handle profile update
  const handleUpdateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Updating profile with data:", updatedData);

      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const success = await updateUserProfile(currentUser.uid, updatedData);

      if (success) {
        console.log("Profile updated successfully");
        setSuccessMessage("Profile updated successfully!");
        await loadUserProfile(); // Reload profile data

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle skill add
  const handleAddSkill = async (newSkill) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Adding skill:", newSkill);

      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const success = await addUserSkill(currentUser.uid, newSkill);

      if (success) {
        console.log("Skill added successfully");
        setSuccessMessage("Skill added successfully!");
        await loadUserProfile(); // Reload profile data

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error("Failed to add skill");
      }
    } catch (err) {
      console.error("Skill add error:", err);
      setError(`Failed to add skill: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle skill remove
  const handleRemoveSkill = async (skillName) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Removing skill:", skillName);

      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const success = await removeUserSkill(currentUser.uid, skillName);

      if (success) {
        console.log("Skill removed successfully");
        setSuccessMessage("Skill removed successfully!");
        await loadUserProfile(); // Reload profile data

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error("Failed to remove skill");
      }
    } catch (err) {
      console.error("Skill remove error:", err);
      setError(`Failed to remove skill: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle availability update
  const handleUpdateAvailability = async (newAvailability) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Updating availability:", newAvailability);

      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const success = await updateUserAvailability(
        currentUser.uid,
        newAvailability
      );

      if (success) {
        console.log("Availability updated successfully");
        setSuccessMessage("Availability updated successfully!");
        setAvailability(newAvailability);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error("Failed to update availability");
      }
    } catch (err) {
      console.error("Availability update error:", err);
      setError(`Failed to update availability: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle preferences update
  const handleUpdatePreferences = async (newPreferences) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Updating preferences:", newPreferences);

      if (!currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const success = await updateUserProfile(currentUser.uid, {
        learningMethods: newPreferences.learningMethods,
        sessionDuration: newPreferences.sessionDuration,
        languages: newPreferences.languages,
      });

      if (success) {
        console.log("Preferences updated successfully");
        setSuccessMessage("Preferences updated successfully!");
        setPreferences(newPreferences);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (err) {
      console.error("Preferences update error:", err);
      setError(`Failed to update preferences: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while loading
  if (loading && !user.name) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show login message if not authenticated
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen flex items-center justify-center">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-300 mb-6">
            Please log in to view and edit your profile.
          </p>
          <a
            href="/login"
            className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
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

        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your skills, portfolio, and track your progress
          </p>
        </div>

        <ProfileHeader
          user={user}
          completionPercentage={completionPercentage}
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Tabs for different sections */}
        <div className="mb-8 border-b border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button
                className="inline-block p-4 border-b-2 border-blue-500 rounded-t-lg text-blue-400 active"
                aria-current="page"
              >
                Profile
              </button>
            </li>
            <li className="mr-2">
              <button
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-300 hover:border-gray-700"
                onClick={() => (window.location.href = "/settings")}
              >
                Settings
              </button>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkillsSection
              skills={skills}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
            />
            <PortfolioSection portfolio={portfolio} />

            {/* Stats Section */}
            <div className="bg-gradient-to-br from-gray-900/90 to-blue-900/50 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    My Learning Journey
                  </span>
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-sm transition-colors duration-300 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Export
                  </button>
                  <button className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-sm transition-colors duration-300 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Set Goals
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300">
                  Track your progress, analyze your learning patterns, and see
                  how your skills are developing over time. Use these insights
                  to set new goals and identify areas for improvement.
                </p>
              </div>

              <ProfileStats />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <AvailabilityCalendar
              availability={availability}
              onUpdateAvailability={handleUpdateAvailability}
            />

            <div className="bg-gradient-to-br from-gray-800/80 to-blue-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 transition-all duration-300 hover:shadow-blue-500/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Learning Preferences
                </span>
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    Preferred Learning Methods
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {preferences.learningMethods.map((method, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    Session Duration
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {preferences.sessionDuration}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300">
                    Languages
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {preferences.languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    // In a real implementation, this would open a modal
                    // For now, let's just update with some sample data
                    handleUpdatePreferences({
                      learningMethods: ["Online", "In-Person"],
                      sessionDuration: "1-2 hours per session",
                      languages: ["English", "Spanish"],
                    });
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  Edit Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnhancedProfile;
