import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";

// Lazy load components
const SkillDiscovery = React.lazy(() => import("./components/SkillDiscovery"));
const SessionScheduler = React.lazy(() =>
  import("./components/SessionScheduler")
);
const ProgressDashboard = React.lazy(() =>
  import("./components/ProgressDashboard")
);
const Messaging = React.lazy(() => import("./components/Messaging"));
const EnhancedProfile = React.lazy(() =>
  import("./features/profile/EnhancedProfile")
);
const Settings = React.lazy(() => import("./components/Settings"));

// Loading component
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-blue-900">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin animation-delay-500"></div>
    </div>
    <div className="mt-8 text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
      Loading SkillSwap...
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/discover"
              element={
                <PrivateRoute>
                  <Layout>
                    <SkillDiscovery />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <PrivateRoute>
                  <Layout>
                    <SessionScheduler />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <PrivateRoute>
                  <Layout>
                    <ProgressDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Layout>
                    <Messaging />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <EnhancedProfile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
