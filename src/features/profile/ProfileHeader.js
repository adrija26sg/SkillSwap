import React from "react";
import { UserCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

function ProfileHeader({ user, completionPercentage }) {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-blue-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-6 mb-6 transition-all duration-300 hover:shadow-blue-500/10">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover border-2 border-blue-500/30 shadow-lg shadow-blue-500/20"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border-2 border-blue-500/30 shadow-lg shadow-blue-500/20">
              <UserCircleIcon className="h-16 w-16 text-white" />
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              {user.name}
            </h1>
            {user.verified && (
              <CheckCircleIcon
                className="h-5 w-5 text-blue-400"
                title="Verified User"
              />
            )}
          </div>

          <p className="text-gray-400 mt-1">{user.location}</p>

          <div className="mt-2 flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-300">{user.rating}</span>
            <span className="ml-2 text-gray-500">({user.reviews} reviews)</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-300">
                Profile Completion
              </span>
              <span className="text-sm font-medium text-gray-300">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
