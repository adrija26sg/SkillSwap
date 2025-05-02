import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  // If no user is logged in, redirect to login
  if (!currentUser) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected route
  console.log("User authenticated, rendering protected route");
  return children;
}

export default PrivateRoute;
