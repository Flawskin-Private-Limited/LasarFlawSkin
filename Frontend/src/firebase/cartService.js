import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const USERS_COL = 'Auth';
const CART_SUB = 'cart';

function cartRef(userId) {
  return collection(db, USERS_COL, userId, CART_SUB);
}

// Get all cart items from Firestore
export async function getFirestoreCart(userId) {
  const snap = await getDocs(cartRef(userId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Sync a full cart array to Firestore (overwrites)
export async function syncCartToFirestore(userId, cartItems) {
  // Clear existing
  const existing = await getDocs(cartRef(userId));
  const deletes = existing.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletes);

  // Write new items
  const writes = cartItems.map((item) =>
    setDoc(doc(db, USERS_COL, userId, CART_SUB, String(item.id)), {
      ...item,
      updatedAt: serverTimestamp(),
    })
  );
  await Promise.all(writes);
}

// Set a single cart item
export async function setCartItem(userId, item) {
  await setDoc(
    doc(db, USERS_COL, userId, CART_SUB, String(item.id)),
    { ...item, updatedAt: serverTimestamp() }
  );
}

// Remove a single cart item
export async function removeCartItem(userId, itemId) {
  await deleteDoc(doc(db, USERS_COL, userId, CART_SUB, String(itemId)));
}

// Clear all cart items
export async function clearFirestoreCart(userId) {
  const snap = await getDocs(cartRef(userId));
  const deletes = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletes);
}

// Real-time cart listener
export function onCartChange(userId, callback) {
  return onSnapshot(cartRef(userId), (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}
