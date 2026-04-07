import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

// Submit treatment feedback
export async function submitFeedback(data) {
  const ref = await addDoc(collection(db, 'feedback'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Submit contact form (Get In Touch)
export async function submitContactForm(data) {
  const ref = await addDoc(collection(db, 'contactRequests'), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Submit callback request
export async function submitCallbackRequest(data) {
  const ref = await addDoc(collection(db, 'callbackRequests'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
