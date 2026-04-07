import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

const USERS_COL = 'Auth';

// Get user profile
export async function getProfile(userId) {
  const snap = await getDoc(doc(db, USERS_COL, userId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Create or set full user profile (used on first login)
export async function createProfile(userId, profileData) {
  await setDoc(doc(db, USERS_COL, userId), {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Update user profile
export async function updateProfile(userId, updates) {
  await updateDoc(doc(db, USERS_COL, userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Upload profile image and return download URL
export async function uploadProfileImage(userId, file) {
  const storageRef = ref(storage, `profileImages/${userId}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
// Real-time profile listener
export function onProfileChange(userId, callback) {
  if (!userId || userId === 'guest_user') return () => {};
  return onSnapshot(doc(db, USERS_COL, userId), (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    } else {
      callback(null);
    }
  });
}
