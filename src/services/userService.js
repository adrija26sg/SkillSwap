import { db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Get user settings
export async function getUserSettings(userId) {
  try {
    console.log("Getting settings for user:", userId);
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      console.error("User not found:", userId);
      throw new Error("User not found");
    }

    const userData = userDoc.data();

    // Return settings if they exist, otherwise return default settings
    return (
      userData.settings || {
        notifications: {
          email: true,
          browser: true,
          sessionReminders: true,
          messages: true,
          updates: false,
        },
        privacy: {
          profileVisibility: "public", // public, connections, private
          showEmail: false,
          showSkills: true,
          showAvailability: true,
        },
        appearance: {
          theme: "dark", // dark, light, system
          compactView: false,
          fontSize: "medium", // small, medium, large
        },
        account: {
          twoFactorAuth: false,
          sessionTimeout: 60, // minutes
        },
      }
    );
  } catch (error) {
    console.error("Error getting user settings:", error);
    throw error;
  }
}

// Update user settings
export async function updateUserSettings(userId, settings) {
  try {
    console.log("Updating settings for user:", userId);
    const userRef = doc(db, "users", userId);

    // Check if the document exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Update existing document with settings
      await updateDoc(userRef, { settings });
      console.log("Settings updated successfully");
    } else {
      // Create new document if it doesn't exist
      await setDoc(userRef, {
        settings,
        createdAt: new Date().toISOString(),
      });
      console.log("User document created with settings");
    }

    return true;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}

// Get user statistics for graphs and analytics
export async function getUserStats(userId) {
  try {
    console.log("Getting stats for user:", userId);
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      console.error("User not found:", userId);
      throw new Error("User not found");
    }

    const userData = userDoc.data();

    // If user has stats, return them
    if (userData.stats) {
      return userData.stats;
    }

    // Otherwise, generate mock stats for demonstration
    // In a real app, these would be calculated from actual user activity
    const mockStats = {
      skillProgress: {
        JavaScript: 75,
        React: 60,
        "Node.js": 45,
        Python: 30,
        "UI/UX Design": 80,
      },
      sessionHistory: [
        { month: "Jan", taught: 2, learned: 1 },
        { month: "Feb", taught: 3, learned: 2 },
        { month: "Mar", taught: 1, learned: 4 },
        { month: "Apr", taught: 4, learned: 2 },
        { month: "May", taught: 3, learned: 3 },
        { month: "Jun", taught: 5, learned: 2 },
      ],
      timeBalance: {
        earned: 24,
        spent: 18,
        balance: 6,
      },
      topSkills: [
        { name: "JavaScript", rating: 4.8, sessions: 12 },
        { name: "React", rating: 4.6, sessions: 8 },
        { name: "UI/UX Design", rating: 4.9, sessions: 15 },
      ],
      connections: {
        total: 28,
        recent: 5,
        bySkill: {
          Programming: 12,
          Design: 8,
          Marketing: 5,
          Other: 3,
        },
      },
    };

    return mockStats;
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
}

// Update user stats (for demo purposes)
export async function updateUserStats(userId, stats) {
  try {
    console.log("Updating stats for user:", userId);
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, { stats });
    console.log("Stats updated successfully");

    return true;
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
}
