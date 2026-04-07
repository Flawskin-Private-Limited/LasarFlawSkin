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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const USERS_COL = 'Auth';
const ADDRESSES_SUB = 'addresses';

function addressesRef(userId) {
  return collection(db, USERS_COL, userId, ADDRESSES_SUB);
}

// Get all addresses for a user
export async function getAddresses(userId) {
  const q = query(addressesRef(userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Add a new address (max 5 enforced)
export async function addAddress(userId, addressData) {
  const existing = await getAddresses(userId);
  if (existing.length >= 5) {
    throw new Error('Maximum 5 addresses allowed');
  }

  const isDefault = existing.length === 0;
  const ref = await addDoc(addressesRef(userId), {
    ...addressData,
    isDefault,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Delete an address
export async function deleteAddress(userId, addressId) {
  await deleteDoc(doc(db, USERS_COL, userId, ADDRESSES_SUB, addressId));
}

// Set an address as default (unset others)
export async function setDefaultAddress(userId, addressId) {
  const addresses = await getAddresses(userId);
  const batch = [];

  for (const addr of addresses) {
    const ref = doc(db, USERS_COL, userId, ADDRESSES_SUB, addr.id);
    batch.push(
      updateDoc(ref, { isDefault: addr.id === addressId })
    );
  }

  await Promise.all(batch);
}

// Get default address
export async function getDefaultAddress(userId) {
  const q = query(
    addressesRef(userId),
    where('isDefault', '==', true)
  );
  const snap = await getDocs(q);
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}
