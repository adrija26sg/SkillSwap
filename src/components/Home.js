import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-16 bg-gray-800/50 backdrop-blur-md border border-blue-500/20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 mix-blend-overlay"></div>
        <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Share Skills, Grow Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl">
            SkillSwap connects people who want to teach and learn from each
            other. Exchange your knowledge and master new skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {currentUser ? (
              <>
                <Link
                  to="/discover"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  Discover Skills
                </Link>
                <Link
                  to="/profile"
                  className="px-8 py-4 bg-gray-700/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-blue-400 font-medium hover:bg-blue-600/20 hover:text-white transition-all duration-300"
                >
                  View Your Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  Join SkillSwap
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gray-700/50 backdrop-blur-sm border border-blue-500/30 rounded-lg text-blue-400 font-medium hover:bg-blue-600/20 hover:text-white transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="h-14 w-14 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Discover Skills
          </h3>
          <p className="text-gray-300">
            Find people who can teach you the skills you want to learn. Browse
            by category or search for specific skills.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="h-14 w-14 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Schedule Sessions
          </h3>
          <p className="text-gray-300">
            Arrange learning sessions at times that work for both of you. Manage
            your availability and keep track of upcoming sessions.
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="h-14 w-14 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Track Progress
          </h3>
          <p className="text-gray-300">
            Monitor your learning journey, set goals, and celebrate
            achievements. See how far you've come and plan your next steps.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-10 border border-blue-500/20 mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          How SkillSwap Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Create Profile
            </h3>
            <p className="text-gray-300">
              Sign up and list the skills you can teach and what you want to
              learn
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Find Matches
            </h3>
            <p className="text-gray-300">
              Discover people who want to learn what you teach and can teach
              what you want to learn
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Schedule Sessions
            </h3>
            <p className="text-gray-300">
              Arrange convenient times to meet online or in person for skill
              exchange
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">4</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">
              Learn & Teach
            </h3>
            <p className="text-gray-300">
              Exchange knowledge, track progress, and build your skills
              portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">J</span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-white">
                  James Wilson
                </h4>
                <p className="text-gray-400 text-sm">Web Developer</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "SkillSwap helped me learn UI design while teaching JavaScript.
              It's a win-win exchange that traditional learning platforms can't
              offer."
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-white">
                  Sarah Johnson
                </h4>
                <p className="text-gray-400 text-sm">Graphic Designer</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "I've made amazing connections through SkillSwap. Teaching design
              while learning photography has been an incredible experience."
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-white">
                  Michael Chen
                </h4>
                <p className="text-gray-400 text-sm">Data Scientist</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "The platform made it easy to find someone to exchange skills
              with. I taught Python while learning public speaking. Highly
              recommended!"
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-2xl p-10 text-center backdrop-blur-md border border-blue-500/20">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Ready to Start Your Skill Exchange Journey?
        </h2>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Join our community today and start exchanging skills with people from
          around the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {currentUser ? (
            <Link
              to="/discover"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Discover Skills Now
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-medium hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              Create Your Free Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
