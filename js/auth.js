import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* 🔹 CLOUD RUN URL */
const CLOUD_RUN_URL =
  "https://meetinsider-210731711520.asia-south1.run.app";

/* 🔹 GOOGLE PROVIDER */
const provider = new GoogleAuthProvider();

/* ================= ELEMENTS ================= */
const loginToggle = document.getElementById("loginToggle");
const registerToggle = document.getElementById("registerToggle");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

/* ================= HELPERS ================= */
function saveRoleAndRedirect(role) {
  localStorage.setItem("role", role);
  window.location.href = "profile.html";
}

function getActiveRole() {
  if (!loginForm.classList.contains("hidden")) {
    return document.getElementById("loginRole").value;
  }
  return document.getElementById("registerRole").value;
}

/* ================= TOGGLE ================= */
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

  const role = document.getElementById("loginRole").value;
  if (!role) return alert("Please select your role");

  try {
    await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    );

    saveRoleAndRedirect(role);
  } catch (err) {
    alert(err.message);
  }
});

/* ================= REGISTER ================= */
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = document.getElementById("registerRole").value;
  if (!role) return alert("Please select your role");

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      regEmail.value,
      regPassword.value
    );

    await updateProfile(userCred.user, {
      displayName: regName.value
    });

    /* 🔥 SAVE USER TO CLOUD RUN (NON-BLOCKING) */
    fetch(CLOUD_RUN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: userCred.user.uid,
        name: regName.value,
        email: regEmail.value,
        role,
        provider: "email",
        createdAt: new Date().toISOString()
      })
    }).catch(err =>
      console.warn("Cloud Run save failed (ignored):", err)
    );

    saveRoleAndRedirect(role);
  } catch (err) {
    alert(err.message);
  }
});

/* ================= GOOGLE LOGIN / REGISTER ================= */
async function handleGoogleAuth() {
  try {
    const role = getActiveRole();
    if (!role) return alert("Please select your role");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    fetch(CLOUD_RUN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role,
        provider: "google",
        createdAt: new Date().toISOString()
      })
    }).catch(err =>
      console.warn("Cloud Run save failed (ignored):", err)
    );

    saveRoleAndRedirect(role);
  } catch (err) {
    alert(err.message);
  }
}

document.getElementById("googleLogin").onclick = handleGoogleAuth;
document.getElementById("googleRegister").onclick = handleGoogleAuth;
