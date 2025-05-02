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

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Auth Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          setCurrentUser({ ...user, ...userData });
        } catch (error) {
          console.error("Error loading user data:", error);
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register a new user
  async function register(name, email, password, skills, interests) {
    try {
      setError("");
      console.log("Starting Firebase registration for:", email);

      // Create the user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Firebase user created:", userCredential.user.uid);

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      console.log("Profile display name updated");

      // Process skills and interests
      const skillsArray = skills ? skills.split(",").map((skill) => skill.trim()) : [];
      const interestsArray = interests ? interests.split(",").map((interest) => interest.trim()) : [];
      
      console.log("Skills:", skillsArray);
      console.log("Interests:", interestsArray);

      // Prepare user data for Firestore
      const userData = {
        name,
        email,
        // Store skills in both formats for compatibility
        skills: skillsArray,
        teachingSkills: skillsArray,
        // Store interests in both formats for compatibility
        interests: interestsArray,
        learningInterests: interestsArray,
        rating: 0,
        completedExchanges: 0,
        createdAt: new Date().toISOString(),
        bio: `Hi, I'm ${name}. I'm interested in sharing my knowledge and learning new skills!`,
      };

      // Create user document in Firestore
      console.log(
        "Creating Firestore document for user:",
        userCredential.user.uid
      );
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      console.log("Firestore document created successfully");

      return userCredential;
    } catch (error) {
      console.error("Detailed registration error:", {
        code: error.code,
        message: error.message,
        fullError: error,
      });

      let errorMessage = "Failed to create an account.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email is already registered. Please use a different email or try logging in.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is invalid.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password accounts are not enabled. Please contact support.";
          break;
        case "auth/weak-password":
          errorMessage =
            "The password is too weak. Please use a stronger password.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = `Registration failed: ${error.message}`;
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
