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

    if (!userData) {
      console.log("No user data found for:", userId);
      return [];
    }

    console.log("User data:", userData);

    // Get user's learning interests - check both interests and learningInterests fields
    const learningInterests =
      userData.interests || userData.learningInterests || [];
    console.log("Learning interests:", learningInterests);

    if (learningInterests.length === 0) {
      console.log("No learning interests found for user");
      return [];
    }

    // Find users who can teach these skills - check both skills and teachingSkills fields
    const potentialMatches = [];

    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));

    usersSnapshot.forEach((userDoc) => {
      if (userDoc.id === userId) return; // Skip current user

      const potentialTeacher = userDoc.data();
      const teacherSkills =
        potentialTeacher.skills || potentialTeacher.teachingSkills || [];

      // Find matching skills
      const matchingSkills = learningInterests.filter((interest) =>
        teacherSkills.some(
          (skill) =>
            skill.toLowerCase().includes(interest.toLowerCase()) ||
            interest.toLowerCase().includes(skill.toLowerCase())
        )
      );

      if (matchingSkills.length > 0) {
        potentialMatches.push({
          userId: userDoc.id,
          ...potentialTeacher,
          matchingSkill: matchingSkills[0], // Use the first matching skill
        });
      }
    });

    console.log("Found potential matches:", potentialMatches.length);
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

    console.log("Creating time exchange:", {
      teacherId,
      studentId,
      skill,
      duration,
    });

    // Get teacher and student details for reference
    const [teacherDoc, studentDoc] = await Promise.all([
      getDoc(doc(db, "users", teacherId)),
      getDoc(doc(db, "users", studentId)),
    ]);

    if (!teacherDoc.exists()) {
      throw new Error("Teacher not found");
    }

    if (!studentDoc.exists()) {
      throw new Error("Student not found");
    }

    const teacherName = teacherDoc.data().name || "Unknown Teacher";
    const studentName = studentDoc.data().name || "Unknown Student";

    const exchangeData = {
      teacherId,
      studentId,
      teacherName,
      studentName,
      skill,
      duration,
      status: "pending",
      createdAt: new Date().toISOString(),
      scheduledFor: null,
      completedAt: null,
      credits: duration, // 1 hour = 1 credit
      participants: [teacherId, studentId], // Add participants array for easier querying
      messages: [], // Initialize empty messages array for communication
    };

    const exchangeRef = await addDoc(collection(db, "exchanges"), exchangeData);
    console.log("Exchange created with ID:", exchangeRef.id);
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
    console.log("Scheduling session:", exchangeId, "for", scheduledTime);

    // Validate the exchange exists
    const exchangeDoc = await getDoc(doc(db, "exchanges", exchangeId));

    if (!exchangeDoc.exists()) {
      throw new Error("Exchange not found");
    }

    // Format the date as ISO string to ensure consistency
    const scheduledTimeISO = scheduledTime.toISOString();

    // Update the exchange with the scheduled time
    await updateDoc(doc(db, "exchanges", exchangeId), {
      scheduledFor: scheduledTimeISO,
      status: "scheduled",
      updatedAt: serverTimestamp(),
    });

    console.log("Session scheduled successfully");
    return true;
  } catch (error) {
    console.error("Error scheduling session:", error);
    throw error;
  }
}

export async function getUpcomingSessions(userId) {
  try {
    console.log("Getting upcoming sessions for user:", userId);
    const now = new Date().toISOString();

    // Query for sessions where user is the teacher
    const teacherQuery = query(
      collection(db, "exchanges"),
      where("teacherId", "==", userId),
      where("status", "==", "scheduled")
    );

    // Query for sessions where user is the student
    const studentQuery = query(
      collection(db, "exchanges"),
      where("studentId", "==", userId),
      where("status", "==", "scheduled")
    );

    // Execute both queries
    const [teacherSnapshot, studentSnapshot] = await Promise.all([
      getDocs(teacherQuery),
      getDocs(studentQuery),
    ]);

    const sessions = [];

    // Process teacher sessions
    teacherSnapshot.forEach((doc) => {
      const data = doc.data();
      // Only include future sessions
      if (data.scheduledFor && data.scheduledFor > now) {
        sessions.push({
          id: doc.id,
          ...data,
          role: "teacher",
        });
      }
    });

    // Process student sessions
    studentSnapshot.forEach((doc) => {
      const data = doc.data();
      // Only include future sessions
      if (data.scheduledFor && data.scheduledFor > now) {
        sessions.push({
          id: doc.id,
          ...data,
          role: "student",
        });
      }
    });

    // Sort sessions by scheduledFor date
    sessions.sort((a, b) => {
      return new Date(a.scheduledFor) - new Date(b.scheduledFor);
    });

    console.log("Found upcoming sessions:", sessions.length);
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
