import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZ4aOcmRemXoQ8ItAsMCQTNneLlCSq3hE",
  authDomain: "projectguide-web.firebaseapp.com",
  projectId: "projectguide-web",
  storageBucket: "projectguide-web.firebasestorage.app",
  messagingSenderId: "185191218818",
  appId: "1:185191218818:web:75f1eeaaed0dde66913e9b"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
