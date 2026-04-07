import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from './config';

const PROMOS_COL = 'promoCodes';

// Validate a promo code and return its details
export async function validatePromoCode(code) {
  const snap = await getDoc(doc(db, PROMOS_COL, code.toUpperCase()));

  if (!snap.exists()) {
    return { valid: false, message: 'Invalid promo code' };
  }

  const promo = snap.data();

  if (!promo.active) {
    return { valid: false, message: 'This promo code is no longer active' };
  }

  if (promo.expiresAt && promo.expiresAt.toDate() < new Date()) {
    return { valid: false, message: 'This promo code has expired' };
  }

  return {
    valid: true,
    code: snap.id,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    minOrder: promo.minOrder || 0,
    message: promo.message || `${promo.discountType === 'percentage' ? promo.discountValue + '%' : '₹' + promo.discountValue} off applied!`,
  };
}
// Get all active promos listing (for the UI)
export async function getActivePromos() {
  const q = query(collection(db, PROMOS_COL), where('active', '==', true));
  const snap = await getDocs(q);
  const now = new Date();
  
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(promo => !promo.expiresAt || promo.expiresAt.toDate() > now);
}
