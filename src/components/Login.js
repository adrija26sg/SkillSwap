import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/profile");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gray-800/80 backdrop-blur-md rounded-xl shadow-xl border border-blue-500/20 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="font-bold text-white text-2xl">S</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Welcome back to SkillSwap
          </p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-sm rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 mb-2">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-block w-full py-3 px-4 border border-blue-500/30 rounded-md text-sm font-medium text-blue-400 hover:text-white hover:bg-blue-600/20 transition-colors duration-300"
            >
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
