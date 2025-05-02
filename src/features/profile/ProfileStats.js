import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserStats } from "../../services/userService";

function ProfileStats() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const userStats = await getUserStats(currentUser.uid);
        setStats(userStats);
      } catch (err) {
        console.error("Error loading stats:", err);
        setError("Failed to load your statistics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [currentUser?.uid]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin animation-delay-500"></div>
        </div>
        <p className="mt-4 text-blue-400 text-sm">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-4">
        <p className="text-red-200 text-sm">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-md rounded-lg p-6 border border-blue-500/20">
        <p className="text-gray-400 text-center">
          No statistics available yet. Start exchanging skills to see your
          progress!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 backdrop-blur-md rounded-xl p-6 border border-blue-500/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Time Balance</h3>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">
                {stats.timeBalance.balance}
              </p>
              <p className="text-sm text-blue-300 mt-1">Hours Available</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{stats.timeBalance.earned}</span>
              </div>
              <div className="flex items-center text-red-400 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{stats.timeBalance.spent}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Sessions</h3>
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">
                {stats.sessionHistory.reduce(
                  (sum, month) => sum + month.taught + month.learned,
                  0
                )}
              </p>
              <p className="text-sm text-purple-300 mt-1">Total Sessions</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span>
                  {stats.sessionHistory.reduce(
                    (sum, month) => sum + month.taught,
                    0
                  )}
                </span>
              </div>
              <div className="flex items-center text-indigo-400 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span>
                  {stats.sessionHistory.reduce(
                    (sum, month) => sum + month.learned,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-900/60 to-teal-900/60 backdrop-blur-md rounded-xl p-6 border border-green-500/30 shadow-lg hover:shadow-green-500/10 transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Connections</h3>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-white">
                {stats.connections.total}
              </p>
              <p className="text-sm text-green-300 mt-1">Total Connections</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>+{stats.connections.recent}</span>
              </div>
              <p className="text-xs text-green-300 mt-1">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Progress */}
      <div className="bg-gradient-to-br from-gray-800/80 to-blue-900/40 backdrop-blur-md rounded-xl p-6 border border-blue-500/20 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Skill Progress
          </h3>
          <div className="bg-blue-900/30 px-3 py-1 rounded-full">
            <span className="text-blue-300 text-sm">
              {Object.keys(stats.skillProgress).length} skills
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(stats.skillProgress).map(([skill, progress]) => (
            <div
              key={skill}
              className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-white">{skill}</span>
                <span className="text-sm font-medium text-blue-400">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session History Graph */}
      <div className="bg-gradient-to-br from-gray-800/80 to-purple-900/40 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Session History
          </h3>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-2 rounded-sm"></div>
              <span className="text-sm text-gray-300">Taught</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-500 mr-2 rounded-sm"></div>
              <span className="text-sm text-gray-300">Learned</span>
            </div>
          </div>
        </div>

        <div className="relative h-64 mt-4">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((_, i) => (
              <div key={i} className="w-full h-px bg-gray-700/50"></div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between">
            {stats.sessionHistory.map((month) => (
              <div
                key={month.month}
                className="flex flex-col items-center group"
              >
                <div className="w-full flex justify-center space-x-2 px-2">
                  <div
                    className="w-5 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-300 relative"
                    style={{ height: `${month.taught * 12}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-900/80 text-blue-200 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {month.taught} sessions taught
                    </div>
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  </div>
                  <div
                    className="w-5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all duration-300 relative"
                    style={{ height: `${month.learned * 12}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-900/80 text-indigo-200 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {month.learned} sessions learned
                    </div>
                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2 font-medium">
                  {month.month}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Skills and Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skills */}
        <div className="bg-gradient-to-br from-gray-800/80 to-yellow-900/30 backdrop-blur-md rounded-xl p-6 border border-yellow-500/20 shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              Top Skills
            </h3>
          </div>
          <div className="space-y-5">
            {stats.topSkills.map((skill, index) => (
              <div
                key={skill.name}
                className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium flex items-center">
                    {index === 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {skill.name}
                  </h4>
                  <div className="bg-yellow-900/30 px-3 py-1 rounded-full">
                    <span className="text-yellow-300 text-sm">
                      {skill.sessions} sessions
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${
                          i < Math.floor(skill.rating)
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400 ml-2">
                    {skill.rating.toFixed(1)} rating
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connections by Category */}
        <div className="bg-gradient-to-br from-gray-800/80 to-green-900/30 backdrop-blur-md rounded-xl p-6 border border-green-500/20 shadow-lg hover:shadow-green-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Connections by Category
            </h3>
          </div>

          <div className="space-y-5">
            {Object.entries(stats.connections.bySkill).map(
              ([category, count]) => (
                <div
                  key={category}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">{category}</span>
                    <span className="text-green-400 font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-1 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-600 to-teal-500 h-3 rounded-full relative"
                      style={{
                        width: `${(count / stats.connections.total) * 100}%`,
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">
                      {Math.round((count / stats.connections.total) * 100)}% of
                      total
                    </span>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Growth Rate</h4>
                <p className="text-sm text-gray-400">
                  New connections per month
                </p>
              </div>
              <div className="flex items-center text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">+{stats.connections.recent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileStats;
