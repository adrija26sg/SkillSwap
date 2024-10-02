import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Exchange Skills, Grow Together
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with others to share your expertise and learn new skills
          through time-based exchanges.
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 inline-block"
          >
            Get Started
          </Link>
          <Link
            to="/exchange"
            className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-md hover:bg-indigo-50 inline-block"
          >
            Browse Skills
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Time-Based Exchange</h3>
          <p className="text-gray-600">
            Trade skills using time as currency. One hour of your expertise for
            one hour of learning.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Skill Matching</h3>
          <p className="text-gray-600">
            Find the perfect skill exchange partner with our intelligent
            matching system.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3">Community Learning</h3>
          <p className="text-gray-600">
            Join a community of learners and experts passionate about sharing
            knowledge.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">Create Profile</h4>
            <p className="text-gray-600">
              List your skills and what you want to learn
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">Find Matches</h4>
            <p className="text-gray-600">
              Connect with others who complement your skills
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Schedule Exchange</h4>
            <p className="text-gray-600">Arrange time to teach and learn</p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 font-bold">4</span>
            </div>
            <h4 className="font-semibold mb-2">Grow Together</h4>
            <p className="text-gray-600">
              Exchange skills and build lasting connections
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
