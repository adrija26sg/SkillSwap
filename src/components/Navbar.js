import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  UserCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-indigo-600">SkillSwap</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/exchange"
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
            >
              <ArrowPathIcon className="h-5 w-5" />
              <span>Exchange</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
            >
              <UserCircleIcon className="h-5 w-5" />
              <span>Profile</span>
            </Link>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
