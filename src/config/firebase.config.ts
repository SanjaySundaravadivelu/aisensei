import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setLogLevel } from "firebase/firestore";
import { enableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable Firestore debug logs
setLogLevel("debug");

// Firestore connection test function
async function testFirestoreConnection() {
  try {
    enableNetwork(db)
      .then(() => console.log("📡 Firestore is online."))
      .catch((error) =>
        console.error("❌ Failed to enable Firestore network:", error)
      );
    const testDocRef = doc(db, "testCollection", "testDoc"); // Change collection & doc names if needed
    const docSnap = await getDoc(testDocRef);
    console.log("HIIIIIIIIIIIIII");
    if (docSnap.exists()) {
      console.log("✅ Firestore is working! Document data:", docSnap.data());
    } else {
      console.log("⚠️ Firestore is connected but no such document exists.");
    }
  } catch (error) {
    console.error("❌ Firestore connection failed:", error);
  }
}

// Run the test
testFirestoreConnection();

export { db };
