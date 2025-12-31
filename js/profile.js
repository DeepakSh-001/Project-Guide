import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const profilePic = document.getElementById("profilePic");
const uploadPic = document.getElementById("uploadPic");
const userNameEl = document.getElementById("userName");
const userRoleEl = document.getElementById("userRole");
const emailEl = document.getElementById("email");
const sessionInfo = document.getElementById("sessionInfo");
const goDashboardBtn = document.getElementById("goDashboardBtn");

const storage = getStorage();

/* AUTH GUARD */
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userNameEl.textContent = user.displayName || "User";
  emailEl.textContent = user.email;

  const role = localStorage.getItem("role") || "mentee";
  userRoleEl.textContent = role;

  renderSessions(role);
  setupDashboardButton(role);

  if (user.photoURL) {
    profilePic.src = user.photoURL;
  } else {
    profilePic.src =
      `https://ui-avatars.com/api/?name=${user.displayName}&background=0b5ed7&color=fff`;
  }
});

/* UPLOAD PROFILE PIC */
uploadPic.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user = auth.currentUser;
  const picRef = ref(storage, `profile-pictures/${user.uid}`);

  await uploadBytes(picRef, file);
  profilePic.src = await getDownloadURL(picRef);
});

/* ROLE-BASED SESSION INFO */
function renderSessions(role) {
  sessionInfo.innerHTML = "";

  if (role === "mentor") {
    sessionInfo.innerHTML = `
      <li>Sessions given: 0</li>
      <li>Total earnings: ₹0</li>
    `;
  } else {
    sessionInfo.innerHTML = `
      <li>Sessions taken: 0</li>
      <li>Upcoming sessions: 0</li>
    `;
  }
}

/* DASHBOARD BUTTON */
function setupDashboardButton(role) {
  goDashboardBtn.onclick = () => {
    window.location.href =
      role === "mentor"
        ? "mentor-dashboard.html"
        : "mentee-dashboard.html";
  };
}

/* LOGOUT */
logoutLink.addEventListener("click", async () => {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "index.html";
});
