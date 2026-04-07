import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './config';

const SERVICES_COL = 'services';
const BUNDLES_COL = 'fullBodyBundles';
const COMBOS_COL = 'comboPackages';

// Filter active items and sort by sortOrder in JS (avoids composite index requirement)
function filterAndSort(docs) {
  return docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
}

// Fetch all active services (one-time)
export async function getServices(gender = 'women') {
  const q = query(collection(db, SERVICES_COL), where('gender', '==', gender));
  const snap = await getDocs(q);
  return filterAndSort(snap.docs);
}

// Real-time services listener
export function onServicesChange(gender, callback, onError) {
  const q = query(collection(db, SERVICES_COL), where('gender', '==', gender));
  return onSnapshot(q, (snap) => {
    callback(filterAndSort(snap.docs));
  }, (error) => {
    console.error('Services listener error:', error);
    if (onError) onError(error); else callback([]);
  });
}

// Fetch single service
export async function getServiceById(serviceId) {
  const ref = doc(db, SERVICES_COL, serviceId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Fetch full-body bundles
export async function getFullBodyBundles(gender = 'women') {
  const q = query(collection(db, BUNDLES_COL), where('gender', '==', gender));
  const snap = await getDocs(q);
  return filterAndSort(snap.docs);
}

// Real-time bundles listener
export function onBundlesChange(gender, callback, onError) {
  const q = query(collection(db, BUNDLES_COL), where('gender', '==', gender));
  return onSnapshot(q, (snap) => {
    callback(filterAndSort(snap.docs));
  }, (error) => {
    console.error('Bundles listener error:', error);
    if (onError) onError(error); else callback([]);
  });
}

// Fetch combo packages
export async function getComboPackages(gender = 'women') {
  const q = query(collection(db, COMBOS_COL), where('gender', '==', gender));
  const snap = await getDocs(q);
  return filterAndSort(snap.docs);
}

// Real-time combos listener
export function onCombosChange(gender, callback, onError) {
  const q = query(collection(db, COMBOS_COL), where('gender', '==', gender));
  return onSnapshot(q, (snap) => {
    callback(filterAndSort(snap.docs));
  }, (error) => {
    console.error('Combos listener error:', error);
    if (onError) onError(error); else callback([]);
  });
}
