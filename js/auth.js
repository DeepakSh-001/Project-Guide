import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* TOGGLE */
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

/* EMAIL LOGIN */
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await signInWithEmailAndPassword(
    auth,
    loginEmail.value,
    loginPassword.value
  );
  alert("Login successful!");
});

/* REGISTER */
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

/* GOOGLE LOGIN */
const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").onclick =
document.getElementById("googleRegister").onclick = async () => {
  await signInWithPopup(auth, provider);
  alert("Google login successful!");
};
