import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy, getDoc, doc } from "firebase/firestore";

export async function getUserSessions(userId) {
  try {
    console.log("Getting sessions for user:", userId);
    
    // Get exchanges where the user is either the teacher or the student
    const exchangesRef = collection(db, "exchanges");
    
    // Query for exchanges where user is the teacher
    const teacherQuery = query(
      exchangesRef,
      where("teacherId", "==", userId)
    );
    
    // Query for exchanges where user is the student
    const studentQuery = query(
      exchangesRef,
      where("studentId", "==", userId)
    );

    // Execute both queries
    const [teacherSnapshot, studentSnapshot] = await Promise.all([
      getDocs(teacherQuery),
      getDocs(studentQuery)
    ]);

    const sessions = [];

    // Process teacher sessions
    teacherSnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...data,
        role: "teacher"
      });
    });

    // Process student sessions
    studentSnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        ...data,
        role: "student"
      });
    });

    // Sort sessions by scheduledFor date if available, otherwise by createdAt
    sessions.sort((a, b) => {
      const dateA = a.scheduledFor ? new Date(a.scheduledFor) : new Date(a.createdAt);
      const dateB = b.scheduledFor ? new Date(b.scheduledFor) : new Date(b.createdAt);
      return dateB - dateA; // Sort in descending order (newest first)
    });

    console.log("Found sessions:", sessions.length);
    return sessions;
  } catch (error) {
    console.error("Error getting user sessions:", error);
    throw error;
  }
}

// Get details for a specific session including user information
export async function getSessionDetails(sessionId) {
  try {
    const sessionDoc = await getDoc(doc(db, "exchanges", sessionId));
    
    if (!sessionDoc.exists()) {
      throw new Error("Session not found");
    }
    
    const sessionData = sessionDoc.data();
    
    // Get teacher and student details
    const [teacherDoc, studentDoc] = await Promise.all([
      getDoc(doc(db, "users", sessionData.teacherId)),
      getDoc(doc(db, "users", sessionData.studentId))
    ]);
    
    return {
      id: sessionDoc.id,
      ...sessionData,
      teacher: teacherDoc.exists() ? teacherDoc.data() : null,
      student: studentDoc.exists() ? studentDoc.data() : null
    };
  } catch (error) {
    console.error("Error getting session details:", error);
    throw error;
  }
}
