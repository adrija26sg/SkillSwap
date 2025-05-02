import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  findSkillMatches,
  createTimeExchange,
} from "../services/skillExchangeService";
import { getAllSkills } from "../services/skillService";

function SkillDiscovery() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [duration, setDuration] = useState(1);
  const [skills, setSkills] = useState([]);

  // Use useCallback to memoize the functions
  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      console.log("Loaded skills:", data);
      setSkills(data || []);
    } catch (err) {
      console.error("Error loading skills:", err);
      setError("Failed to load skills");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMatches = useCallback(async () => {
    if (!currentUser?.uid) {
      console.log("No current user, skipping match loading");
      return;
    }

    try {
      setLoading(true);
      console.log("Finding matches for user:", currentUser.uid);
      const potentialMatches = await findSkillMatches(currentUser.uid);
      console.log("Loaded matches:", potentialMatches);
      setMatches(potentialMatches || []);
    } catch (err) {
      console.error("Error loading matches:", err);
      setError("Failed to load skill matches");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  // Load skills on component mount
  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  // Load matches on component mount and when currentUser changes
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleRequestExchange = async (teacherId, skill) => {
    try {
      await createTimeExchange(teacherId, currentUser.uid, skill, duration);
      // Refresh matches after creating exchange
      loadMatches();
    } catch (err) {
      setError("Failed to request skill exchange");
      console.error("Error requesting exchange:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin animation-delay-500"></div>
        </div>
        <p className="mt-4 text-blue-400">Loading skills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-red-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-400 mb-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="text-xl font-semibold text-white mb-2">
          Error Loading Skills
        </h3>
        <p className="text-red-300 text-center">{error}</p>
        <button
          onClick={() => {
            setError(null);
            loadSkills();
            loadMatches();
          }}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          Discover Skills
        </h2>
        <p className="text-gray-300 max-w-3xl">
          Find people who can teach you the skills you want to learn. Filter by
          skill or session duration to find your perfect match.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Filter Options
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="skill-select"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Select Skill
            </label>
            <select
              id="skill-select"
              value={selectedSkill || ""}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full rounded-lg bg-gray-700/50 border border-gray-600 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Skills</option>
              {skills.map((skill) => (
                <option key={skill.name} value={skill.name}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="duration-select"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Session Duration
            </label>
            <select
              id="duration-select"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-lg bg-gray-700/50 border border-gray-600 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>1 hour</option>
              <option value={2}>2 hours</option>
              <option value={3}>3 hours</option>
              <option value={4}>4 hours</option>
              <option value={5}>5+ hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches
          .filter(
            (match) => !selectedSkill || match.matchingSkill === selectedSkill
          )
          .map((match) => (
            <div
              key={match.userId}
              className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 hover:shadow-xl hover:border-blue-400/40 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                {match.avatar ? (
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                    {match.name?.charAt(0) || "?"}
                  </div>
                )}
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-white">
                    {match.name}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600/30 text-blue-300">
                      {match.matchingSkill}
                    </span>
                    {match.rating && (
                      <div className="flex items-center ml-2 text-yellow-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs ml-1">{match.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 bg-gray-700/30 rounded-lg p-3">
                <p className="text-gray-300 text-sm">
                  {match.bio || "No bio available"}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center text-gray-300 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <span>
                    Completed Exchanges: {match.completedExchanges || 0}
                  </span>
                </div>

                <button
                  onClick={() =>
                    handleRequestExchange(match.userId, match.matchingSkill)
                  }
                  className="w-full flex justify-center items-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Request Exchange
                </button>
              </div>
            </div>
          ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center bg-gray-800/50 backdrop-blur-md rounded-xl p-10 border border-blue-500/20">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Skill Matches Found
          </h3>
          <p className="text-gray-300 mb-6">
            Try adding more skills you want to learn in your profile or adjust
            your filter settings.
          </p>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Update Your Profile
          </Link>
        </div>
      )}
    </div>
  );
}

export default SkillDiscovery;
