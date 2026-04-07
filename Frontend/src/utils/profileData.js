import { getProfile, createProfile, updateProfile, uploadProfileImage } from '../firebase/profileService';
import { getCurrentUserId } from './authSession';

export const DEFAULT_PROFILE = {
  fullName: "Sarah Johnson",
  email: "sarah.j@example.com",
  phone: "+1 (555) 892-0431",
  gender: "Female",
  note: "",
  image: "/female.png",
};

// Temporary guest user ID — will be replaced with Firebase Auth uid after auth integration
export const GUEST_USER_ID = 'guest_user';

export function getStoredProfile() {
  try {
    const raw = localStorage.getItem("profileData");
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch (error) {
    console.error("Unable to parse profileData", error);
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile) {
  localStorage.setItem("profileData", JSON.stringify(profile));
  // Also sync to Firestore
  const { image, ...profileWithoutImage } = profile;
  // Only store image URL if it's not a base64 string (too large for Firestore)
  const firestoreData = image && !image.startsWith('data:') ? { ...profileWithoutImage, image } : profileWithoutImage;
  const userId = getCurrentUserId();
  
  if (!userId) return; // Prevent crashes if not logged in

  try {
    await updateProfile(userId, firestoreData);
  } catch (error) {
    // If update fails (e.g., document doesn't exist yet), fall back to setDoc
    try {
      await createProfile(userId, firestoreData);
    } catch (createErr) {
      console.error("Firestore sync failed:", createErr);
    }
  }
}

// Load profile from Firestore (for use after auth)
export async function loadProfileFromFirestore(userId) {
  const resolvedUserId = userId || getCurrentUserId();
  const profile = await getProfile(resolvedUserId);
  if (profile) {
    const merged = { ...DEFAULT_PROFILE, ...profile };
    localStorage.setItem("profileData", JSON.stringify(merged));
    return merged;
  }
  return getStoredProfile();
}

// Upload profile image to Firebase Storage and update profile
export async function uploadAndSetProfileImage(userId, file) {
  const resolvedUserId = userId || getCurrentUserId();
  const url = await uploadProfileImage(resolvedUserId, file);
  await updateProfile(resolvedUserId, { image: url });
  return url;
}
