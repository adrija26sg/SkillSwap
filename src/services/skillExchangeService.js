import { db } from "../firebase";
import { auth } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

// Skill Matching Functions
export async function findSkillMatches(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();

    // Get user's learning interests
    const learningInterests = userData.learningInterests || [];

    // Find users who can teach these skills
    const potentialMatches = [];
    for (const skill of learningInterests) {
      const teachersQuery = query(
        collection(db, "users"),
        where("teachingSkills", "array-contains", skill)
      );

      const teachersSnapshot = await getDocs(teachersQuery);
      teachersSnapshot.forEach((doc) => {
        if (doc.id !== userId) {
          potentialMatches.push({
            userId: doc.id,
            ...doc.data(),
            matchingSkill: skill,
          });
        }
      });
    }

    return potentialMatches;
  } catch (error) {
    console.error("Error finding skill matches:", error);
    throw error;
  }
}

// Time Banking Functions
export async function getTimeBalance(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.data()?.timeBalance || 0;
  } catch (error) {
    console.error("Error getting time balance:", error);
    throw error;
  }
}

export async function createTimeExchange(
  teacherId,
  studentId,
  skill,
  duration
) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    const exchangeData = {
      teacherId,
      studentId,
      skill,
      duration,
      status: "pending",
      createdAt: serverTimestamp(),
      scheduledFor: null,
      completedAt: null,
      credits: duration, // 1 hour = 1 credit
    };

    const exchangeRef = await addDoc(collection(db, "exchanges"), exchangeData);
    return exchangeRef.id;
  } catch (error) {
    console.error("Error creating time exchange:", error);
    throw error;
  }
}

export async function completeTimeExchange(exchangeId) {
  try {
    const exchangeDoc = await getDoc(doc(db, "exchanges", exchangeId));
    const exchange = exchangeDoc.data();

    // Update exchange status
    await updateDoc(doc(db, "exchanges", exchangeId), {
      status: "completed",
      completedAt: serverTimestamp(),
    });

    // Transfer time credits
    const teacherRef = doc(db, "users", exchange.teacherId);
    const studentRef = doc(db, "users", exchange.studentId);

    await Promise.all([
      updateDoc(teacherRef, {
        timeBalance: arrayUnion(exchange.credits),
      }),
      updateDoc(studentRef, {
        timeBalance: arrayRemove(exchange.credits),
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error completing time exchange:", error);
    throw error;
  }
}

// Session Scheduling Functions
export async function scheduleSession(exchangeId, scheduledTime) {
  try {
    await updateDoc(doc(db, "exchanges", exchangeId), {
      scheduledFor: scheduledTime,
      status: "scheduled",
    });
    return true;
  } catch (error) {
    console.error("Error scheduling session:", error);
    throw error;
  }
}

export async function getUpcomingSessions(userId) {
  try {
    const now = new Date();
    const sessionsQuery = query(
      collection(db, "exchanges"),
      where("status", "==", "scheduled"),
      where("scheduledFor", ">", now)
    );

    const sessionsSnapshot = await getDocs(sessionsQuery);
    const sessions = [];

    sessionsSnapshot.forEach((doc) => {
      const session = { id: doc.id, ...doc.data() };
      if (session.teacherId === userId || session.studentId === userId) {
        sessions.push(session);
      }
    });

    return sessions;
  } catch (error) {
    console.error("Error getting upcoming sessions:", error);
    throw error;
  }
}

// Progress Tracking Functions
export async function updateSkillProgress(userId, skill, progress) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`skillProgress.${skill}`]: progress,
    });
    return true;
  } catch (error) {
    console.error("Error updating skill progress:", error);
    throw error;
  }
}

export async function getSkillProgress(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.data()?.skillProgress || {};
  } catch (error) {
    console.error("Error getting skill progress:", error);
    throw error;
  }
}

export async function addAchievement(userId, achievement) {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      achievements: arrayUnion(achievement),
    });
    return true;
  } catch (error) {
    console.error("Error adding achievement:", error);
    throw error;
  }
}
