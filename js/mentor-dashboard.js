import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const mentorName = document.getElementById("mentorName");
const logoutBtn = document.getElementById("logoutBtn");
const addMoneyBtn = document.getElementById("addMoneyBtn");
const balEl = document.getElementById("bal");

let balance = 0;

/* 🔐 AUTH GUARD */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  mentorName.textContent = user.displayName || "Mentor";
});

/* 🚪 LOGOUT */
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

/* 💰 WALLET SIMULATION */
addMoneyBtn.addEventListener("click", () => {
  balance += 500;
  balEl.textContent = balance;
});

/* 📅 AVAILABILITY */
document.querySelectorAll(".slot").forEach(slot => {
  slot.addEventListener("click", () => {
    slot.classList.toggle("active");
  });
});
