import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/* ELEMENTS */
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

  if (userNameEl) {
    userNameEl.textContent = user.displayName || "User";
  }

  if (emailEl) {
    emailEl.textContent = user.email || "";
  }

  const role = localStorage.getItem("role") || "mentee";

  if (userRoleEl) {
    userRoleEl.textContent = role;
  }

  renderSessions(role);
  setupDashboardButton(role);

  if (profilePic) {
    profilePic.src = user.photoURL
      ? user.photoURL
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.displayName || "User"
        )}&background=0b5ed7&color=fff`;
  }
});

/* UPLOAD PROFILE PIC */
if (uploadPic) {
  uploadPic.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    const picRef = ref(storage, `profile-pictures/${user.uid}`);

    await uploadBytes(picRef, file);
    const url = await getDownloadURL(picRef);

    if (profilePic) {
      profilePic.src = url;
    }
  });
}

/* ROLE-BASED SESSION INFO */
function renderSessions(role) {
  if (!sessionInfo) return;

  sessionInfo.innerHTML =
    role === "mentor"
      ? `
        <li>Sessions given: 0</li>
        <li>Total earnings: ₹0</li>
      `
      : `
        <li>Sessions taken: 0</li>
        <li>Upcoming sessions: 0</li>
      `;
}

/* DASHBOARD BUTTON */
function setupDashboardButton(role) {
  if (!goDashboardBtn) return;

  goDashboardBtn.onclick = () => {
    window.location.href =
      role === "mentor"
        ? "mentor-dashboard.html"
        : "mentee-dashboard.html";
  };
}

/* LOGOUT (wait until navbar is injected) */
document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "logoutLink") {
    e.preventDefault();
    await signOut(auth);
    localStorage.clear();
    window.location.href = "index.html";
  }
});
