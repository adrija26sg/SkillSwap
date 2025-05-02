// src/seedData.js
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Sample skill categories
const skillCategories = [
  "Programming",
  "Design",
  "Languages",
  "Music",
  "Cooking",
  "Fitness",
  "Business",
  "Academic",
];

// Sample skills with descriptions
const sampleSkills = [
  {
    name: "JavaScript Programming",
    description: "Learn modern JavaScript including ES6+ features, async/await, and more.",
    category: "Programming",
    estimatedHours: 10,
  },
  {
    name: "React Development",
    description: "Build interactive UIs with React, including hooks, context, and state management.",
    category: "Programming",
    estimatedHours: 15,
  },
  {
    name: "Python Basics",
    description: "Get started with Python programming language fundamentals.",
    category: "Programming",
    estimatedHours: 8,
  },
  {
    name: "UI/UX Design",
    description: "Learn principles of user interface and experience design.",
    category: "Design",
    estimatedHours: 12,
  },
  {
    name: "Adobe Photoshop",
    description: "Master image editing and manipulation with Photoshop.",
    category: "Design",
    estimatedHours: 20,
  },
  {
    name: "Spanish Conversation",
    description: "Practice conversational Spanish with a fluent speaker.",
    category: "Languages",
    estimatedHours: 15,
  },
  {
    name: "French for Beginners",
    description: "Learn basic French vocabulary, grammar, and pronunciation.",
    category: "Languages",
    estimatedHours: 20,
  },
  {
    name: "Guitar Lessons",
    description: "Learn to play guitar from basic chords to advanced techniques.",
    category: "Music",
    estimatedHours: 25,
  },
  {
    name: "Piano Fundamentals",
    description: "Get started with piano playing and music theory basics.",
    category: "Music",
    estimatedHours: 20,
  },
  {
    name: "Italian Cooking",
    description: "Learn to make authentic Italian dishes from scratch.",
    category: "Cooking",
    estimatedHours: 8,
  },
  {
    name: "Baking Essentials",
    description: "Master the fundamentals of baking breads, cakes, and pastries.",
    category: "Cooking",
    estimatedHours: 10,
  },
  {
    name: "Yoga for Beginners",
    description: "Learn basic yoga poses and breathing techniques.",
    category: "Fitness",
    estimatedHours: 6,
  },
  {
    name: "Home Workout Routines",
    description: "Effective exercise routines you can do without equipment.",
    category: "Fitness",
    estimatedHours: 5,
  },
  {
    name: "Digital Marketing",
    description: "Learn social media marketing, SEO, and content strategy.",
    category: "Business",
    estimatedHours: 15,
  },
  {
    name: "Personal Finance",
    description: "Budgeting, saving, and investing for beginners.",
    category: "Business",
    estimatedHours: 8,
  },
  {
    name: "Mathematics Tutoring",
    description: "Help with algebra, calculus, and other math subjects.",
    category: "Academic",
    estimatedHours: 10,
  },
  {
    name: "Essay Writing",
    description: "Improve your academic writing skills for better essays and papers.",
    category: "Academic",
    estimatedHours: 6,
  },
];

// Function to seed skills data
export async function seedSkills() {
  try {
    console.log("Starting to seed skills data...");
    
    // Check if skills already exist
    const skillsQuery = query(collection(db, "skills"));
    const snapshot = await getDocs(skillsQuery);
    
    if (!snapshot.empty) {
      console.log(`Skills collection already has ${snapshot.size} documents. Skipping seeding.`);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    // Add skills to Firestore
    const addedSkills = [];
    for (const skill of sampleSkills) {
      const skillData = {
        ...skill,
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, "skills"), skillData);
      addedSkills.push({ id: docRef.id, ...skillData });
      console.log(`Added skill: ${skill.name} with ID: ${docRef.id}`);
    }
    
    console.log(`Successfully seeded ${addedSkills.length} skills`);
    return addedSkills;
  } catch (error) {
    console.error("Error seeding skills data:", error);
    throw error;
  }
}