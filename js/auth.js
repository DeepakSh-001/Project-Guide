import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/* ================= GOOGLE PROVIDER ================= */
const provider = new GoogleAuthProvider();

/* ================= HELPERS ================= */
function getActiveRole() {
  if (!loginForm.classList.contains("hidden")) {
    return document.getElementById("loginRole").value;
  } else {
    return document.getElementById("registerRole").value;
  }
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

  const role = document.getElementById("loginRole").value;
  if (!role) {
    alert("Please select a role");
    return;
  }

  try {
    await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    );

    redirectByRole(role);
  } catch (err) {
    alert(err.message);
  }
});

/* ================= REGISTER ================= */
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = document.getElementById("registerRole").value;
  if (!role) {
    alert("Please select a role");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      regEmail.value,
      regPassword.value
    );

    await updateProfile(userCred.user, {
      displayName: regName.value
    });

    await fetch("https://meetinsider-210731711520.asia-south1.run.app", {
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

    redirectByRole(role);
  } catch (err) {
    alert(err.message);
  }
});

/* ================= GOOGLE LOGIN / REGISTER ================= */
const handleGoogleAuth = async () => {
  try {
    const role = getActiveRole();
    if (!role) {
      alert("Please select a role");
      return;
    }

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await fetch("https://meetinsider-210731711520.asia-south1.run.app", {
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

    redirectByRole(role);
  } catch (err) {
    alert(err.message);
  }
};

document.getElementById("googleLogin").onclick = handleGoogleAuth;
document.getElementById("googleRegister").onclick = handleGoogleAuth;

/* ================= ROLE BASED REDIRECT ================= */
function redirectByRole(role) {
  if (role === "mentor") {
    window.location.href = "mentor-dashboard.html";
  } else {
    window.location.href = "mentee-dashboard.html";
  }
}
