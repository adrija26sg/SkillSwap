import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

// Send a message to another user
export async function sendMessage(receiverId, content) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    const messageData = {
      senderId: currentUser.uid,
      receiverId,
      content,
      timestamp: serverTimestamp(),
      read: false,
      participants: [currentUser.uid, receiverId],
    };

    const docRef = await addDoc(collection(db, "messages"), messageData);
    return {
      id: docRef.id,
      ...messageData,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Get messages between current user and a specific partner
export async function getMessages(partnerId) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    // Query for messages where either user is sender or receiver
    const messagesQuery = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("timestamp", "asc")
    );

    const querySnapshot = await getDocs(messagesQuery);
    const messages = [];

    querySnapshot.forEach((doc) => {
      const message = { id: doc.id, ...doc.data() };
      // Only include messages between current user and partner
      if (
        (message.senderId === currentUser.uid &&
          message.receiverId === partnerId) ||
        (message.senderId === partnerId &&
          message.receiverId === currentUser.uid)
      ) {
        messages.push({
          ...message,
          timestamp: message.timestamp?.toDate() || new Date(),
        });
      }
    });

    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}

// Get all conversations for the current user
export async function getConversations() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    const messagesQuery = query(
      collection(db, "messages"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const querySnapshot = await getDocs(messagesQuery);
    const conversations = new Map();

    querySnapshot.forEach((doc) => {
      const message = { id: doc.id, ...doc.data() };
      const partnerId =
        message.senderId === currentUser.uid
          ? message.receiverId
          : message.senderId;

      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partnerId,
          lastMessage: message.content,
          timestamp: message.timestamp?.toDate() || new Date(),
          unread: message.senderId !== currentUser.uid && !message.read,
        });
      }
    });

    return Array.from(conversations.values());
  } catch (error) {
    console.error("Error getting conversations:", error);
    throw error;
  }
}

// Mark messages as read
export async function markMessagesAsRead(partnerId) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not authenticated");

    const messagesQuery = query(
      collection(db, "messages"),
      where("receiverId", "==", currentUser.uid),
      where("senderId", "==", partnerId),
      where("read", "==", false)
    );

    const querySnapshot = await getDocs(messagesQuery);
    const updatePromises = querySnapshot.docs.map((doc) =>
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
}

// Subscribe to real-time message updates
export function subscribeToMessages(partnerId, callback) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User not authenticated");

  const messagesQuery = query(
    collection(db, "messages"),
    where("participants", "array-contains", currentUser.uid),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(messagesQuery, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      const message = { id: doc.id, ...doc.data() };
      // Only include messages between current user and partner
      if (
        (message.senderId === currentUser.uid &&
          message.receiverId === partnerId) ||
        (message.senderId === partnerId &&
          message.receiverId === currentUser.uid)
      ) {
        messages.push({
          ...message,
          timestamp: message.timestamp?.toDate() || new Date(),
        });
      }
    });
    callback(messages);
  });
}
