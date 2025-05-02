import { db, storage } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Get user profile data
export async function getUserProfile(userId) {
  try {
    console.log("Getting profile for user:", userId);
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      console.error("User not found:", userId);
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    console.log("User data retrieved:", userData);

    // Calculate profile completion percentage
    const requiredFields = [
      "name",
      "email",
      "skills",
      "interests",
      "bio",
      "location",
      "avatar",
    ];

    let completedFields = 0;
    requiredFields.forEach((field) => {
      if (
        userData[field] &&
        (typeof userData[field] !== "object" ||
          (Array.isArray(userData[field]) && userData[field].length > 0) ||
          Object.keys(userData[field]).length > 0)
      ) {
        completedFields++;
      }
    });

    const completionPercentage = Math.round(
      (completedFields / requiredFields.length) * 100
    );

    return {
      ...userData,
      id: userDoc.id,
      completionPercentage,
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(userId, profileData) {
  try {
    console.log("Updating profile for user:", userId, profileData);
    const userRef = doc(db, "users", userId);

    // Check if the document exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(userRef, profileData);
      console.log("Profile updated successfully");
    } else {
      // Create new document if it doesn't exist
      console.log("User document doesn't exist, creating new one");
      await setDoc(userRef, {
        ...profileData,
        createdAt: new Date().toISOString(),
      });
      console.log("Profile created successfully");
    }

    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Upload profile image
export async function uploadProfileImage(userId, file) {
  try {
    console.log("Uploading profile image for user:", userId);
    const storageRef = ref(storage, `profile-images/${userId}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Update user profile with new image URL
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { avatar: downloadURL });

    console.log("Profile image uploaded successfully");
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}

// Add a skill to user profile
export async function addUserSkill(userId, skill) {
  try {
    console.log("Adding skill for user:", userId, skill);
    const userRef = doc(db, "users", userId);

    // Check if the document exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Get current user data
      const userData = docSnap.data();

      // Check if skillDetails exists
      if (userData.skillDetails) {
        // Add to existing skillDetails
        await updateDoc(userRef, {
          skills: arrayUnion(skill.name),
          teachingSkills: arrayUnion(skill.name),
          skillDetails: arrayUnion(skill),
        });
      } else {
        // Create skillDetails array
        await updateDoc(userRef, {
          skills: arrayUnion(skill.name),
          teachingSkills: arrayUnion(skill.name),
          skillDetails: [skill],
        });
      }
    } else {
      // Create new document if it doesn't exist
      await setDoc(userRef, {
        skills: [skill.name],
        teachingSkills: [skill.name],
        skillDetails: [skill],
        createdAt: new Date().toISOString(),
      });
    }

    console.log("Skill added successfully");
    return true;
  } catch (error) {
    console.error("Error adding user skill:", error);
    throw error;
  }
}

// Remove a skill from user profile
export async function removeUserSkill(userId, skillName) {
  try {
    console.log("Removing skill for user:", userId, skillName);
    const userRef = doc(db, "users", userId);

    // Get current user data to find the skill in skillDetails
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    // Remove from skills and teachingSkills
    await updateDoc(userRef, {
      skills: arrayRemove(skillName),
      teachingSkills: arrayRemove(skillName),
    });

    // Remove from skillDetails if it exists
    if (userData.skillDetails) {
      const updatedSkillDetails = userData.skillDetails.filter(
        (skill) => skill.name !== skillName
      );

      await updateDoc(userRef, {
        skillDetails: updatedSkillDetails,
      });
    }

    console.log("Skill removed successfully");
    return true;
  } catch (error) {
    console.error("Error removing user skill:", error);
    throw error;
  }
}

// Add a portfolio item
export async function addPortfolioItem(userId, portfolioItem) {
  try {
    console.log("Adding portfolio item for user:", userId, portfolioItem);

    // Add timestamp
    const itemWithTimestamp = {
      ...portfolioItem,
      createdAt: new Date().toISOString(),
    };

    // Add to portfolio collection
    const portfolioRef = collection(db, "portfolio");
    const docRef = await addDoc(portfolioRef, {
      userId,
      ...itemWithTimestamp,
    });

    console.log("Portfolio item added successfully");
    return docRef.id;
  } catch (error) {
    console.error("Error adding portfolio item:", error);
    throw error;
  }
}

// Get user portfolio items
export async function getUserPortfolio(userId) {
  try {
    console.log("Getting portfolio for user:", userId);
    const portfolioQuery = query(
      collection(db, "portfolio"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(portfolioQuery);
    const portfolioItems = [];

    querySnapshot.forEach((doc) => {
      portfolioItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    console.log("Retrieved portfolio items:", portfolioItems.length);
    return portfolioItems;
  } catch (error) {
    console.error("Error getting user portfolio:", error);
    throw error;
  }
}

// Update user availability
export async function updateUserAvailability(userId, availability) {
  try {
    console.log("Updating availability for user:", userId, availability);
    const userRef = doc(db, "users", userId);

    // Check if the document exists
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(userRef, { availability });
      console.log("Availability updated successfully");
    } else {
      // Create new document if it doesn't exist
      await setDoc(userRef, {
        availability,
        createdAt: new Date().toISOString(),
      });
      console.log("User document created with availability");
    }

    return true;
  } catch (error) {
    console.error("Error updating user availability:", error);
    throw error;
  }
}

// Get user availability
export async function getUserAvailability(userId) {
  try {
    console.log("Getting availability for user:", userId);
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    return userDoc.data().availability || {};
  } catch (error) {
    console.error("Error getting user availability:", error);
    throw error;
  }
}
