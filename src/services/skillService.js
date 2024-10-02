import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

// Get all skills available for exchange
export async function getAllSkills() {
  try {
    const skillsQuery = query(
      collection(db, "skills"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(skillsQuery);

    const skills = [];
    querySnapshot.forEach((doc) => {
      skills.push({ id: doc.id, ...doc.data() });
    });

    return skills;
  } catch (error) {
    console.error("Error getting skills:", error);
    throw error;
  }
}

// Get skills by category
export async function getSkillsByCategory(category) {
  try {
    const skillsQuery = query(
      collection(db, "skills"),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(skillsQuery);

    const skills = [];
    querySnapshot.forEach((doc) => {
      skills.push({ id: doc.id, ...doc.data() });
    });

    return skills;
  } catch (error) {
    console.error("Error getting skills by category:", error);
    throw error;
  }
}

// Search skills by keyword
export async function searchSkills(keyword) {
  try {
    // Note: Firestore doesn't support full-text search
    // This is a simple implementation that searches in skill names
    const skillsQuery = query(collection(db, "skills"));
    const querySnapshot = await getDocs(skillsQuery);

    const skills = [];
    querySnapshot.forEach((doc) => {
      const skill = { id: doc.id, ...doc.data() };
      if (
        skill.name.toLowerCase().includes(keyword.toLowerCase()) ||
        skill.description.toLowerCase().includes(keyword.toLowerCase())
      ) {
        skills.push(skill);
      }
    });

    return skills;
  } catch (error) {
    console.error("Error searching skills:", error);
    throw error;
  }
}

// Create a new skill exchange request
export async function createExchangeRequest(
  senderId,
  receiverId,
  skillId,
  message
) {
  try {
    const exchangeRef = await addDoc(collection(db, "exchanges"), {
      senderId,
      receiverId,
      skillId,
      message,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return exchangeRef.id;
  } catch (error) {
    console.error("Error creating exchange request:", error);
    throw error;
  }
}

// Get exchange requests for a user
export async function getExchangeRequests(userId) {
  try {
    const exchangesQuery = query(
      collection(db, "exchanges"),
      where("receiverId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(exchangesQuery);

    const exchanges = [];
    for (const doc of querySnapshot.docs) {
      const exchange = { id: doc.id, ...doc.data() };

      // Get sender and skill details
      const [senderDoc, skillDoc] = await Promise.all([
        getDoc(doc(db, "users", exchange.senderId)),
        getDoc(doc(db, "skills", exchange.skillId)),
      ]);

      if (senderDoc.exists() && skillDoc.exists()) {
        exchanges.push({
          ...exchange,
          sender: senderDoc.data(),
          skill: skillDoc.data(),
        });
      }
    }

    return exchanges;
  } catch (error) {
    console.error("Error getting exchange requests:", error);
    throw error;
  }
}

// Update exchange status
export async function updateExchangeStatus(exchangeId, status) {
  try {
    const exchangeRef = doc(db, "exchanges", exchangeId);
    await updateDoc(exchangeRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating exchange status:", error);
    return false;
  }
}

// Add a review for a user
export async function addReview(userId, reviewerId, rating, comment, skillId) {
  try {
    // Add review to reviews collection
    const reviewRef = await addDoc(collection(db, "reviews"), {
      userId,
      reviewerId,
      rating,
      comment,
      skillId,
      createdAt: new Date().toISOString(),
    });

    // Update user's rating
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentRating = userData.rating || 0;
      const totalReviews = userData.totalReviews || 0;

      const newRating =
        (currentRating * totalReviews + rating) / (totalReviews + 1);

      await updateDoc(userRef, {
        rating: newRating,
        totalReviews: totalReviews + 1,
      });
    }

    return reviewRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

// Get reviews for a user
export async function getUserReviews(userId) {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(reviewsQuery);

    const reviews = [];
    for (const doc of querySnapshot.docs) {
      const review = { id: doc.id, ...doc.data() };

      // Get reviewer details
      const reviewerDoc = await getDoc(doc(db, "users", review.reviewerId));

      if (reviewerDoc.exists()) {
        reviews.push({
          ...review,
          reviewer: reviewerDoc.data(),
        });
      }
    }

    return reviews;
  } catch (error) {
    console.error("Error getting user reviews:", error);
    throw error;
  }
}

// Get top rated users
export async function getTopRatedUsers(limit = 10) {
  try {
    const usersQuery = query(
      collection(db, "users"),
      orderBy("rating", "desc"),
      limit(limit)
    );
    const querySnapshot = await getDocs(usersQuery);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Error getting top rated users:", error);
    throw error;
  }
}

// Get user data including skills and profile information
export async function getUserData(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    return {
      id: userDoc.id,
      ...userDoc.data(),
    };
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
}
