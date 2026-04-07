import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const BOOKINGS_COL = 'bookings';

// Create a new booking
import { bookSlot } from './slotService';
import { setDoc } from 'firebase/firestore';

export async function createBooking(bookingData) {
  const baseData = {
    ...bookingData,
    status: 'upcoming',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Create rigorously structured document in single source of truth global bookings array
  const ref = await addDoc(collection(db, BOOKINGS_COL), baseData);

  // Mark slot as booked
  if (bookingData.dateISO && bookingData.time) {
    const dateKey = bookingData.dateISO.split('T')[0];
    await bookSlot(dateKey, bookingData.time);
  }
  return ref.id;
}

// Fetch bookings for a user (one-time)
export async function getUserBookings(userId) {
  if (!userId || userId === 'guest_user') return [];
  const q = query(
    collection(db, BOOKINGS_COL),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  
  // Client-side sort to avoid index requirement
  return docs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
    return timeB - timeA;
  });
}

// Real-time bookings listener
export function onUserBookingsChange(userId, callback) {
  if (!userId || userId === 'guest_user') return () => {};
  const q = query(
    collection(db, BOOKINGS_COL),
    where('userId', '==', userId)
  );
  return onSnapshot(q, (snap) => {
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    // Client-side sort to avoid index requirement
    docs.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
      return timeB - timeA;
    });
    callback(docs);
  });
}

// Reschedule a booking
// Logic: Unbook old slot, update record, book new slot
import { getDoc } from 'firebase/firestore';
import { unbookSlot } from './slotService';

export async function rescheduleBooking(userId, bookingId, newDate, newTimeSlot, newDateISO) {
  const bookingRef = doc(db, BOOKINGS_COL, bookingId);
  const bookingSnap = await getDoc(bookingRef);
  
  if (bookingSnap.exists()) {
    const oldData = bookingSnap.data();
    // Release old slot if date was stored
    if (oldData.dateISO || oldData.date) {
      const oldDateKey = (oldData.dateISO || new Date(oldData.date).toISOString()).split('T')[0];
      await unbookSlot(oldDateKey, oldData.time || oldData.timeSlot);
    }
  }

  const updates = {
    date: newDate,
    dateISO: newDateISO || null,
    time: newTimeSlot,
    timeSlot: newTimeSlot,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(bookingRef, updates);

  // Reserve new slot
  if (newDateISO || newDate) {
    const newDateKey = (newDateISO || new Date(newDate).toISOString()).split('T')[0];
    await bookSlot(newDateKey, newTimeSlot);
  }
}

// Cancel a booking
export async function cancelBooking(userId, bookingId) {
  const bookingRef = doc(db, BOOKINGS_COL, bookingId);
  const bookingSnap = await getDoc(bookingRef);

  if (bookingSnap.exists()) {
    const data = bookingSnap.data();
    if (data.dateISO || data.date) {
      const dateKey = (data.dateISO || new Date(data.date).toISOString()).split('T')[0];
      await unbookSlot(dateKey, data.time || data.timeSlot);
    }
  }

  const updates = {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  };
  await updateDoc(bookingRef, updates);
}

// Delete a booking
export async function deleteBooking(userId, bookingId) {
  await deleteDoc(doc(db, BOOKINGS_COL, bookingId));
}

// Mark a booking as completed
export async function completeBooking(userId, bookingId) {
  const updates = {
    status: 'completed',
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, BOOKINGS_COL, bookingId), updates);
}

// Separate transaction logging
export async function createTransaction(transactionData) {
  const TRANSACTIONS_COL = 'transactions';
  const ref = await addDoc(collection(db, TRANSACTIONS_COL), {
    ...transactionData,
    status: 'successful',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
