import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register a new user
  async function register(name, email, password, skills, interests) {
    try {
      setError("");
      console.log("Registering user:", email);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User created:", userCredential.user.uid);

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("Profile updated with name:", name);

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
        interests: interests
          ? interests.split(",").map((interest) => interest.trim())
          : [],
        rating: 0,
        completedExchanges: 0,
        createdAt: new Date().toISOString(),
      });

      console.log("User document created in Firestore");

      return userCredential;
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to create an account.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please use a different email or try logging in.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage =
          "Email/password accounts are not enabled. Please contact support.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "The password is too weak. Please use a stronger password.";
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Login user
  async function login(email, password) {
    try {
      setError("");
      console.log("Logging in user:", email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User logged in:", userCredential.user.uid);
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to sign in.";

      if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is invalid.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage =
          "This account has been disabled. Please contact support.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage =
          "No account found with this email. Please check your email or register.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Logout user
  function logout() {
    return signOut(auth);
  }

  // Get user data from Firestore
  async function getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        console.log("No such user!");
        return null;
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Update user profile
  async function updateUserProfile(userId, data) {
    try {
      await setDoc(doc(db, "users", userId), data, { merge: true });
      return true;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return false;
    }
  }

  const value = {
    currentUser,
    register,
    login,
    logout,
    getUserData,
    updateUserProfile,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
