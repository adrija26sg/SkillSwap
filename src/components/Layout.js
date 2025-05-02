import React from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
        <main className="mt-6">{children}</main>
      </div>
      <footer className="bg-gray-800/50 backdrop-blur-md mt-12 py-6 border-t border-blue-500/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                SkillSwap
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Connect. Learn. Grow.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                to="/about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
