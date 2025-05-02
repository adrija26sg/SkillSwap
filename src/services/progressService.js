import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserProgress(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    return {
      skills: userData.skills || [],
      completedExchanges: userData.completedExchanges || 0,
      timeBalance: userData.timeBalance || 0,
      rating: userData.rating || 0,
      achievements: userData.achievements || [],
    };
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
}
