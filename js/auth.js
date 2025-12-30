import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ================= TOGGLE ================= */
const loginToggle = document.getElementById("loginToggle");
const registerToggle = document.getElementById("registerToggle");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginToggle.onclick = () => {
  loginToggle.classList.add("active");
  registerToggle.classList.remove("active");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
};

registerToggle.onclick = () => {
  registerToggle.classList.add("active");
  loginToggle.classList.remove("active");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
};

/* ================= EMAIL LOGIN ================= */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  await signInWithEmailAndPassword(
    auth,
    loginEmail.value,
    loginPassword.value
  );

  alert("Login successful!");
});

/* ================= REGISTER ================= */
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userCred = await createUserWithEmailAndPassword(
    auth,
    regEmail.value,
    regPassword.value
  );

  await updateProfile(userCred.user, {
    displayName: regName.value
  });

  alert("Account created!");
});

/* ================= GOOGLE LOGIN & REGISTER ================= */
const provider = new GoogleAuthProvider();

const handleGoogleAuth = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 🔥 STORE GOOGLE USER DATA IN GCP
    await fetch("https://meetinsider-210731711520.asia-south1.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber || "",
        provider: "google",
        createdAt: new Date().toISOString()
      })
    });

    alert(`Welcome ${user.displayName}`);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

document.getElementById("googleLogin").onclick = handleGoogleAuth;
document.getElementById("googleRegister").onclick = handleGoogleAuth;
