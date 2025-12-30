import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const menteeName = document.getElementById("menteeName");
const logoutBtn = document.getElementById("logoutBtn");

/* 🔐 AUTH GUARD */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  menteeName.textContent = user.displayName || "Mentee";
});

/* 🚪 LOGOUT */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
