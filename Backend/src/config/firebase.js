const admin = require("firebase-admin");

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error);
    process.exit(1);
  }
} else {
  // Local development
  try {
    serviceAccount = require("../../firebaseServiceKey.json");
  } catch (error) {
    console.error("firebaseServiceKey.json not found. Set FIREBASE_SERVICE_ACCOUNT env var on Render.");
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;