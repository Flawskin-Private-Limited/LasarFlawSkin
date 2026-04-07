/**
 * Firestore Seed Script
 * 
 * Run this ONCE from the browser console or a temporary page to populate
 * Firestore with all the existing hardcoded service data.
 * 
 * Usage: import and call seedAllData() from any component or browser console.
 */
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './config';

const SERVICES = [
  {
    id: 'underarms-trial',
    title: 'Trail Session - Underarms',
    shortTitle: 'Trail Session',
    area: 'Underarms',
    description: 'Get smooth, hair-free skin on your underarms with our safe and effective laser hair removal treatments.',
    mrp: 999,
    price: 499,
    duration: '30 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/underarm.png',
    gender: 'women',
    serviceType: 'trial',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: 'hands',
    title: 'Hands Laser Hair Reduction',
    shortTitle: 'Full Arms & Hands',
    area: 'Hands',
    description: 'Get smooth, hair-free skin on your hands with our safe and effective laser hair removal treatments.',
    mrp: 4500,
    price: 2999,
    duration: '45 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/Hands.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: 'underarms',
    title: 'Underarms Laser Hair Reduction',
    shortTitle: 'Underarms',
    area: 'Underarms',
    description: 'Get smooth, hair-free skin on your underarms with our safe and effective laser hair removal treatments.',
    mrp: 999,
    price: 899,
    duration: '30 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/underarm.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 4,
  },
  {
    id: 'legs',
    title: 'Legs Laser Hair Reduction',
    shortTitle: 'Full Legs',
    area: 'Legs',
    description: 'Get smooth, hair-free skin on your legs with our safe and effective laser hair removal treatments.',
    mrp: 5599,
    price: 4499,
    duration: '1 Hr',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/legs.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 5,
  },
  {
    id: 'back',
    title: 'Back Laser Hair Reduction',
    shortTitle: 'Full Back',
    area: 'Back',
    description: 'Get smooth, hair-free skin on your back with our safe and effective laser hair removal treatments.',
    mrp: 4275,
    price: 2999,
    duration: '1 Hr',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/back.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 6,
  },
  {
    id: 'bikini',
    title: 'Bikini Laser Hair Reduction',
    shortTitle: 'Full Bikini',
    area: 'Bikini',
    description: 'Get smooth, hair-free skin on your bikini with our safe and effective laser hair removal treatments.',
    mrp: 3999,
    price: 2999,
    duration: '45 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/Bikini.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 7,
  },
  {
    id: 'chest-abdomen',
    title: 'Chest & Abdomin Laser Hair Reduction',
    shortTitle: 'Chest & Abdomin',
    area: 'Chest & Abdomin',
    description: 'Get smooth, hair-free skin on your Chest & Abdomin with our safe and effective laser hair removal treatments.',
    mrp: 4275,
    price: 2999,
    duration: '45 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/chest & abdomen.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 8,
  },
  {
    id: 'buttocks',
    title: 'Buttocks Laser Hair Reduction',
    shortTitle: 'Buttocks',
    area: 'Buttocks',
    description: 'Get smooth, hair-free skin on your buttocks with our safe and effective laser hair removal treatments.',
    mrp: 4499,
    price: 2999,
    duration: '45 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/Buttocks.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 9,
  },
  {
    id: 'full-face',
    title: 'Full Face Laser Hair Reduction',
    shortTitle: 'Full Face',
    area: 'Face',
    description: 'Get smooth, hair-free skin on your face with our safe and effective laser hair removal treatments.',
    mrp: 3500,
    price: 2999,
    duration: '45 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/full face.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 10,
  },
  {
    id: 'upper-lip',
    title: 'Upper Lip Laser Hair Reduction',
    shortTitle: 'Upper Lip',
    area: 'Face',
    description: 'Get smooth, hair-free skin on your upper lip with our safe and effective laser hair removal treatments.',
    mrp: 999,
    price: 899,
    duration: '30 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/upper lip.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 11,
  },
  {
    id: 'chin',
    title: 'Chin Laser Hair Reduction',
    shortTitle: 'Chin',
    area: 'Face',
    description: 'Get smooth, hair-free skin on your chin with our safe and effective laser hair removal treatments.',
    mrp: 999,
    price: 899,
    duration: '30 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/chin.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 12,
  },
  {
    id: 'sidelock',
    title: 'Side Lock Laser Hair Reduction',
    shortTitle: 'Side Lock',
    area: 'Face',
    description: 'Get smooth, hair-free skin on your sidelock area with our safe and effective laser hair removal treatments.',
    mrp: 999,
    price: 899,
    duration: '30 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/side lock.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 13,
  },
  {
    id: 'cheeks',
    title: 'Cheeks Laser Hair Reduction',
    shortTitle: 'Cheeks',
    area: 'Face',
    description: 'Get smooth, hair-free skin on your cheeks with our safe and effective laser hair removal treatments.',
    mrp: 999,
    price: 899,
    duration: '30 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/cheek.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 14,
  },
  {
    id: 'upper-neck',
    title: 'Upper Neck Laser Hair Reduction',
    shortTitle: 'Upper Neck',
    area: 'Neck',
    description: 'Get smooth, hair-free skin on your neck with our safe and effective laser hair removal treatments.',
    mrp: 999,
    price: 899,
    duration: '30 Min',
    rating: 5.0,
    reviews: 210,
    image: '/src/assets/images/Upper neck.png',
    gender: 'women',
    serviceType: 'regular',
    isActive: true,
    sortOrder: 15,
  },
];

const FULL_BODY_BUNDLES = [
  {
    id: 'fb-5-parts',
    title: 'Full Body: 5 Parts',
    subtitle: 'Included Areas: Full Arms, Full Legs, Underarms, Bikini, Face.',
    badge: 'MOST POPULAR',
    gender: 'women',
    isActive: true,
    sortOrder: 1,
    plans: [
      { id: 'fb5-1', sessions: 1, mrp: 10333, price: 9499, duration: '2 Hr 30 Min', includes: ['Hands', 'Face', 'Legs', 'Underarms', 'Bikini'] },
      { id: 'fb5-3', sessions: 3, mrp: 29997, price: 25499, duration: '2 Hr 30 Min', includes: ['Hands', 'Face', 'Legs', 'Underarms', 'Bikini'] },
      { id: 'fb5-6', sessions: 6, mrp: 59997, price: 48499, duration: '2 Hr 30 Min', includes: ['Hands', 'Face', 'Legs', 'Underarms', 'Bikini'] },
    ],
  },
  {
    id: 'fb-8-parts',
    title: 'Full Body: 8 Parts',
    subtitle: 'Included Areas: Full Arms, Full Legs, Underarms, Bikini, Face, Full Back, Stomach, Neck.',
    badge: '',
    gender: 'women',
    isActive: true,
    sortOrder: 2,
    plans: [
      { id: 'fb8-1', sessions: 1, mrp: 13333, price: 10499, duration: '3 Hrs', includes: ['Hands', 'Face', 'Legs', 'Underarms', 'Bikini', 'Chest & Stomach', 'Back', 'Buttocks'] },
      { id: 'fb8-3', sessions: 3, mrp: 31497, price: 28499, duration: '3 Hrs', includes: ['Hands', 'Face', 'Legs', 'Underarms', 'Bikini', 'Chest & Stomach', 'Back', 'Buttocks'] },
      { id: 'fb8-6', sessions: 6, mrp: 62994, price: 54499, duration: '3 Hrs', includes: ['Hands', 'Face', 'Legs', 'Underarms', 'Bikini', 'Chest & Stomach', 'Back', 'Buttocks'] },
    ],
  },
];

const COMBO_PACKAGES = [
  { id: 'combo-1', title: 'Full Legs + Hands + Underarms', mrp: 8979, price: 6999, duration: '2 Hrs', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 1 },
  { id: 'combo-2', title: 'Full Legs + Underarms + Bikini', mrp: 8400, price: 6999, duration: '1 Hr 45 Min', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 2 },
  { id: 'combo-3', title: 'Full Face + Underarms', mrp: 3898, price: 3499, duration: '1 Hr', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 3 },
  { id: 'combo-4', title: 'Bikini + Buttocks', mrp: 5998, price: 4499, duration: '1 Hr 30 Min', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 4 },
  { id: 'combo-5', title: 'Full Face + Bikini', mrp: 5899, price: 4999, duration: '1 Hr 30 Min', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 5 },
  { id: 'combo-6', title: 'Full Front + Full Back', mrp: 5999, price: 5499, duration: '1 Hr 30 Min', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 6 },
  { id: 'combo-7', title: 'Full Hands + Underarms', mrp: 4000, price: 3499, duration: '1 Hr 30 Min', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 7 },
  { id: 'combo-8', title: 'Full Hands + Full Legs', mrp: 7499, price: 6499, duration: '1 Hr 30 Min', rating: 5.0, reviews: 210, gender: 'women', isActive: true, sortOrder: 8 },
];

const PROMO_CODES = [
  { id: 'SAVE10', discountType: 'percentage', discountValue: 10, minOrder: 0, active: true, message: '10% off applied!', expiresAt: null },
  { id: 'SAVE20', discountType: 'percentage', discountValue: 20, minOrder: 2000, active: true, message: '20% off applied!', expiresAt: null },
  { id: 'FLAT50', discountType: 'fixed', discountValue: 50, minOrder: 500, active: true, message: '₹50 off applied!', expiresAt: null },
  { id: 'WELCOME15', discountType: 'percentage', discountValue: 15, minOrder: 0, active: true, message: '15% welcome discount applied!', expiresAt: null },
];

const SAMPLE_SLOTS = [
  {
    id: '2026-03-12',
    slots: [
      { time: '7:00 AM', period: 'morning', booked: false },
      { time: '8:00 AM', period: 'morning', booked: false },
      { time: '9:00 AM', period: 'morning', booked: false },
      { time: '10:00 AM', period: 'morning', booked: false },
      { time: '11:00 AM', period: 'morning', booked: true },
      { time: '12:00 PM', period: 'afternoon', booked: false },
      { time: '1:00 PM', period: 'afternoon', booked: false },
      { time: '2:00 PM', period: 'afternoon', booked: false },
      { time: '3:00 PM', period: 'afternoon', booked: true },
      { time: '4:00 PM', period: 'afternoon', booked: false },
      { time: '5:00 PM', period: 'evening', booked: false },
      { time: '6:00 PM', period: 'evening', booked: false },
      { time: '7:00 PM', period: 'evening', booked: false },
      { time: '8:00 PM', period: 'evening', booked: false },
      { time: '9:00 PM', period: 'evening', booked: false },
      { time: '10:00 PM', period: 'evening', booked: true },
    ],
  },
  {
    id: '2026-03-13',
    slots: [
      { time: '7:00 AM', period: 'morning', booked: false },
      { time: '8:00 AM', period: 'morning', booked: true },
      { time: '9:00 AM', period: 'morning', booked: false },
      { time: '10:00 AM', period: 'morning', booked: false },
      { time: '11:00 AM', period: 'morning', booked: false },
      { time: '12:00 PM', period: 'afternoon', booked: false },
      { time: '1:00 PM', period: 'afternoon', booked: false },
      { time: '2:00 PM', period: 'afternoon', booked: true },
      { time: '3:00 PM', period: 'afternoon', booked: false },
      { time: '4:00 PM', period: 'afternoon', booked: false },
      { time: '5:00 PM', period: 'evening', booked: false },
      { time: '6:00 PM', period: 'evening', booked: false },
      { time: '7:00 PM', period: 'evening', booked: true },
      { time: '8:00 PM', period: 'evening', booked: false },
      { time: '9:00 PM', period: 'evening', booked: false },
      { time: '10:00 PM', period: 'evening', booked: false },
    ],
  },
];

// Wraps a promise with a timeout (default 15s)
function withTimeout(promise, ms = 15000, label = 'Operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s — Firestore may not be enabled in your Firebase Console`)), ms)
    ),
  ]);
}

async function isCollectionEmpty(colName) {
  const snap = await withTimeout(getDocs(collection(db, colName)), 15000, `Reading ${colName}`);
  return snap.empty;
}

async function seedCollection(colName, items) {
  for (const item of items) {
    await withTimeout(setDoc(doc(db, colName, item.id), item), 15000, `Writing ${colName}/${item.id}`);
  }
}

export async function seedAllData(onProgress) {
  const log = (msg) => {
    console.log('[Seed]', msg);
    if (onProgress) onProgress(msg);
  };
  const results = [];

  const collections = [
    { name: 'services', data: SERVICES, label: 'Services' },
    { name: 'fullBodyBundles', data: FULL_BODY_BUNDLES, label: 'Full Body Bundles' },
    { name: 'comboPackages', data: COMBO_PACKAGES, label: 'Combo Packages' },
    { name: 'promoCodes', data: PROMO_CODES, label: 'Promo Codes' },
    { name: 'slots', data: SAMPLE_SLOTS, label: 'Slots' },
  ];

  for (const col of collections) {
    try {
      log(`Checking ${col.label}...`);
      const empty = await isCollectionEmpty(col.name);
      if (empty) {
        log(`Seeding ${col.data.length} ${col.label.toLowerCase()}...`);
        await seedCollection(col.name, col.data);
        const msg = `✅ Seeded ${col.data.length} ${col.label.toLowerCase()}`;
        log(msg);
        results.push(msg);
      } else {
        const msg = `⏭️ ${col.label} already has data — skipped`;
        log(msg);
        results.push(msg);
      }
    } catch (error) {
      const msg = `❌ ${col.label} failed: ${error.message}`;
      log(msg);
      results.push(msg);
    }
  }

  return results;
}
