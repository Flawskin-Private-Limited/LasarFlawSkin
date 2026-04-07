import {
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

const SLOTS_COL = 'slots';

// Get available slots for a date (one-time)
export async function getSlotsByDate(dateString) {
  const snap = await getDoc(doc(db, SLOTS_COL, dateString));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Real-time slots listener for a date
export function onSlotsChange(dateString, callback) {
  return onSnapshot(doc(db, SLOTS_COL, dateString), (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() });
    } else {
      callback(null);
    }
  });
}

// Mark a slot as booked for a given date
import { arrayUnion, arrayRemove, setDoc, updateDoc } from 'firebase/firestore';

export async function bookSlot(dateString, time) {
  const slotRef = doc(db, SLOTS_COL, dateString);
  await setDoc(slotRef, {
    bookedTimes: arrayUnion(time)
  }, { merge: true });
}

// Release a previously booked slot
export async function unbookSlot(dateString, time) {
  const slotRef = doc(db, SLOTS_COL, dateString);
  const snap = await getDoc(slotRef);
  if (snap.exists()) {
    await updateDoc(slotRef, {
      bookedTimes: arrayRemove(time)
    });
  }
}
