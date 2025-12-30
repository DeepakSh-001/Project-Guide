import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

function getUserRole() {
  return document.getElementById("userRole").value;
}

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

  const role = getUserRole();
  if (!role) {
    alert("Please select a role");
    return;
  }

  const userCred = await createUserWithEmailAndPassword(
    auth,
    regEmail.value,
    regPassword.value
  );

  await updateProfile(userCred.user, {
    displayName: regName.value
  });

  // 🔥 STORE ROLE IN DATABASE
  await fetch(CLOUD_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: userCred.user.uid,
      name: regName.value,
      email: regEmail.value,
      role: role,
      provider: "email",
      createdAt: new Date().toISOString()
    })
  });

  alert("Account created!");
});
;

/* ================= GOOGLE LOGIN & REGISTER ================= */
const handleGoogleAuth = async () => {
  try {
    const role = getUserRole();
    if (!role) {
      alert("Please select a role");
      return;
    }

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // 🔥 STORE ROLE + USER
    await fetch(CLOUD_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role: role,
        provider: "google",
        createdAt: new Date().toISOString()
      })
    });

    alert("Login successful");
  } catch (err) {
    alert(err.message);
  }
};


document.getElementById("googleLogin").onclick = handleGoogleAuth;
document.getElementById("googleRegister").onclick = handleGoogleAuth;
