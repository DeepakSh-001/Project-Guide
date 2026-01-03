import { initializeApp } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { getStorage } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* 🔥 Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyAZ4aOcmRemXoQ8ItAsMCQTNneLlCSq3hE",
  authDomain: "projectguide-web.firebaseapp.com",
  projectId: "projectguide-web",
  storageBucket: "projectguide-web.appspot.com", // ✅ FIXED
  messagingSenderId: "185191218818",
  appId: "1:185191218818:web:75f1eeaaed0dde66913e9b"
};

/* 🔥 Initialize App (ONCE) */
export const app = initializeApp(firebaseConfig);

/* 🔐 Auth */
export const auth = getAuth(app);

/* 🗄️ Firestore */
export const db = getFirestore(app);

/* 📦 Storage */
export const storage = getStorage(app);
