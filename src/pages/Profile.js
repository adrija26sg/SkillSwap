import React, { useState } from "react";

function Profile() {
  // Mock user data
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    location: "New York, USA",
    bio: "Passionate about teaching and learning new skills. Always excited to meet new people and share knowledge.",
    skills: [
      { name: "Web Development", level: "Expert" },
      { name: "Photography", level: "Intermediate" },
      { name: "Spanish", level: "Advanced" },
    ],
    interests: [
      { name: "Guitar", level: "Beginner" },
      { name: "Digital Marketing", level: "Intermediate" },
    ],
    rating: 4.8,
    completedExchanges: 12,
  });

  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl text-gray-500">
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.location}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-gray-700">{user.rating}</span>
              <span className="ml-2 text-gray-500">
                ({user.completedExchanges} exchanges)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "profile"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "exchanges"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("exchanges")}
            >
              Exchanges
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === "reviews"
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </nav>
        </div>
      </div>

      {/* Profile Content */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">About Me</h2>
              <p className="text-gray-600">{user.bio}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Skills I Can Teach</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.skills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-500">
                        {skill.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">
                Skills I Want to Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.interests.map((interest, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{interest.name}</span>
                      <span className="text-sm text-gray-500">
                        {interest.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exchanges Content */}
      {activeTab === "exchanges" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Exchanges</h2>
          <p className="text-gray-600">No recent exchanges to display.</p>
        </div>
      )}

      {/* Reviews Content */}
      {activeTab === "reviews" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Reviews</h2>
          <p className="text-gray-600">No reviews to display.</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
